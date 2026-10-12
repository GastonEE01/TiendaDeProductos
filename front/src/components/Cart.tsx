import React, { useState, useRef } from "react";
import { FaUserAlt, FaPhoneAlt, FaAddressCard, FaCity } from "react-icons/fa";
import { MdOutlineMailLock, MdOutlinePostAdd } from "react-icons/md";
import { OrdenDtoRequest } from "../interfaces/OrdenType";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useCartStore } from "../hooks/useCartStore";
import toast from "react-hot-toast";
import { addOrden } from "../service/api";
import { CartItemDto } from "../interfaces/CartType";

const API_URL = import.meta.env.VITE_API_URL;
initMercadoPago("APP_USR-a0c61e8e-fd17-45bb-b992-fe81a16abfbf");
export const Cart = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pay, setPay] = useState<Boolean>(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const getImageUrl = (path: string) =>
    path.startsWith("http") ? path : `${API_URL}${path}`;

  const handleSelectChange = (event: SelectChangeEvent) => {
    setDeliveryMethod(event.target.value);
  };

  const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!deliveryMethod) {
      setFormError("Por favor, elija un tipo de envío");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const cartItems: CartItemDto[] = cart.map((item) => ({
      productoId: item.id,
      quantity: item.quantity,
    }));

    const isPickup = deliveryMethod === "presencial";

    const orden: OrdenDtoRequest = {
      customerName: formData.get("customerName") as string,
      customerEmail: formData.get("customerEmail") as string,
      customerPhone: String(formData.get("customerPhone")),
      deliveryMethod: deliveryMethod,
      customerAddress: isPickup
        ? "Retiro en local"
        : (formData.get("customerAddress") as string),
      city: isPickup ? "N/A" : (formData.get("city") as string),
      postalCode: isPickup ? "N/A" : (formData.get("postalCode") as string),
      items: cartItems,
    };

    localStorage.setItem("customerEmail", orden.customerEmail);
    console.log("Items carrito: ", cartItems);
    console.log("Orden: ", orden);
    try {
      const response = await addOrden(orden);
      console.log("Respuesta:", response);
      const listaPagos = response.pagos;

      if (listaPagos && listaPagos.length > 0) {
        toast.success(response.message);
        localStorage.setItem(
          "cola_pagos_vendedores",
          JSON.stringify(listaPagos),
        );

        // LEEMOS EL PRIMER PAGO DE LA LISTA
        const primerPago = listaPagos[0]; // Captura el primer elemento del array

        // Guardamos el preferenceId en el estado para activar el botón Wallet si el usuario regresa
        if (primerPago.preferenceId) {
          setPreferenceId(primerPago.preferenceId);
        }

        if (primerPago.paymentUrl) {
          console.log(
            "--> Redirigiendo automáticamente a:",
            primerPago.paymentUrl,
          );
          window.location.href = primerPago.paymentUrl;
        }
      } else {
        setFormError("El array de pagos llegó vacío.");
      }
      formRef.current?.reset();
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
    "& .MuiInputLabel-root": { color: "#94a3b8" }, // Texto gris claro flotando
    "& .MuiInputLabel-root.Mui-focused": { color: "#00E5FF" },
  };

  return (
    <div
      style={{
        margin: 0,
        minHeight: "180px",
        borderRadius: "16px",
        padding: "16px",
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          padding: { xs: "12px", sm: "20px" },
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          marginTop: 0,
          backgroundColor: "#172033",
          color: "#FFFFFF",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Carrito
        </Typography>

        {/* Si el carrito está vacío, mostramos un aviso */}
        {cart.length === 0 ? (
          <Typography color="textSecondary">
            El carrito está vacío actualmente.
          </Typography>
        ) : (
          <Box>
            {pay === false && (
              <>
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "64px minmax(0, 1fr)",
                        sm: "80px minmax(0, 1fr) auto",
                      },
                      alignItems: "center",
                      columnGap: { xs: 1.5, sm: 2 },
                      rowGap: 0.5,
                      py: 1.5,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(item.img)}
                      alt={item.name}
                      sx={{
                        width: { xs: 64, sm: 80 },
                        height: { xs: 64, sm: 80 },
                        objectFit: "cover",
                        borderRadius: 1,
                        gridRow: { xs: "span 2", sm: "auto" },
                      }}
                    />

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: "bold", overflowWrap: "anywhere" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography
                      color="primary"
                      sx={{
                        gridColumn: { xs: "2", sm: "auto" },
                        justifySelf: "end",
                        textAlign: "right",
                      }}
                    >
                      Subtotal: ${item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
                <Typography color="info" sx={{ display: "block", textAlign: "right", mt: 1 }}>
                  Total: ${total}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    gap: 1.5,
                    mt: 2,
                    "& > *": { flex: { sm: 1 } },
                    "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } },
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={clearCart}
                    disabled={loading}
                  >
                    Vaciar Carrito
                  </Button>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ background: "#2563EB", color: "#FFFFFF" }}
                      disabled={loading}
                      onClick={() => setPay(true)}
                    >
                      Pagar
                    </Button>
                  </Box>
                </Box>
              </>
            )}
            {pay === true && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Datos de envio y contacto
                </Typography>

                <form
                  ref={formRef}
                  onSubmit={handleSumit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* 👤 NOMBRE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaUserAlt fontSize={35} style={{ color: "#00E5FF" }} />
                    <TextField
                      id="standard-basic"
                      label="Nombre"
                      type="text"
                      name="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      fullWidth
                      required
                      sx={inputStyle}
                    />
                  </div>

                  {/* 📧 EMAIL */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdOutlineMailLock
                      fontSize={35}
                      style={{ color: "#00E5FF" }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Email"
                      type="text"
                      name="customerEmail"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      fullWidth
                      required
                      sx={inputStyle}
                    />
                  </div>

                  {/* 📞 TELEFONO */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaPhoneAlt fontSize={20} style={{ color: "#00E5FF" }} />
                    <TextField
                      id="standard-basic"
                      label="Telefono"
                      type="number"
                      name="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      fullWidth
                      required
                      sx={inputStyle}
                    />
                  </div>

                  {/* 📍 DIRECCIÓN */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaAddressCard fontSize={20} style={{ color: "#00E5FF" }} />
                    <TextField
                      id="standard-basic"
                      label="Direccion"
                      type="text"
                      name="customerAddress"
                      value={customerAddress}
                      sx={inputStyle}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      fullWidth
                      required
                    />
                  </div>

                  {/* 🏙️ CIUDAD */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaCity fontSize={20} style={{ color: "#00E5FF" }} />
                    <TextField
                      id="standard-basic"
                      label="Cuidad"
                      type="text"
                      name="city"
                      fullWidth
                      required
                      value={city}
                      sx={inputStyle}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  {/* 📦 CÓDIGO POSTAL */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdOutlinePostAdd
                      fontSize={20}
                      style={{ color: "#00E5FF" }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Codigo postal"
                      type="text"
                      name="postalCode"
                      fullWidth
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>

                  {/* 🚚 TIPO DE ENVÍO */}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth required>
                      <InputLabel id="delivery-method-label">
                        Tipo de envio
                      </InputLabel>
                      <Select
                        labelId="delivery-method-label"
                        id="delivery-method-select"
                        value={deliveryMethod}
                        onChange={handleSelectChange}
                      >
                        <MenuItem value="domicilio">Envío a domicilio</MenuItem>
                        <MenuItem value="presencial">
                          Retiro presencial
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* BOTONES DE ACCIÓN */}
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="text"
                      onClick={() => setPay(false)}
                      disabled={loading}
                    >
                      Volver al carrito
                    </Button>

                    <div>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{ background: "#2563EB", color: "#FFFFFF" }}
                        disabled={loading}
                      >
                        {loading ? "Procesando..." : "Confirmar Pedido"}
                      </Button>
                    </div>
                  </Box>

                  {/*BOTÓN DE MERCADO PAGO */}
                  {preferenceId && (
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, fontWeight: "bold", color: "green" }}
                      >
                        ¡Orden registrada! Haz clic abajo para pagar de forma
                        segura:
                      </Typography>
                      <div style={{ width: "100%" }}>
                        {/* El componente Wallet lee el ID dinámico y dibuja el botón azul oficial */}
                        <Wallet
                          initialization={{ preferenceId: preferenceId }}
                        />
                      </div>
                    </Box>
                  )}
                  {formError && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      ❌ {formError}
                    </div>
                  )}
                </form>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};
