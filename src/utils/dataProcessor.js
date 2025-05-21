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

// Player object structure returned by loadPlayerData()
/**
 * @typedef {Object} Player
 * @property {number} playerId
 * @property {string} name
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 * @property {number} height
 * @property {number} weight
 * @property {string|null} highSchool
 * @property {string|null} highSchoolState
 * @property {string} homeTown
 * @property {string|null} homeState
 * @property {string} homeCountry
 * @property {string} nationality
 * @property {string|null} photoUrl
 * @property {string} currentTeam
 * @property {string} league
 * @property {string} leagueType
 * @property {Object} scoutRankings
 *   - All scout ranks (e.g. "ESPN Rank": number|null, etc)
 *   - averageMavericksRank: number|null
 *   - scoutHighLow: { [scoutName: string]: 'high'|'mid'|'low' }
 * @property {Object} measurements
 *   - All combine measurements (e.g. heightNoShoes: number|null, wingspan: number|null, etc)
 * @property {Array<Object>} gameLogs
 *   - Each object: { playerId: number, gameId: number, ..., pts: number, ... }
 * @property {Array<Object>} seasonLogs
 *   - Each object: { ...season stats, playerId?: number }
 * @property {Array<Object>} scoutingReports
 *   - Each object: { ...report fields, playerId?: number }
 */