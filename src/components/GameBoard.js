// OVERVIEW: This large file controls the core gameplay components of Nationle by rendering the puzzle, showing clues, taking hints, tracking progress, e.t.c
// This is essentially the gameplay that is seen on the main page of the screen
// This file interacts closely with several other files, since it reports results to files such as App.js and also uses data from other sources

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getDailyPuzzle } from '../utils/schedule';

// Importing all countries within the Nationle experience and their relevant information such as aliases and abbreviations
import countries from '../data/countries.json';

// Creating a mapping of all the countries to their associated names
const ALL_COUNTRY_NAMES = countries.map(c => c.name);

// Storing a list of the colours required for the burst animation
const BURST_COLORS = ['#6aaf64', '#ffd700', '#ff9e3c', '#c8e840', '#80d060', '#ffcc44', '#a8e060'];

// Decorative particle-burst animation that is shown upon a correct guess
// Creates 22 particles that are randomly coloured, angled, and sized using .random()
function StarBurst() {
  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => {
      const angle = (i / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist  = 55 + Math.random() * 95;
      return {
        id:       i,
        tx:       Math.round(Math.cos(angle) * dist),
        ty:       Math.round(Math.sin(angle) * dist),
        size:     4 + Math.random() * 7,
        color:    BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
        duration: 550 + Math.random() * 400,
        delay:    Math.random() * 80,
        diamond:  Math.random() > 0.5,
      };
    })
  , []);

  return (
    <div className="starburst" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className={`starburst__p${p.diamond ? ' starburst__p--diamond' : ''}`}
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            width:           p.size,
            height:          p.size,
            background:      p.color,
            animationDuration:  `${p.duration}ms`,
            animationDelay:     `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

const STATE_KEY   = 'nationle_game_state';
const SAVE_VERSION = 9;

// Formatting the date as a string so that it matches the puzzle number regardless of the player's local timezone (working in EST)
const TODAY = new Date().toLocaleDateString('en-US', {
  timeZone: 'America/New_York',
  month: 'short', day: 'numeric', year: 'numeric',
});

// Calculates the total number of seconds until midnight in EST, which is when the curernt puzzle will be replaced with the new one
function secsUntilMidnightET() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const h = parseInt(parts.find(p => p.type === 'hour').value);
  const m = parseInt(parts.find(p => p.type === 'minute').value);
  const s = parseInt(parts.find(p => p.type === 'second').value);
  return 86400 - (h * 3600 + m * 60 + s);
}

// A custom hook that ticks down each second to display the remaining time until the next puzzle
// Follows the form HH:MM:SS
function useNextPuzzleCountdown() {
  const [secs, setSecs] = useState(secsUntilMidnightET);
  useEffect(() => {
    const id = setInterval(() => setSecs(secsUntilMidnightET()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Maps a current score to its display colour, with green denoting a high score and red denoting a low score
function scoreColor(pts) {
  if (pts >= 70) return '#6aaf64';
  if (pts >= 40) return '#c09030';
  return '#d46060';
}

// Function to calculate the score of the user
// Formula: Starting from 100 points, deduct 10 points for each guess / hint reveal (20 if in hardcore), with the minimum being 10 points
function calcPoints(hintsRevealed, guessCount, hardcore = false) {
  const cost = hardcore ? 20 : 10;
  return Math.max(10, 100 - hintsRevealed * cost - guessCount * cost);
}

// Function to read the local storage and return the saved game if the user refreshes the site
function loadSavedGame(puzzleNumber) {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed.puzzleNumber === puzzleNumber ? parsed : null;
  } catch {
    return null;
  }
}

// The following is the main component / body of the file, controlling the gameboard itself
function GameBoard({ onGameEnd, puzzleNumber, hardcore = false, autofill = true }) {

  // Loading the daily puzzle using the getDailyPuzzle function in schedule.js (might be diff. if on launching week)
  const puzzle = useMemo(() => getDailyPuzzle(puzzleNumber), [puzzleNumber]);
  const MAX_HINTS = puzzle.hints.length - 1;

  const saved = useRef(loadSavedGame(puzzleNumber)).current;

  // If possible, uses the values from the current save if the user has already started the puzzle - otherwise it starts fresh
  const [guesses,       setGuesses]       = useState(saved?.guesses       ?? []);
  const [inputValue,    setInputValue]    = useState('');
  const [gameOver,      setGameOver]      = useState(saved?.gameOver      ?? false);
  const [won,           setWon]           = useState(saved?.won           ?? false);
  const [hintsRevealed, setHintsRevealed] = useState(saved?.hintsRevealed ?? 0);

  const wasAlreadyDone = useRef(saved?.gameOver ?? false);
  const [showBurst, setShowBurst] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const countdown = useNextPuzzleCountdown();

  useEffect(() => {
    if (!autofill) setSuggestions([]);
  }, [autofill]);

  useEffect(() => {
    if (guesses.length > 0 || hintsRevealed > 0 || gameOver) {
      try {
        localStorage.setItem(STATE_KEY, JSON.stringify({
          version: SAVE_VERSION,
          puzzleNumber, guesses, hintsRevealed, gameOver, won,
        }));
      } catch {}
    }
  }, [puzzleNumber, guesses, hintsRevealed, gameOver, won]);

  const visibleClues  = gameOver ? puzzle.hints : puzzle.hints.slice(0, hintsRevealed + 1);
  const wrongGuesses  = won ? guesses.length - 1 : guesses.length;
  const currentPoints = calcPoints(hintsRevealed, wrongGuesses, hardcore);
  const barPct        = ((currentPoints - 10) / 90) * 100;

  // Advances the revealed hints by one, if there are still hints to be revealed
  const revealHint = () => {
    if (gameOver || hintsRevealed >= MAX_HINTS) return;
    setHintsRevealed((h) => h + 1);
  };

  // Controls the autofill suggestions by matching textual input from the user to a country within a two character gap (to prevent "surfing")
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (!autofill) return;
    const trimmed = val.trim();
    if (!trimmed) { setSuggestions([]); return; }
    const lower = trimmed.toLowerCase();
    const matches = ALL_COUNTRY_NAMES.filter(name =>
      name.toLowerCase().startsWith(lower) && (name.length - trimmed.length) <= 2
    );
    setSuggestions(matches);
  };

  const selectSuggestion = (name) => {
    setInputValue(name);
    setSuggestions([]);
  };

  // Takes the submitted input from the user, turns it into lowercase, and it determines if it is correct or not
  const submitGuess = () => {
    if (gameOver) return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setSuggestions([]);

    const normalized = trimmed.toLowerCase();
    const validAnswers = [
      puzzle.country.toLowerCase(),
      ...puzzle.aliases.map(a => a.toLowerCase()),
    ];
    const isCorrect = validAnswers.includes(normalized);

    const newGuesses = [...guesses, { name: trimmed, correct: isCorrect }];
    const finalPts   = calcPoints(hintsRevealed, isCorrect ? guesses.length : newGuesses.length, hardcore);

    setGuesses(newGuesses);
    setInputValue('');

    // If the guess from the user was correct, change the game states to true to queue the latter popups
    if (isCorrect) {
      setWon(true);
      setGameOver(true);
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1600);
      if (!wasAlreadyDone.current) onGameEnd?.(true, finalPts, hintsRevealed, newGuesses.length, puzzle.country);
    }
  };

  return (
    <div className="gameboard">

      {/* Puzzle header, which includes the number of the puzzle, date, and whether or not hardcore mode is activated */}
      <div className="gameboard__meta">
        <span className="gameboard__meta-puzzle">Puzzle #{puzzleNumber}</span>
        <span className="gameboard__meta-sep">·</span>
        <span className="gameboard__meta-date">{TODAY}</span>
        {hardcore && (
          <span className="gameboard__meta-hardcore" aria-label="Hardcore mode active">
            Hardcore Mode
          </span>
        )}
      </div>

      {/* Puzzle header, which includes the current (or final) score of the user along with a bar to indicate their performance */}
      <div className="gameboard__score-card">
        <div className="gameboard__score-main">
          <span className="gameboard__score-num" style={{ color: scoreColor(currentPoints) }}>
            {currentPoints}
          </span>
          <span className="gameboard__score-unit">pts</span>
        </div>
        <p className="gameboard__score-label">{gameOver ? 'Final Score' : 'Current Score'}</p>
        <div className="gameboard__score-bar-track">
          <div
            className="gameboard__score-bar-fill"
            style={{ width: `${barPct}%`, background: scoreColor(currentPoints) }}
          />
        </div>
      </div>

      {/* Clues, which are loaded in upon being revealed by the user and are numbered off for accesibility */}
      <section className="gameboard__clues">
        {visibleClues.map((clue, index) => (
          <div
            key={index}
            className={`gameboard__clue${
              index === visibleClues.length - 1 && !gameOver ? ' gameboard__clue--latest' : ''
            }`}
          >
            <span className="gameboard__clue-number">{index + 1}</span>
            <p className="gameboard__clue-text">{clue}</p>
          </div>
        ))}
      </section>

      {/* Result banner, which includes information on how the user performed and a timer for the next puzzle */}
      <div className="gameboard__result-anchor">
        {showBurst && <StarBurst />}
        {gameOver && (
          <div className={`gameboard__result ${won ? 'gameboard__result--win' : 'gameboard__result--loss'}`}>
            <p className="gameboard__result-text">
              {won
                ? `GOT IT! You scored ${calcPoints(hintsRevealed, (guesses.length) - 1, hardcore)} points.`
                : `Out of guesses! The answer was ${puzzle.country}.`}
            </p>
            <p className="gameboard__result-next">
              Next puzzle in <span className="gameboard__result-countdown">{countdown}</span>
            </p>
          </div>
        )}
      </div>

      {/* Controls, which includes the buttons for allowing the user to reveal the next hint or make their own guess */}
      {!gameOver && (
        <section className="gameboard__controls">

          <button
            className="gameboard__hint-btn"
            onClick={revealHint}
            disabled={hintsRevealed >= MAX_HINTS}
          >
            <span className="gameboard__hint-label">
              {hintsRevealed >= MAX_HINTS ? 'All Hints Revealed!' : 'Reveal Next Hint'}
            </span>
            {hintsRevealed < MAX_HINTS && (
              <span className="gameboard__hint-cost">−{hardcore ? 20 : 10} pts</span>
            )}
          </button>

          <div className="gameboard__divider">
            <hr className="gameboard__divider-line" />
            <span className="gameboard__divider-text">Or Guess</span>
            <hr className="gameboard__divider-line" />
          </div>

          <div className="gameboard__input-wrap">
            <div className="gameboard__input-row">
              <input
                className="gameboard__input"
                type="text"
                placeholder="Enter a country name"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                onBlur={() => setTimeout(() => setSuggestions([]), 100)}
                autoComplete="off"
              />
              <button className="gameboard__submit-btn" onClick={submitGuess}>
                Guess&nbsp;(−{hardcore ? 20 : 10}&nbsp;pts)
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="gameboard__suggestions" role="listbox">
                {suggestions.map(name => (
                  <li
                    key={name}
                    className="gameboard__suggestion-item"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectSuggestion(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </section>
      )}

      {/* Footer element, which includes information on which countries the user has guessed and their guess counter */}
      <section className="gameboard__footer">
        <div className="gameboard__guesses-list">
          {guesses.length > 0 && (
            <span className="gameboard__footer-label">Guessed:&nbsp;</span>
          )}
          {guesses.map((g, i) => (
            <span
              key={i}
              className={`gameboard__guessed-tag${g.correct ? ' gameboard__guessed-tag--correct' : ''}`}
            >
              {g.name}&nbsp;{g.correct ? '✓' : '✕'}
            </span>
          ))}
        </div>
        <div className="gameboard__counter">{guesses.length} {guesses.length === 1 ? 'guess' : 'Guesses'}</div>
      </section>

    </div>
  );
}

export default GameBoard;
