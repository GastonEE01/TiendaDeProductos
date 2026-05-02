import { useEffect } from "react";

export const CheckoutMP = ({ preferenceId }) => {

  useEffect(() => {
    if (!window.MercadoPago) return;

    const mp = new window.MercadoPago(
        import.meta.env.VITE_MP_PUBLIC_KEY
    );

    const bricksBuilder = mp.bricks();

    bricksBuilder.create("wallet", "walletBrick_container", {
      initialization: {
        preferenceId: preferenceId,
      },
    });

  }, [preferenceId]);

  return <div id="walletBrick_container"></div>;
};