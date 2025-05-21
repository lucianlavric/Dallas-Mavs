import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container'; // Add this import
import theme from './theme'; // Import the custom theme
import Navbar from './components/Navbar'; // Import Navbar
import BigBoard from './components/BigBoard';
import PlayerProfile from './components/PlayerProfile';
// import './App.css'; 

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Navbar />
      <Container
       
        sx={{
          mt: 3,
          mb: 3,
          minHeight: '100vh', // Ensures the app covers the viewport height
          display: 'flex',
          flexDirection: 'column',
          width: "100%",
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
