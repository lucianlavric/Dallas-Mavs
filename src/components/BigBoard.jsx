import { useState, useEffect } from 'react';
import { loadPlayerData } from '../utils/dataProcessor';
import PlayerCard from './PlayerCard';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom'; // Import Link

const BigBoard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = loadPlayerData();
      // Sort players by averageMavericksRank.
      // Handle cases where averageMavericksRank might be null or undefined.
      const sortedData = data.sort((a, b) => {
        const rankA = a.scoutRankings?.averageMavericksRank;
        const rankB = b.scoutRankings?.averageMavericksRank;

        if (rankA == null && rankB == null) return 0;
        if (rankA == null) return 1; // Place players with no rank at the end
        if (rankB == null) return -1; // Place players with no rank at the beginning (lower rank is better)

        return rankA - rankB;
      });
      setPlayers(sortedData);
    } catch (error) {
      console.error("Error loading or processing player data:", error);
      // Optionally, set an error state here to display to the user
    } finally {
      setLoading(false);
    }
  }, []);

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
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginY: 3 }}>
        NBA Big Board
      </Typography>
      <Grid container columns={12} spacing={3}>
        {players.map((player, index) => (
          console.log(player.playerId),
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={player.playerId || `${player.name}-${index}`}>
            <Link to={`/player/${player.playerId}`} style={{ textDecoration: 'none' }}>
              <PlayerCard player={player} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BigBoard;
