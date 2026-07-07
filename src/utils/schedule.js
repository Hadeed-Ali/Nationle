import puzzles from '../data/puzzles.json';
// All 196 countries (name, official name, cca2, region, subregion, UN status, aliases)
import countries from '../data/countries.json';

// Building an alias lookup
// Each country name is mapped to its respective aliases (Ex: Liking United States to USA)
const aliasMap = {};
for (const c of countries) {
  aliasMap[c.name] = c.aliases || [];
}

// Seeded Fisher-Yates shuffle --> fixed seed means the cycle order never changes
function seededShuffle(arr, seed) {
  const result = [...arr];
  let s = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    const j = (s >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Changing this seed changes every puzzle day — only do so before launch
const SCHEDULE_SEED = 0xd3adb33f;
const schedule = seededShuffle(puzzles, SCHEDULE_SEED);

// Used to force a specific country for the daily puzzle - used for testing prior to deployment
const DEV_COUNTRY = 'Portugal';

// Hand-picked countries for the launch week (puzzles 1–7).
// Countries are specifically picked based on their coverage, quality of hints, playability, and difficulty
// Once puzzle #8 arrives this list is ignored automatically - can be kept or deletedd as required.
const LAUNCH_WEEK = [
  'Japan',       // Puzzle 1 / ASIA
  'Czechia',       // Puzzle 2 / EUROPE
  'Ghana',       // Puzzle 3 / AFRICA
  'Hungary',        // Puzzle 4 / EUROPE
  'Mongolia',        // Puzzle 5 / ASIA
  'Uruguay',    // Puzzle 6 / SOUTH AMERICA
  'Liberia',        // Puzzle 7 / AFRICA
];

// Function to obtain the country, associated hints, potential aliases, and all relevant information to format the daily puzzle
export function getDailyPuzzle(puzzleNumber) {
  if (DEV_COUNTRY) {
    const entry = schedule.find(p => p.country === DEV_COUNTRY) ?? schedule[(puzzleNumber - 1) % schedule.length];
    return { country: entry.country, hints: entry.hints, aliases: aliasMap[entry.country] || [] };
  }

  if (puzzleNumber >= 1 && puzzleNumber <= LAUNCH_WEEK.length) {
    const name  = LAUNCH_WEEK[puzzleNumber - 1];
    const entry = schedule.find(p => p.country === name);
    if (entry) return { country: entry.country, hints: entry.hints, aliases: aliasMap[entry.country] || [] };
  }

  return {
    country: schedule[(puzzleNumber - 1) % schedule.length].country,
    hints:   schedule[(puzzleNumber - 1) % schedule.length].hints,
    aliases: aliasMap[schedule[(puzzleNumber - 1) % schedule.length].country] || [],
  };
}
