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
import { LogoNexusShopHex } from "../assets/sections/LogoNexusShopHex";
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
    <AppBar position="static" sx={{ background: "#0B1120", height: "auto" }}>
      <Toolbar
        sx={{
          minHeight: { xs: 64, sm: 80 },
          px: { xs: 1, sm: 2 },
          display: "flex",
          justifyContent: "space-between",
          gap: { xs: 0.5, sm: 2 },
        }}
      >
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: "1 1 auto",
            minWidth: 0,
            "& > a > span": {
              fontSize: { xs: "1.1rem", sm: "2rem", md: "3.75rem" },
            },
            "& > a > div": { p: { xs: 0.75, sm: 1 } },
            "& > a > div svg": {
              width: { xs: 18, sm: 25 },
              height: { xs: 18, sm: 25 },
            },
          }}
        >
          <LogoNexusShopHex
            size={{ xs: 22, sm: 30 }}
            fontSize={{ xs: "1rem", sm: "1.35rem" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: "0 0 auto",
            gap: { xs: 0, sm: 1 },
            "& .MuiIconButton-root": { p: { xs: 0.75, sm: 1 } },
          }}
        >
          {/* PERFIL */}
          {user ? (
            <div>
              <IconButton
                onClick={() => setProfileModal(true)} 
                sx={{ padding: 0 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(0, 229, 255, 0.12)",
                    color: "#00E5FF",
                    fontWeight: "bold",
                    border: "1px solid rgba(0, 229, 255, 0.3)",
                    cursor: "pointer",
                    width: { xs: 36, sm: 48, md: 55 },
                    height: { xs: 36, sm: 48, md: 55 },
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
                bgcolor: "#172033",
                color: "#FFFFFF",
                width: { xs: 36, sm: 48, md: 55 },
                height: { xs: 36, sm: 48, md: 55 },
                border: "1px solid #7C3AED",
              }}
            />
          )}
          {user?.rol !== "Seller" && (
            <>
              <IconButton
                aria-label="Abrir carrito"
                onClick={handleOpenCart}
                color="inherit"
              >
                <FaShoppingCart size={22} />
              </IconButton>
              <HeaderShopping />
            </>
          )}

          {user?.rol == "Seller" && <HeaderNotification />}
          <IconButton
            aria-label="Cerrar sesión"
            onClick={handleLogout}
            color="inherit"
          >
            <FaSignOutAlt size={22} />
          </IconButton>
        </Box>
      </Toolbar>

      <Dialog
        open={isCartOpen}
        onClose={handleCloseCart} 
        fullWidth
        maxWidth="sm" 
      >
        <Cart />
      </Dialog>
    </AppBar>
  );
};
