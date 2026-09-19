import React, { useState } from "react";
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

  return (
    <div style={{ backgroundColor: "orange" }}>
      <Card sx={{ maxWidth: 345, borderRadius: "12px", boxShadow: 3, m: 2 }}>
        <CardContent>
          {/* Nombre */}
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {product.name}
          </Typography>

          {/* IMG */}
          <Box
            component="img"
            src={`${API_URL}${product.img}`}
            alt={product.name}
            sx={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          ></Box>

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
          {user?.rol === "Admin" && (
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

          {user?.rol !== "Admin" && (
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
