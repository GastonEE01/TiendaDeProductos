import { useState,useRef,useEffect,useMemo } from 'react'
import './App.css'
import { Header } from './assets/components/Header'
import { ProductList } from './assets/components/ProductList'
import { Cart } from './assets/components/Cart'
import { SearchBar } from './assets/components/SearchBar'
import { useTheme } from './assets/components/ThemeContext'

  /*const products = [
  { id: 1, nombre: 'Laptop', precio: 1200, categoria: 'tecnologia', imagen: '💻' },
  { id: 2, nombre: 'Auriculares', precio: 150, categoria: 'tecnologia', imagen: '🎧' },
  { id: 3, nombre: 'Remera', precio: 30, categoria: 'ropa', imagen: '👕' },
  { id: 4, nombre: 'Zapatillas', precio: 90, categoria: 'ropa', imagen: '👟' },
  { id: 5, nombre: 'Mochila', precio: 60, categoria: 'accesorios', imagen: '🎒' },
  { id: 6, nombre: 'Reloj', precio: 200, categoria: 'accesorios', imagen: '⌚' },
  ]*/


function App() {

    const [products,setProducts] = useState([])

    // Pedir datos al back 
    useEffect(() => {
      fetch("https://tiendadeproductos-fmhngcc8czgjd9dk.brazilsouth-01.azurewebsites.net/api/product")
    .then(res => res.json())
    .then(data => {
          console.log(data)
          setProducts(data)
    })
}, [])

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  const addToCart = (products) => {
    setCart([...cart, products])
    setNotification('Producto agregado al carrito')
  }


  const deleteFromCart = (products) => {
    setCart(cart.filter((item) => item.id !== products.id))
  }

  const [searchText, setSearchText] = useState('')
   
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [notification])


const handleSearchChange = (e) => {
  setSearchText(e.target.value)
}

const [seachTerm, setSearchTerm] = useState('Todos')
const handleFilterChange = (e) => {
  setSearchTerm(e.target.value)
}

const filteredProducts = useMemo(() => {
  return products.filter((product) => {
   const coincideCategoria =
  seachTerm === 'Todos' ||
  product.categoria === seachTerm.toLowerCase()

    const coincideTexto =
      product.nombre.toLowerCase().includes(searchText.toLowerCase())

    return coincideCategoria && coincideTexto
  })
}, [ seachTerm, searchText, products])



const carritoRef = useRef(null)

const { darkMode, toggleDarkMode } = useTheme()

// cargar al iniciar
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart))
}, [cart])




return (
  <>
    <Header />
    <SearchBar 
    onFilterChange={handleFilterChange }  
    onSearchChange={handleSearchChange}
//    searchText={searchText}
    />


    <ProductList products={filteredProducts} addToCart={addToCart} />   
        {notification && <p>{notification}</p>}

    <Cart ref = {carritoRef} items = {cart} deleteFromCart={deleteFromCart} />

<button onClick={() => carritoRef.current.scrollIntoView({ behavior: 'smooth' })}>
  Ir al carrito
</button>

<button onClick={toggleDarkMode}>
  {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
</button>
     </>

  )
}

export default App
