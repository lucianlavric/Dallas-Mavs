import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box'; // Import Box
import { Link as RouterLink } from 'react-router-dom';

// Replace with the actual path to your Mavericks logo image
import mavericksLogo from '../Dallas_Mavericks_logo.png';

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ marginBottom: { xs: '1rem', sm: '1.5rem', md: '2rem' } }}>
      <Toolbar>
        <RouterLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src={mavericksLogo}
            alt="Mavericks Logo"
            sx={{
              height: { xs: 40, sm: 50, md: 64 }, 
              marginRight: { xs: 1, sm: 2 }, // Corresponds to 8px, 16px
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            // onMouseOver and onMouseOut are not directly supported in sx, 
            // but the hover effect is achieved with sx['&:hover']
            // If direct JS event handlers are needed for other reasons, they can remain on a wrapping Box or the img itself if not using component="img"
          />
        </RouterLink>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            marginLeft: 'auto',
            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9375rem' }, // Adjusted font sizes
            padding: { xs: '4px 8px', sm: '5px 10px', md: '6px 12px' } // Adjusted paddings
          }}
        >
          Big Board
        </Button>
        {/* Add more navigation links here if needed */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
