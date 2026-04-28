import React from 'react'
import { ProductCard } from './ProductCard'

export const ProductList = ({products,addToCart}) => {
  return (
    <div>
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

