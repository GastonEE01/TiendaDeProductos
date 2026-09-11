import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct } from "../service/api";
import { ProductDtoRequest } from "../interfaces/ProductoType";
import { ProductCard } from "../components/ProductCard";
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export const ProductList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductDtoRequest[]>([]);
  const [error, setError] = useState<string>("");
  const [editProduct, setEditProduct] = useState<ProductDtoRequest | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    nameCategoria: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err: unknown) {
        const errorObject = err as Error;
        setError(errorObject.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
      toast.success(response.message);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto";

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
              }
            : product,
        ),
      );
      toast.success(response.message || "Producto actualizado");
      setEditProduct(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar el producto";
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

  return (
    <div>
      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}

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
            <Button type="submit" variant="contained">Guardar cambios</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
