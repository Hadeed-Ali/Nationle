// OVERVIEW: Controls the navigation / header bar that is located on the top of the website, which is present on both the main and about pages
// Includes the Nationle logo/title, and the navigation buttons that lead to the various popups such as badges and stats

import React from 'react';
import nationleLogo from '../photos/NationleLogo.png';

// Constructing an SVG component for the bar chart icon, as part of the stats navigation button
const BarChartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
  </svg>
);

// Constructing an SVG component for the help icon, as part of the how to play navigation button
const HelpIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <circle cx="12" cy="17" r="0.5" fill="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Constructing an SVG component for the settings icon, as part of the settings navigation button
const GearIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// Constructing an SVG component for the person icon, as part of the about meavigation button
const PersonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// Constructing an SVG component for the trophy icon, as part of the badges navigation button
const TrophyIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

// Main function for the header itself, including the title / logo and right section which stores the various navigation buttons
function Header({ onStatsClick, onBadgesClick, onHelpClick, onSettingsClick, onAboutClick, onLogoClick, currentPage }) {
  return (
    <header className="header">

       {/* Wrapping the logo and Nationle text into a clickable div, redirecting to either the main page or the title screen*/}
      <div
        className="header__left header__left--clickable"
        onClick={onLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLogoClick(); }}
        title={currentPage === 'about' ? 'Back to game' : 'Back to start'}
      >
        <img src={nationleLogo} alt="" className="header__logo-img" aria-hidden="true" />
        <h1 className="header__title">Nationle</h1>
      </div>

      {/* Right section of the header, which includes the various navigation buttons in a pre-defined order */}
      {/* Upon the pressing of each button, the respective popup will be opened using the linked onClick functions*/}
      <div className="header__right">
        <button className="header__icon-btn" onClick={onStatsClick} aria-label="Statistics" title="Statistics">
          <BarChartIcon />
          <span className="header__btn-label">Stats</span>
        </button>

        <button className="header__icon-btn" onClick={onBadgesClick} aria-label="Badges" title="Badges">
          <TrophyIcon />
          <span className="header__btn-label">Badges</span>
        </button>

        <button className="header__icon-btn" onClick={onHelpClick} aria-label="How to play" title="How to play">
          <HelpIcon />
          <span className="header__btn-label">How to Play</span>
        </button>

        <button
          className={`header__icon-btn header__icon-btn--about${currentPage === 'about' ? ' header__icon-btn--active' : ''}`}
          onClick={onAboutClick}
          aria-label="About"
          title="About"
        >
          <PersonIcon />
          <span className="header__btn-label">About</span>
        </button>

        <button className="header__icon-btn header__icon-btn--gear" onClick={onSettingsClick} aria-label="Settings" title="Settings">
          <GearIcon />
        </button>
      </div>
    </header>
  );
}

export default Header;
