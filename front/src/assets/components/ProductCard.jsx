import React from 'react'
import { useTheme } from './ThemeContext.jsx'

export const ProductCard = ({product, addToCart}) => {
  const {darkMode} = useTheme()

  return (
    <div className='card' style= {{
      backgroundColor: darkMode ? '#ffffff' : '#000000',
      color: darkMode ? '#da0a0a' : '#ffffff',
    }}
      >
        <span>{product.imagen}</span>
        <h2 style={{ color: darkMode ? '#000000' : '#ffffff' }}>{product.nombre}</h2>
        <p>${product.precio.toFixed(2)}</p>
        <button onClick={() => { addToCart(product)}}>Agregar al Carrito</button>

    </div>
  )
}

