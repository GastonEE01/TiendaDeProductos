import React, { useState } from "react";
import { ProductDtoRequest } from "../interfaces/ProductoType";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { FaCartPlus, FaTrash, FaEdit, FaSearchPlus, FaSearchMinus, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

import { InputNumber } from "antd";
import { useAuthStore } from "../hooks/userStorage";
import { useCartStore } from "../hooks/useCartStore";

const API_URL = import.meta.env.VITE_API_URL;

interface ProductCardProps {
  product: ProductDtoRequest;
  onDelete: (id: string) => void;
  onEdit: (product: ProductDtoRequest) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDelete,
  onEdit,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(1);

  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const images = product.images?.length
    ? product.images
    : product.img
      ? [product.img]
      : [];

  const getImageUrl = (path: string) =>
    path.startsWith("http") ? path : `${API_URL}${path}`;

  const changeImage = (direction: number) => {
    setActiveImage((current) => (current + direction + images.length) % images.length);
    setZoom(1);
  };

  return (
    <Box sx={{ minWidth: 0, width: "100%" }}>
      <Card sx={{ width: "100%", borderRadius: "12px", boxShadow: 3, backgroundColor: "#172033", color: "#FFFFFF" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
          {/* Nombre */}
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", fontSize: { xs: "1.15rem", sm: "1.5rem" }, overflowWrap: "anywhere" }} >
            {product.name}
          </Typography>

          {/* IMG */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1, backgroundColor: "rgba(255, 255, 255, 0.02)", borderRadius: "8px", overflow: "hidden" }}>
            {images.length > 1 && (
              <Box
                role="group"
                aria-label="Fotos del producto"
                sx={{
                  width: { xs: "100%", sm: 56 },
                  height: { xs: 52, sm: 220 },
                  flex: { xs: "0 0 52px", sm: "0 0 56px" },
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  gap: 0.75,
                  overflowX: { xs: "auto", sm: "hidden" },
                  overflowY: { xs: "hidden", sm: "auto" },
                  p: 0.5,
                }}
              >
                {images.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    component="button"
                    type="button"
                    aria-label={`Mostrar foto ${index + 1}`}
                    aria-pressed={index === activeImage}
                    onClick={() => setActiveImage(index)}
                    sx={{
                      p: 0,
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      flex: { xs: "0 0 40px", sm: "0 0 48px" },
                      borderRadius: 1,
                      overflow: "hidden",
                      border: index === activeImage ? "2px solid #00E5FF" : "1px solid rgba(255,255,255,.2)",
                      backgroundColor: "#0B1120",
                      cursor: "pointer",
                    }}
                  >
                    <Box component="img" src={getImageUrl(image)} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
              {images.length > 0 ? (
                <Box
                  component="img"
                  src={getImageUrl(images[activeImage] ?? images[0])}
                  alt={`${product.name}, foto ${activeImage + 1}`}
                  onClick={() => setGalleryOpen(true)}
                  sx={{
                    width: "100%",
                    height: { xs: 180, sm: 220 },
                    objectFit: "contain",
                    borderRadius: "8px",
                    padding: "12px",
                    cursor: "zoom-in",
                  }}
                />
              ) : (
                <Box sx={{ height: { xs: 180, sm: 220 }, display: "grid", placeItems: "center", color: "#FFFFFF" }}>
                  Sin imágenes
                </Box>
              )}
              {images.length > 0 && (
                <IconButton
                  aria-label="Ampliar fotos del producto"
                  onClick={() => {
                    setZoom(1);
                    setGalleryOpen(true);
                  }}
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    color: "#FFFFFF",
                    backgroundColor: "rgba(11, 17, 32, 0.85)",
                    "&:hover": { backgroundColor: "#2563EB" },
                  }}
                >
                  <FaSearchPlus />
                </IconButton>
              )}
              {images.length > 1 && (
                <Typography
                  variant="caption"
                  sx={{ position: "absolute", left: 12, bottom: 12, color: "#FFFFFF", backgroundColor: "rgba(11, 17, 32, 0.85)", px: 1, borderRadius: 1 }}
                >
                  {activeImage + 1} / {images.length}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Categoria */}
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "rgba(37, 99, 235, 0.15)", 
              color: "#00E5FF",
              padding: "4px 10px",
              borderRadius: "50px",
              fontWeight: "bold",
              display: "inline-block",
              mb: 2,
              border: "1px solid rgba(0, 229, 255, 0.3)"
            }}
          >
            {product.categoriaName || "General"}
          </Typography>

          {/* Descripcion */}
          <Typography
            gutterBottom
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, overflowWrap: "anywhere" }}
          >
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1, mt: 1 }}>
            {/* Precio */}
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#00E5FF !important" }}
            >
              Precio: ${product.price}
            </Typography>

            {/* Stock */}
            <Typography
              variant="subtitle2"
              color={product.stock > 0 ? "success.main" : "error.main"}
            >
              Stock: {product.stock}
            </Typography>
          </Box>
        </CardContent>

        {/* Botones de acción de la tarjeta */}
        <CardActions sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1, p: { xs: 1.5, sm: 2 } }}>
          {user?.rol === "Seller" && (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FaEdit />}
                onClick={() => onEdit(product)}
                sx={{ color: "#00E5FF !important", flex: "1 1 110px" }}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<FaTrash />}
                onClick={() => onDelete(product.id)}
                sx={{ flex: "1 1 110px" }}
              >
                Eliminar
              </Button>
            </>
          )}

          {user?.rol !== "Seller" && (
            <>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<FaCartPlus />}
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                aria-label={`Agregar ${product.name} al carrito`}
                sx={{ color: "#00E5FF !important", minWidth: 48 }}
              />

              <InputNumber
                placeholder="Elegí la cantidad"
                aria-label={`Cantidad de ${product.name}`}
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                disabled={product.stock <= 0}
                style={{ maxWidth: "100%" }}
              />
            </>
          )}
        </CardActions>
      </Card>
      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { backgroundColor: "#172033", color: "#FFFFFF" } } }}
      >
        <DialogContent sx={{ position: "relative", p: { xs: 2, sm: 3 } }}>
          <IconButton
            aria-label="Cerrar galería"
            onClick={() => setGalleryOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, color: "#FFFFFF" }}
          >
            <FaTimes />
          </IconButton>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2, pr: 4 }}>
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 0, sm: 2 }, overflow: "hidden", minWidth: 0 }}>
            <IconButton
              aria-label="Foto anterior"
              onClick={() => changeImage(-1)}
              disabled={images.length < 2}
              sx={{ color: "#00E5FF", p: { xs: 0.5, sm: 1 } }}
            >
              <FaChevronLeft />
            </IconButton>
            {images[activeImage] && (
              <Box
                component="img"
                src={getImageUrl(images[activeImage])}
                alt={`${product.name}, foto ${activeImage + 1}`}
                onWheel={(event) => {
                  event.preventDefault();
                  setZoom((current) => Math.min(3, Math.max(1, current + (event.deltaY < 0 ? 0.2 : -0.2))));
                }}
                onDoubleClick={() => setZoom((current) => current === 1 ? 2 : 1)}
                sx={{
                  width: "min(68vw, 640px)",
                  height: "min(60vh, 520px)",
                  objectFit: "contain",
                  transform: `scale(${zoom})`,
                  transition: "transform 150ms ease",
                  cursor: zoom > 1 ? "zoom-out" : "zoom-in",
                }}
              />
            )}
            <IconButton
              aria-label="Foto siguiente"
              onClick={() => changeImage(1)}
              disabled={images.length < 2}
              sx={{ color: "#00E5FF", p: { xs: 0.5, sm: 1 } }}
            >
              <FaChevronRight />
            </IconButton>
          </Box>
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", my: 1, color: "#FFFFFF" }}>
            Usá la rueda del mouse o doble clic para acercar. Zoom: {Math.round(zoom * 100)}%
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <IconButton
              aria-label="Alejar imagen"
              onClick={() => setZoom((current) => Math.max(1, current - 0.25))}
              disabled={zoom === 1}
              sx={{ color: "#00E5FF" }}
            >
              <FaSearchMinus />
            </IconButton>
            <IconButton
              aria-label="Acercar imagen"
              onClick={() => setZoom((current) => Math.min(3, current + 0.25))}
              disabled={zoom === 3}
              sx={{ color: "#00E5FF" }}
            >
              <FaSearchPlus />
            </IconButton>
          </Box>
          {images.length > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, overflowX: "auto", mt: 2 }}>
              {images.map((image, index) => (
                <Box
                  key={`${image}-${index}`}
                  component="button"
                  type="button"
                  aria-label={`Ver foto ${index + 1}`}
                  onClick={() => {
                    setActiveImage(index);
                    setZoom(1);
                  }}
                  sx={{
                    p: 0,
                    width: 64,
                    height: 64,
                    flex: "0 0 auto",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: index === activeImage ? "2px solid #00E5FF" : "1px solid rgba(255,255,255,.2)",
                    backgroundColor: "#0B1120",
                    cursor: "pointer",
                  }}
                >
                  <Box component="img" src={getImageUrl(image)} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
