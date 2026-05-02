import React,{forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { CheckoutMP } from '../CheckoutMP'
import './Cart.css'
export const Cart = forwardRef(({ items, deleteFromCart ,handleCheckout}, ref) => {

 const total = items.reduce((acc, item) => acc + item.precio, 0)

  return (
    <div className="cart-container">
  <h2 className="cart-title">Carrito de Compras</h2>

  {items.length === 0 ? (
    <p className="empty-cart">El carrito está vacío</p>
  ) : (
    <>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-left">
              <span className="cart-img">{item.imagen}</span>
              <div>
                <h3>{item.name}</h3>
                <p className="category">{item.categoria}</p>
              </div>
            </div>

            <div className="cart-right">
              <span className="price">
                ${item.precio.toFixed(2)}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteFromCart(item)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>
          Total: $
          {items
            .reduce((acc, item) => acc + item.precio, 0)
            .toFixed(2)}
        </h3>

        <button className="checkout-btn" onClick={handleCheckout}>
          Pagar
        </button>
      </div>
    </>
  )}
</div> 
  )
})
