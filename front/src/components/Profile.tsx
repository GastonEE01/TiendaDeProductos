import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { FaTimes, FaPhoneAlt, FaUserAlt, FaUniversity } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

import { useAuthStore } from "../hooks/userStorage"; // Tu store de Zustand
import toast from "react-hot-toast";
import { updatePerfil, conectAuhtMP } from "../service/api";
import { useSearchParams } from "react-router-dom";
export interface ProfileProps {
  open: boolean;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ open, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);

  const [countryCode, setCountryCode] = useState("+54");
  const [formattedPhone, setFormattedPhone] = useState("");

  useEffect(() => {
    if (user?.phone) {
      const codes = [
        "+598",
        "+55",
        "+56",
        "+57",
        "+52",
        "+51",
        "+58",
        "+34",
        "+54",
        "+1",
      ];
      const foundCode = codes.find((code) => user.phone.startsWith(code));

      if (foundCode) {
        setCountryCode(foundCode);
        const numberWithoutCode = user.phone.replace(foundCode, "");
        setFormattedPhone(numberWithoutCode);
      } else {
        setFormattedPhone(user.phone);
      }
    }
  }, [user]);

  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#0B1120",
      color: "#FFFFFF",
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00E5FF" },
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    const limitedNumber = soloNumeros.slice(0, 14);
    setFormattedPhone(limitedNumber);

    let formatted = limitedNumber;
    if (limitedNumber.length > 2 && limitedNumber.length <= 6) {
      formatted = `${limitedNumber.slice(0, 2)} ${limitedNumber.slice(2)}`;
    } else if (limitedNumber.length > 6) {
      formatted = `${limitedNumber.slice(0, 2)} ${limitedNumber.slice(2, 6)}-${limitedNumber.slice(6)}`;
    }

    setFormattedPhone(formatted);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const image = formData.get("img");

    const phoneClean = formattedPhone.replace(/\D/g, "");
    const phoneFull = `${countryCode}${phoneClean}`; // Ej: "+541112345678"

    const profileData = new FormData();
    profileData.append("UserName", formData.get("userName") as string);
    profileData.append("Mail", formData.get("mail") as string);
    const rawAliasCBU = (formData.get("aliasCBU") as string) || "";
    const cleanAliasCBU = rawAliasCBU.trim();
    profileData.append("AliasCBU", cleanAliasCBU);
    profileData.append("Phone", phoneFull);

    if (image instanceof File) {
      profileData.append("IMG", image);
    }

    try {
      const response = await updatePerfil(profileData);
      console.log("Respuesta del PUT de .NET:", response);
      if (!user || !token) {
        toast.error("Sesión inválida. Reubique sus credenciales.");
        return;
      }

      login(
        {
          id: user.id,
          rol: user.rol,
          token: token,
          userName: response.userName,
          mail: response.mail,
          aliasCBU: response.aliasCBU,
          img: response.img,
          phone: response.phone,
        },
        token,
      );
      toast.success(response.message);
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar";
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

    try {
      const response = await conectAuhtMP(token);
      console.log("JSON recibido del backend:", response);

      if (response.url) {
        toast.success("Redirigiendo a Mercado Pago de forma segura... 🔒");
        setTimeout(() => {
          window.location.href = response.url;
        }, 1000);
      } else {
        setFormError(
          "El servidor no devolvió la propiedad 'url' en la respuesta.",
        );
        toast.error("Error en la respuesta del servidor.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Leemos si Mercado Pago nos mandó el flag de éxito en la URL
    if (searchParams.get("mp_connected") === "1") {
      toast.success(
        "¡Mercado Pago vinculado con éxito! Ya podés recibir cobros. 🔒💳",
        {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#172033",
            color: "#4ade80",
            fontWeight: "bold",
            border: "1px solid #4ade80",
          },
        },
      );

      // Limpiamos la URL para que no quede el '?mp_connected=1' feo para siempre
      searchParams.delete("mp_connected");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "#172033",
          borderRadius: "16px",
          padding: "10px",
          width: "100%",
        }}
      >
        <form onSubmit={handleSaveEdit} ref={formRef}>
          <DialogTitle
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <div style={{ width: "24px" }}></div>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#FFFFFF",
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              Mi Perfil
            </Typography>
            <FaTimes
              size={24}
              onClick={onClose}
              style={{
                cursor: "pointer",
                color: "#7C3AED",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#00E5FF")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#7C3AED")}
            />
          </DialogTitle>

          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
          >
            {/* SECCIÓN DE FOTO ACTUAL */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 1,
                justifyContent: "center",
              }}
            >
              <Avatar
                src={
                  user?.img
                    ? `${import.meta.env.VITE_API_URL}${user.img}`
                    : undefined
                }
                sx={{
                  width: 75,
                  height: 75,
                  bgcolor: "rgba(37, 99, 235, 0.1)",
                  color: "#2563eb",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {user?.userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                component="label"
                variant="outlined"
                startIcon={<FaCloudArrowUp />}
                sx={{
                  color: "#94a3b8",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { borderColor: "#2563eb", color: "#2563eb" },
                }}
              >
                Nueva Foto
                <input type="file" name="img" hidden />
              </Button>
            </Box>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUserAlt fontSize={28} style={{ color: "#00E5FF" }} />
              <TextField
                label="Nombre de Usuario"
                name="userName"
                defaultValue={user?.userName}
                sx={inputStyle}
                fullWidth
                required
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MdMail fontSize={28} style={{ color: "#00E5FF" }} />
              <TextField
                label="Correo Electrónico"
                name="mail"
                defaultValue={user?.mail}
                sx={inputStyle}
                fullWidth
                required
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaPhoneAlt fontSize={28} style={{ color: "#00E5FF" }} />
              {/* Select del código de país */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #444",
                }}
              >
                <option value="+54">🇦🇷 (+54)</option>
                <option value="+55">🇧🇷 (+55)</option>
                <option value="+56">🇨🇱 (+56)</option>
                <option value="+57">🇨🇴 (+57)</option>
                <option value="+52">🇲🇽 (+52)</option>
                <option value="+51">🇵🇪 (+51)</option>
                <option value="+598">🇺🇾 (+598)</option>
                <option value="+58">🇻🇪 (+58)</option>
                <option value="+34">🇪🇸 (+34)</option>
                <option value="+1">🇺🇸 (+1)</option>
              </select>

              {/* Campo del número de teléfono */}
              <TextField
                id="standard-basic"
                label="11 1234-5678"
                variant="standard"
                type="text"
                name="phone"
                value={formattedPhone} 
                onChange={handleChangePhone}
                fullWidth
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUniversity fontSize={28} style={{ color: "#00E5FF" }} />
              <TextField
                label="Alias Homebanking / CBU"
                name="aliasCBU"
                defaultValue={user?.aliasCBU}
                sx={inputStyle}
                fullWidth
              />
            </div>

            {formError && (
              <Typography
                variant="body2"
                sx={{ color: "#ef4444", fontWeight: "bold", mt: 1 }}
              >
                ❌ {formError}
              </Typography>
            )}
          </DialogContent>

          {/* ACCIONES */}
          <DialogActions sx={{ p: 2, pr: 3, gap: 1 }}>
            <Button
              onClick={onClose}
              sx={{ color: "#FFFFFF", "&:hover": { color: "#00E5FF" } }}
            >
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
                "&:hover": { backgroundColor: "#7C3AED" },
              }}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogActions>
        </form>

        {/*Mercado pago */}
        <Box sx={{ mt: 1, mb: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleConectMP}
            disabled={loading}
            sx={{
              backgroundColor: "#009ee3",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "8px",
              padding: "10px 16px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0, 158, 227, 0.2)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#1289c4",
                boxShadow: "0 6px 16px rgba(0, 158, 227, 0.4)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Conectar con Mercado Pago
          </Button>

          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              display: "block",
              mt: 0.5,
              textAlign: "center",
            }}
          >
            🔒 Vinculación segura mediante protocolo oficial OAuth 2.0
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};
