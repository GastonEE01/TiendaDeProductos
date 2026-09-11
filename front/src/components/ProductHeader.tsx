import React from "react";
import { Button } from "@mui/material";

interface ProductHeaderProps {
  onShowProducts: () => void;
  onAddProduct: () => void;
}

export const ProductHeader = ({
  onShowProducts,
  onAddProduct,
}: ProductHeaderProps) => {
  
  
    return (

    <header>
      <Button onClick={onShowProducts}>Mis productos</Button>

      <Button onClick={onAddProduct}>Agregar producto</Button>
    </header>
  );
};
