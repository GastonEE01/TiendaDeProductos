import React, { useState,useEffect } from "react";
import { ProductDtoRequest } from "../interfaces/ProductoType";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { FaCartPlus, FaTrash, FaEdit } from "react-icons/fa";

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

  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);

  const obtenerRutaInicial = () => {
    if (!product.img) return "https://placeholder.com";
    return product.img.startsWith("http") ? product.img : `${API_URL}${product.img}`;
  };

  const [imgSrc, setImgSrc] = useState<string>(obtenerRutaInicial);

   useEffect(() => {
    if (product.img) {
      const rutaCorrecta = product.img.startsWith("http") ? product.img : `${API_URL}${product.img}`;
      setImgSrc(rutaCorrecta);
    }
  }, [product.img]);

/*
  useEffect(() => {
    setImgSrc(`${API_URL}${product.img}`);
  }, [product.img]);
*/
  const handleImageError = () => {
    if (product.img && product.img.startsWith("http")) {
      setImgSrc("https://placeholder.com?text=Imagen+No+Disponible");
      return;
    }
    const urlAlternativa = `https://azurewebsites.net${product.img}`;
    
    if (imgSrc !== urlAlternativa) {
      console.log(`Imagen de '${product.name}' no encontrada localmente. Redirigiendo a Azure...`);
      setImgSrc(urlAlternativa);
    }
  };

  return (
    <div style={{ backgroundColor: "orange" }}>
      <Card sx={{ maxWidth: 345, borderRadius: "12px", boxShadow: 3, m: 2 }}>
        <CardContent>
          {/* Nombre */}
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold" }} >
            {product.name}
          </Typography>

          {/* IMG */}
          <Box
            component="img"
            src={imgSrc}
            alt={product.name}
            onError={handleImageError} 
            sx={{
              width: "100%",
              height: "160px",
              objectFit: "contain",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
               backgroundColor: "rgba(255, 255, 255, 0.02)", 
              padding: "8px"
            }}
          ></Box>

          {/* Categoria */}
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "rgba(37, 99, 235, 0.15)", 
              color: "#60a5fa",                            
              padding: "4px 10px",
              borderRadius: "50px",
              fontWeight: "bold",
              display: "inline-block",
              mb: 2,
              border: "1px solid rgba(37, 99, 235, 0.3)"
            }}
          >
            {product.categoriaName || "General"}
          </Typography>

          {/* Descripcion */}
          <Typography
            gutterBottom
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            {/* Precio */}
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#60a5fa !important" }}
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
        <CardActions sx={{ justifyContent: "space-between", padding: "16px" }}>
          {user?.rol === "Seller" && (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FaEdit />}
                onClick={() => onEdit(product)}
                sx={{ color: "#60a5fa !important" }}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                startIcon={<FaTrash />}
                onClick={() => onDelete(product.id)}
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
                sx={{ color: "#60a5fa !important" }}
              ></Button>

              <InputNumber
                placeholder="Elegí la cantidad"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                disabled={product.stock <= 0}
              />
            </>
          )}
        </CardActions>
      </Card>
    </div>
  );
};
