import React, {useState,useEffect} from 'react'
import { NotificacionDtoResponse } from '../interfaces/NotificacionType'
import { getNotificacionesAdmin,MarkNotificationsRead } from '../service/api'

import { Badge, IconButton, Drawer, Box, Typography, List, ListItem, Divider } from "@mui/material";
import { FaBell } from "react-icons/fa"



export const HeaderNotification = () => {

    const [notifications, setNotifications] = useState<NotificacionDtoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);


    useEffect(() => {
      const fetchAlert = async () => {
        try{
          setLoading(true);
          const data = await getNotificacionesAdmin();
          setNotifications(data);
        }catch(error){
          console.error("Error al traer notificaciones: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAlert();
    },[]);

    const unreadCount = notifications.filter((n) => n.state === "Unread").length;

    const handleCloseDrawer = async () => {
  setIsDrawerOpen(false); 
  
  try {
    await MarkNotificationsRead(); 
    
    // 3. Modificamos nuestro estado local para que pasen a "Read" en la pantalla
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, state: "Read" }))
    );
  } catch (error) {
    console.error("Error al actualizar notificaciones:", error);
  }
};

  return (
    <>
      {/* 🔔 ÍCONO DE LA CAMPANA */}
      <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}> 
        <Badge badgeContent={unreadCount} color="error">
          <FaBell size={24} style={{ color: "#d8a6a6" }} />
        </Badge>
      </IconButton>

      {/* 🧱 2. BARRA LATERAL (DRAWER) QUE SE DESPLIEGA AL HACER CLIC */}
      <Drawer
        anchor="right" // Hace que salga desde la derecha
        open={isDrawerOpen}
        onClose={handleCloseDrawer} // Al hacer clic afuera, se cierra
      >

        <Box sx={{ width: 350, padding: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Notificaciones de Ventas 🔔
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {notifications.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No tienes ventas registradas aún.
            </Typography>
          ) : (
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {notifications.map((notif) => (
                <ListItem 
                  key={notif.id} 
                  disablePadding 
                  sx={{ 
                    flexDirection: "column", 
                    alignItems: "flex-start",
                    backgroundColor: notif.state === "Unread" ? "#fff9f9" : "transparent", 
                    padding: 2,
                    borderRadius: "8px",
                    border: "1px solid #eee"
                  }}
                >
                  {/* Mensaje principal armado por el Back */}
                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                    {notif.message}
                  </Typography>

                  {/* Datos del Cliente */}
                  <Typography variant="caption" color="textSecondary">
                    📍 Dirección: {notif.customerAddress}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
                    📞 Tel: {notif.customerPhone}
                  </Typography>

                  {/* Lista de productos que vienen en tu JSON plano */}
                  <Box sx={{ width: "100%", mt: 1 }}>
                    {notif.productos.map((prod) => (
                      <Box key={prod.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <img 
                          src={`https://localhost:7197${prod.img}`} 
                          alt={prod.name} 
                          style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} 
                        />
                        <Box>
                          <Typography variant="caption" sx={{ display: "block", fontWeight: "bold" }}>
                            {prod.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Cant: {prod.quantity} x ${prod.unitPrice}
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

