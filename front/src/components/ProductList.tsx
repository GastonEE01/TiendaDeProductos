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
  Box,
  Typography
} from "@mui/material";
import { FaSearch,FaTimes } from "react-icons/fa";


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

  const inputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#111827", // Fondo medianoche para las cajas
    color: "#f8fafc",            // Letras blancas al escribir
    borderRadius: "8px",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" }, // Borde azul eléctrico al escribir
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" }, // Texto gris claro flotando
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" }
};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginLeft: "15%",
        width: "82%",
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
        <FaSearch size={24} style={{ color: "#2563eb" }} />
        <TextField
          label="Buscar producto"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
          sx={{
            ...inputStyle, // Hereda el fondo oscuro y letras blancas
          "& .MuiOutlinedInput-root": {
            ...inputStyle["& .MuiOutlinedInput-root"],
            borderRadius: "50px",
          }
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

              <Box sx={{ backgroundColor: "#1e293b", borderRadius: "16px", padding: "10px", width: "100%" }}>

        <form onSubmit={handleSaveEdit}>
           <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <div style={{ width: "24px" }}></div> 
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#f8fafc", flexGrow: 1, textAlign: "center" }}>
              Editar producto
            </Typography>
            
            {/* 🚀 RECTIFICADO: Pasamos una función de flecha limpia para limpiar el estado */}
            <FaTimes 
              size={24} 
              onClick={() => setEditProduct(null)} 
              style={{ cursor: "pointer", color: "#ef4444", transition: "color 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ff0000'}
              onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
            />
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
          >
            <TextField
              name="name"
              label="Nombre"
              value={editFormData.name}
              onChange={handleFieldChange}
              required
              fullWidth
              sx={inputStyle}
            />
            <TextField
              name="description"
              label="Descripción"
              value={editFormData.description}
              onChange={handleFieldChange}
              required
              fullWidth
              multiline
              rows={2}
              sx={inputStyle}
            />
            <TextField
              name="nameCategoria"
              label="Categoría"
              value={editFormData.nameCategoria}
              onChange={handleFieldChange}
              required
              fullWidth
               multiline
              rows={2}
              sx={inputStyle}
            />

             <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: "bold" }}>
                Nueva imagen (Opcional)
              </Typography>
              <input
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
                style={{
                  color: "#94a3b8",
                  backgroundColor: "#111827",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer"
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="price"
              label="Precio"
              type="number"
              value={editFormData.price}
              onChange={handleFieldChange}
              required
               fullWidth
                sx={inputStyle}
            />
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={editFormData.stock}
              onChange={handleFieldChange}
              required
               fullWidth
                sx={inputStyle}
            />
            </Box>
          </DialogContent>
           <DialogActions sx={{ p: 2, pr: 3, gap: 1 }}>
            <Button onClick={() => setEditProduct(null)} sx={{ color: "#94a3b8", "&:hover": { color: "#f8fafc" } }}>Cancelar</Button>
            <Button type="submit" variant="contained"  sx={{
                backgroundColor: "#2563eb", // El mismo azul oficial de tus botones
                color: "#ffffff",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "8px 24px",
                "&:hover": { backgroundColor: "#1d4ed8" }
              }}>
              Guardar cambios
            </Button>
          </DialogActions>
        </form>
         </Box>
      </Dialog>
    </div>
  );
};
