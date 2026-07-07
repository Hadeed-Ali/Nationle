# Nationle

A daily geography guessing game, similar in style to Wordle. Each day there is one country to figure out, which is accomplished through revealing hints or making guesses at the cost of points.

Built with React. No backend is present, as the whole thing runs client-side, with your personal statistics and progress saved to `localStorage`.

## How it works

Each puzzle gives you a country to identify. You start with one hint on the board and can either:

- **Reveal another hint** (costs points), or
- **Take a guess** (costs point, unless a correct guess is made)

In general, the hints start off pretty vague but become more specific as the game progresses. The first hints usually provide information on the flag or languages, with the last hints being dead giveaways or valuable information such as capital cities and notable landmarks. You start at 100 points and lose 10 per hint revealed and per wrong guess (20 if in Hardcore Mode). Everyone playing on a given day is given the same country, and it flips over to the next one at midnight (Eastern Standard Time / EST).

In addition to the core gameplay experience, thre is also:
- **Stats tracking** — win rate, average score, guess distribution, full game history
- **A badge system** — nine badges for achivements such as your first win, achieving perfect score, or completing five daily puzzles
- **A country card** - upon winning, showing the flag and a link to read more
- **Autofill toggle** and **Hardcore Mode** (higher point penalties) as optional settings
- **Light/dark theme**

## Tech stack

- React (Create React App / `react-scripts`)
- `react-simple-maps` for the decorative world map backdrop
- Everything else is hand-rolled. No state management library, no CSS framework. Game state and stats are persistent through `localStorage`.

## Project structure

```
src/
  components/     UI components (GameBoard, modals, intro screen, header, etc.)
  data/            countries.json, puzzles.json, badges.js: the game's actual content
  utils/           schedule.js (which country plays on which day) and stats.js (scoring, stats, badges)
scripts/
  generateHints.js  offline script that generates the 6 hints for a country using Claude
prompts/           prompt templates used by generateHints.js
```

The puzzle schedule is a seeded shuffle of all 197 countries, so the order is fixed but not predictable, and nobody repeats a country until the full cycle is done. During opening/launch week, the countries might be picked out beforehand to improve the overall experience.

## Running it locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. Standard CRA setup — `npm test` runs tests, `npm run build` builds for production.

## Regenerating hint content

Hints are generated offline (not at runtime) by `scripts/generateHints.js`, which calls the Anthropic API to write and verify each country's six hints against the project's difficulty curve and style rules. You won't need this unless you're editing the puzzle content itself:

```bash
cp .env.example .env    # add your own ANTHROPIC_API_KEY
node scripts/generateHints.js               # full run
node scripts/generateHints.js --country=Japan   # regenerate a single country
node scripts/generateHints.js --dry-run     # preview without writing
```

The generation is resumable. That is, if it gets interrupted partway through the 197 countries, running it again picks up where it left off.

## Status

This is a solo and personal project created by Hadeed Ali. The project is currently in Version 1.0 and early release, with updates expected in the future should the game proce to be succesful.

Enjoy!
