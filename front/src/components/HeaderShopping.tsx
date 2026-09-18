import React, {useState,useEffect} from 'react'
import { GetCustomerCartClient,updateOrdenDelivered } from '../service/api'
import { CustomerPurchasesDtoResponse } from '../interfaces/CartType'
import {  IconButton, Drawer, Box, Typography, List, ListItem, Divider } from "@mui/material";
import { FaBell } from "react-icons/fa"
import toast from "react-hot-toast";

export const HeaderShopping = () => {

  const email = localStorage.getItem("customerEmail");
console.log("Email es: ", email);
 //const [notifications, setNotifications] = useState<NotificacionDtoResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [shopping, setShopping] = useState<CustomerPurchasesDtoResponse[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);



      const [customerEmail, setCustomerEmail] = useState<string | null>(
    localStorage.getItem("customerEmail")
  );

    useEffect(() => {
      const fetchAlert = async () => {
    
                // Si el Drawer está cerrado o no hay mail, no gastamos recursos en internet
           if (!isDrawerOpen || !customerEmail) return;
              try{
           setLoading(true);
           setFormError(null);
          const response = await GetCustomerCartClient(email);
          setShopping(response);
          console.log("Porductos comprados: " , response);
          //toast.success(response.message);  
        
        }catch(error: unknown){
           const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
      };
      fetchAlert();
    },[isDrawerOpen,customerEmail]);


      // Cada vez que el componente se renderice, podemos chequear si el Cart.tsx guardó un mail nuevo
  const currentLocalEmail = localStorage.getItem("customerEmail");
  if (currentLocalEmail !== customerEmail) {
    setCustomerEmail(currentLocalEmail);
  }

   const handleCloseDrawer = async () => {
  setIsDrawerOpen(false); 
  
};

const handleConfirmedDelivery = async (ordenId: string) => {
  if(!customerEmail) return;
  try{
     const response = await updateOrdenDelivered(ordenId,customerEmail);
     toast.success(response.message);

     // Buscamos la orden por su ID y le cambiamos el state a "Delivered"
    setShopping((prev) =>
      prev.map((item) =>
        item.id === ordenId ? { ...item, state: "Delivered" } : item
      )
    );

    }catch (error) {
    console.error("Error al confirmar la recepción:", error);
  }
};



  return (
    <>
      {/* 🔔 ÍCONO DE LA CAMPANA */}
      <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}> 
          <FaBell size={24} style={{ color: "#d8a6a6" }} />
      </IconButton>

      {/* 🧱 2. BARRA LATERAL (DRAWER) QUE SE DESPLIEGA AL HACER CLIC */}
      <Drawer
        anchor="right" // Hace que salga desde la derecha
        open={isDrawerOpen}
        onClose={handleCloseDrawer} 
        // Al hacer clic afuera, se cierra
      >

        <Box sx={{ width: 350, padding: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Mis compras
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {shopping.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No tienes ninguna compra aun.
            </Typography>
          ) : (
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {shopping.map((product) => (
                <ListItem 
                  key={product.id} 
                  disablePadding 
                  sx={{ 
                    flexDirection: "column", 
                    alignItems: "flex-start",
                    backgroundColor: product.state === "Unread" ? "#fff9f9" : "transparent", 
                    padding: 2,
                    borderRadius: "8px",
                    border: "1px solid #eee"
                  }}
                >
                  {/* Mensaje principal armado por el Back */}
                 

                  {/* Datos del Cliente */}
                  <Typography variant="caption" color="textSecondary" sx={{display:"block"}}>
                    📍 Estado: {product.state}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 1 ,display:"block"}}>
                    📞 metodo: {product.deliveryMethod}
                  </Typography>

                  {/* 🚀 TU BOTÓN DE CONFIRMACIÓN DEL CLIENTE: Solo aparece si está en camino */}
{product.state === "Shipped" && (
  <button
    style={{
      marginTop: "10px",
      padding: "5px 10px",
      backgroundColor: "#28a745", // Verde de éxito
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
    onClick={() => handleConfirmedDelivery(product.id) } // Aquí irá el PUT del cliente
  >
  
    Ya tengo mi producto ✅
  </button>
)}
{/*alert(`Confirmando recepción de la compra ID: ${product.id}`*/}
{product.state === "Delivered" && (
  <Typography variant="caption" sx={{ display: "block", mt: 1, color: "green", fontWeight: "bold" }}>
    🎉 ¡Disfruta tu compra! Pedido completado.
  </Typography>
)}
                  {/* Lista de productos que vienen en tu JSON plano */}
                  <Box sx={{ width: "100%", mt: 1 }}>
                    {product.productos.map((prod) => (
                      <Box key={prod.img} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
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