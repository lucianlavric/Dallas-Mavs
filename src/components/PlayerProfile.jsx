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
    { key: 'Season', label: 'Season' }, { key: 'Team', label: 'Team' }, { key: 'League', label: 'Lg' },
    { key: 'GP', label: 'GP' }, { key: 'GS', label: 'GS' },
    { key: 'MP', label: statDisplayType === 'perGame' ? 'MPG' : 'MP' },
    { key: 'PTS', label: statDisplayType === 'perGame' ? 'PPG' : 'PTS' },
    { key: 'TRB', label: statDisplayType === 'perGame' ? 'RPG' : 'REB' },
    { key: 'AST', label: statDisplayType === 'perGame' ? 'APG' : 'AST' },
    { key: 'STL', label: statDisplayType === 'perGame' ? 'SPG' : 'STL' },
    { key: 'BLK', label: statDisplayType === 'perGame' ? 'BPG' : 'BLK' },
    { key: 'FG', label: 'FG' }, { key: 'FG%', label: 'FG%' },
    { key: '3P', label: '3P' }, { key: '3P%', label: '3P%' },
    { key: 'FT', label: 'FT' }, { key: 'FTP', label: 'FT%' },
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
              <BlackBorderBox sx={{ display: 'flex', flexDirection: 'row', height: '100%', bgcolor:"#0D47A1", color:"#ffffff"}}>
                {playerData.photoUrl ? (
                  <CardMedia component="img" image={playerData.photoUrl} alt={`${playerData.firstName} ${playerData.lastName}`} sx={{ width: '25%' }} onError={(e) => { e.target.src = placeholderImageUrl; }} />
                ) : (
                  <Avatar variant="square" sx={{ width: '100%', height: 'auto', aspectRatio: '2/3', mx: 'auto', fontSize: '4rem' }}>{playerData.firstName?.[0]}{playerData.lastName?.[0]}</Avatar>
                )}
                
                <Stack>
                  <Typography sx={{p:5, height:'70%'}} variant="h1" component="h1" gutterBottom>{playerData.firstName} {playerData.lastName}</Typography>
                  <Stack spacing={3} direction="row" sx={{ justifyContent: 'space-around', width: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center', flexGrow: 1 }}>Team<br /> {playerData.currentTeam || 'N/A'} {playerData.teamConference ? `(${playerData.teamConference})` : ''}</Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', flexGrow: 1 }}>
                      Height<br /> {
                        playerData.measurements && playerData.measurements.heightShoes != null
                          ? `${getHeightInFeetInches(playerData.measurements.heightShoes)} ✅`
                          : playerData.height != null
                            ? `${getHeightInFeetInches(playerData.height)} 🟡`
                            : 'N/A'
                      }
                    </Typography>
                    <Typography variant="body1" sx={{display:'flex', alignItems:'center', textAlign: 'center', flexGrow: 1 }}>
                      Weight<br /> {
                        playerData.measurements && playerData.measurements.weight != null
                          ? `${playerData.measurements.weight} lbs ✅`
                          : playerData.weight != null
                            ? `${playerData.weight} lbs 🟡`
                            : 'N/A'
                      }
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', flexGrow: 1 }}>Born<br /> {playerData.birthDate ? format(new Date(playerData.birthDate), 'MMMM d, yyyy') : 'N/A'}</Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', flexGrow: 1 }}>Age<br /> {getAge(playerData.birthDate)}</Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', flexGrow: 1 }}>Hometown<br /> {playerData.homeTown || 'N/A'}{playerData.homeState ? `, ${playerData.homeState}` : ''}{playerData.homeCountry && playerData.homeCountry !== 'USA' ? `, ${playerData.homeCountry}` : ''}</Typography>
                  </Stack>
                </Stack>
              </BlackBorderBox>

              {/* Measurements Section */}
              {playerData.measurements && Object.keys(playerData.measurements).length > 1 && (
                <BlackBorderBox sx={{ p: 2, mb: 3}}>
                  <Typography variant="h5" gutterBottom>Measurements</Typography>
                  <Grid container spacing={1}>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Wingspan: {getHeightInFeetInches(playerData.measurements.wingspan)}</Typography></Grid>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Height (No Shoes): {getHeightInFeetInches(playerData.measurements.heightNoShoes)}</Typography></Grid>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Standing Reach: {getHeightInFeetInches(playerData.measurements.reach)}</Typography></Grid>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Max Vertical: {playerData.measurements.maxVertical != null ? `${playerData.measurements.maxVertical}"` : 'N/A'}</Typography></Grid>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Weight: {playerData.measurements.weight != null ? `${playerData.measurements.weight} lbs` : 'N/A'}</Typography></Grid>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Hand Length: {playerData.measurements.handLength != null ? `${playerData.measurements.handLength}"` : 'N/A'}</Typography></Grid>
                    <Grid size={{xs:12, sm:6, md:4}} ><Typography>Hand Width: {playerData.measurements.handWidth != null ? `${playerData.measurements.handWidth}"` : 'N/A'}</Typography></Grid>
                  </Grid>
                </BlackBorderBox>
              )}

              {/* Scout Rankings Section */}
              {Object.keys(individualScoutRanks).length > 0 && (
                 <BlackBorderBox  sx={{ p: 2, mb: 3 }}>
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
                </BlackBorderBox>
              )}
              
              {/* Player Statistics Section */}
              <BlackBorderBox sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Player Statistics</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="stat-display-type-label">Stat Display</InputLabel>
                  <Select labelId="stat-display-type-label" value={statDisplayType} label="Stat Display" onChange={handleStatTypeChange}>
                    <MenuItem value="perGame">Per Game</MenuItem>
                    <MenuItem value="totals">Season Totals</MenuItem>
                  </Select>
                </FormControl>

                {statDisplayType === 'totals' && (
                  <>
                    {playerData.seasonLogs && playerData.seasonLogs.length > 0 ? (
                      <TableContainer>
                        <Table stickyHeader size="small">
                          {/* Use statHeaders directly, their labels are already dynamic based on statDisplayType */}
                          <TableHead><TableRow>{statHeaders.map(header => (<TableCell key={header.key} sx={{ fontWeight: 'bold' }}>{header.label}</TableCell>))}</TableRow></TableHead>
                          <TableBody>
                            {playerData.seasonLogs.sort((a, b) => b.Season - a.Season).map(log => {
                              const gamesPlayed = parseFloat(log.GP); const isValidGP = gamesPlayed > 0; const divisor = 1; // Always 1 for totals
                              return (
                                <TableRow key={(log.Season || 'N/A') + (log.currentTeam || 'N/A') + (log.League || 'N/A')}>
                                  <TableCell>{log.Season || 'N/A'}</TableCell><TableCell>{log.TeamAbbr || log.Team || 'N/A'}</TableCell><TableCell>{log.League || 'N/A'}</TableCell>
                                  <TableCell>{log.GP || '0'}</TableCell><TableCell>{log.GS || '0'}</TableCell>
                                  <TableCell>{formatStat(log.MP, divisor, 1)}</TableCell><TableCell>{formatStat(log.PTS, divisor, 1)}</TableCell>
                                  <TableCell>{formatStat(log.TRB, divisor, 1)}</TableCell><TableCell>{formatStat(log.AST, divisor, 1)}</TableCell>
                                  <TableCell>{formatStat(log.STL, divisor, 1)}</TableCell><TableCell>{formatStat(log.BLK, divisor, 1)}</TableCell>
                                  {/* FG, 3P, FT Cells for Season Logs */}
                                  <TableCell>
                                    {statDisplayType === 'perGame'
                                      ? `${formatStat(log.FGM, divisor, 1)}-${formatStat(log.FGA, divisor, 1)}`
                                      : `${log.FGM || 0}-${log.FGA || 0}`}
                                  </TableCell>
                                  <TableCell>{formatPercentageStat(log['FG%'])}</TableCell>
                                  <TableCell>
                                    {statDisplayType === 'perGame'
                                      ? `${formatStat(log['3PM'], divisor, 1)}-${formatStat(log['3PA'], divisor, 1)}`
                                      : `${log['3PM'] || 0}-${log['3PA'] || 0}`}
                                  </TableCell>
                                  <TableCell>{formatPercentageStat(log['3P%'])}</TableCell>
                                  <TableCell>
                                    {statDisplayType === 'perGame'
                                      ? `${formatStat(log.FTM, divisor, 1)}-${formatStat(log.FTA, divisor, 1)}`
                                      : `${log.FTM || 0}-${log.FTA || 0}`}
                                  </TableCell>
                                  <TableCell>{formatPercentageStat(log['FT%'])}</TableCell> {/* Assuming FT% is the correct key for free throw percentage */}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (<Typography>No season logs available.</Typography>)}
                  </>
                )}

                {statDisplayType === 'perGame' && (
                  <>
                    {(() => {
                      // Use playerData.gameLogs directly, assuming it's pre-filtered and available
                      // Ensure playerData.gameLogs exists and is an array before attempting to sort
                      const gameLogsToDisplay = playerData.gameLogs && Array.isArray(playerData.gameLogs) 
                        ? [...playerData.gameLogs] // Create a shallow copy before sorting to avoid mutating the original prop
                        : [];

                      // Sort the game logs by date in descending order
                      const sortedGameLogs = gameLogsToDisplay.sort((a, b) => new Date(b.date) - new Date(a.date));

                      if (sortedGameLogs.length > 0) {
                        return (
                          <TableContainer>
                            <Table stickyHeader size="small">
                              <TableHead><TableRow>{gameLogTableHeaders.map(header => (<TableCell key={header.key} sx={{ fontWeight: 'bold' }}>{header.label}</TableCell>))}</TableRow></TableHead>
                              <TableBody>
                                {sortedGameLogs.map(log => (
                                  // Ensure gameId is unique, or use a more robust key if necessary
                                  <TableRow key={log.gameId || Math.random()}> 
                                    <TableCell>{format(new Date(log.date), 'MM/dd/yyyy')}</TableCell>
                                    <TableCell>{log.opponent}</TableCell>
                                    <TableCell>{log.timePlayed}</TableCell>
                                    <TableCell>{log.pts}</TableCell>
                                    <TableCell>{log.reb}</TableCell>
                                    <TableCell>{log.ast}</TableCell>
                                    <TableCell>{log.stl}</TableCell>
                                    <TableCell>{log.blk}</TableCell>
                                    {/* FG, 3P, FT Cells for Game Logs */}
                                    <TableCell>{`${log.fgm != null ? log.fgm : '0'}-${log.fga != null ? log.fga : '0'}`}</TableCell>
                                    <TableCell>{formatPercentageStat(log['fg%'])}</TableCell>
                                    <TableCell>{`${log.tpm != null ? log.tpm : '0'}-${log.tpa != null ? log.tpa : '0'}`}</TableCell>
                                    <TableCell>{formatPercentageStat(log['tp%'])}</TableCell>
                                    <TableCell>{`${log.ftm != null ? log.ftm : '0'}-${log.fta != null ? log.fta : '0'}`}</TableCell>
                                    <TableCell>{formatPercentageStat(log['ft%'])}</TableCell>
                                    <TableCell>{log.plusMinus}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        );
                      } else {
                        return <Typography>No game logs available for this player.</Typography>;
                      }
                    })()}
                  </>
                )}
              </BlackBorderBox>

              {/* Scouting Reports Section - Modified */}
              <BlackBorderBox sx={{ p: 2, mb: 3 }}>
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
                  <BlackBorderBox sx={{ mt: (playerData.scoutingReports && playerData.scoutingReports.length > 0) ? 2 : 0 }}>
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
                  </BlackBorderBox>
                )}
                <ScoutingReportForm onAddReport={handleAddReport} />
              </BlackBorderBox>
        </Container>
  );
};

export default PlayerProfile;
