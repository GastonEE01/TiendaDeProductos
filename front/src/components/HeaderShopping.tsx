import { useState, useEffect } from "react";
import { GetCustomerCartClient, updateOrdenDelivered } from "../service/api";
import { CustomerPurchasesDtoResponse } from "../interfaces/CartType";
import {
  IconButton,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import {
  FaBell,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthStore } from "../hooks/userStorage";

const API_URL = import.meta.env.VITE_API_URL;

export const HeaderShopping = () => {
  const [loading, setLoading] = useState(false);
  const [shopping, setShopping] = useState<CustomerPurchasesDtoResponse[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const [customerEmail, setCustomerEmail] = useState<string | null>(
    localStorage.getItem("customerEmail"),
  );

  useEffect(() => {
    const fetchAlert = async () => {
      const searchEmail = user?.mail || customerEmail;
      if (!searchEmail) {
        console.log("No hay un usuario logueado para traer el carrito.");
        return;
      }
      // Si el Drawer está cerrado o no hay mail, no gastamos recursos en internet
      if (!isDrawerOpen || !customerEmail) return;
      try {
        setLoading(true);
        setFormError(null);
        const response = await GetCustomerCartClient(searchEmail);
        setShopping(response);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : null;
        setFormError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
  }, [isDrawerOpen, customerEmail]);

  // Cada vez que el componente se renderice, podemos chequear si el Cart.tsx guardó un mail nuevo
  const currentLocalEmail = localStorage.getItem("customerEmail");
  if (currentLocalEmail !== customerEmail) {
    setCustomerEmail(currentLocalEmail);
  }

  const handleCloseDrawer = async () => {
    setIsDrawerOpen(false);
  };

  const handleConfirmedDelivery = async (ordenId: string) => {
    if (!customerEmail) return;
    try {
      const response = await updateOrdenDelivered(ordenId, customerEmail);
      toast.success(response.message);

      setShopping((prev) =>
        prev.map((item) =>
          item.id === ordenId ? { ...item, state: "Delivered" } : item,
        ),
      );
    } catch (error) {
      console.error("Error al confirmar la recepción:", error);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const imgPath = e.currentTarget.getAttribute("data-path");
    const fallbackUrl = `https://azurewebsites.net${imgPath}`;

    if (e.currentTarget.src !== fallbackUrl) {
      console.log(
        "No se encontro la img del carrito.Redirigiendo a Azure de respaldo...",
      );
      e.currentTarget.src = fallbackUrl;
    }
  };

  return (
    <>
      {loading && <p>Cargando productos...</p>}
      {formError && <p style={{ color: "red" }}>{formError}</p>}

      <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}>
        <FaBell size={24} style={{ color: "#2563eb" }} />
      </IconButton>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#111827",
              color: "#f8fafc",
              width: 360,
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            },
          },
        }}
      >
        <Box sx={{ padding: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#f8fafc" }}
          >
            Mis compras
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {shopping.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              No tienes ninguna compra aun.
            </Typography>
          ) : (
            <List sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {shopping.map((product) => (
                <ListItem
                  key={product.id}
                  disablePadding
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    backgroundColor: "#1e293b",
                    padding: 2.5,
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Box sx={{ mb: 1.5, width: "100%" }}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: "600",
                        display: "block",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      Estado del pedido
                    </Typography>

                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor:
                          product.state === "Shipped"
                            ? "rgba(245, 158, 11, 0.12)"
                            : product.state === "Delivered"
                              ? "rgba(16, 185, 129, 0.12)"
                              : "rgba(148, 163, 184, 0.12)",
                        color:
                          product.state === "Shipped"
                            ? "#f59e0b"
                            : product.state === "Delivered"
                              ? "#10b981"
                              : "#94a3b8",
                      }}
                    >
                      {product.state === "Shipped" && <FaTruck size={14} />}
                      {product.state === "Delivered" && (
                        <FaCheckCircle size={14} />
                      )}

                      {product.state !== "Shipped" &&
                        product.state !== "Delivered" && (
                          <FaBoxOpen size={14} />
                        )}

                      <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                        {product.state === "Shipped" && "En camino"}
                        {product.state === "Delivered" && "Entregado"}
                        {product.state !== "Shipped" &&
                          product.state !== "Delivered" &&
                          "Preparando pedido"}
                      </span>
                    </Box>
                  </Box>

                  {/*  TIPO DE ENTREGA */}
                  <Box sx={{ mb: 2, width: "100%" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: "600",
                        display: "block",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      Tipo de entrega
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                        color: "#f1f5f9",
                      }}
                    >
                      {product.deliveryMethod === "domicilio" ? (
                        <FaTruck size={14} style={{ color: "#38bdf8" }} />
                      ) : (
                        <FaMapMarkerAlt
                          size={14}
                          style={{ color: "#ef4444" }}
                        />
                      )}
                      <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>
                        {product.deliveryMethod === "domicilio"
                          ? "Envío a domicilio"
                          : "Retiro presencial"}
                      </span>
                    </Box>
                  </Box>

                  {product.state === "Shipped" && (
                    <button
                      style={{
                        marginTop: "4px",
                        marginBottom: "12px",
                        padding: "8px 16px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        width: "100%",
                        fontSize: "0.9rem",
                      }}
                      onClick={() => handleConfirmedDelivery(product.id)}
                    >
                      Ya tengo mi producto ✅
                    </button>
                  )}

                  {product.state === "Delivered" && (
                    <Box
                      sx={{
                        display: "block",
                        width: "100%",
                        mb: 1.5,
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        textAlign: "center",
                        color: "#10b981",
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      🎉 ¡Disfruta tu compra! Pedido completado.
                    </Box>
                  )}
                  <Box
                    sx={{
                      width: "100%",
                      mt: 1,
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      pt: 2,
                    }}
                  >
                    {product.productos.map((prod) => (
                      <Box
                        key={prod.img}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mt: 1,
                        }}
                      >
                        <img
                          src={`${API_URL}${prod.img}`}
                          alt={prod.name}
                          data-path={prod.img}
                          onError={handleImageError}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 4,
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              fontWeight: "bold",
                              color: "#f8fafc",
                            }}
                          >
                            {prod.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8" }}
                          >
                            Cant:{" "}
                            <span
                              style={{ color: "#f8fafc", fontWeight: "bold" }}
                            >
                              {prod.quantity}
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};
