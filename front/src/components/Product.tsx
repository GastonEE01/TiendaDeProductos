import React, { useRef, useState } from "react";
import { addProduct } from "../service/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../hooks/userStorage";
//import { Button, TextField,Dialog, DialogTitle,DialogContent,DialogActions,Typography,Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

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

     const inputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#111827", // Fondo medianoche para las cajas
    color: "#f8fafc",            // Letras blancas al escribir
    borderRadius: "8px",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" }, // Borde azul al escribir
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" }, // Texto gris claro flotando
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" }
};

  return (
  <Dialog
    open={true} // Cambialo por tu variable de estado si controlás su apertura
    onClose={onClose}
    fullWidth
    maxWidth="sm"
  >

    <Box sx={{ backgroundColor: "#1e293b", borderRadius: "16px", padding: "10px", width: "100%" }}>
    <form onSubmit={handleSumit} ref={formRef}>
      
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#f8fafc", flexGrow: 1, textAlign: "center" }}>
          Agregar Producto
        </Typography>
        <FaTimes 
          size={24} 
          onClick={onClose} 
          style={{ cursor: "pointer", color: "#ef4444", transition: "color 0.2s" }}
          onMouseOver={(e) => e.currentTarget.style.color = '#ff0000'}
          onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
        />
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
        
        <TextField
          label="Nombre del producto"
          variant="outlined"
          type="text"
          name="name"
          required
          fullWidth
          sx={inputStyle}
        />

        <TextField
          label="Descripción"
          variant="outlined"
          type="text"
          name="description"
          required
          fullWidth
          multiline
          rows={2}
          sx={inputStyle}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: "bold" }}>
            Imagen del Producto
          </Typography>
          <input
            type="file"
            name="img"
            required
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

        <TextField
          label="Categoría"
          variant="outlined"
          type="text"
          name="categoriaName"
          required
          fullWidth
          sx={inputStyle}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Precio"
            variant="outlined"
            type="number"
            name="price"
            required
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="Stock"
            variant="outlined"
            type="number"
            name="stock"
            required
            fullWidth
            sx={inputStyle}
          />
        </Box>

        {formError && (
          <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: "bold", mt: 1 }}>
            ❌ {formError}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pr: 3, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#94a3b8", "&:hover": { color: "#f8fafc" } }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "8px 24px",
            "&:hover": {
              backgroundColor: "#1d4ed8",
            }
          }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </DialogActions>

    </form>
    </Box>
  </Dialog>
);

}