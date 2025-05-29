import { createTheme } from '@mui/material/styles';
import BebasNeue from './fonts/BebasNeue-Regular.ttf';
import Inter from './fonts/Inter/Inter-VariableFont_opsz,wght.ttf';

// Define a sporty and professional color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1', // A strong blue, like a team's primary color
      light: '#1E88E5', // Lighter blue for accents or hover states
      dark: '#002171',  // Darker blue for depth
    },
    secondary: {
      main: '#FF6F00', // An orange accent, like a basketball
      light: '#FF9E40',
      dark: '#C43E00',
    },
    background: {
      default: '#f4f6f8', // Light gray for the overall background
      paper: '#ffffff',   // White for paper elements like cards
    },
    text: {
      primary: '#212121', // Dark gray for primary text
      secondary: '#757575', // Lighter gray for secondary text
    },
    // Consider adding an error color, warning, info, success if needed
    error: {
      main: '#D32F2F',
    },
    success: {
        main: '#2E7D32',
    }
  },
  typography: {
    fontFamily: '"BebasNeue","Inter"',
    
    h1: {
      fontSize: '4rem',
      fontWeight: 500,
      margin: '1rem 0',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      margin: '0.75rem 0',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    // You can also define button typography, caption, etc.
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'BebasNeue';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('BebasNeue'), local('BebasNeue-Regular'), url(${BebasNeue}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-display: swap;
          font-weight: 100 900; // <-- Support all weights
          src: local('Inter'), url(${Inter}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Example: Making AppBar slightly less tall by default
          // boxShadow: 'none', // Flatter design
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly more rounded cards
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Softer shadow
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '8px', // Consistent button rounding
                textTransform: 'none', // More modern button text
            }
        }
    },
     MuiContainer: {
      styleOverrides: {
        disableGutters: {
        },
      },
    },
  },
});

export default theme;
