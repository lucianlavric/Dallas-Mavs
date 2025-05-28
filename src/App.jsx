import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container'; // Add this import
import theme from './theme'; // Import the custom theme
import Navbar from './components/Navbar'; // Import Navbar
import BigBoard from './components/BigBoard';
import PlayerProfile from './components/PlayerProfile';

function App() {
  return (
    <ThemeProvider theme={theme} >
      <CssBaseline /> 
      <Navbar />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          mt: 3,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems:'stretch',
          px:0,
        }}
      >
        <Routes>
          <Route path="/" element={<BigBoard />} />
          <Route path="/player/:playerId" element={<PlayerProfile />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
