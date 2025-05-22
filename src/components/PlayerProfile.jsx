import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadPlayerData } from '../utils/dataProcessor';
import ScoutingReportForm from './ScoutingReportForm'; // Import the form
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';


const PlayerProfile = () => {
  const { playerId } = useParams();
  const numericPlayerId = Number(playerId);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statDisplayType, setStatDisplayType] = useState('perGame');
  const [newScoutingReports, setNewScoutingReports] = useState([]); // State for new reports

 useEffect(() => {
  setLoading(true); 
  try {
    const allPlayers = loadPlayerData();
    console.log('All players:', allPlayers);

    // ✅ Check if allPlayers is an array
    if (!Array.isArray(allPlayers)) {
      console.error('allPlayers is not an array');
      return;
    }

    console.log("Searching for playerId:", numericPlayerId);
    console.log("All players:", allPlayers);

const selectedPlayer = allPlayers.find(p => {
  const match = p.playerId != null && Number(p.playerId) === numericPlayerId;
  if (!match) {
    console.log(`Skipping player: ${p.name}, ID: ${p.numericPlayerId ?? "NO ID"}`);
  }
  return match;
});

if (!selectedPlayer) {
  console.warn(`No player found matching id: ${numericPlayerId}`);
} else {
  console.log("Selected player:", selectedPlayer);
}

    setPlayerData(selectedPlayer);
    setNewScoutingReports([]); // Reset new reports when player changes
  } catch (error) {
    console.error("Error loading player data:", error);
    setPlayerData(null); 
  } finally {
    setLoading(false);
  }
}, [numericPlayerId]); 

  const handleStatTypeChange = (event) => {
    setStatDisplayType(event.target.value);
  };

  const handleAddReport = (reportData) => {
    const newReport = {
      ...reportData,
      reportId: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
      date: new Date().toISOString(), 
    };
    setNewScoutingReports(prevReports => [newReport, ...prevReports]); // Add to top for immediate visibility
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!playerData) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">Player not found.</Typography>
      </Container>
    );
  }

  // Calculate overall average rank
  let sumOfRanks = 0;
  let numberOfScouts = 0;
  const individualScoutRanks = {};

  if (playerData.scoutRankings) {
    Object.entries(playerData.scoutRankings).forEach(([scout, rank]) => {
      if (typeof rank === 'number' && rank != null && scout !== 'averageMavericksRank' && scout !== 'playerId') {
        sumOfRanks += rank;
        numberOfScouts++;
        individualScoutRanks[scout] = rank;
      } else if (scout !== 'averageMavericksRank' && scout !== 'playerId') {
        individualScoutRanks[scout] = null;
      }
    });
  }
  const overallAverageRank = numberOfScouts > 0 ? sumOfRanks / numberOfScouts : null;
  const rankThreshold = 5; 

  const getHeightInFeetInches = (inches) => {
    if (inches == null || isNaN(inches)) return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
  };
  
  const placeholderImageUrl = 'https://via.placeholder.com/300x450.png?text=No+Player+Image';

  const statHeaders = [
    { key: 'Season', label: 'Season' }, { key: 'Team', label: 'Team' }, { key: 'League', label: 'Lg' },
    { key: 'GP', label: 'GP' }, { key: 'GS', label: 'GS' },
    { key: 'MP', label: statDisplayType === 'perGame' ? 'MPG' : 'MP' },
    { key: 'PTS', label: statDisplayType === 'perGame' ? 'PPG' : 'PTS' },
    { key: 'TRB', label: statDisplayType === 'perGame' ? 'RPG' : 'REB' },
    { key: 'AST', label: statDisplayType === 'perGame' ? 'APG' : 'AST' },
    { key: 'STL', label: statDisplayType === 'perGame' ? 'SPG' : 'STL' },
    { key: 'BLK', label: statDisplayType === 'perGame' ? 'BPG' : 'BLK' },
    { key: 'FGM', label: 'FGM' }, { key: 'FGA', label: 'FGA' }, { key: 'FG%', label: 'FG%' },
    { key: '3PM', label: '3PM' }, { key: '3PA', label: '3PA' }, { key: '3P%', label: '3P%' },
    { key: 'FTM', label: 'FTM' }, { key: 'FTA', label: 'FTA' }, { key: 'FTP', label: 'FT%' },
  ];

  const formatStat = (value, divisor = 1, toFixed = 1) => {
    if (value == null) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';
    if (divisor === 0) return 'N/A'; 
    return (numValue / divisor).toFixed(toFixed);
  };
  
  const formatPercentageStat = (value, toFixed = 1) => {
    if (value == null) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';
    return `${numValue.toFixed(toFixed)}%`;
  };

  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Grid container spacing={3}>
        {/* Bio Section */}
        <Grid>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {playerData.photoUrl ? (
              <CardMedia component="img" image={playerData.photoUrl} alt={`${playerData.firstName} ${playerData.lastName}`} sx={{ width: '100%', mb: 2, borderRadius: '4px' }} onError={(e) => { e.target.src = placeholderImageUrl; }} />
            ) : (
              <Avatar variant="square" sx={{ width: '100%', height: 'auto', aspectRatio: '2/3', mb: 2, mx: 'auto', fontSize: '4rem' }}>{playerData.firstName?.[0]}{playerData.lastName?.[0]}</Avatar>
            )}
            <Typography variant="h4" component="h1" gutterBottom>{playerData.firstName} {playerData.lastName}</Typography>
            <Typography variant="subtitle1" gutterBottom>Team: {playerData.currentTeam || 'N/A'} {playerData.teamConference ? `(${playerData.teamConference})` : ''}</Typography>
            <Typography variant="body1">Height: {getHeightInFeetInches(playerData.height)}</Typography>
            <Typography variant="body1">Weight: {playerData.weight ? `${playerData.weight} lbs` : 'N/A'}</Typography>
            <Typography variant="body1">Born: {playerData.birthDate ? format(new Date(playerData.birthDate), 'MMMM d, yyyy') : 'N/A'}</Typography>
            <Typography variant="body1">High School: {playerData.highSchool || 'N/A'}</Typography>
            <Typography variant="body1">Hometown: {playerData.homeTown || 'N/A'}{playerData.homeState ? `, ${playerData.homeState}` : ''}{playerData.homeCountry && playerData.homeCountry !== 'USA' ? `, ${playerData.homeCountry}` : ''}</Typography>
          </Paper>
        </Grid>

        <Grid>
          {/* Measurements Section */}
          {playerData.measurements && Object.keys(playerData.measurements).length > 1 && (
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h5" gutterBottom>Measurements</Typography>
              <Grid container spacing={1}>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Wingspan: {getHeightInFeetInches(playerData.measurements.wingspan)}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Height (No Shoes): {getHeightInFeetInches(playerData.measurements.heightNoShoes)}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Standing Reach: {getHeightInFeetInches(playerData.measurements.reach)}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Max Vertical: {playerData.measurements.maxVertical != null ? `${playerData.measurements.maxVertical}"` : 'N/A'}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Weight: {playerData.measurements.weight != null ? `${playerData.measurements.weight} lbs` : 'N/A'}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Body Fat: {playerData.measurements.bodyFat != null ? `${playerData.measurements.bodyFat}%` : 'N/A'}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Hand Length: {playerData.measurements.handLength != null ? `${playerData.measurements.handLength}"` : 'N/A'}</Typography></Grid>
                <Grid size={{xs:12, sm:6, md:4}} ><Typography>Hand Width: {playerData.measurements.handWidth != null ? `${playerData.measurements.handWidth}"` : 'N/A'}</Typography></Grid>
              </Grid>
            </Paper>
          )}

          {/* Scout Rankings Section */}
          {Object.keys(individualScoutRanks).length > 0 && (
             <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h5" gutterBottom>Scout Rankings</Typography>
              {overallAverageRank != null && (<Typography variant="subtitle1" gutterBottom>Overall Calculated Average Rank: {overallAverageRank.toFixed(1)}</Typography>)}
              {playerData.scoutRankings?.averageMavericksRank != null && (<Typography variant="subtitle1" gutterBottom sx={{ fontStyle: 'italic' }}>Mavericks Average Rank (Provided): {playerData.scoutRankings.averageMavericksRank.toFixed(1)}</Typography>)}
              <List dense>
                {Object.entries(individualScoutRanks).map(([scout, rank]) => {
                  let rankColor = 'text.primary'; let fontWeight = 'normal';
                  if (overallAverageRank != null && rank != null) {
                    if (rank < overallAverageRank - rankThreshold) { rankColor = 'success.main'; fontWeight = 'bold'; } 
                    if (rank > overallAverageRank + rankThreshold) { rankColor = 'error.main'; fontWeight = 'bold'; }   
                  }
                  return (<ListItem key={scout} sx={{ py: 0.5 }}><ListItemText primary={<Typography component="span" sx={{ fontWeight: 'medium' }}>{scout.replace(/([A-Z])/g, ' $1').trim()}:</Typography>} secondary={<Typography component="span" sx={{ color: rankColor, fontWeight: fontWeight, ml: 0.5 }}>{rank != null ? `${rank}` : 'N/A'}</Typography>} /></ListItem>);
                })}
              </List>
            </Paper>
          )}
          
          {/* Player Statistics Section */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Player Statistics</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="stat-display-type-label">Stat Display</InputLabel>
              <Select labelId="stat-display-type-label" value={statDisplayType} label="Stat Display" onChange={handleStatTypeChange}>
                <MenuItem value="perGame">Per Game</MenuItem>
                <MenuItem value="totals">Season Totals</MenuItem>
              </Select>
            </FormControl>
            {playerData.seasonLogs && playerData.seasonLogs.length > 0 ? (
              <TableContainer>
                <Table stickyHeader size="small">
                  <TableHead><TableRow>{statHeaders.map(header => (<TableCell key={header.key} sx={{ fontWeight: 'bold' }}>{header.label}</TableCell>))}</TableRow></TableHead>
                  <TableBody>
                    {playerData.seasonLogs.sort((a, b) => b.Season - a.Season).map(log => {
                      const gamesPlayed = parseFloat(log.GP); const isValidGP = gamesPlayed > 0; const divisor = statDisplayType === 'perGame' && isValidGP ? gamesPlayed : 1;
                      return (
                        <TableRow key={(log.Season || 'N/A') + (log.currentTeam || 'N/A') + (log.League || 'N/A')}>
                          <TableCell>{log.Season || 'N/A'}</TableCell><TableCell>{log.TeamAbbr || log.Team || 'N/A'}</TableCell><TableCell>{log.League || 'N/A'}</TableCell>
                          <TableCell>{log.GP || '0'}</TableCell><TableCell>{log.GS || '0'}</TableCell>
                          <TableCell>{formatStat(log.MP, divisor, 1)}</TableCell><TableCell>{formatStat(log.PTS, divisor, 1)}</TableCell>
                          <TableCell>{formatStat(log.TRB, divisor, 1)}</TableCell><TableCell>{formatStat(log.AST, divisor, 1)}</TableCell>
                          <TableCell>{formatStat(log.STL, divisor, 1)}</TableCell><TableCell>{formatStat(log.BLK, divisor, 1)}</TableCell>
                          <TableCell>{formatStat(log.FGM, divisor, 1)}</TableCell><TableCell>{formatStat(log.FGA, divisor, 1)}</TableCell>
                          <TableCell>{formatPercentageStat(log['FG%'])}</TableCell><TableCell>{formatStat(log['3PM'], divisor, 1)}</TableCell>
                          <TableCell>{formatStat(log['3PA'], divisor, 1)}</TableCell><TableCell>{formatPercentageStat(log['3P%'])}</TableCell>
                          <TableCell>{formatStat(log.FTM, divisor, 1)}</TableCell><TableCell>{formatStat(log.FTA, divisor, 1)}</TableCell>
                          <TableCell>{formatPercentageStat(log.FTP)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (<Typography>No season logs available.</Typography>)}
          </Paper>

          {/* Scouting Reports Section - Modified */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>Scouting Reports</Typography>
            {/* Display existing reports from playerData.scoutingReports */}
            {playerData.scoutingReports && playerData.scoutingReports.length > 0 ? (
              <List dense sx={{ mb: newScoutingReports.length > 0 ? 2 : 0 }}> {/* Add margin if new reports will follow */}
                {playerData.scoutingReports.map((report) => (
                  <ListItem key={report.reportId || report.scout || Math.random()} alignItems="flex-start" sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                    <ListItemText
                      primary={<Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>{report.scout || 'Unknown Scout'} {report.date ? ` - ${format(new Date(report.date), 'MM/dd/yyyy')}` : ''}</Typography>}
                      secondary={<Typography component="span" variant="body2" sx={{ display: 'block', whiteSpace: 'pre-wrap' }}>{report.report}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ mb: newScoutingReports.length > 0 ? 2 : 0, fontStyle: 'italic' }}>No existing scouting reports.</Typography>
            )}

            {/* Display new reports */}
            {newScoutingReports.length > 0 && (
              <Box sx={{ mt: (playerData.scoutingReports && playerData.scoutingReports.length > 0) ? 2 : 0 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Newly Added Reports:</Typography>
                <List dense>
                  {newScoutingReports.map((report) => (
                    <ListItem key={report.reportId} alignItems="flex-start" sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' }}}>
                      <ListItemText
                        primary={<Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>{report.scout} - <Typography component="span" variant="caption">{format(new Date(report.date), 'MM/dd/yyyy HH:mm')}</Typography></Typography>}
                        secondary={<Typography component="span" variant="body2" sx={{ display: 'block', whiteSpace: 'pre-wrap' }}>{report.report}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <ScoutingReportForm onAddReport={handleAddReport} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlayerProfile;
