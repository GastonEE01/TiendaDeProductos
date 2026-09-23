import React, { useState, useRef } from "react";
import { LoginDtoRequest } from "../../interfaces/UsuarioType";
import { LogoMercadoExpress } from "../../assets/sections/LogoMercadoExpress";

import { Button, TextField, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { login } from "../../service/api";
import { useAuthStore } from "../../hooks/userStorage";

export const LoginPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);

    const userLogin: LoginDtoRequest = {
      mail: formData.get("mail") as string,
      password: formData.get("password") as string,
    };
    try {
      const response = await login(userLogin);
      toast.success(response.message);
      if (response) {
        useAuthStore.getState().login(
          {
            id: response.id,
            rol: response.rol,
            token: response.token,
            userName: response.userName,
            mail: response.mail,
            aliasCBU: response.aliasCBU,
            img: response.img
          },
          response.token,
        );
        console.log(response);
        navigate("/admin");
      }
    } catch (error: unknown) {
      const menssage = error instanceof Error ? error.message : null;
      setFormError(menssage);
      formRef.current?.reset(); // resetea los campos
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
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          }}
        >
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
              Iniciando sesión, por favor espere...
            </Typography>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MdOutlineMailLock fontSize={28} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Ingrese su mail"
                variant="standard"
                type="text"
                name="mail"
                fullWidth
                disabled={loading}
                sx={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <RiLockPasswordFill fontSize={35} style={{ color: "#94a3b8" }} />
              <TextField
                id="standard-basic"
                label="Ingrese su contraseña"
                variant="standard"
                type="password"
                name="password"
                fullWidth
                disabled={loading}
                sx={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
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
                {loading ? "Cargando..." : "Enviar"}
              </Button>
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#60a5fa",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#60a5fa")}
              >
                ¿No tienes una cuenta? Registrate{" "}
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
