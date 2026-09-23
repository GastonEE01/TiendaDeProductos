import React, { useRef, useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { FaCloudArrowUp } from "react-icons/fa6";
import { useAuthStore } from '../hooks/userStorage'; // Tu store de Zustand
import toast from "react-hot-toast";
import { updatePerfil,conectAuhtMP } from '../service/api';

export interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ open, onClose }) => {
  // 👤 Traemos al usuario actual y el método login de Zustand para actualizar la RAM al guardar
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#111827",
      color: "#f8fafc",
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" }
  };

  // 💾 PROCESAR CAMBIOS DE FORMA ATÓMICA (Igual que el Alta de Producto)
  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
     
    // 🚀 Recolectamos de forma nativa todo el formulario binario
    const formData = new FormData(e.currentTarget);
    const image = formData.get("img");

    const profileData = new FormData();
    profileData.append("UserName", formData.get("userName") as string);
    profileData.append("Mail", formData.get("mail") as string);
    profileData.append("AliasCBU", formData.get("aliasCBU") as string);
    
    if (image instanceof File) {
      profileData.append("IMG", image);
    }

    try {
      // Mandamos los datos binarios a tu endpoint de .NET
      const response = await updatePerfil(profileData);
      console.log("Respuesta del PUT de .NET:", response);
      if (!user || !token) {
    toast.error("Sesión inválida. Reubique sus credenciales.");
    return;
  }

 login({
  id: user.id,                      
  rol: user.rol,                    
  token: token,                     
  userName: response.userName,      
  mail: response.mail,              
  aliasCBU: response.aliasCBU,      
  
  // 🎯 CONEXIÓN PERFECTA: Guardamos el string 'img' del back 
  // adentro de la casilla 'imgPath' que exige tu interfaz de Zustand.
  img: response.img             
}, token);

      toast.success(response.message);
      onClose(); // Cerramos el modal de forma limpia
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al actualizar";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConectMP = async () => {
    setLoading(true);
    setFormError(null);

    if (!token) {
    toast.error("Sesión inválida. Por favor, vuelva a iniciar sesión.");
    setLoading(false);
    return;
  }

    try{
      const response =  await conectAuhtMP(token);
      console.log("JSON recibido del backend:", response);

 // const urlDeVinculacion = response.url || response.Url;
     if (response.url) {
      toast.success("Redirigiendo a Mercado Pago de forma segura... 🔒");
              // 3. 🔥 ¡EL EYECTOR DEFINITIVO!: Forzamos al navegador a viajar a la pantalla azul
      setTimeout(() => {
        window.location.href = response.url;
      }, 1000);
      } else {
      setFormError("El servidor no devolvió la propiedad 'url' en la respuesta.");
      toast.error("Error en la respuesta del servidor.");
    }
    }catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al actualizar";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box sx={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '10px', width: '100%' }}>
        <form onSubmit={handleSaveEdit} ref={formRef}>
          
          {/* 🏷️ ENCABEZADO CON CRUZ ROJA */}
          <DialogTitle component="div" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <div style={{ width: "24px" }}></div> 
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#f8fafc", flexGrow: 1, textAlign: "center" }}>
              Mi Perfil
            </Typography>
            <FaTimes 
              size={24} 
              onClick={onClose} 
              style={{ cursor: "pointer", color: "#ef4444", transition: "color 0.2s" }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ff0000'}
              onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
            />
          </DialogTitle>

          {/* 🧼 CUERPO DEL MODAL */}
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            
            {/* SECCIÓN DE FOTO ACTUAL */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1, justifyContent: "center" }}>
              <Avatar 
                src={user?.img ? `${import.meta.env.VITE_API_URL}${user.img}` : undefined} 
                sx={{ width: 75, height: 75, bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', fontWeight: 'bold', fontSize: '1.5rem' }}
              >
                {user?.userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                component="label"
                variant="outlined"
                startIcon={<FaCloudArrowUp />}
                sx={{ color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.1)', '&:hover': { borderColor: '#2563eb', color: '#2563eb' } }}
              >
                Nueva Foto
                <input type="file" name="img" hidden />
              </Button>
            </Box>

            {/* CAMPOS CON DATOS PRECARGADOS DESDE TU USEAUTHSTORE */}
            <TextField label="Nombre de Usuario" name="userName" defaultValue={user?.userName} sx={inputStyle} fullWidth required />
            <TextField label="Correo Electrónico" name="mail" defaultValue={user?.mail} sx={inputStyle} fullWidth required />
            <TextField label="Alias Homebanking / CBU" name="aliasCBU" defaultValue={user?.aliasCBU} sx={inputStyle} fullWidth />

            {formError && (
              <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: "bold", mt: 1 }}>
                ❌ {formError}
              </Typography>
            )}
          </DialogContent>

          {/* 🔘 ACCIONES */}
          <DialogActions sx={{ p: 2, pr: 3, gap: 1 }}>
            <Button onClick={onClose} sx={{ color: "#94a3b8", "&:hover": { color: "#f8fafc" } }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "8px 24px",
                "&:hover": { backgroundColor: "#1d4ed8" }
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogActions>

        </form>
        {/* 👤 BOTÓN OFICIAL DE VINCULACIÓN OAUTH MERCADO PAGO */}
<Box sx={{ mt: 1, mb: 1 }}>
  <Button
    variant="contained"
    fullWidth
    // startIcon={<FaHandshake />} // Podés importar FaHandshake de react-icons/fa
    onClick={handleConectMP}
   disabled={loading}
    sx={{
      backgroundColor: "#009ee3", // 🔵 El Azul Oficial de la marca Mercado Pago
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: "0.95rem",
      borderRadius: "8px",
      padding: "10px 16px",
      textTransform: "none", // Evita que MUI te lo ponga todo en mayúsculas estresantes
      boxShadow: "0 4px 12px rgba(0, 158, 227, 0.2)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#1289c4", // Azul un poco más oscuro al pasar el mouse
        boxShadow: "0 6px 16px rgba(0, 158, 227, 0.4)",
        transform: "translateY(-1px)" // Efecto sutil flotante de Startup premium
      },
      "&:active": {
        transform: "translateY(0)"
      }
    }}
  >
    Conectar con Mercado Pago
  </Button>
  
  <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5, textAlign: "center" }}>
    🔒 Vinculación segura mediante protocolo oficial OAuth 2.0
  </Typography>
</Box>

      </Box>
    </Dialog>
  );
};
