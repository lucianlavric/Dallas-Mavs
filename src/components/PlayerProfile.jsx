import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadPlayerData } from "../utils/dataProcessor";
import { getAge, getHeightInFeetInches } from "../utils/playerUtils";
import ScoutingReportForm from "./ScoutingReportForm"; // Import the form
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

const PlayerProfile = () => {
  const { playerId } = useParams();
  const numericPlayerId = Number(playerId);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statDisplayType, setStatDisplayType] = useState("perGame");
  const [newScoutingReports, setNewScoutingReports] = useState([]); // State for new reports
  const navigate = useNavigate(); // Initialize useNavigate

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
        console.error("allPlayers is not an array");
        return;
      }

      // console.log("Searching for playerId:", numericPlayerId);
      // console.log("All players:", allPlayers);

      const selectedPlayer = allPlayers.find((p) => {
        const match =
          p.playerId != null && Number(p.playerId) === numericPlayerId;
        if (!match) {
          console.log(
            `Skipping player: ${p.name}, ID: ${p.numericPlayerId ?? "NO ID"}`
          );
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
    setNewScoutingReports((prevReports) => [newReport, ...prevReports]); // Add to top for immediate visibility
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!playerData) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5">Player not found.</Typography>
      </Container>
    );
  }

  // Calculate overall average rank
  let sumOfRanks = 0;
  let mavsSumOfRanks = 0;
  let numberOfScouts = 0;
  let numberOfMavsScouts = 0;
  const individualScoutRanks = {};

  if (playerData.scoutRankings) {
    // First, create a clean copy of rankings without the Scout High Low field
    const cleanedRankings = { ...playerData.scoutRankings };
    delete cleanedRankings["Scout High Low"];
    delete cleanedRankings["ScoutHighLow"];
    delete cleanedRankings["scoutHighLow"];

    Object.entries(cleanedRankings).forEach(([scout, rank]) => {
      // Skip non-ranking fields
      if (scout === "playerId" || scout === "averageMavericksRank" || !scout) {
        return;
      }

      // Only process valid numeric ranks
      if (typeof rank === "number" && rank != null) {
        individualScoutRanks[scout] = rank;
        sumOfRanks += rank;
        numberOfScouts++;

        // Add to Mavs average only if not ESPN
        if (!scout.includes("ESPN")) {
          mavsSumOfRanks += rank;
          numberOfMavsScouts++;
        }
      } else {
        individualScoutRanks[scout] = null;
      }
    });
  }
  const overallAverageRank =
    numberOfScouts > 0 ? sumOfRanks / numberOfScouts : null;
  const mavsAverageRank =
    numberOfMavsScouts > 0 ? mavsSumOfRanks / numberOfMavsScouts : null;
  const rankThreshold = 5;

  const placeholderImageUrl =
    "https://via.placeholder.com/300x450.png?text=No+Player+Image";

  const statHeaders = [
    { key: "Season", label: "Season" },
    { key: "League", label: "League" },
    { key: "Team", label: "Team" },
    { key: "w", label: "W" },
    { key: "l", label: "L" },
    { key: "GP", label: "GP" },
    { key: "GS", label: "GS" },
    { key: "MP", label: "MP" },
    { key: "FG", label: "FG" },
    { key: "FG%", label: "FG%" },
    { key: "2P", label: "2P" },
    { key: "FG2%", label: "2P%" },
    { key: "eFG%", label: "eFG%" },
    { key: "3P", label: "3P" },
    { key: "3P%", label: "3P%" },
    { key: "FT", label: "FT" },
    { key: "FTP", label: "FT%" },
    { key: "ORB", label: "ORB" },
    { key: "DRB", label: "DRB" },
    { key: "TRB", label: "TRB" },
    { key: "AST", label: "AST" },
    { key: "STL", label: "STL" },
    { key: "BLK", label: "BLK" },
    { key: "TOV", label: "TOV" },
    { key: "PF", label: "PF" },
    { key: "PTS", label: "PTS" },
  ];

  const gameLogTableHeaders = [
    { key: "date", label: "Date" },
    { key: "opponent", label: "Opponent" },
    { key: "timePlayed", label: "MP" },
    { key: "pts", label: "PTS" },
    { key: "reb", label: "REB" },
    { key: "ast", label: "AST" },
    { key: "stl", label: "STL" },
    { key: "blk", label: "BLK" },
    { key: "FG", label: "FG" }, // New combined header
    { key: "fg%", label: "FG%" }, // Existing percentage header
    { key: "3P", label: "3P" }, // New combined header
    { key: "tp%", label: "3P%" }, // Existing percentage header
    { key: "FT", label: "FT" }, // New combined header
    { key: "ft%", label: "FT%" }, // Existing percentage header
    { key: "plusMinus", label: "+/-" },
  ];

  const formatStat = (value, divisor = 1, toFixed = 1) => {
    if (value == null) return "N/A";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "N/A";
    if (divisor === 0) return "N/A";
    return (numValue / divisor).toFixed(toFixed);
  };

  const formatPercentageStat = (value, toFixed = 1) => {
    if (value == null) return "N/A";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "N/A";
    return `${numValue.toFixed(toFixed)}%`;
  };

  return (
    <Container
      sx={{
        pt: { xs: 1, sm: 0 }, // Add some padding top on mobile
        px: { xs: 1, sm: 2, md: 3 }, // Responsive padding for the container
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
      }}
    >
      {/* Back Button in its own container */}
      <Box sx={{ mb: 2, mt: { xs: 1, sm: 2} }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          variant="contained"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.9)",
            color: "black",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease-in-out",
            fontFamily: "Inter",
            textTransform: "none",
            fontSize: { xs: '0.8rem', sm: '0.9rem'},
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.8, sm: 1 },
            "&:hover": {
              bgcolor: "#0D47A1",
              color: "white",
              transform: "scale(1.05)",
            },
          }}
        >
          Go back to Big Board
        </Button>
      </Box>

      {/* Bio Section */}
      <BlackBorderBox
        sx={{
          display: "flex",
          flexDirection: { xs: 'column', sm: 'row' },
          height: "100%",
          minHeight: 350,
          bgcolor: "#0D47A1",
          color: "#ffffff",
        }}
      >
        {playerData.photoUrl ? (
          <CardMedia
            component="img"
            image={playerData.photoUrl}
            alt={`${playerData.firstName} ${playerData.lastName}`}
            sx={{ 
              width: { xs: '100%', sm: '25%' }, 
              minWidth: {sm: 120 },
              maxHeight: { xs: 350, sm: '100%' }, // Control height on mobile
              objectFit: "cover",
              mb: { xs: 2, sm: 0 }, // Margin bottom on mobile
            }}
            onError={(e) => {
              e.target.src = placeholderImageUrl;
            }}
          />
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: { xs: '100%', sm: '25%' },
              minWidth: { sm: 120 },
              maxHeight: { xs: 350, sm: '100%' },
              aspectRatio: "2/3",
              mx: { xs: 'auto', sm: '0' }, // Center on xs if it becomes block
              fontSize: "4rem",
              objectFit: "cover",
              mb: { xs: 2, sm: 0 },
            }}
          >
            {playerData.firstName?.[0]}
            {playerData.lastName?.[0]}
          </Avatar>
        )}

        <Stack
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            width: { xs: '100%', sm: '75%' }, // Ensure stack takes remaining width
          }}
        >
          {/* Top section: Name, Position, Avg Rank */}
          <Box
            sx={{
              flex: 7,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: { xs: 1, sm: 2 }, // Responsive padding
              textAlign: { xs: 'center', sm: 'left'} // Center text on mobile
            }}
          >
            <Typography
              sx={{ 
                marginLeft: { xs: 0, sm: 0.75 }, 
                marginBottom: { xs: -0.5, sm: -1.5 },
                fontSize: { xs: '1.5rem', sm: 'h4.fontSize' } // Responsive font size
              }}
              variant="h4" // Base variant, sx overrides
              component="div"
            >
              {playerData.position ? playerData.position : "Position N/A"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' }, // Stack rank below name on mobile
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  margin: 0,
                  fontSize: { xs: '3rem', sm: '4.5rem', md: 96 }, // Responsive font size for name
                  flexShrink: 0,
                  lineHeight: { xs: 1.1, sm: 1 }
                }}
                variant="h1"
                component="div"
              >
                {playerData.firstName} {playerData.lastName}
              </Typography>
              {overallAverageRank != null && (
                <Box
                  sx={{
                    bgcolor: "white",
                    color: "#0D47A1",
                    px: { xs: 2, sm: 3 }, // Responsive padding
                    py: { xs: 0.5, sm: 'auto'},
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: { xs: '2.5rem', sm: 64 }, // Responsive font size for rank
                    boxShadow: 3,
                    minWidth: { xs: 100, sm: 120 },
                    // height: { xs: 'auto', sm: '100%' }, // Adjust height for mobile
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: { xs: 'center', sm: 'stretch' },
                    mx: { sm: "auto" }, // Auto margin on sides for sm+
                    mt: { xs: 1, sm: 0 } // Margin top on mobile
                  }}
                >
                  {overallAverageRank.toFixed(1)}
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#0D47A1",
                      fontWeight: 400,
                      fontSize: { xs: '0.8rem', sm: 18 }, // Responsive font size for "AVG RANK"
                      display: "block",
                      mt: { xs: -0.5, sm: -1 }
                    }}
                  >
                    AVG RANK
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Bottom section: Team, Height, Weight, Born, Age */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }} // Stack items vertically on mobile
            sx={{
              flex: 3,
              borderTop: "3px solid #fff",
              width: "100%",
            }}
          >
            {/* Team */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1, sm: 2 }, // Responsive padding
                borderLeft: "none",
                borderColor: "#fff",
                borderTop: { xs: '1px solid #fff', sm: 'none' }, // Top border for mobile items
                '&:first-of-type': { borderTop: 'none' }, // Remove top border for the first item on mobile
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontFamily: "BebasNeue", fontSize: {xs: '0.9rem', sm: '1rem'} }}
              >
                TEAM
              </Typography>
              <Typography sx={{ textAlign: "center", fontFamily: "Inter", fontSize: {xs: '0.8rem', sm: '1rem'} }}>
                {playerData.currentTeam || "N/A"}{" "}
                {playerData.teamConference
                  ? `(${playerData.teamConference})`
                  : ""}
              </Typography>
            </Box>
            {/* Height */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1, sm: 2 },
                borderLeft: { xs: 'none', sm: "3px solid #fff" },
                borderColor: "#fff",
                borderTop: { xs: '1px solid #fff', sm: 'none' },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontFamily: "BebasNeue", fontSize: {xs: '0.9rem', sm: '1rem'} }}
              >
                HEIGHT
              </Typography>
              <Typography sx={{ textAlign: "center", fontFamily: "Inter", fontSize: {xs: '0.8rem', sm: '1rem'} }}>
                {playerData.measurements &&
                playerData.measurements.heightShoes != null
                  ? `${getHeightInFeetInches(playerData.measurements.heightShoes)} ✅`
                  : playerData.height != null
                    ? `${getHeightInFeetInches(playerData.height)} 🟡`
                    : "N/A"}
              </Typography>
            </Box>
            {/* Weight */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1, sm: 2 },
                borderLeft: { xs: 'none', sm: "3px solid #fff" },
                borderColor: "#fff",
                borderTop: { xs: '1px solid #fff', sm: 'none' },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontFamily: "BebasNeue", fontSize: {xs: '0.9rem', sm: '1rem'} }}
              >
                WEIGHT
              </Typography>
              <Typography sx={{ textAlign: "center", fontFamily: "Inter", fontSize: {xs: '0.8rem', sm: '1rem'} }}>
                {playerData.measurements &&
                playerData.measurements.weight != null
                  ? `${playerData.measurements.weight} lbs ✅`
                  : playerData.weight != null
                    ? `${playerData.weight} lbs 🟡`
                    : "N/A"}
              </Typography>
            </Box>
            {/* Born */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1, sm: 2 },
                borderLeft: { xs: 'none', sm: "3px solid #fff" },
                borderColor: "#fff",
                borderTop: { xs: '1px solid #fff', sm: 'none' },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontFamily: "BebasNeue", fontSize: {xs: '0.9rem', sm: '1rem'} }}
              >
                BORN
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: "Inter",
                  fontSize: {xs: '0.8rem', sm: '1rem'},
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {playerData.birthDate
                  ? format(new Date(playerData.birthDate), "MMMM d, yyyy")
                  : "N/A"}
              </Typography>
            </Box>
            {/* Age */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 1, sm: 2 },
                borderLeft: { xs: 'none', sm: "3px solid #fff" },
                borderColor: "#fff",
                borderTop: { xs: '1px solid #fff', sm: 'none' },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ textAlign: "center", fontFamily: "BebasNeue", fontSize: {xs: '0.9rem', sm: '1rem'} }}
              >
                AGE
              </Typography>
              <Typography sx={{ textAlign: "center", fontFamily: "Inter", fontSize: {xs: '0.8rem', sm: '1rem'} }}>
                {getAge(playerData.birthDate)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </BlackBorderBox>

      {/* Measurements Section */}
      {playerData.measurements &&
        Object.keys(playerData.measurements).length > 1 && (
          <BlackBorderBox sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Measurements
            </Typography>
            <Grid container spacing={2}>
              {/* Column 1 */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontFamily: "Inter", mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>
                    Height (Without Shoes):
                  </span>{" "}
                  {playerData.measurements &&
                  playerData.measurements.heightNoShoes != null
                    ? `${getHeightInFeetInches(playerData.measurements.heightNoShoes)}`
                    : playerData.height != null
                      ? `${getHeightInFeetInches(playerData.height)} 🟡`
                      : "N/A"}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Wingspan:</span>{" "}
                  {getHeightInFeetInches(playerData.measurements.wingspan)}
                </Typography>
              </Grid>

              {/* Column 2 */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontFamily: "Inter", mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Standing Reach:</span>{" "}
                  {getHeightInFeetInches(playerData.measurements.reach)}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Body Fat:</span>{" "}
                  {playerData.measurements.bodyFat != null
                    ? `${playerData.measurements.bodyFat}%`
                    : "N/A"}
                </Typography>
              </Grid>

              {/* Column 3 */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontFamily: "Inter", mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Hand Length:</span>{" "}
                  {playerData.measurements.handLength != null
                    ? `${playerData.measurements.handLength}"`
                    : "N/A"}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Hand Width:</span>{" "}
                  {playerData.measurements.handWidth != null
                    ? `${playerData.measurements.handWidth}"`
                    : "N/A"}
                </Typography>
              </Grid>

              {/* Column 4 */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontFamily: "Inter", mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Max Vertical:</span>{" "}
                  {playerData.measurements.maxVertical != null
                    ? `${playerData.measurements.maxVertical}"`
                    : "N/A"}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>No Step Vertical:</span>{" "}
                  {playerData.measurements.noStepVertical != null
                    ? `${playerData.measurements.noStepVertical}"`
                    : "N/A"}
                </Typography>
              </Grid>

              {/* Column 5 */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography sx={{ fontFamily: "Inter", mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Sprint:</span>{" "}
                  {playerData.measurements.sprint != null
                    ? `${playerData.measurements.sprint}s`
                    : "N/A"}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                  <span style={{ fontWeight: "bold" }}>Lane Agility:</span>{" "}
                  {playerData.measurements.agility != null
                    ? `${playerData.measurements.agility}s`
                    : "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </BlackBorderBox>
        )}

      {/* Scout Rankings Section */}
      {Object.keys(individualScoutRanks).length > 0 && (
        <BlackBorderBox sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontFamily: "BebasNeue", fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
          >
            Scout Rankings
          </Typography>

          {/* Overall Rankings Summary */}
          <Box sx={{ mb: 3, p: { xs: 1, sm: 2 }, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            {overallAverageRank != null && (
              <Typography sx={{ fontFamily: "Inter", mb: 1, fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                <span style={{ fontWeight: "bold" }}>
                  Overall Average (Including ESPN):
                </span>{" "}
                {overallAverageRank.toFixed(1)}
              </Typography>
            )}
            {mavsAverageRank != null && (
              <Typography sx={{ fontFamily: "Inter", fontStyle: "italic", fontSize: { xs: '0.8rem', sm: '1rem'} }}>
                <span style={{ fontWeight: "bold" }}>
                  Mavericks Scout Average:
                </span>{" "}
                {mavsAverageRank.toFixed(1)}
              </Typography>
            )}
          </Box>

          {/* Individual Scout Rankings */}
          <Grid container spacing={{ xs: 1, sm: 2}}>
            {Object.entries(individualScoutRanks).map(([scout, rank]) => {
              const formattedScoutName = scout.includes(" ")
                ? scout
                : /^[A-Z0-9]+$/.test(scout)
                  ? scout
                  : scout.replace(/([A-Z])/g, " $1").trim();
              const displayName =
                formattedScoutName.charAt(0).toUpperCase() +
                formattedScoutName.slice(1);

              let rankColor = "text.primary";
              let indicator = "";

              if (overallAverageRank != null && rank != null) {
                if (rank < overallAverageRank - rankThreshold) {
                  rankColor = "success.main";
                  indicator = " (High)";
                } else if (rank > overallAverageRank + rankThreshold) {
                  rankColor = "error.main";
                  indicator = " (Low)";
                } else {
                  rankColor = "text.primary";
                  indicator = "";
                }
              }

              return (
                <Grid item xs={12} sm={6} key={scout}> {/* Ensure 1 column on xs, 2 on sm */}
                  <Box
                    sx={{
                      p: { xs: 1, sm: 1.5 }, // Responsive padding
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: rank != null ? "white" : "#f5f5f5",
                    }}
                  >
                    <Typography
                      sx={{ fontFamily: "Inter", fontWeight: "bold", fontSize: { xs: '0.8rem', sm: '0.9rem'} }}
                    >
                      {displayName}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        color: rankColor,
                        fontWeight: rank != null ? "medium" : "normal",
                        marginLeft: 2,
                        fontSize: { xs: '0.8rem', sm: '0.9rem'}
                      }}
                    >
                      {rank != null ? `${rank}${indicator}` : "Not Ranked"}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </BlackBorderBox>
      )}

      {/* Player Statistics Section */}
      <BlackBorderBox sx={{ p: { xs: 1, sm: 2 }, mb: 3, fontFamily: "Inter" }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "Inter", fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Player Statistics
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="stat-display-type-label" sx={{ fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}>
            Stat Display
          </InputLabel>
          <Select
            labelId="stat-display-type-label"
            value={statDisplayType}
            label="Stat Display"
            onChange={handleStatTypeChange}
            sx={{ fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}
          >
            <MenuItem value="perGame" sx={{ fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}>
              Per Game
            </MenuItem>
            <MenuItem value="totals" sx={{ fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}>
              Season Averages
            </MenuItem>
          </Select>
        </FormControl>

        {statDisplayType === "totals" && (
          <>
            {playerData.seasonLogs && playerData.seasonLogs.length > 0 ? (
              <TableContainer sx={{ maxHeight: { xs: 400, sm: 'none' } }}> {/* Max height for mobile scrolling if needed */}
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {statHeaders.map((header) => (
                        <TableCell
                          key={header.key}
                          sx={{
                            fontWeight: "bold",
                            fontFamily: "Inter",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 120, 
                            p: { xs: '6px 8px', sm: '8px 12px'}, // Reduced padding for cells
                            fontSize: { xs: '0.7rem', sm: '0.875rem' } // Reduced font size
                          }}
                        >
                          {header.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playerData.seasonLogs
                      .sort((a, b) => b.Season - a.Season)
                      .map((log) => {
                        const gamesPlayed = parseFloat(log.GP);
                        const isValidGP = gamesPlayed > 0;
                        const divisor = 1;
                        return (
                          <TableRow key={log.Season + log.Team + log.League}>
                            {statHeaders.map((header) => (
                              <TableCell
                                key={header.key}
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {header.key === "FG"
                                  ? `${log.FGM != null ? log.FGM : 0}-${log.FGA != null ? log.FGA : 0}`
                                  : header.key === "3P"
                                    ? `${log["3PM"] != null ? log["3PM"] : 0}-${log["3PA"] != null ? log["3PA"] : 0}`
                                    : header.key === "2P"
                                      ? `${log.FG2M != null ? log.FG2M : 0}-${log.FG2A != null ? log.FG2A : 0}`
                                      : header.key === "FT"
                                        ? `${log.FTM != null ? log.FTM : 0}-${log.FTA != null ? log.FTA : 0}`
                                        : header.key.includes("%")
                                          ? log[header.key] != null
                                            ? `${Number(log[header.key]).toFixed(1)}%`
                                            : "N/A"
                                          : log[header.key] != null
                                            ? log[header.key]
                                            : "N/A"}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}>
                No season logs available.
              </Typography>
            )}
          </>
        )}

        {statDisplayType === "perGame" && (
          <>
            {(() => {
              const gameLogsToDisplay =
                playerData.gameLogs && Array.isArray(playerData.gameLogs)
                  ? [...playerData.gameLogs]
                  : [];
              const sortedGameLogs = gameLogsToDisplay.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              );
              if (sortedGameLogs.length > 0) {
                return (
                  <>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Inter",
                        mb: 1,
                        display: "block",
                        color: "text.secondary",
                        fontSize: { xs: '0.75rem', sm: '0.875rem'}
                      }}
                    >
                      2025 Season
                    </Typography>
                    <TableContainer sx={{ maxHeight: { xs: 400, sm: 'none' } }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            {gameLogTableHeaders.map(
                              (
                                header 
                              ) => (
                                <TableCell
                                  key={header.key}
                                  sx={{
                                    fontWeight: "bold",
                                    fontFamily: "Inter",
                                    p: { xs: '6px 8px', sm: '8px 12px'},
                                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {header.key === "date"
                                    ? "Date (2025)"
                                    : header.label}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedGameLogs.map((log) => (
                            <TableRow key={log.gameId || Math.random()}>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {format(new Date(log.date), "MM/dd")}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.opponent}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.timePlayed}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.pts}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.reb}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.ast}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.stl}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {log.blk}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {`${log.fgm != null ? log.fgm : "0"}-${log.fga != null ? log.fga : "0"}`}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {formatPercentageStat(log["fg%"])}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {`${log.tpm != null ? log.tpm : "0"}-${log.tpa != null ? log.tpa : "0"}`}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {formatPercentageStat(log["tp%"])}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {`${log.ftm != null ? log.ftm : "0"}-${log.fta != null ? log.fta : "0"}`}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
                                {formatPercentageStat(log["ft%"])}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontFamily: "Inter",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 90,
                                  p: { xs: '6px 8px', sm: '8px 12px'},
                                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                                }}
                              >
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
                return (
                  <Typography sx={{ fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}>
                    No game logs available for this player.
                  </Typography>
                );
              }
            })()}
          </>
        )}
      </BlackBorderBox>

      {/* Scouting Reports Section */}
      <BlackBorderBox sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Scouting Reports
        </Typography>
        {/* Display existing reports from playerData.scoutingReports */}
        {playerData.scoutingReports && playerData.scoutingReports.length > 0 ? (
          <List
            dense
            sx={{
              mb: newScoutingReports.length > 0 ? 2 : 0,
              fontFamily: "Inter",
            }}
          >
            {playerData.scoutingReports.map((report) => (
              <ListItem
                key={report.reportId || report.scout || Math.random()}
                alignItems="flex-start"
                sx={{
                  borderBottom: "1px solid #eee",
                  "&:last-child": { borderBottom: "none" },
                  p: { xs: '4px 0', sm: '8px 0'} // Reduce padding for list items on mobile
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      component="span"
                      sx={{ fontFamily: "Inter", fontWeight: "bold", fontSize: { xs: '0.85rem', sm: '0.9rem'} }}
                    >
                      {report.scout || "Unknown Scout"}{" "}
                      {report.date
                        ? ` - ${format(new Date(report.date), "MM/dd/yyyy")}`
                        : ""}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        fontFamily: "Inter",
                        display: "block",
                        whiteSpace: "pre-wrap",
                        fontSize: { xs: '0.75rem', sm: '0.875rem'}
                      }}
                    >
                      {report.report}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            sx={{
              mb: newScoutingReports.length > 0 ? 2 : 0,
              fontStyle: "italic",
              fontFamily: "Inter",
              fontSize: { xs: '0.8rem', sm: '0.9rem'}
            }}
          >
            No existing scouting reports.
          </Typography>
        )}

        {/* Display new reports */}
        {newScoutingReports.length > 0 && (
          <BlackBorderBox
            sx={{
              mt:
                playerData.scoutingReports &&
                playerData.scoutingReports.length > 0
                  ? 2
                  : 0,
              p: { xs: 1, sm: 1.5 } // Padding for new reports box
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold", fontFamily: "Inter", fontSize: { xs: '0.9rem', sm: '1rem'} }}
            >
              Newly Added Reports:
            </Typography>
            <List dense>
              {newScoutingReports.map((report) => (
                <ListItem
                  key={report.reportId}
                  alignItems="flex-start"
                  sx={{
                    borderBottom: "1px solid #eee",
                    "&:last-child": { borderBottom: "none" },
                    p: { xs: '4px 0', sm: '8px 0'}
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        component="span"
                        sx={{ fontFamily: "Inter", fontWeight: "bold", fontSize: { xs: '0.85rem', sm: '0.9rem'} }}
                      >
                        {report.scout} -{" "}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ fontFamily: "Inter", fontSize: { xs: '0.7rem', sm: '0.8rem'} }}
                        >
                          {format(new Date(report.date), "MM/dd/yyyy HH:mm")}
                        </Typography>
                      </Typography>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          fontFamily: "Inter",
                          display: "block",
                          whiteSpace: "pre-wrap",
                          fontSize: { xs: '0.75rem', sm: '0.875rem'}
                        }}
                      >
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
        {/* Assuming ScoutingReportForm handles its own responsiveness. If not, it might need Grid items or sx props passed down. */}
      </BlackBorderBox>
    </Container>
  );
};

export default PlayerProfile;
