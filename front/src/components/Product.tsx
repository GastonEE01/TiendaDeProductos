import React, { useRef, useState } from "react";
import { addProduct } from "../service/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../hooks/userStorage";
import { Button, TextField, FormControl } from "@mui/material";
import { FaTimes } from "react-icons/fa";

interface ProductProps {
  onClose: () => void;
}

export const Product: React.FC<ProductProps> = ({onClose}) => {
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

      const productData = new FormData();
      productData.append("Name", formData.get("name") as string);
      productData.append("Description", formData.get("description") as string);
      productData.append("Price", formData.get("price") as string);
      if (image instanceof File) {
        productData.append("IMG", image);
      }
      productData.append("Stock", formData.get("stock") as string);
      productData.append("CategoriaName",formData.get("categoriaName") as string);
      productData.append("UsuarioId", userId);
      const response = await addProduct(productData);
      toast.success(response.message);
      formRef.current?.reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        background: "rgba(224, 191, 163, 0.96)",
        margin: "3%",
        marginLeft: "25%",
        marginRight: "25%",
        minHeight: "100px",
        borderRadius: "10px",
        padding: "20px",
        height: "fit-content", 
        
      }}
    >
  
      <FormControl
        component="form"
        onSubmit={handleSumit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          fontSize: "20px",
        }}
        ref={formRef}
      >
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",marginBottom: "10px"}}>
        <div style={{ width: "30px" }}></div> 

          <h2 style={{ margin: 0, color: "#333", flexGrow: 1, textAlign: "center" }}>

          Producto
        </h2>
        <FaTimes size={30} onClick={onClose} style={{ cursor: "pointer", color: "#dd1e1e" }}/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TextField
            id="standard-basic"
            label="Ingrese su nombre del producto."
            variant="standard"
            type="text"
            name="name"
            size="medium"
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
                        size="medium"

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
            size="medium"
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
            size="medium"
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
            size="medium"
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
            size="medium"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color="info"
            variant="contained"
            type="submit"
            disabled={loading}
          >
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


/*
           slotProps={{
    input: { style: { fontSize: "16px" } },       // 👈 Reduce la letra de lo que escribe el usuario
    inputLabel: { style: { fontSize: "14px" } }   // 👈 Reduce la letra del texto flotante (Label)
  }}
    */      