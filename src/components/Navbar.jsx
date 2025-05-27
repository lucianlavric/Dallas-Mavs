import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from 'react-router-dom';

// Replace with the actual path to your Mavericks logo image
import mavericksLogo from '../Dallas_Mavericks_logo.png';

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{ marginBottom: '2rem' }}>
      <Toolbar>
        <RouterLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <img
            src={mavericksLogo}
            alt="Mavericks Logo"
            style={{
              height: 64, // Increased size
              marginRight: 16,
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </RouterLink>
        <Button color="inherit" component={RouterLink} to="/" sx={{ marginLeft: 'auto' }}>
          Big Board
        </Button>
        {/* Add more navigation links here if needed */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
