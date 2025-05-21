import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import the custom theme
import Navbar from './components/Navbar'; // Import Navbar
import BigBoard from './components/BigBoard';
import PlayerProfile from './components/PlayerProfile';
// import './App.css'; 

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Navbar /> {/* Add Navbar here */}
      {/* Main content area - consider adding a Container here for consistent padding if needed */}
      <Routes>
        <Route path="/" element={<BigBoard />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
