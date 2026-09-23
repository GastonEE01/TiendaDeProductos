import React, { useState, useRef } from "react";

// style
import { Button, TextField, Typography, Box } from "@mui/material";
import { MdOutlineMailLock } from "react-icons/md";
import { FaUserAlt, FaUniversity,FaFileImage  } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogoMercadoExpress } from "../../assets/sections/LogoMercadoExpress";

// API
import { register } from "../../service/api";

export const RegisterPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const image = formData.get("img");

    const userData = new FormData();
    userData.append("UserName", formData.get("userName") as string);
    userData.append("Mail", formData.get("mail") as string);
    userData.append("Password", formData.get("password") as string);
    userData.append("ConfirmPassword", formData.get("confirmPassword") as string,);
    if (image instanceof File) {
      userData.append("IMG", image);
    }

    /*const user: RegisterDtoRequest = {
      userName: formData.get("userName") as string,
      mail: formData.get("mail") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      aliasCBU: formData.get("aliasCBU") as string,
      mercadoPagoAccessToken: formData.get("mercadoPagoAccessToken") as string,
    };*/

    try {
      const response = await register(userData);
      console.log(response);
      toast.success(response.message);
      formRef.current?.reset(); // resetea los campos
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#111827", // Fondo más oscuro para las cajas de entrada
      color: "#f8fafc", // Letras blancas al escribir
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#2563eb" }, // Borde azul al hacer foco
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" }, // Texto flotante en gris claro
    "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "16px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <LogoMercadoExpress />
        </Box>

        <div
          style={{
            backgroundColor: "1e293b",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <form
            onSubmit={handleSumit}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <h2
              style={{
                textAlign: "center",
                margin: "0 0 10px 0",
                color: "#f8fafc", // ⚪ Blanco brillante oficial de tu marca
                fontWeight: "bold",
                fontSize: "1.75rem",
                letterSpacing: "-0.03em",
              }}
            >
              Registro de Usuario
            </h2>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUserAlt fontSize={28} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Ingrese su nombre de usuario"
                variant="standard"
                type="text"
                name="userName"
                fullWidth
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MdOutlineMailLock fontSize={28} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Ingrese su mail"
                variant="standard"
                type="text"
                name="mail"
                fullWidth
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <RiLockPasswordFill fontSize={28} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Ingrese su contraseña"
                variant="standard"
                type="password"
                name="password"
                fullWidth
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <RiLockPasswordFill fontSize={28} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Confirme su contraseña"
                variant="standard"
                type="password"
                name="confirmPassword"
                fullWidth
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUniversity fontSize={28} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Ingrese su alias de su homebanking (opcional)"
                variant="standard"
                type="text"
                name="aliasCBU"
                fullWidth
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", fontWeight: "bold" }}
              >
                              <FaFileImage  fontSize={28} style={{ color: "#94a3b8" }} />

              </Typography>
              <input id="standard-basic" type="file" name="img" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading} // preguntar para que sirve
                sx={{
                  backgroundColor: "#2563eb", // 🔵 El azul eléctrico oficial de la Landing
                  color: "#ffffff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                }}
              >
                Enviar
              </Button>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#60a5fa",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#60a5fa")}
              >
                Volver{" "}
              </Link>
            </div>
          </form>
        </div>
        {formError && (
          <div style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>
            ❌ {formError}
          </div>
        )}
      </div>
    </div>
  );
};
