import { useState, useEffect } from "react";
import { NotificacionDtoResponse } from "../interfaces/NotificacionType";
import {
  getNotificacionesAdmin,
  MarkNotificationsRead,
  updateOrdenShipped,
} from "../service/api";

import {
  Badge,
  IconButton,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { FaBell, FaAddressCard, FaPhoneAlt } from "react-icons/fa";

export const HeaderNotification = () => {
  const [notifications, setNotifications] = useState<NotificacionDtoResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        setLoading(true);
        const data = await getNotificacionesAdmin();
        setNotifications(data);
      } catch (error) {
        console.error("Error al traer notificaciones: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
  }, []);

  const unreadCount = notifications.filter((n) => n.state === "Unread").length;

  const handleCloseDrawer = async () => {
    setIsDrawerOpen(false);

    try {
      await MarkNotificationsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, state: "Read" })));
    } catch (error) {}
  };

  const handleUpdateOrdenShipped = async (ordenId: string) => {
    try {
      await updateOrdenShipped(ordenId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.ordenId === ordenId ? { ...n, orderState: "Shipped" } : n,
        ),
      );
    } catch (error) {}
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
      {loading && (
        <Typography
          variant="body2"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#2563eb",
          }}
        >
          Cargando notificaciones, por favor espere...
        </Typography>
      )}
      <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <FaBell size={35} style={{ color: "#2563eb" }} />
        </Badge>
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
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "#f8fafc",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Notificaciones de Ventas 🔔
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.08)" }} />

          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              No tienes ventas registradas aún.
            </Typography>
          ) : (
            <List sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {notifications.map((notif) => (
                <ListItem
                  key={notif.id}
                  disablePadding
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    backgroundColor:
                      notif.state === "Unread"
                        ? "rgba(37, 99, 235, 0.08)"
                        : "#1e293b",
                    padding: 2.5,
                    borderRadius: "12px",
                    border:
                      notif.state === "Unread"
                        ? "1px solid rgba(37, 99, 235, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      mb: 1.5,
                      color: "#f8fafc",
                      lineHeight: 1.4,
                    }}
                  >
                    {notif.message}
                  </Typography>

                  <Box sx={{ mb: 1.5, width: "100%" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: "600",
                        display: "block",
                        textTransform: "uppercase",
                        fontSize: "0.65rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      Dirección de entrega
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
                      <FaAddressCard size={14} style={{ color: "#94a3b8" }} />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", fontSize: "0.85rem" }}
                      >
                        {notif.customerAddress}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2, width: "100%" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: "600",
                        display: "block",
                        textTransform: "uppercase",
                        fontSize: "0.65rem",
                        letterSpacing: 0.5,
                      }}
                    >
                      Teléfono de contacto
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
                      <FaPhoneAlt size={12} style={{ color: "#94a3b8" }} />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", fontSize: "0.85rem" }}
                      >
                        {notif.customerPhone}
                      </Typography>
                    </Box>
                  </Box>

                  {notif.orderState === "Paid" ? (
                    <button
                      style={{
                        marginTop: "4px",
                        marginBottom: "12px",
                        padding: "10px 16px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        width: "100%",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => handleUpdateOrdenShipped(notif.ordenId)}
                    >
                      Marcar como Enviado 📦
                    </button>
                  ) : (
                    <Box
                      sx={{
                        display: "block",
                        width: "100%",
                        mb: 1.5,
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        textAlign: "center",
                        color:
                          notif.orderState === "Shipped"
                            ? "#f59e0b"
                            : "#10b981",
                        backgroundColor:
                          notif.orderState === "Shipped"
                            ? "rgba(245, 158, 11, 0.12)"
                            : "rgba(16, 185, 129, 0.12)",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border:
                          notif.orderState === "Shipped"
                            ? "1px solid rgba(245, 158, 11, 0.2)"
                            : "1px solid rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      {notif.orderState === "Shipped"
                        ? "🚚 Pedido en camino"
                        : "✅ Entrega confirmada por el cliente"}
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
                    {notif.productos.map((prod) => (
                      <Box
                        key={prod.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mt: 1.5,
                        }}
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}${prod.img}`}
                          alt={prod.name}
                          data-path={prod.img}
                          onError={handleImageError}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 6,
                            objectFit: "cover",
                            backgroundColor: "#334155",
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
                            </span>{" "}
                            x \${prod.unitPrice}
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
