import {  Route, Routes } from 'react-router-dom'

import { LoginPage } from './components/pages/LoginPage'
import { RegisterPage } from './components/pages/RegisterPage'
import { ClientPage } from './components/pages/ClientPage'
import { AdminPage } from './components/pages/AdminPage'

import { Product } from './components/Product'

function App() {

return (
  <div >
      <Routes>
        <Route path="/login" element={ <LoginPage/>} /> 
        <Route path="/" element={ <LoginPage/>} />
        
        <Route path="/register" element={ <RegisterPage/>} /> 

        <Route path="/admin" element={ <><AdminPage/> <Product/> </>}/> 

        <Route path="/client" element={ <ClientPage/>} /> 

       <Route path="/register" element={ <RegisterPage/>} /> 
      
      </Routes>
  </div>
)
}


export default App
