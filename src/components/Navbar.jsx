
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from 'react-router-dom'; // Alias for clarity

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ marginBottom: '2rem' }}> {/* Add some margin below the AppBar */}
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            NBA Draft Hub
          </RouterLink>
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Big Board
        </Button>
        {/* Add more navigation links here if needed */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
