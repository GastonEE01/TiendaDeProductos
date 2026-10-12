import React, { useEffect, useMemo, useRef, useState } from "react";
import { addProduct } from "../service/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../hooks/userStorage";
//import { Button, TextField,Dialog, DialogTitle,DialogContent,DialogActions,Typography,Box } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { PRODUCT_CATEGORIES } from "../constants/productCategories";

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

interface ProductProps {
  onClose: () => void;
}

export const Product: React.FC<ProductProps> = ({ onClose }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imagePreviews = useMemo(
    () => selectedImages.map((image) => URL.createObjectURL(image)),
    [selectedImages],
  );
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(
    () => () => imagePreviews.forEach((url) => URL.revokeObjectURL(url)),
    [imagePreviews],
  );

  const addSelectedImages = (newImages: File[]) => {
    setFormError(null);
    const availableSlots = MAX_IMAGES - selectedImages.length;
    if (newImages.length > availableSlots) {
      setFormError(
        `No podés agregar más fotos. El límite es de ${MAX_IMAGES}.`,
      );
      return;
    }
    const oversizedImage = newImages.find(
      (image) => image.size > MAX_IMAGE_SIZE_BYTES,
    );
    if (oversizedImage) {
      setFormError(`${oversizedImage.name} supera el máximo de 5 MB.`);
      return;
    }

    setSelectedImages((currentImages) => [...currentImages, ...newImages]);
  };

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
      if (selectedImages.length === 0) {
        setFormError("Seleccioná al menos una imagen.");
        return;
      }

      const productData = new FormData();
      productData.append("Name", formData.get("name") as string);
      productData.append("Description", formData.get("description") as string);
      productData.append("Price", formData.get("price") as string);
      selectedImages.forEach((image) => productData.append("Images", image));
      productData.append("Stock", formData.get("stock") as string);
      productData.append(
        "CategoriaName",
        formData.get("categoriaName") as string,
      );
      productData.append("UsuarioId", userId);
      const response = await addProduct(productData);
      toast.success(response.message);
      formRef.current?.reset();
      setSelectedImages([]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#0B1120",
      color: "#FFFFFF",
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" }, // Texto gris claro flotando
    "& .MuiInputLabel-root.Mui-focused": { color: "#00E5FF" },
  };

  return (
    <Dialog
      open={true} // Cambialo por tu variable de estado si controlás su apertura
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box
        sx={{
          backgroundColor: "#172033",
          borderRadius: "16px",
          padding: "10px",
          width: "100%",
        }}
      >
        <form onSubmit={handleSumit} ref={formRef}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              Agregar Producto
            </Typography>
            <FaTimes
              size={24}
              onClick={onClose}
              style={{
                cursor: "pointer",
                color: "#7C3AED",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#7C3AED")}
            />
          </DialogTitle>

          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 4 }}
          >
            <TextField
              label="Nombre del producto"
              variant="outlined"
              type="text"
              name="name"
              required
              fullWidth
              sx={{ ...inputStyle, mt: 1 }}
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
              <Typography
                variant="body2"
                sx={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Fotos del producto (hasta {MAX_IMAGES}, máximo 5 MB cada una)
              </Typography>
              <Typography variant="caption" sx={{ color: "#FFFFFF" }}>
                Elegí varias a la vez con Ctrl/Shift, o agregalas en varias
                tandas.
              </Typography>
              <input
                type="file"
                name="Images"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  addSelectedImages(
                    Array.from(event.currentTarget.files ?? []),
                  );
                  event.currentTarget.value = "";
                }}
                style={{
                  color: "#94a3b8",
                  backgroundColor: "#0B1120",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                }}
              />
              <Typography variant="caption" sx={{ color: "#00E5FF" }}>
                {selectedImages.length} de {MAX_IMAGES} fotos seleccionadas
              </Typography>
              {selectedImages.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedImages.map((image, index) => (
                    <Box
                      key={`${image.name}-${image.lastModified}-${index}`}
                      sx={{ position: "relative", width: 76 }}
                    >
                      <Box
                        component="img"
                        src={imagePreviews[index]}
                        alt={`Vista previa de ${image.name}`}
                        sx={{
                          width: 76,
                          height: 76,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid rgba(255,255,255,.2)",
                        }}
                      />
                      <Button
                        type="button"
                        aria-label={`Quitar ${image.name}`}
                        onClick={() =>
                          setSelectedImages((current) =>
                            current.filter(
                              (_, imageIndex) => imageIndex !== index,
                            ),
                          )
                        }
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          minWidth: 24,
                          width: 24,
                          height: 24,
                          p: 0,
                          color: "#FFFFFF",
                          backgroundColor: "rgba(11,17,32,.85)",
                        }}
                      >
                        <FaTimes size={12} />
                      </Button>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ display: "block", color: "#FFFFFF" }}
                      >
                        {image.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <TextField
              label="Categoría"
              variant="outlined"
              name="categoriaName"
              required
              fullWidth
              select
              defaultValue=""
              sx={inputStyle}
            >
              <MenuItem value="" disabled>
                Seleccioná una categoría
              </MenuItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

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
              <Typography
                variant="body2"
                sx={{ color: "#ef4444", fontWeight: "bold", mt: 1 }}
              >
                ❌ {formError}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, pr: 3, gap: 1 }}>
            <Button
              onClick={onClose}
              sx={{ color: "#94a3b8", "&:hover": { color: "#f8fafc" } }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "8px 24px",
                "&:hover": {
                  backgroundColor: "#7C3AED",
                },
              }}
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
};
