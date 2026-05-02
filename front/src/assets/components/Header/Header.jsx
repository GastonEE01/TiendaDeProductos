import React from 'react'
import { Link } from 'react-router-dom'

import './Header.css'
export const Header = ({cart,toggleDarkMode,darkMode}) => {


  return (
    <section className='header'>
  <div className='header-container'> 

        <h1 >Tienda de Productos</h1>
            <div className='header-actions'>

        <button className= "button" onClick={toggleDarkMode}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
       </button>
        <Link to="/cart" className='button'>
          Carrito ({cart.length})
        </Link>
        <Link to="/product">
                      <button className='button'>Producto</button>
              </Link>
    </div>
     </div>
    </section>
  )
}


/*
 <h1 style = {{
      backgroundColor: darkMode ? '#33a2e2' : '#c51f1f',
      color: darkMode ? '#000000' : '#f7e9e9',
      display: 'inline-block',
     padding: '0 10px'}}*/