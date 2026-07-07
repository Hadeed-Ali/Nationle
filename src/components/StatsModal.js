// OVERVIEW: Creates the popup for the statistics page, which contains valuable information on games played, total wins, score distributions, et cetera
// This popup can be accessed from the header (clicking the stats button), and also opens automatically upon completing a puzzle
// Includes some of the more logic heavy and crucial functions for the Nationle experience

import React, { useState } from 'react';
import { loadStats, BUCKET_LABELS, BUCKET_GRADES, scoreToBucket, getPuzzleNumber, BETA_LABEL } from '../utils/stats';
import { MapPin } from './icons';

const PUZZLE_NUMBER = getPuzzleNumber();

// Manually parses the date string to prevent timezone issues and keep the date formatting constant regardless of time (Works in EST)
function formatHistoryDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}


function StatsModal({ onClose, lastResult }) {
  
  // Reads from the localStorage on each render to obtain the stats to display on the page
  const stats = loadStats();
  const [copied, setCopied] = useState(false);

  // Preventing a division by zero error by checking if gamesPlayed > 0 prior to mathematical operation
  const winPercent = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0;

  const avgPoints = stats.gamesPlayed > 0
    ? Math.round(stats.totalPoints / stats.gamesPlayed)
    : 0;

  // Finds the highest count across all five score buckets (Ranked D - C - B - A - S) to draw bars relative to one another
  const maxDist = Math.max(1, ...stats.scoreDistribution);

  // Maps a given score to its respective scoring bucket
  // Example: If the user got a score of 60 on the puzzle, then they get mapped to bucket B or bucket 2, as B covers scores from 50 to 69
  const currentBucket = lastResult != null ? scoreToBucket(lastResult.points) : null;

  const sortedHistory = [...stats.gameHistory].reverse();

  // Handling the sharing of the statistics, which is done through the button located at the bottom of the popup
  // Obtains tbe required statistics for the text, which are sourced from either the same session or from the game history if a refresh occurred
  // Formatting: NATIONLE -> PUZZLE NUMBER -> SCORE -> HINTS -> GUESSES - > WEBSITE LINK
  const handleShare = () => {
    const todayEntry = stats.gameHistory.findLast(e => e.puzzleNumber === PUZZLE_NUMBER);
    const pts     = lastResult?.points    ?? todayEntry?.points    ?? '?';
    const hints   = lastResult?.hintsUsed  ?? todayEntry?.hintsUsed  ?? '?';
    const guesses = lastResult?.guessCount ?? todayEntry?.guessCount ?? '?';
    const text = `Nationle ${BETA_LABEL} 🌍 | Score: ${pts}pts | Hints: ${hints}, Guesses: ${guesses} | https://nationle.vercel.app/`;

    // Upon completion, setCopied is set to True so the button can be changed to "Copied to clipboard!", appearing for 2000ms / 2 seconds
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--stats" onClick={(e) => e.stopPropagation()}>

         {/* The header, which includes the title and close buttons as seen in various other popups */}
        <div className="modal__header">
          <div className="modal__title-row">
            <hr className="modal__rule" />
            <span className="modal__title">&nbsp;Statistics</span>
            <hr className="modal__rule" />
          </div>
          <button className="modal__close-btn" onClick={onClose} aria-label="Close"><MapPin /></button>
        </div>

        {/* The stats titles for the top boxes - Games played, win percentage, playing streak, and best streak ever held */}
        {/* Entrances for each of the stat are staggered rather than appearing simultaneously */}
        <div className="stats__tiles">
          {[
            { value: stats.gamesPlayed,   label: 'Played'  },
            { value: `${winPercent}%`,    label: 'Win Rate' },
            { value: stats.currentStreak, label: 'Streak'  },
            { value: stats.longestStreak, label: 'Best'    },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className="stats__tile"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="stats__tile-value">{value}</span>
              <span className="stats__tile-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Average score label, which is calculated above */}
        <div className="stats__avg">
          <span className="stats__avg-label">Average Score</span>
          <span className="stats__avg-value">{avgPoints} pts</span>
        </div>

        {/* Score distribution chart, which is a horizontal bar chart that shows which buckets / ranks the user tends to place in */}
        <div className="stats__dist-section">
          <p className="stats__dist-title">Score Distribution</p>
          <div className="stats__dist-rows">
            {stats.scoreDistribution.map((count, i) => {
              const isCurrent = currentBucket === i;

              // Scales the bar as a percentage of the tallest bar, so the bars are proportional relative to accumulation
              const pct = count === 0 ? 6 : Math.max(8, Math.round((count / maxDist) * 100));
              return (
                <div key={i} className="stats__dist-row">

                  {/* Maps each index to its corresponding letter grade and point range, also applying different colours for each tier */}
                  <span className={`stats__dist-grade stats__dist-grade--${BUCKET_GRADES[i]}`}>{BUCKET_GRADES[i]}</span>
                  <span className="stats__dist-label">{BUCKET_LABELS[i]}</span>
                  <div className="stats__dist-bar-wrap">

                    {/* Adding in staggered entrance animations and a specific CSS styling pattern to each tier of bucket */}
                    <div
                      className={`stats__dist-bar${isCurrent ? ' stats__dist-bar--current' : ''}`}
                      style={{
                        width: `${pct}%`,
                        animationDelay: `${0.28 + i * 0.06}s`,
                      }}
                    >
                      <span className="stats__dist-count">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game history, which contains a series of labels that show the puzzles most recently played by the user */}
        <div className="stats__history-section">
          <p className="stats__dist-title">Game History</p>

          {/* Alternative message if the user has not played any games yet */}
          {sortedHistory.length === 0 ? (
            <p className="stats__history-empty">Complete a puzzle to unlock game history!</p>
          ) : (

            <div className="stats__history-list">

              {/* Each row renders a historic entry objet that contains the date and information of a previously played puzzle*/}
              {sortedHistory.map((entry, i) => (
                
                <div key={i} className={`stats__history-row${entry.won ? ' stats__history-row--win' : ' stats__history-row--loss'}`}>
                  <div className="stats__history-left">
                    <span className={`stats__history-badge${entry.won ? ' stats__history-badge--win' : ' stats__history-badge--loss'}`}>
                      {entry.won ? 'W' : 'L'}
                    </span>
                    <div className="stats__history-meta">
                      <span className="stats__history-date">{formatHistoryDate(entry.date)}</span>
                      <span className="stats__history-puzzle">Puzzle #{entry.puzzleNumber}</span>
                    </div>
                  </div>
                  <div className="stats__history-right">
                    <span className="stats__history-pts">{entry.points} pts</span>
                    <span className="stats__history-detail">
                      {entry.guessCount} Guesses · {entry.hintsUsed} Hints
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer section, which contains the button for the user to share their daily puzzle */}
        <div className="modal__footer">
          <button className="modal__share-btn" onClick={handleShare}>
            {copied ? 'Copied to clipboard!' : 'Share Today\'s Game ↗'}
          </button>
          <p className="modal__brand">Nationle</p>
        </div>

      </div>
    </div>
  );
}

export default StatsModal;
