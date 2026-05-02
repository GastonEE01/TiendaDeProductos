import { useTheme } from '../ThemeContext.jsx'
import './Card.css'

export const ProductCard = ({product, addToCart}) => {
  const {darkMode} = useTheme()

  return (
    <section className='sectionProduct'>
    <div className='card'>
      <div  className='heading'>
        <span>{product.imagen}</span>
        <h2 >{product.name}</h2>
        <p>${product.precio.toFixed(2)}</p>
        <button className="button" onClick={() => { addToCart(product)}}>Agregar al Carrito</button>
        </div>
    </div>
    </section>
  )
}

