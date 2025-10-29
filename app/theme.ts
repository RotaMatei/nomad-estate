import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    background: {
      default: '#FFFFFF',
      paper: '#E80000',
    },
    primary: {
      main: '#E80000',
      light: '#FF6666',
      dark: '#B30000',
    },
    secondary: {
      main: '#003fc7',
      light: '#3B49D1',
      dark: '#00077F',
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
      200: '#c2c2c2ff',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
});
