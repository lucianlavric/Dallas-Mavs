import rawData from '../data/intern_project_data.json';

export const loadPlayerData = () => {
  const { bio, scoutRankings, measurements, game_logs, seasonLogs, scoutingReports } = rawData;

  const processedPlayers = bio.map(playerBio => {
    const playerId = playerBio.id;

    // Process Scout Rankings
    const playerScoutRankings = scoutRankings.find(r => r.playerId === playerId);
    let averageMavericksRank = null;
    if (playerScoutRankings) {
      const ranks = Object.values(playerScoutRankings).slice(1); // Exclude playerId
      const validRanks = ranks.filter(rank => rank !== null && typeof rank === 'number');
      if (validRanks.length > 0) {
        averageMavericksRank = validRanks.reduce((sum, rank) => sum + rank, 0) / validRanks.length;
      }
    }

    // Process Measurements
    const playerMeasurements = measurements.find(m => m.playerId === playerId);

    // Process Game Logs
    const playerGameLogs = game_logs.filter(log => log.playerId === playerId);

    // Process Season Logs
    const playerSeasonLogs = seasonLogs.filter(log => log.playerId === playerId);

    // Process Scouting Reports
    const playerScoutingReports = scoutingReports.filter(report => report.playerId === playerId);

    return {
      ...playerBio,
      scoutRankings: playerScoutRankings ? { ...playerScoutRankings, averageMavericksRank } : { averageMavericksRank },
      measurements: playerMeasurements || {},
      gameLogs: playerGameLogs,
      seasonLogs: playerSeasonLogs,
      scoutingReports: playerScoutingReports,
    };
  });

  return processedPlayers;
};
