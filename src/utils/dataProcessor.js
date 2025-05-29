import rawData from '../data/intern_project_data.json';
import { parseISO, isAfter } from 'date-fns'; // Add this import at the top

export const loadPlayerData = () => {
  const {
    bio = [],
    scoutRankings = [],
    measurements = [],
    game_logs = [],
    seasonLogs = [],
    scoutingReports = [],
  } = rawData;

  const EXHIBITION_LEAGUE_NAMES_LOWERCASE = [
    "ncaa exhibitions",
    "combine",
    "g-league elite camp",
    "hoop summit",
    "u-18 national team exh",
    "national team exhibitions",
    "adidas eurocamp",
    "chipotle nationals",
    "eybl scholastic",
    "city of palms",
    "border league",
    "montverde tournament",
    "nbpa top 100",
    "sportradar showdown",
    "overtime elite",
    "adriatic junior",
    "radivoj korac cup",
    "fiba u19 world",
    "fiba u20 europe a",
    "fiba eurobasket qlf"
  ];

  // Filter seasonLogs first to exclude exhibition leagues
  const filteredSeasonLogs = seasonLogs.filter(log => {
    const leagueName = log.League || log.league; // Accommodate potential variations in property casing
    if (!leagueName) return true; // Keep if league name is missing, or decide to filter
    return !EXHIBITION_LEAGUE_NAMES_LOWERCASE.includes(leagueName.toLowerCase());
  });

  // Map seasonLogs and scoutingReports by playerId if possible
  const seasonLogsByPlayer = {};
  filteredSeasonLogs.forEach((log, idx) => {
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

    // --- Filter game logs by year and date constraints ---
    const filteredGameLogs = game_logs.filter(log => {
      if (log.playerId !== playerId) return false;
      if (!log.date) return false;

      const logDate = parseISO(log.date);
      const minDate = new Date('2024-01-01');
      if (logDate < minDate) return false;

      // Determine league and cutoff date
      const leagueName = log.league || '';
      let cutoffDate;
      if (leagueName.toLowerCase().includes('ncaa')) {
        cutoffDate = new Date('2024-11-01');
      } else {
        cutoffDate = new Date('2024-10-01');
      }
      return isAfter(logDate, cutoffDate);
    });

    // --- Season logs: only keep most GP league for non-NCAA ---
    // Only keep season logs for 2025
    let playerSeasonLogs = (seasonLogsByPlayer[playerId] || []).filter(
      log => String(log.Season || log.season) === '2025'
    );

    const isNCAA = (playerBio.league || '').toLowerCase().includes('ncaa');
    if (!isNCAA && playerSeasonLogs.length > 0) {
      // Group by league, sum GP
      const leagueGPMap = {};
      playerSeasonLogs.forEach(log => {
        const league = (log.League || log.league || '').toLowerCase();
        const gp = Number(log.GP || log.gp || 0);
        if (!leagueGPMap[league]) leagueGPMap[league] = { logs: [], totalGP: 0 };
        leagueGPMap[league].logs.push(log);
        leagueGPMap[league].totalGP += gp;
      });
      // Find league with max GP
      let maxGP = -1;
      let bestLeague = null;
      Object.entries(leagueGPMap).forEach(([league, { totalGP }]) => {
        if (totalGP > maxGP) {
          maxGP = totalGP;
          bestLeague = league;
        }
      });
      // Only keep logs from that league
      if (bestLeague) {
        playerSeasonLogs = leagueGPMap[bestLeague].logs;
      }
    }

    return {
      ...playerBio,
      scoutRankings: playerScoutRankings
        ? { ...playerScoutRankings, averageMavericksRank, scoutHighLow }
        : { averageMavericksRank, scoutHighLow },
      measurements: measurements.find(m => m.playerId === playerId) || {},
      gameLogs: filteredGameLogs,
      seasonLogs: playerSeasonLogs,
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