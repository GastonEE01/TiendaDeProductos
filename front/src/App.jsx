import { useState,useRef,useEffect,useMemo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './assets/components/Header/Header'
import { ProductList } from './assets/components/Card/ProductList'
import { Cart } from './assets/components/Cart/Cart'
import { SearchBar } from './assets/components/SearchBar/SearchBar'
import { useTheme } from './assets/components/ThemeContext'
import { CheckoutMP } from './assets/components/CheckoutMP'
function App() {

    const [products,setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL;
//      fetch("https://tiendadeproductos-fmhngcc8czgjd9dk.brazilsouth-01.azurewebsites.net/api/product")

    // Pedir datos al back 
    useEffect(() => {
      fetch(`${API_URL}/api/product`)
    .then(res => res.json())
    .then(data => {
          console.log(data)
          setProducts(data)
          setLoading(false)
    })
}, [])

// mercado pago
const [preferenceId, setPreferenceId] = useState(null);

const handleCheckout = async () => {
   const cartParaBackend = cart.map(item => ({
    id: item.id,
    name: item.name,
    precio: item.precio,
    quantity: 1
  }));
console.log(cartParaBackend);
  const res = await fetch(`${API_URL}/api/product/create_preference`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(cartParaBackend),
  });

  const data = await res.json();
  setPreferenceId(data.id);
};

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
      product.name.toLowerCase().includes(searchText.toLowerCase())

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
  <div className={darkMode ? 'dark-mode' : 'light-mode'}>
    <BrowserRouter>
      <Header cart={cart} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Routes>
        <Route path="/product" element={
          <>
            <SearchBar 
              onFilterChange={handleFilterChange}  
              onSearchChange={handleSearchChange}
            />
            <ProductList products={filteredProducts} addToCart={addToCart} />   
            {notification && <p>{notification}</p>}
          </>
        } />
        <Route path="/cart" element={
          loading ? (
            <p>Cargando...</p>
          ) : (
            <>
            {preferenceId && (
          <CheckoutMP preferenceId={preferenceId} />
        )}
            
            <Cart items={cart} deleteFromCart={deleteFromCart}  handleCheckout = {handleCheckout}/>
            </>
            )
          
        } />
      </Routes>
    </BrowserRouter>
  </div>
)
}


export default App
