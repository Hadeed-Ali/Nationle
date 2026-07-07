// OVERVIEW: Creates the celebratory popup that appears on the screen after the player has earned one (or more) new badges
// Popup includes the badge icon / name, the number of badges earned, and references to the badges page itself
// Overlay - sits on top of everything else and only shows up once all other popups have occured (lowest priority)

import React, { useState, useEffect } from 'react';
import BADGES from '../data/badges';
import { MapPin } from './icons';

// Converts the BADGES array into a lookup object, so badges can be fetched off their ids
const BADGE_MAP = Object.fromEntries(BADGES.map(b => [b.id, b]));

// The number of particle spans that are rendered in the burst animation
const SPARKS = 10;

// Main function for the popup itself
function BadgeEarnedPopup({ badgeIds, currentIndex, onNext, onViewBadges, onClose }) {
  const [cardVisible, setCardVisible] = useState(false);

  // Entrance animation for the card, showing up in 650ms after the celebration animation has played
  useEffect(() => {
    setCardVisible(false);
    const t = setTimeout(() => setCardVisible(true), 650);
    return () => clearTimeout(t);
  }, [currentIndex]);

  // Obtaining the badges, the total number of badges, and the last one for the link to the badges page
  const badge = BADGE_MAP[badgeIds[currentIndex]];
  const total = badgeIds.length;
  const isLast = currentIndex === total - 1;

  // Fail safe if no badges are retrieved
  if (!badge) return null;

  return (

    <div className="badge-popup" role="status" aria-live="polite">

      {/* Particles remount on each badge via key, restarting animations */}
      <div key={currentIndex} className="badge-popup__burst" aria-hidden="true">
        {Array.from({ length: SPARKS }, (_, i) => (
          <span key={i} className={`badge-popup__spark badge-popup__spark--${i}`} />
        ))}
      </div>

      {/* Waypoint button to close the popup at any point */}
      <div className={`badge-popup__card${cardVisible ? ' badge-popup__card--visible' : ''}`}>
        <button className="badge-popup__close" onClick={onClose} aria-label="Dismiss badge notification">
          <MapPin />
        </button>

        {/* Badge earned message, counter of the # of badges, and the badge images in the center of the popup */}
        <div className="badge-popup__label">Badge Earned!</div>

        {total > 1 && (
          <div className="badge-popup__counter">{currentIndex + 1} of {total}</div>
        )}

        <div className="badge-popup__img-wrap">
          <img className="badge-popup__img" src={badge.img} alt={badge.name} />
        </div>

        <div className="badge-popup__name"> {badge.name} </div>

        {/* Allowing the user to transition to the next badge in the sequence */}
        <div className="badge-popup__actions">
          {!isLast && (
            <button className="badge-popup__next-btn" onClick={onNext}>
              Next →
            </button>
          )}
          
          <button className="badge-popup__view-btn" onClick={onViewBadges}>
            View Badges →
          </button>
        </div>
      </div>
    </div>
  );
}

export default BadgeEarnedPopup;
