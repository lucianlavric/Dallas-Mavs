import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadPlayerData } from '../utils/dataProcessor';
import { getAge, getHeightInFeetInches } from '../utils/playerUtils';
import ScoutingReportForm from './ScoutingReportForm'; // Import the form
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
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
import Stack from '@mui/material/Stack';
import {styled} from '@mui/material/styles';
import { format } from 'date-fns';


const PlayerProfile = () => {
  const { playerId } = useParams();
  const numericPlayerId = Number(playerId);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statDisplayType, setStatDisplayType] = useState('perGame');
  const [newScoutingReports, setNewScoutingReports] = useState([]); // State for new reports


  const BlackBorderBox = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.common.black}`,
    backgroundColor: "white",
  }));

 useEffect(() => {
  setLoading(true); 
  try {
    const allPlayers = loadPlayerData();
    // console.log('All players:', allPlayers);

    // ✅ Check if allPlayers is an array
    if (!Array.isArray(allPlayers)) {
      console.error('allPlayers is not an array');
      return;
    }

    // console.log("Searching for playerId:", numericPlayerId);
    // console.log("All players:", allPlayers);

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
  // console.log("Selected player:", selectedPlayer);
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

  
  const placeholderImageUrl = 'https://via.placeholder.com/300x450.png?text=No+Player+Image';

  const statHeaders = [
    { key: 'Season', label: 'Season' },
    { key: 'League', label: 'League' },
    { key: 'Team', label: 'Team' },
    { key: 'w', label: 'W' },
    { key: 'l', label: 'L' },
    { key: 'GP', label: 'GP' },
    { key: 'GS', label: 'GS' },
    { key: 'MP', label: 'MP' },
    { key: 'FG', label: 'FG' },      // Combined FG
    { key: 'FG%', label: 'FG%' },
    { key: 'FG2M', label: '2PM' },
    { key: 'FG2A', label: '2PA' },
    { key: '2P', label: '2P' }, // Combined 2PM-2PA
    { key: 'FG2%', label: '2P%' },
    { key: 'eFG%', label: 'eFG%' },
    { key: '3P', label: '3P' },      // Combined 3P
    { key: '3P%', label: '3P%' },
    { key: 'FT', label: 'FT' },      // Combined FT
    { key: 'FTP', label: 'FT%' },
    { key: 'ORB', label: 'ORB' },
    { key: 'DRB', label: 'DRB' },
    { key: 'TRB', label: 'TRB' },
    { key: 'AST', label: 'AST' },
    { key: 'STL', label: 'STL' },
    { key: 'BLK', label: 'BLK' },
    { key: 'TOV', label: 'TOV' },
    { key: 'PF', label: 'PF' },
    { key: 'PTS', label: 'PTS' }
  ];

  const gameLogTableHeaders = [
    { key: 'date', label: 'Date' },
    { key: 'opponent', label: 'Opponent' },
    { key: 'timePlayed', label: 'MP' },
    { key: 'pts', label: 'PTS' },
    { key: 'reb', label: 'REB' },
    { key: 'ast', label: 'AST' },
    { key: 'stl', label: 'STL' },
    { key: 'blk', label: 'BLK' },
    { key: 'FG', label: 'FG' }, // New combined header
    { key: 'fg%', label: 'FG%' }, // Existing percentage header
    { key: '3P', label: '3P' }, // New combined header
    { key: 'tp%', label: '3P%' }, // Existing percentage header
    { key: 'FT', label: 'FT' }, // New combined header
    { key: 'ft%', label: 'FT%' }, // Existing percentage header
    { key: 'plusMinus', label: '+/-' },
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
        <Container sx={{xs:12, md:10, display:'flex', flexDirection:'column', alignSelf:'stretch'}} >
              {/* Bio Section */}
              <BlackBorderBox sx={{ display: 'flex', flexDirection: 'row', height: '100%', minHeight: 350, bgcolor: "#0D47A1", color: "#ffffff" }}>
                {playerData.photoUrl ? (
                  <CardMedia
                    component="img"
                    image={playerData.photoUrl}
                    alt={`${playerData.firstName} ${playerData.lastName}`}
                    sx={{ width: '25%', minWidth: 120, objectFit: 'cover' }}
                    onError={(e) => { e.target.src = placeholderImageUrl; }}
                  />
                ) : (
                  <Avatar
                    variant="square"
                    sx={{ width: '25%', minWidth: 120, aspectRatio: '2/3', mx: 'auto', fontSize: '4rem', objectFit: 'cover' }}
                  >
                    {playerData.firstName?.[0]}{playerData.lastName?.[0]}
                  </Avatar>
                )}

                <Stack sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  {/* Top section: Name, Position, Avg Rank */}
                  <Box
                    sx={{
                      flex: 7,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      p: 2,
                    }}
                  >
                    <Typography sx={{ marginLeft: .75, marginBottom: -1.5 }} variant="h4" component="div">
                      {playerData.position ? playerData.position : 'Position N/A'}
                    </Typography>
                    <Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  width: '100%'
}}>
  <Typography 
    sx={{ 
      margin: 0, 
      fontSize: 96,
      flexShrink: 0 // Prevent name from shrinking
    }} 
    variant="h1" 
    component="div"
  >
    {playerData.firstName} {playerData.lastName}
  </Typography>
  {overallAverageRank != null && (
    <Box
      sx={{
        bgcolor: 'white',
        color: '#0D47A1',
        px: 3,
        borderRadius: 2,
        fontWeight: 'bold',
        fontSize: 64,
        boxShadow: 3,
        minWidth: 120,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        mx: 'auto' // Add auto margin on both sides
      }}
    >
      {overallAverageRank.toFixed(1)}
      <Typography variant="caption" sx={{ color: '#0D47A1', fontWeight: 400, fontSize: 18, display: 'block', mt: -1 }}>
        AVG RANK
      </Typography>
    </Box>
  )}
</Box>
                  </Box>

                  {/* Bottom section: Team, Height, Weight, Born, Age */}
                  <Stack
                    direction="row"
                    sx={{
                      flex: 3,
                      borderTop: '3px solid #fff',
                      width: '100%',
                    }}
                  >
                    {/* Team */}
                    <Box sx={{ flex: 1, p: 2, borderLeft: 'none', borderColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', fontFamily: 'BebasNeue' }}>
                        TEAM
                      </Typography>
                      <Typography sx={{ textAlign: 'center', fontFamily: 'Inter' }}>
                        {playerData.currentTeam || 'N/A'} {playerData.teamConference ? `(${playerData.teamConference})` : ''}
                      </Typography>
                    </Box>
                    {/* Height */}
                    <Box sx={{ flex: 1, p: 2, borderLeft: '3px solid #fff', borderColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', fontFamily: 'BebasNeue' }}>
                        HEIGHT
                      </Typography>
                      <Typography sx={{ textAlign: 'center', fontFamily: 'Inter' }}>
                        {
                          playerData.measurements && playerData.measurements.heightShoes != null
                            ? `${getHeightInFeetInches(playerData.measurements.heightShoes)} ✅`
                            : playerData.height != null
                              ? `${getHeightInFeetInches(playerData.height)} 🟡`
                              : 'N/A'
                        }
                      </Typography>
                    </Box>
                    {/* Weight */}
                    <Box sx={{ flex: 1, p: 2, borderLeft: '3px solid #fff', borderColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', fontFamily: 'BebasNeue' }}>
                        WEIGHT
                      </Typography>
                      <Typography sx={{ textAlign: 'center', fontFamily: 'Inter' }}>
                        {
                          playerData.measurements && playerData.measurements.weight != null
                            ? `${playerData.measurements.weight} lbs ✅`
                            : playerData.weight != null
                              ? `${playerData.weight} lbs 🟡`
                              : 'N/A'
                        }
                      </Typography>
                    </Box>
                    {/* Born */}
                    <Box sx={{ flex: 1, p: 2, borderLeft: '3px solid #fff', borderColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', fontFamily: 'BebasNeue' }}>
                        BORN
                      </Typography>
                      <Typography sx={{ 
    textAlign: 'center', 
    fontFamily: 'Inter',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }}>
    {playerData.birthDate ? format(new Date(playerData.birthDate), 'MMMM d, yyyy') : 'N/A'}
  </Typography>
                    </Box>
                    {/* Age */}
                    <Box sx={{ flex: 1, p: 2, borderLeft: '3px solid #fff', borderColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', fontFamily: 'BebasNeue' }}>
                        AGE
                      </Typography>
                      <Typography sx={{ textAlign: 'center', fontFamily: 'Inter' }}>
                        {getAge(playerData.birthDate)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </BlackBorderBox>

              {/* Measurements Section */}
              {playerData.measurements && Object.keys(playerData.measurements).length > 1 && (
                <BlackBorderBox sx={{ p: 2, mb: 3}}>
                  <Typography variant="h5" gutterBottom>Measurements</Typography>
                  <Grid container spacing={2}>
                    {/* Column 1 */}
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontFamily: 'Inter', mb: 2 }}>
                        <span style={{ fontWeight: 'bold' }}>Height (No Shoes):</span> {getHeightInFeetInches(playerData.measurements.heightNoShoes)}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter' }}>
                        <span style={{ fontWeight: 'bold' }}>Height (In Shoes):</span> {getHeightInFeetInches(playerData.measurements.heightShoes)}
                      </Typography>
                    </Grid>

                    {/* Column 2 */}
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontFamily: 'Inter', mb: 2 }}>
                        <span style={{ fontWeight: 'bold' }}>Wingspan:</span> {getHeightInFeetInches(playerData.measurements.wingspan)}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter' }}>
                        <span style={{ fontWeight: 'bold' }}>Standing Reach:</span> {getHeightInFeetInches(playerData.measurements.reach)}
                      </Typography>
                    </Grid>

                    {/* Column 3 */}
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontFamily: 'Inter', mb: 2 }}>
                        <span style={{ fontWeight: 'bold' }}>Weight:</span> {playerData.measurements.weight != null ? `${playerData.measurements.weight} lbs` : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter' }}>
                        <span style={{ fontWeight: 'bold' }}>Body Fat:</span> {playerData.measurements.bodyFat != null ? `${playerData.measurements.bodyFat}%` : 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Column 4 */}
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontFamily: 'Inter', mb: 2 }}>
                        <span style={{ fontWeight: 'bold' }}>Hand Length:</span> {playerData.measurements.handLength != null ? `${playerData.measurements.handLength}"` : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter' }}>
                        <span style={{ fontWeight: 'bold' }}>Hand Width:</span> {playerData.measurements.handWidth != null ? `${playerData.measurements.handWidth}"` : 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Column 5 */}
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontFamily: 'Inter', mb: 2 }}>
                        <span style={{ fontWeight: 'bold' }}>Max Vertical:</span> {playerData.measurements.maxVertical != null ? `${playerData.measurements.maxVertical}"` : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter' }}>
                        <span style={{ fontWeight: 'bold' }}>No Step Vertical:</span> {playerData.measurements.noStepVertical != null ? `${playerData.measurements.noStepVertical}"` : 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Column 6 */}
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontFamily: 'Inter', mb: 2 }}>
                        <span style={{ fontWeight: 'bold' }}>Sprint:</span> {playerData.measurements.sprint != null ? `${playerData.measurements.sprint}s` : 'N/A'}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Inter' }}>
                        <span style={{ fontWeight: 'bold' }}>Lane Agility:</span> {playerData.measurements.agility != null ? `${playerData.measurements.agility}s` : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </BlackBorderBox>
              )}

              {/* Scout Rankings Section */}
              {Object.keys(individualScoutRanks).length > 0 && (
              <BlackBorderBox sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'BebasNeue' }}>
                  Scout Rankings
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ fontFamily: 'Inter' }}>
                  {overallAverageRank != null && (
                    <>Overall Calculated Average Rank: {overallAverageRank.toFixed(1)}<br /></>
                  )}
                  {playerData.scoutRankings?.averageMavericksRank != null && (
                    <span style={{ fontStyle: 'italic' }}>
                      Mavericks Average Rank (Provided): {playerData.scoutRankings.averageMavericksRank.toFixed(1)}
                    </span>
                  )}
                </Typography>
                <Grid container spacing={1}>
                  
                  
                  {Object.entries(individualScoutRanks).map(([scout, rank]) => {
                    let rankColor = 'text.primary';
                    if (overallAverageRank != null && rank != null) {
                      if (rank < overallAverageRank - rankThreshold) { rankColor = 'success.main'; }
                      if (rank > overallAverageRank + rankThreshold) { rankColor = 'error.main'; }
                    }
                    return (
                      <Grid item xs={12} sm={6} md={4} key={scout}>
                        <Typography
                          component="span"
                          sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}
                        >
                          {(() => {
                            let label = scout.includes(' ')
                              ? scout
                              : /^[A-Z0-9]+$/.test(scout)
                                ? scout
                                : scout.replace(/([A-Z])/g, ' $1').trim();
                            // Capitalize first letter
                            return label.charAt(0).toUpperCase() + label.slice(1);
                          })()}:
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ fontFamily: 'Inter', color: rankColor, fontWeight: 'normal', ml: 1 }}
                        >
                          {rank != null ? `${rank}` : 'N/A'}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </BlackBorderBox>
            )}
              
              {/* Player Statistics Section */}
              <BlackBorderBox sx={{ p: 2, mb: 3, fontFamily: 'Inter' }}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Inter' }}>
                  Player Statistics
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="stat-display-type-label" sx={{ fontFamily: 'Inter' }}>Stat Display</InputLabel>
                  <Select
                    labelId="stat-display-type-label"
                    value={statDisplayType}
                    label="Stat Display"
                    onChange={handleStatTypeChange}
                    sx={{ fontFamily: 'Inter' }}
                  >
                    <MenuItem value="perGame" sx={{ fontFamily: 'Inter' }}>Per Game</MenuItem>
                    <MenuItem value="totals" sx={{ fontFamily: 'Inter' }}>Season Averages</MenuItem>
                  </Select>
                </FormControl>

                {statDisplayType === 'totals' && (
                  <>
                    {playerData.seasonLogs && playerData.seasonLogs.length > 0 ? (
                      <TableContainer>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              {statHeaders.map(header => (
                                <TableCell
  key={header.key}
  sx={{
    fontWeight: 'bold',
    fontFamily: 'Inter',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 120 // adjust as needed
  }}
>
  {header.label}
</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {playerData.seasonLogs.sort((a, b) => b.Season - a.Season).map(log => {
                              const gamesPlayed = parseFloat(log.GP); const isValidGP = gamesPlayed > 0; const divisor = 1;
                              return (
                                <TableRow key={log.Season + log.Team + log.League}>
                                  {statHeaders.map(header => (
                                    <TableCell
      key={header.key}
      sx={{
        fontFamily: 'Inter',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 90
      }}
    >
      {header.key === 'FG'
        ? `${log.FGM != null ? log.FGM : 0}-${log.FGA != null ? log.FGA : 0}`
        : header.key === '3P'
        ? `${log['3PM'] != null ? log['3PM'] : 0}-${log['3PA'] != null ? log['3PA'] : 0}`
        : header.key === '2P'
        ? `${log.FG2M != null ? log.FG2M : 0}-${log.FG2A != null ? log.FG2A : 0}`
        : header.key === 'FT'
        ? `${log.FT != null ? log.FT : 0}-${log.FTA != null ? log.FTA : 0}`
        : header.key === 'FTP'
        ? (log.FTP != null ? `${Number(log.FTP).toFixed(1)}%` : 'N/A')
        : (log[header.key] != null ? log[header.key] : 'N/A')}
    </TableCell>
                                  ))}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography sx={{ fontFamily: 'Inter' }}>No season logs available.</Typography>
                    )}
                  </>
                )}

                {statDisplayType === 'perGame' && (
                  <>
                    {(() => {
                      const gameLogsToDisplay = playerData.gameLogs && Array.isArray(playerData.gameLogs)
                        ? [...playerData.gameLogs]
                        : [];
                      const sortedGameLogs = gameLogsToDisplay.sort((a, b) => new Date(b.date) - new Date(a.date));
                      if (sortedGameLogs.length > 0) {
                        return (
                          <>
                          <Typography variant="caption" sx={{ fontFamily: 'Inter', mb: 1, display: 'block', color: 'text.secondary' }}>
  2025 Season
</Typography>
                          <TableContainer>
                            <Table stickyHeader size="small">
                              <TableHead>
                                <TableRow>
                                  {gameLogTableHeaders.map(header => (
                                    <TableCell key={header.key} sx={{ fontWeight: 'bold', fontFamily: 'Inter' }}>
                                      {header.key === 'date' ? 'Date (2025)' : header.label}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {sortedGameLogs.map(log => (
                                  <TableRow key={log.gameId || Math.random()}>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {format(new Date(log.date), 'MM/dd')}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.opponent}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.timePlayed}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.pts}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.reb}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.ast}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.stl}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.blk}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {`${log.fgm != null ? log.fgm : '0'}-${log.fga != null ? log.fga : '0'}`}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {formatPercentageStat(log['fg%'])}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {`${log.tpm != null ? log.tpm : '0'}-${log.tpa != null ? log.tpa : '0'}`}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {formatPercentageStat(log['tp%'])}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {`${log.ftm != null ? log.ftm : '0'}-${log.fta != null ? log.fta : '0'}`}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {formatPercentageStat(log['ft%'])}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Inter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                      {log.plusMinus}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          </>
                        );
                      } else {
                        return <Typography sx={{ fontFamily: 'Inter' }}>No game logs available for this player.</Typography>;
                      }
                    })()}
                  </>
                )}
              </BlackBorderBox>

              {/* Scouting Reports Section */}
              <BlackBorderBox sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Scouting Reports</Typography>
                {/* Display existing reports from playerData.scoutingReports */}
                {playerData.scoutingReports && playerData.scoutingReports.length > 0 ? (
                  <List dense sx={{ mb: newScoutingReports.length > 0 ? 2 : 0, fontFamily: 'Inter' }}>
                    {playerData.scoutingReports.map((report) => (
                      <ListItem key={report.reportId || report.scout || Math.random()} alignItems="flex-start" sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" component="span" sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>
                              {report.scout || 'Unknown Scout'} {report.date ? ` - ${format(new Date(report.date), 'MM/dd/yyyy')}` : ''}
                            </Typography>
                          }
                          secondary={
                            <Typography component="span" variant="body2" sx={{ fontFamily: 'Inter', display: 'block', whiteSpace: 'pre-wrap' }}>
                              {report.report}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ mb: newScoutingReports.length > 0 ? 2 : 0, fontStyle: 'italic', fontFamily: 'Inter' }}>
                    No existing scouting reports.
                  </Typography>
                )}

                {/* Display new reports */}
                {newScoutingReports.length > 0 && (
                  <BlackBorderBox sx={{ mt: (playerData.scoutingReports && playerData.scoutingReports.length > 0) ? 2 : 0 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'Inter' }}>
                      Newly Added Reports:
                    </Typography>
                    <List dense>
                      {newScoutingReports.map((report) => (
                        <ListItem key={report.reportId} alignItems="flex-start" sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' }}}>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" component="span" sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>
                                {report.scout} - <Typography component="span" variant="caption" sx={{ fontFamily: 'Inter' }}>
                                  {format(new Date(report.date), 'MM/dd/yyyy HH:mm')}
                                </Typography>
                              </Typography>
                            }
                            secondary={
                              <Typography component="span" variant="body2" sx={{ fontFamily: 'Inter', display: 'block', whiteSpace: 'pre-wrap' }}>
                                {report.report}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </BlackBorderBox>
                )}
                <ScoutingReportForm onAddReport={handleAddReport} />
              </BlackBorderBox>
        </Container>
  );
};

export default PlayerProfile;
