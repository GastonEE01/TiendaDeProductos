import React, { useState,useRef } from "react";
import { LoginDtoRequest } from "../../interfaces/UsuarioType";

import {
  Button,
  TextField,
  FormControl,
  Typography
} from "@mui/material";
import { Link ,useNavigate} from "react-router-dom";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import toast from "react-hot-toast";
import {login} from '../../service/api'
import { useAuthStore } from "../../hooks/userStorage";

export const LoginPage: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [formError, setFormError] = useState<string | null>(null);
        const navigate = useNavigate();
        

   const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>)  => {
      e.preventDefault();
      setLoading(true);
      setFormError(null);

      const formData = new FormData(e.currentTarget);

      const userLogin: LoginDtoRequest = {
              mail: formData.get("mail") as string,
              password: formData.get("password") as string,
      }
      try{
        const response = await login(userLogin)
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
            mercadoPagoAccessToken: response.mercadoPagoAccessToken
          },
         response.token);
        navigate("/admin");
                
    }}
    catch (error: unknown) {
      const menssage = error instanceof Error ? error.message : null;
      setFormError(menssage);
      formRef.current?.reset();  // resetea los campos
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

       {loading && (
        <Typography variant="body2" color="primary" style={{ textAlign: "center", marginBottom: "15px", fontWeight: "bold" }}>
          Iniciando sesión, por favor espere...
        </Typography>
      )}

        <FormControl
          component="form"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MdOutlineMailLock fontSize={35} style={{ color: "#666" }} />
            <TextField
              id="standard-basic"
              label="Ingrese su mail"
              variant="standard"
              type="text"
              name="mail"
              fullWidth
              disabled={loading} 
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
              disabled={loading}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button color="info" variant="contained" type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Enviar"}
            </Button>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              ¿No tienes una cuenta? Registrate{" "}
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
