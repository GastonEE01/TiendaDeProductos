import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563EB',
    },
    secondary: {
      main: '#7C3AED',
    },
    info: {
      main: '#00E5FF',
    },
    background: {
      default: '#0B1120',
      paper: '#172033',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#172033',
          color: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B1120',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00E5FF',
          },
        },
      },
    },
  },
});
