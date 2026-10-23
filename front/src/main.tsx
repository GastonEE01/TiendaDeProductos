import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/landing.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
    {/* 🌌 Capa 1: Material UI Theme Global */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <MantineProvider>
        <BrowserRouter>       
          <Toaster position="top-right" reverseOrder={false} /> 
          <App />
          
        </BrowserRouter>
      </MantineProvider>
    </ThemeProvider>
  </StrictMode>
);
