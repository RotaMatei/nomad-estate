import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    background: {
      default: '#FFFFFF',
      paper: '#E80000',
    },
    primary: {
      main: '#E80000',
    },
    secondary: {
      main: '#00089D',
    },
    info: {
      main: '#BC2DFF',
    },
    text: {
      primary: '#000000',
      secondary: '#0C2239',
    },
    grey: {
      500: '#7B7B7B',
      200: '#c2c2c2ff'
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});
