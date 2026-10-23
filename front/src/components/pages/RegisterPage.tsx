import React, { useState, useRef } from "react";

// style
import { Button, TextField, Typography, Box } from "@mui/material";
import { MdOutlineMailLock } from "react-icons/md";
import {
  FaUserAlt,
  FaUniversity,
  FaFileImage,
  FaPhoneAlt,
} from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogoNexusShopHex } from "../../assets/sections/LogoNexusShopHex";

// API
import { register } from "../../service/api";

export const RegisterPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState("+54");
  const [formattedPhone, setFormattedPhone] = useState("");

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

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const image = formData.get("img");

    const phoneClean = formattedPhone.replace(/\D/g, "");
    const phoneFull = `${countryCode}${phoneClean}`; // Ej: "+541112345678"

    const userData = new FormData();
    userData.append("UserName", formData.get("userName") as string);
    userData.append("Mail", formData.get("mail") as string);
    userData.append("Password", formData.get("password") as string);
    userData.append("ConfirmPassword",formData.get("confirmPassword") as string,);
    if (image instanceof File) {
      userData.append("IMG", image);
    }
    userData.append("Phone", phoneFull);

    try {
      const response = await register(userData);
      console.log(response);
      toast.success(response.message);
      formRef.current?.reset(); // resetea los campos
      setFormattedPhone("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#0B1120",
      color: "#FFFFFF",
      borderRadius: "8px",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
    },
    "& .MuiInputLabel-root": { color: "#94a3b8" }, // Texto flotante en gris claro
    "& .MuiInputLabel-root.Mui-focused": { color: "#00E5FF" },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0B1120",
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
          <LogoNexusShopHex
            size={{ xs: 26, sm: 30 }}
            fontSize={{ xs: "1.25rem", sm: "1.5rem" }}
          />
        </Box>

        <div
          style={{
            backgroundColor: "#172033",
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
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "1.75rem",
                letterSpacing: "-0.03em",
              }}
            >
              Registro de Usuario
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FaUserAlt fontSize={28} style={{ color: "#00E5FF" }} />
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
              <MdOutlineMailLock fontSize={28} style={{ color: "#00E5FF" }} />
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
              <RiLockPasswordFill fontSize={28} style={{ color: "#00E5FF" }} />
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
              <RiLockPasswordFill fontSize={28} style={{ color: "#00E5FF" }} />
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
              <FaPhoneAlt fontSize={28} style={{ color: "#00E5FF" }} />
              {/* Select de código de país */}
              <select
                onChange={(e) => setCountryCode(e.target.value)}
                defaultValue="+54"
                style={{ padding: "8px", borderRadius: "4px" }}
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
                <FaFileImage fontSize={28} style={{ color: "#00E5FF" }} />
              </Typography>
              <input id="standard-basic" type="file" name="img" />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading} // preguntar para que sirve
                sx={{
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  "&:hover": {
                    backgroundColor: "#7C3AED",
                  },
                }}
              >
                Enviar
              </Button>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#00E5FF",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#00E5FF")}
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
