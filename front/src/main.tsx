import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./assets/components/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
          <MantineProvider>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </BrowserRouter>
          </MantineProvider>
    </ThemeProvider>
  </StrictMode>
);
