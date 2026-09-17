import { useAuthStore } from '../hooks/userStorage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // 🚀 1. Importamos useState para el modal

import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Dialog,
} from "@mui/material";
import { FaShoppingCart,FaSignOutAlt,FaBell } from "react-icons/fa";
import { Cart } from '../components/Cart';
import { HeaderNotification } from '../components/HeaderNotification'
export const Header = () => {

const [modalNotificacion, setModalNotifications] = useState<boolean>(false);

const logout = useAuthStore((state) => state.logout);
const user = useAuthStore((state) => state.user);
console.log("Rol:", JSON.stringify(user?.rol));

 const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
const handleOpenCart = (): void => setIsCartOpen(true);
const handleCloseCart = (): void => setIsCartOpen(false);

const navigate = useNavigate(); 
const handleLogout = () => {
  logout();
  navigate('/login');
};


  return (
    <AppBar position="static" style={{ background: "black", height: "10vh" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between", height: "100%"}}>
        
        {/* LADO IZQUIERDO: Tu Logo o Nombre de la App */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div" style={{ fontWeight: "bold", color: "white" }}>
            🚀 MI LOGO
          </Typography>
        </Box>

        <Box style={{ flexGrow: 1, textAlign: "center" }}>
        </Box>

        <Box style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          {/* Avatar del perfil (podés cambiarlo por una foto o iniciales) */}
          <Avatar 
            sx={{ bgcolor: "#rgba(26, 24, 23, 0.96)", cursor: "pointer" }}
            alt="Perfil Usuario"
          >
            U {/* Inicial del usuario o un icono */}
          </Avatar>

          {user?.rol !== "Admin" && ( 
            <FaShoppingCart   onClick={handleOpenCart}  fontSize={25} style={{ cursor: "pointer", color: "white"}} />
          ) }

           {user?.rol == "Admin" && ( 
              <HeaderNotification />
            
           )}
      
              
         
          <FaSignOutAlt  
            onClick={handleLogout}
            fontSize="25"
          
          >
            Cerrar sesión
          </FaSignOutAlt>
         
        </Box>

      </Toolbar>

       <Dialog
        open={isCartOpen}          
        onClose={handleCloseCart}  // Se ejecuta si el usuario hace click fuera del modal
        fullWidth
        maxWidth="sm" // Tamaño del modal (puedes usar xs, sm, md, lg)
      >
        <Cart /> 
      </Dialog>
    </AppBar>
    
  )
}

