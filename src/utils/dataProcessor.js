import rawData from '../data/intern_project_data.json';

export const loadPlayerData = () => {
  const {
    bio = [],
    scoutRankings = [],
    measurements = [],
    game_logs = [],
    seasonLogs = [],
    scoutingReports = [],
  } = rawData;

  // Map seasonLogs and scoutingReports by playerId if possible
  // (Assuming each seasonLog and scoutingReport has a playerId field, otherwise you may need to adjust this)
  const seasonLogsByPlayer = {};
  seasonLogs.forEach((log, idx) => {
    if (log.playerId) {
      if (!seasonLogsByPlayer[log.playerId]) seasonLogsByPlayer[log.playerId] = [];
      seasonLogsByPlayer[log.playerId].push(log);
    }
  });

  const scoutingReportsByPlayer = {};
  scoutingReports.forEach((report, idx) => {
    if (report.playerId) {
      if (!scoutingReportsByPlayer[report.playerId]) scoutingReportsByPlayer[report.playerId] = [];
      scoutingReportsByPlayer[report.playerId].push(report);
    }
  });

  const processedPlayers = bio.map(playerBio => {
    const playerId = playerBio.playerId;

    // Scout Rankings
    const playerScoutRankings = scoutRankings.find(r => r.playerId === playerId);
    let averageMavericksRank = null;
    let scoutHighLow = {};

    if (playerScoutRankings) {
      const { playerId, ...ranks } = playerScoutRankings;
      const validRanks = Object.values(ranks).filter(
        rank => typeof rank === 'number' && !isNaN(rank)
      );
      if (validRanks.length > 0) {
        averageMavericksRank = validRanks.reduce((sum, rank) => sum + rank, 0) / validRanks.length;
        // Find high/low for each scout
        const min = Math.min(...validRanks);
        const max = Math.max(...validRanks);
        Object.entries(ranks).forEach(([scout, rank]) => {
          if (typeof rank === 'number') {
            if (rank === min) scoutHighLow[scout] = 'high';
            else if (rank === max) scoutHighLow[scout] = 'low';
            else scoutHighLow[scout] = 'mid';
          }
        });
      }
    }

    return {
      ...playerBio,
      scoutRankings: playerScoutRankings
        ? { ...playerScoutRankings, averageMavericksRank, scoutHighLow }
        : { averageMavericksRank, scoutHighLow },
      measurements: measurements.find(m => m.playerId === playerId) || {},
      gameLogs: game_logs.filter(log => log.playerId === playerId),
      seasonLogs: seasonLogsByPlayer[playerId] || [],
      scoutingReports: scoutingReportsByPlayer[playerId] || [],
    };
  });

  return processedPlayers;
};