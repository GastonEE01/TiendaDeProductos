import React, { useEffect, useState } from "react";
import { getProducts,getProductsSeller, deleteProduct, updateProduct } from "../service/api";
import { ProductDtoRequest } from "../interfaces/ProductoType";
import { ProductCard } from "../components/ProductCard";
import { useDebouceSearch } from "../hooks/useDebouce";
import { useAuthStore } from '../hooks/userStorage'
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";

export const ProductList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductDtoRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<ProductDtoRequest | null>(null,);

  const user = useAuthStore((state) => state.user);

  const [editFormData, setEditFormData] = useState<{
    name: string;
    description: string;
    price: string;
    stock: string;
    nameCategoria: string;
    img: File | null;
  }>({
    name: "",
    description: "",
    price: "",
    stock: "",
    nameCategoria: "",
    img: null,
  });

  const [search, setSearch] = useState("");
  const deboucedSearch = useDebouceSearch<string>(search, 1000);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
         let data;
         if (user?.rol === "Admin") {
        data = await getProductsSeller(); 
      } else {
        data = await getProducts(); 
      }
        setProducts(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : null;
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (deboucedSearch) {
      console.log("Filtrando productos en la API por:", deboucedSearch);
    }
  }, [deboucedSearch]);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
      toast.success(response.message);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setError(message);
      toast.error(message);
    }
  };

  const handleEdit = async (product: ProductDtoRequest) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      nameCategoria: product.categoriaName,
      img: null,
    });
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editProduct) return;

    try {
      const response = await updateProduct({
        id: editProduct.id,
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        price: Number(editFormData.price),
        stock: Number(editFormData.stock),
        nameCategoria: editFormData.nameCategoria.trim(),
        img: editFormData.img
      });

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editProduct.id
            ? {
                ...product,
                name: editFormData.name.trim(),
                description: editFormData.description.trim(),
                price: Number(editFormData.price),
                stock: Number(editFormData.stock),
                categoriaName: editFormData.nameCategoria.trim(),
                img: response.img ?? product.img,
              }
            : product,
        ),
      );
      toast.success(response.message || "Producto actualizado");
      setEditProduct(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setError(message);
      toast.error(message);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const normalizedSearch = deboucedSearch.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!normalizedSearch) {
      return true;
    }
    return product.name.toLowerCase().includes(normalizedSearch);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginLeft: "15%",
        width: "calc(100% - 250px)",
        padding: "20px",
      }}
    >
      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
        }}
      >
        <FaSearch size={30} style={{ color: "#d8a6a6" }} />
        <TextField
          label="Buscar producto"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px", // Estilo píldora/cápsula
            },
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "15px",
          width: "100%",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <Dialog
        open={editProduct !== null}
        onClose={() => setEditProduct(null)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={handleSaveEdit}>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
          >
            <TextField
              name="name"
              label="Nombre"
              value={editFormData.name}
              onChange={handleFieldChange}
              required
            />
            <TextField
              name="description"
              label="Descripción"
              value={editFormData.description}
              onChange={handleFieldChange}
              required
            />
            <TextField
              name="nameCategoria"
              label="Categoría"
              value={editFormData.nameCategoria}
              onChange={handleFieldChange}
              required
            />

            <TextField
              name="img"
              label="Nueva imagen"
              type="file"
              onChange={(event) => {
                if (event.target instanceof HTMLInputElement) {
                  const file = event.target.files?.[0] ?? null;

                  setEditFormData((currentData) => ({
                    ...currentData,
                    img: file,
                  }));
                }
              }}
            />

            <TextField
              name="price"
              label="Precio"
              type="number"
              value={editFormData.price}
              onChange={handleFieldChange}
              required
            />
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={editFormData.stock}
              onChange={handleFieldChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditProduct(null)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Guardar cambios
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
