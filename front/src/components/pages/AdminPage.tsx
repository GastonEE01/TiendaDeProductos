import { useState } from 'react'
import { ProductHeader } from "../ProductHeader";
import { Product } from "../Product";
import { ProductList } from "../ProductList";
import { Header } from "../Header"

export const AdminPage = () => {

const [products,setProduct] = useState<"products" | "add">("products");


  return (
    <div>
      <Header/>
      
      <ProductHeader onShowProducts={() => setProduct("products")} onAddProduct={() => setProduct("add")} />
      {products === "products" && <ProductList />}
      {products === "add" && <Product onClose={() => setProduct("products")} />}

    </div>
  )
}

