import React from 'react'
import { ProductCard } from './ProductCard'
import './ProductList.css'
export const ProductList = ({products,addToCart}) => {
  return (
    <div className='container'>
      {products.map((product) => (
        <ProductCard 
        key={product.id} 
        product={product}
        addToCart={addToCart} 
        />
      ))}
    </div>
  )
}

