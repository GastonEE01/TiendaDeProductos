import { useAuthStore } from '../hooks/userStorage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // 🚀 1. Importamos useState para el modal

import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Dialog,
  IconButton
} from "@mui/material";
import { FaShoppingCart,FaSignOutAlt } from "react-icons/fa";
import { Cart } from '../components/Cart';
import { HeaderNotification } from '../components/HeaderNotification'
import { HeaderShopping } from '../components/HeaderShopping'
import { LogoMercadoExpress } from '../assets/sections/LogoMercadoExpress'
import { Profile } from './Profile';

const API_URL = import.meta.env.VITE_API_URL;

export const Header = () => {


const logout = useAuthStore((state) => state.logout);
const user = useAuthStore((state) => state.user);
console.log("Rol:", JSON.stringify(user?.rol));
console.log("IMG:", JSON.stringify(user?.img));

 const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
const handleOpenCart = (): void => setIsCartOpen(true);
const handleCloseCart = (): void => setIsCartOpen(false);

const [profileModal,setProfileModal] = useState<boolean>(false);

const navigate = useNavigate(); 
const handleLogout = () => {
  logout();
  navigate('/login');
};

const obtenerInicial = () => {
  return user?.userName ? user.userName.charAt(0).toUpperCase() : "U";
};

  return (
    <AppBar position="static" style={{ background: "black", height: "10vh" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between", height: "100%"}}>
        
        {/* LADO IZQUIERDO: Tu Logo o Nombre de la App */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <LogoMercadoExpress/>
        </Box>

        <Box style={{ flexGrow: 1, textAlign: "center" }}>
        </Box>

        <Box style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          {/* Avatar del perfil (podés cambiarlo por una foto o iniciales) */}
         <div>
           <IconButton 
          onClick={() => setProfileModal(true)} // 🚀 Al hacer clic, abrimos el modal pasándolo a true
          sx={{ padding: 0 }}
        >
           <Avatar 
    sx={{ 
      // 🚀 RECTIFICADO: Quitamos el '#' para que el color rgba sea válido y estético
      bgcolor: "rgba(37, 99, 235, 0.1)", // Tu azul eléctrico de Startup con transparencia
      color: "#2563eb",                  // La inicial se pinta en tu azul oficial
      fontWeight: "bold",
      border: "1px solid rgba(37, 99, 235, 0.2)",
      cursor: "pointer",
      width: 60,
      height: 60
    }}
    alt={user?.userName || "Perfil Usuario"}
    // 🚀 RECTIFICADO: Controlamos que la URL se arme limpia sin dobles barras
    src={user?.img ? `${API_URL}${user.img}` : undefined}
    
  >
    {/* 💡 Si user.imgPath viene vacío, MUI oculta el src y renderiza esta inicial automáticamente */}
    {obtenerInicial()} 
  </Avatar>
  </IconButton>
    <Profile open={profileModal} onClose={() => setProfileModal(false)} />

    
</div>
          {user?.rol !== "Admin" && ( 
            <>
            <FaShoppingCart   onClick={handleOpenCart}  fontSize={35} style={{ cursor: "pointer", color: "white"}} />
            <HeaderShopping />
            </>
          ) }

           {user?.rol == "Admin" && ( 
              <HeaderNotification />
            
           )}
      
              
         
          <FaSignOutAlt  
            onClick={handleLogout}
            fontSize="35"
          
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

