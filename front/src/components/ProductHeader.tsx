import { useState } from "react";
import { Button } from "@mui/material";
interface ProductHeaderProps {
  onShowProducts: () => void;
  onAddProduct: () => void;
}


export const ProductHeader = ({
  onShowProducts,
  onAddProduct,
}: ProductHeaderProps) => {
  
  const [isHovered, setIsHovered] = useState(false);
  
    return (

    <header onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} style={{backgroundColor:isHovered ? "rgba(224, 116, 28, 0.96)" : "transparent", marginTop:"10px", maxWidth:"15%",width: "100%", height:"100vh",position: "fixed", borderRadius:"10px",border:"1px solid black",  transition: "background-color 0.3s ease"}}>
      
      <Button onClick={onShowProducts}>Mis productos</Button>

      <Button onClick={onAddProduct}>Agregar producto</Button>
    </header>
  );
};
