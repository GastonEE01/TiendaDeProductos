import React,{forwardRef } from 'react'
import { useTheme } from './ThemeContext.jsx'

export const Cart = forwardRef(({ items, deleteFromCart }, ref) => {
  const { darkMode } = useTheme()

  return (
    <div ref={ref} style={{
      backgroundColor: darkMode ? '#90b1ec' : 'brown',
      color: darkMode ? '#000000' : '#000000',
    }}>
      <h2>Carrito de Compras</h2>
        {items.map((item) => (
            <div key={item.id}>
                <h2 style={{ color: darkMode ? '#ffffff' : '#000000' }}>{item.nombre}</h2>
                <p>${item.precio.toFixed(2)}</p>
                <button onClick = {() => deleteFromCart(item)}>Eliminar</button>
                <h2>Total: ${items.reduce((total, item) => total + item.precio, 0).toFixed(2)}</h2>
            </div>
        ))}
    </div>
  )
})
