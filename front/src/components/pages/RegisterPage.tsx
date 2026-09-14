import React, { useState,useRef } from "react";
import { RegisterDtoRequest } from "../../interfaces/UsuarioType";

// style
import {
  Button,
  TextField,
  FormControl,
 
} from "@mui/material";
import { MdOutlineMailLock } from "react-icons/md";
import { FaUserAlt, FaWallet, FaUniversity } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// API
import {register} from '../../service/api'

export const RegisterPage: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

  const handleSumit =  async (e: React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const user: RegisterDtoRequest = {
        userName: formData.get("userName") as string,
        mail: formData.get("mail") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
        aliasCBU: formData.get("aliasCBU") as string,
        mercadoPagoAccessToken: formData.get("mercadoPagoAccessToken") as string,      
    }

    try{
        const response = await register(user)
        toast.success(response.message);      
        formRef.current?.reset();  // resetea los campos   
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#99bde4", 
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <FormControl
          component="form"
          onSubmit={handleSumit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h2
            style={{ textAlign: "center", margin: "0 0 10px 0", color: "#333" }}
          >
            Registro de Usuario
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaUserAlt fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Ingrese su nombre de usuario"
              variant="standard"
              type="text"
              name="userName"
              fullWidth
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MdOutlineMailLock fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Ingrese su mail"
              variant="standard"
              type="text"
              name="mail"
              fullWidth
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <RiLockPasswordFill fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Ingrese su contraseña"
              variant="standard"
              type="password"
              name="password"
              fullWidth
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <RiLockPasswordFill fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Confirme su contraseña"
              variant="standard"
              type="password"
              name="confirmPassword"
              fullWidth
            />
          </div>

          <label style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            No es necesario que pongas ambas,almenos 1 de esas 2
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaUniversity fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Ingrese su alias de su homebanking"
              variant="standard"
              type="text"
              name="aliasCBU"
              fullWidth
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaWallet fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Ingrese su alias de mercado pago"
              variant="standard"
              type="text"
              name="mercadoPagoAccessToken"
              fullWidth
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              color="info"
              variant="contained"
              type="submit"
              disabled={loading}// preguntar para que sirve 
            >
              Enviar
            </Button>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Volver{" "}
            </Link>
          </div>
        </FormControl>
          {formError && (
          <div style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>
            ❌ {formError}
          </div>
        )}
      </div>
    </div>
  );
};
