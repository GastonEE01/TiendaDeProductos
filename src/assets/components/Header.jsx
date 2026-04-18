import React from 'react'
import { useTheme } from './ThemeContext'

export const Header = () => {
  const { darkMode } = useTheme()

  return (
    <div > 
        <h1 style = {{
      backgroundColor: darkMode ? '#33a2e2' : '#c51f1f',
      color: darkMode ? '#000000' : '#f7e9e9',
      display: 'inline-block',
     padding: '0 10px'}}>Tienda de Productos</h1>
        <button>Carrito</button>
    </div>
  )
}


