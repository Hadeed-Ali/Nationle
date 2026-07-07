// OVERVIEW: Creates the full badges collection screen, consisting of all nine available badges and how many have been collected thus far
// Includes the name and symbol for each badge, along with an indication if the badge has been unlocked or not
// Tied closely to the BadgesEarnedPopup.js file, which redirects to this main badge page upon completion

import React from 'react';
import { loadStats, getBadgeStatus } from '../utils/stats';
import { MapPin } from './icons';
import BADGES from '../data/badges';

// Loading the users stats to obtain data, running it through for a map of earned badges, and determining how many are true for progress
function BadgesModal({ onClose }) {
  const stats = loadStats();
  const earned = getBadgeStatus(stats);
  const earnedCount = Object.values(earned).filter(Boolean).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--badges" onClick={e => e.stopPropagation()}>

        {/* Header, which includes the Badges title, close buttons, and associated lines for aesthetics */}
        <div className="modal__header">
          <div className="modal__title-row">
            <hr className="modal__rule" />
            <span className="modal__title">&nbsp;Badges</span>
            <hr className="modal__rule" />
          </div>
          <button className="modal__close-btn" onClick={onClose} aria-label="Close">
            <MapPin />
          </button>
        </div>

        {/* Progress bar, which shows a fraction with the number of earned badges on the left and total badges in the game on the right */}
        <div className="badges__progress">
          <span className="badges__progress-label">Badges Earned</span>
          <span className="badges__progress-count">
            <span className="badges__progress-earned">{earnedCount}</span>
            <span className="badges__progress-total"> / {BADGES.length}</span>
          </span>
        </div>

        {/* Creating a 3 x 3 grid with all of the badges displayed, rendering one card per badge */}
        <div className="badges__grid">
          {BADGES.map((badge, i) => {

            // Determining if the badge has been earned and if it is a mystery one - creates the ??? concealment
            const isEarned = earned[badge.id];
            const showMystery = badge.mystery && !isEarned;

            return (
              <div
                key={badge.id}
                className={`badges__card ${isEarned ? 'badges__card--earned' : 'badges__card--locked'}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                
                {/* Corner indicator */}
                {isEarned ? (
                  <div className="badges__corner-indicator badges__corner-indicator--earned" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="badges__corner-indicator badges__corner-indicator--locked" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </div>
                )}

                {/* Showcasing the image of a badge, which takes on one of three types based on status */}
                <div className={`badges__icon ${isEarned ? 'badges__icon--earned' : 'badges__icon--locked'}`}>
                  <img
                    src={showMystery ? (badge.lockedImg ?? badge.img) : badge.img}
                    alt={showMystery ? 'Mystery badge' : badge.name}
                    className={`badges__icon-img${
                      !isEarned
                        ? (showMystery ? ' badges__icon-img--mystery' : ' badges__icon-img--locked')
                        : ''
                    }`}
                  />
                </div>

                {/* The name and description for each of the badges - ??? if the badge is a mystery */}
                <div className="badges__card-info">

                  <span className="badges__card-name">
                    {showMystery ? '???' : badge.name}
                  </span>

                  <span className="badges__card-desc">
                    {showMystery ? '???' : (badge.mystery ? badge.revealedDesc : badge.desc)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nationle footer located at the bottom of the card */}
        <div className="modal__footer">
          <p className="modal__brand">Nationle</p>
        </div>

      </div>
    </div>
  );
}

export default BadgesModal;
