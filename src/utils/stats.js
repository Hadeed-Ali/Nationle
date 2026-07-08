const STORAGE_KEY = 'nationle_stats';

// Date in which the first puzzle was publicly aired --> marks the date for Puzzle #1
const LAUNCH_DATE = '2026-07-08';

// Highest puzzle number that still counts as "initial launch" for the Beta
const BETA_CUTOFF_PUZZLE = 30;

// Countries of the creator, Hadeed Ali
const CREATOR_COUNTRIES = ['Canada', 'Pakistan'];

 // Puzzle flips at midnight America/New_York, not UTC - EST is utilized
export function getPuzzleNumber() {
  const estDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const diffMs = new Date(estDate) - new Date(LAUNCH_DATE);
  return Math.floor(diffMs / 86_400_000) + 1;
}

// 5 equal 20-point buckets spanning the 10-100 scoring range, which correspond to their own letter grades
export const BUCKET_LABELS = ['10–29', '30–49', '50–69', '70–89', '90–100'];
export const BUCKET_GRADES = ['D', 'C', 'B', 'A', 'S'];

// Connects a given score to its associated bucket grade
export function scoreToBucket(score) {
  const clamped = Math.max(10, Math.min(100, score));
  return Math.min(Math.floor((clamped - 10) / 20), 4);
}

// Initial statistics for a new player - all relevant stats are set to 0 / null and all badge requirements are false
const DEFAULT = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalPoints: 0,
  scoreDistribution: [0, 0, 0, 0, 0],
  lastPuzzleNumber: null,
  gameHistory: [],
  earnedPerfectScore: false,
  earnedNoHints: false,
  earnedTenGuesses: false,
  earnedBetaPlayer: false,
  earnedCreatorApproval: false,
};

function freshDefault() {
  return { ...DEFAULT, scoreDistribution: [0, 0, 0, 0, 0], gameHistory: [] };
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshDefault();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.scoreDistribution) || parsed.scoreDistribution.length !== 5) {
      parsed.scoreDistribution = [0, 0, 0, 0, 0];
    }
    if (!Array.isArray(parsed.gameHistory)) {
      parsed.gameHistory = [];
    }
    return { ...DEFAULT, ...parsed };
  } catch {
    return freshDefault();
  }
}

// Resetting user stats, which attempts to remove the storage key and current game state to nullify stats (try-catch block)
export function resetStats() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('nationle_game_state');
  } catch {
    /* storage unavailable */
  }
}

// Function to update the statistics of the user based on their performance in the completed puzzle
export function recordGame(won, points, puzzleNumber, hintsUsed = 0, guessCount = 0, countryName = '') {
  const stats = loadStats();
  if (stats.lastPuzzleNumber === puzzleNumber) return { stats, newBadges: [] };

  const beforeStatus = getBadgeStatus(stats);

  stats.gamesPlayed += 1;
  stats.lastPuzzleNumber = puzzleNumber;
  stats.totalPoints += points;
  stats.scoreDistribution[scoreToBucket(points)] += 1;

  const today = new Date().toISOString().slice(0, 10);
  stats.gameHistory.push({ date: today, puzzleNumber, won, points, hintsUsed, guessCount, country: countryName });
  if (stats.gameHistory.length > 100) stats.gameHistory = stats.gameHistory.slice(-100);


// Checking to see if variables related to badges can be updated to true
  if (points >= 100) stats.earnedPerfectScore = true;
  if (won && hintsUsed === 0) stats.earnedNoHints = true;
  if (guessCount >= 10) stats.earnedTenGuesses = true;
  if (puzzleNumber <= BETA_CUTOFF_PUZZLE) stats.earnedBetaPlayer = true;
  if (won && CREATOR_COUNTRIES.includes(countryName)) stats.earnedCreatorApproval = true;

  
// Upticking key variables if the user "won", or in other words if they completed the puzzle
  if (won) {
    stats.wins += 1;
    stats.currentStreak += 1;
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  const afterStatus = getBadgeStatus(stats);
  const newBadges = Object.keys(afterStatus).filter(k => !beforeStatus[k] && afterStatus[k]);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* storage unavailable */
  }
  return { stats, newBadges };
}

// For each badge, there is an associated metric (such as stats.wins >= 5) or a variable that must be true (like earnedNoHints)
// The function checks through the users stats and sees if they qualify for the condition of each badge
export function getBadgeStatus(stats) {
  const history = stats.gameHistory || [];
  return {
    betaPlayer:  stats.earnedBetaPlayer      || history.some(e => e.puzzleNumber <= BETA_CUTOFF_PUZZLE),
    firstGame:   stats.gamesPlayed >= 1,
    enjoyer:     stats.wins >= 5,
    specialist:  stats.wins >= 10,
    master:      stats.wins >= 20,
    sharpshooter: stats.earnedPerfectScore || history.some(e => e.points >= 100),
    noHints:     stats.earnedNoHints      || history.some(e => e.won && e.hintsUsed === 0),
    tenGuesses:  stats.earnedTenGuesses   || history.some(e => e.guessCount >= 10),
    creatorApproval: stats.earnedCreatorApproval || history.some(e => e.won && CREATOR_COUNTRIES.includes(e.country)),
  };
}
