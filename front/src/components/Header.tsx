import { useAuthStore } from "../hooks/userStorage";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // 🚀 1. Importamos useState para el modal

import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Dialog,
  IconButton,
} from "@mui/material";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { Cart } from "../components/Cart";
import { HeaderNotification } from "../components/HeaderNotification";
import { HeaderShopping } from "../components/HeaderShopping";
import { LogoMercadoExpress } from "../assets/sections/LogoMercadoExpress";
import { Profile } from "./Profile";

const API_URL = import.meta.env.VITE_API_URL;

export const Header = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  console.log("Rol:", JSON.stringify(user?.rol));
  console.log("IMG:", JSON.stringify(user?.img));

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const handleOpenCart = (): void => setIsCartOpen(true);
  const handleCloseCart = (): void => setIsCartOpen(false);

  const [profileModal, setProfileModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const obtenerInicial = () => {
    return user?.userName ? user.userName.charAt(0).toUpperCase() : "U";
  };

  return (
    <AppBar position="static" style={{ background: "black", height: "10vh" }}>
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* LADO IZQUIERDO: Tu Logo o Nombre de la App */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <LogoMercadoExpress />
        </Box>

        <Box style={{ flexGrow: 1, textAlign: "center" }}></Box>

        <Box style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Avatar del perfil (podés cambiarlo por una foto o iniciales) */}
          {user ? (
            <div>
              <IconButton
                onClick={() => setProfileModal(true)} // 🚀 Al hacer clic, abrimos el modal pasándolo a true
                sx={{ padding: 0 }}
              >
                <Avatar
                  sx={{
                    // 🚀 RECTIFICADO: Quitamos el '#' para que el color rgba sea válido y estético
                    bgcolor: "rgba(37, 99, 235, 0.1)", // Tu azul eléctrico de Startup con transparencia
                    color: "#2563eb", // La inicial se pinta en tu azul oficial
                    fontWeight: "bold",
                    border: "1px solid rgba(37, 99, 235, 0.2)",
                    cursor: "pointer",
                    width: 55,
                    height: 55,
                  }}
                  alt={user?.userName || "Perfil Usuario"}
                  src={user?.img ? `${API_URL}${user.img}` : undefined}
                >
                  {obtenerInicial()}
                </Avatar>
              </IconButton>

              <Profile
                open={profileModal}
                onClose={() => setProfileModal(false)}
              />
            </div>
          ) : (
            <Avatar
              sx={{
                bgcolor: "#27272a", // Fondo gris oscuro premium para modo oscuro
                color: "#a1a1aa", // Monigote gris claro
                width: 55,
                height: 55,
                border: "1px solid #3f3f46",
              }}
              // Al no pasarle 'src' ni texto, renderiza automáticamente el icono de usuario genérico de Material UI
            />
          )}
          {user?.rol !== "Seller" && (
            <>
              <FaShoppingCart
                onClick={handleOpenCart}
                fontSize={35}
                style={{ cursor: "pointer", color: "white" }}
              />
              <HeaderShopping />
            </>
          )}

          {user?.rol == "Seller" && <HeaderNotification />}

          {user ? (
            <FaSignOutAlt
              onClick={handleLogout}
              fontSize="35"
              style={{ cursor: "pointer", color: "white" }}
            />
              ) : (
            // ⚪ Si es un cliente anónimo, le pintamos un botón estético para ir a loguearse
           <FaSignOutAlt
              onClick={handleLogout}
              fontSize="35"
              style={{ cursor: "pointer", color: "white" }}
            />
          )}

        </Box>
      </Toolbar>


      <Dialog
        open={isCartOpen}
        onClose={handleCloseCart} // Se ejecuta si el usuario hace click fuera del modal
        fullWidth
        maxWidth="sm" // Tamaño del modal (puedes usar xs, sm, md, lg)
      >
        <Cart />
      </Dialog>
    </AppBar>
  );
};
