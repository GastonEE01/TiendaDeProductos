import React, { useState } from 'react'
import toast from "react-hot-toast";
import { useAuthStore } from "../../hooks/userStorage";
import { useNavigate } from 'react-router-dom';
import { ProductHeader } from "../ProductHeader";
import { Product } from "../Product";
import { ProductList } from "../ProductList";


export const AdminPage = () => {
const logout = useAuthStore((state) => state.logout);
const navigate = useNavigate(); // 2. Inicializás el hook
const [products,setProduct] = useState<"products" | "add">("products")
const handleLogout = () => {
  logout();
  navigate('/login');
};

  return (
    <div>
      <h1>Admin</h1>
      <button onClick={handleLogout}>Cerrar sesion</button>
      <ProductHeader onShowProducts={() => setProduct("products")} onAddProduct={() => setProduct("add")} />
      
      {products === "products" && <ProductList />}
      {products === "add" && <Product />}

    </div>
  )
}

