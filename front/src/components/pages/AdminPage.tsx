import { useState } from "react";
import { ProductHeader } from "../ProductHeader";
import { Product } from "../Product";
import { ProductList } from "../ProductList";
import { Header } from "../Header";

export const AdminPage = () => {
  const [currentView, setCurrentView] = useState<"products" | "add">(
    "products",
  );
  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <Header />

      <ProductHeader
        onShowProducts={() => setCurrentView("products")}
        onAddProduct={() => setCurrentView("add")}
      />

      {currentView === "products" && (
        <ProductList onClose={() => setCurrentView("products")} />
      )}

      {/* Formulario de creación (Agregar): Al cerrar, te devuelve a la lista */}
      {currentView === "add" && (
        <Product onClose={() => setCurrentView("products")} />
      )}
    </div>
  );
};

/*
{products === "products" && <ProductList />}
      {products === "add" && <Product onClose={() => setProduct("products")} />}

      */
