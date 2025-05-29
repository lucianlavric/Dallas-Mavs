import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadPlayerData } from '../utils/dataProcessor';
import PlayerCard from './PlayerCard';
import useDebounce from '../hooks/useDebounce';
import { Stack, Container, Typography, Grid, CircularProgress, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const BigBoard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  // Memoize the sorting function
  const sortPlayers = useCallback((data) => {
    return [...data].sort((a, b) => {
      const rankA = a.scoutRankings?.averageMavericksRank ?? Infinity;
      const rankB = b.scoutRankings?.averageMavericksRank ?? Infinity;
      return rankA - rankB;
    });
  }, []);

  // Memoize the filtered players
  const filteredPlayers = useMemo(() => {
    if (!debouncedSearchTerm) return players;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return players.filter(player => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      return fullName.includes(searchLower) || 
             player.currentTeam?.toLowerCase().includes(searchLower) ||
             player.position?.toLowerCase().includes(searchLower);
    });
  }, [players, debouncedSearchTerm]);

  useEffect(() => {
    const initializePlayers = async () => {
      try {
        const data = loadPlayerData();
        const sortedData = sortPlayers(data);
        setPlayers(sortedData);
      } catch (error) {
        console.error("Error loading player data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePlayers();
  }, [sortPlayers]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          textAlign: 'center', 
          my: 3,
          fontWeight: 'bold',
          color: '#1e3c72'
        }}
      >
        NBA Big Board
      </Typography>
      
      {/* Search Bar */}
      <Box sx={{ 
        mb: 4,
        width: '100%', // Changed from maxWidth: 600
        mx: 'auto'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976D2',
              },
            }
          }}
        />
      </Box>

      <Stack spacing={2}>
        {filteredPlayers.map((player) => (
          <PlayerCard 
            key={player.playerId} 
            player={player} 
          />
        ))}
      </Stack>
    </Container>
  );
};

export default BigBoard;
