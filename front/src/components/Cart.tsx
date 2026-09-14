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

import { useCartStore } from "../hooks/useCartStore";
import toast from "react-hot-toast";
import { addOrden } from "../service/api";
import { CartItemDto } from "../interfaces/CartType";

export const Cart = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pay, setPay] = useState<Boolean>(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
      productId: item.id,
      quantity: item.quantity,
    }));

    const isPickup = deliveryMethod === "presencial";

    const orden: OrdenDtoRequest = {
      customerName: formData.get("customerName") as string,
      customerEmail: formData.get("customerEmail") as string,
      customerPhone: Number(formData.get("customerPhone")),
      deliveryMethod: deliveryMethod,
      customerAddress: isPickup
        ? "Retiro en local"
        : (formData.get("customerAddress") as string),
      city: isPickup ? "N/A" : (formData.get("city") as string),
      postalCode: isPickup ? "N/A" : (formData.get("postalCode") as string),
      items: cartItems,
    };
    try {
      console.log("Enviando orden al Backend:", orden);

      const response = await addOrden(orden);
      toast.success(response.message);
      formRef.current?.reset();
      console.log(response);
      clearCart();
      setPay(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(172, 164, 156, 0.96)",
        margin: 0,
        minHeight: "180px",
        borderRadius: "16px",
        padding: "24px",
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          border: "1px solid rgba(10, 10, 10, 0.45)",
          borderRadius: "12px",
          marginTop: 0,
          backgroundColor: "rgb(255, 255, 255)",
          color: "#2b1708",
        }}
      >
        <Typography variant="h5" gutterBottom style={{ textAlign: "center" }}>
          Carrito
        </Typography>

        {/* Si el carrito está vacío, mostramos un aviso */}
        {cart.length === 0 ? (
          <Typography color="textSecondary">
            El carrito está vacío actualmente.
          </Typography>
        ) : (
          <Box>
            {/* Mapeamos el arreglo para ver qué hay adentro */}
            {pay === false && (
              <>
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #000000",
                    }}
                  >
                    <Typography>
                      <strong>{item.name}</strong> (x{item.quantity})
                    </Typography>
                    <Typography color="primary">
                      Subtotal: ${item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
                <Typography color="info">Total: ${total}</Typography>

                {/* Botón rápido para limpiar todo y probar de nuevo */}

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={clearCart}
                    disabled={loading}
                  >
                    Vaciar Carrito
                  </Button>
                  <div>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ background: " #ccdb44", color: "black" }}
                      disabled={loading}
                      onClick={() => setPay(true)}
                    >
                      Pagar
                    </Button>
                  </div> 
                </Box>
              </>
            )}
            {pay === true && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Datos de envio y contacto
                </Typography>

                <FormControl
                  component="form"
                  onSubmit={handleSumit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaUserAlt fontSize={35} style={{ color: "#666" }} />
                    <TextField
                      id="standard-basic"
                      label="Nombre"
                      variant="standard"
                      type="text"
                      name="customerName"
                      fullWidth
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdOutlineMailLock
                      fontSize={35}
                      style={{ color: "#666" }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Email"
                      variant="standard"
                      type="text"
                      name="customerEmail"
                      fullWidth
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaPhoneAlt fontSize={20} style={{ color: "#666" }} />
                    <TextField
                      id="standard-basic"
                      label="Telefono"
                      variant="standard"
                      type="number"
                      name="customerPhone"
                      fullWidth
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaAddressCard fontSize={20} style={{ color: "#666" }} />
                    <TextField
                      id="standard-basic"
                      label="Direccion"
                      variant="standard"
                      type="text"
                      name="customerAddress"
                      fullWidth
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaCity fontSize={20} style={{ color: "#666" }} />
                    <TextField
                      id="standard-basic"
                      label="Cuidad"
                      variant="standard"
                      type="text"
                      name="city"
                      fullWidth
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdOutlinePostAdd fontSize={20} style={{ color: "#666" }} />
                    <TextField
                      id="standard-basic"
                      label="Codigo postal"
                      variant="standard"
                      type="text"
                      name="postalCode"
                      fullWidth
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  ></div>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl variant="standard" fullWidth required>
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
                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    {/* Botón para volver atrás si quiere revisar el carrito */}
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
                        style={{ background: " #ccdb44", color: "black" }}
                        disabled={loading}
                      >
                        {loading ? "Procesando..." : "Confirmar Pedido"}
                      </Button>
                    </div>
                  </Box>
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
                </FormControl>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};
