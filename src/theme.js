import { createTheme } from '@mui/material/styles';

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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
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
    }
  },
});

export default theme;
