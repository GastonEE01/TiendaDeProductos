import React, { useRef, useState } from "react";
import { addProduct } from "../service/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../hooks/userStorage";
import { Button, TextField, FormControl } from "@mui/material";

export const Product: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!userId) {
      toast.error("No se encontró el usuario autenticado");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      const image = formData.get("img");

      if (!(image instanceof File) || image.size === 0) {
        throw new Error("Debés seleccionar una imagen");
      }

      const productData = new FormData();
      productData.append("Name", formData.get("name") as string);
      productData.append("Description", formData.get("description") as string);
      productData.append("Price", formData.get("price") as string);
      productData.append("IMG", image);
      productData.append("Stock", formData.get("stock") as string);
      productData.append("CategoriaName", formData.get("categoriaName") as string);
      productData.append("UsuarioId", userId);
      const response = await addProduct(productData);
      toast.success(response.message);
      formRef.current?.reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al agregar el producto";

      setFormError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        background: "red",
        margin: "5%",
        maxHeight: "350px",
        minHeight: "100px",
      }}
    >
      <h1>producto</h1>
      <FormControl
        component="form"
        onSubmit={handleSumit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        ref={formRef}

      >
        <h2
          style={{ textAlign: "center", margin: "0 0 10px 0", color: "#333" }}
        >
          Producto
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="Ingrese su nombre del producto."
            variant="standard"
            type="text"
            name="name"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="Ingrese la descripcion."
            variant="standard"
            type="text"
            name="description"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="img"
            variant="standard"
            type="file"
            name="img"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="Ingrese la categoria"
            variant="standard"
            type="text"
            name="categoriaName"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="Ingrese el precio"
            variant="standard"
            type="text"
            name="price"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="Ingrese el stock"
            variant="standard"
            type="text"
            name="stock"
            fullWidth
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button color="info" variant="contained" type="submit" disabled={loading}>
            Enviar
          </Button>
        </div>
      </FormControl>
      {formError && (
        <div style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>
          ❌ {formError}
        </div>
      )}
    </div>
  );
};
