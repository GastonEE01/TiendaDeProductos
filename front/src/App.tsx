import {  Route, Routes } from 'react-router-dom'
import  {ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import  {ProtectedClientRoute } from './components/ProtectedClientRoute ';

import { LoginPage } from './components/pages/LoginPage'
import { RegisterPage } from './components/pages/RegisterPage'
import { ClientPage } from './components/pages/ClientPage'
import { AdminPage } from './components/pages/AdminPage'
import { LandingPage } from './components/pages/LandingPage'


function App() {

return (
  <div >
      <Routes>
        <Route path="/" element={ <LandingPage/>} />

        <Route path="/login" element={ <LoginPage/>} /> 
        
        <Route path="/register" element={ <RegisterPage/>} /> 

        <Route path="/admin" element={ <> <ProtectedAdminRoute> <AdminPage/> </ProtectedAdminRoute></>}/> 

        <Route path="/client" element={ <> <ProtectedClientRoute><ClientPage/> </ProtectedClientRoute></>}/> 

       <Route path="/register" element={ <RegisterPage/>} /> 
      
      </Routes>
  </div>
)
}


export default App
