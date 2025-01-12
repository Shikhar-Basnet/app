import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f0f0',
    },
  },
  preLoader: {
    background: '#fefefe',
    color: '#262626',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fafafa', // Updated background color
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1520',
    },
  },
  preLoader: {
    background: '#333',
    color: '#ffffff',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 25, 40, 0.75)', // Updated background color
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121a26',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
