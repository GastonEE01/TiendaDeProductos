import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // 🎨 Sincronizamos la paleta de colores del CSS con Material UI
  palette: {
    mode: 'dark', // 🚀 Clave: Le dice a MUI que use tipografías blancas por defecto
    primary: {
      main: '#0332a8', // 🔵 El color de tu clase '.button-primary' del CSS
    },
    secondary: {
      main: '#334155', // El color de tu clase '.button-dark'
    },
    background: {
      default: '#111827', // 🌌 El fondo oscuro de tu ':root' de la Landing
      paper: '#172137',   // 🧱 El fondo de tus tarjetas '.tiles-item-inner'
    },
    text: {
      primary: '#f8fafc',   // El color blanco de tus títulos h1, h2, h3
      secondary: '#94a3b8', // El color gris de tus párrafos '.section-header p'
    },
  },
  // 🔤 Sincronizamos la tipografía exacta de la Landing
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
});
