// OVERVIEW: Creates the settings popup, which allows the user to adjust the appearance of the game, swap difficulties, and reset their progress
// This popup is only accesible from the header, and is opened when the user presses on the unnamed gear icon
// Actions taken by the user on this popup are saved locally and impact the rest of the site 

import React, { useState } from 'react';
import { MapPin } from './icons';
import { resetStats } from '../utils/stats';

// Constructing an SVG component for the sun icon, representing the light theme
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"     x2="12" y2="3"/>
    <line x1="12" y1="21"    x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1"  y1="12"    x2="3"  y2="12"/>
    <line x1="21" y1="12"    x2="23" y2="12"/>
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
  </svg>
);

// Constructing an SVG component for the moon icon, representing the dark (and superior!) theme
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// Constructing an SVG component for the warning icon, which is used if the user chooses to reset their saved progress
const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// A static array that defines the three main components of the settings popup - appearance, hardcore mode, and autofill mode
// Each part contains its id, display label, and a description which is provided directly to the user
const SETTINGS_ROWS = [
  {
    id: 'theme',
    label: 'Appearance',
    desc: 'Switch the mood a little.',
  },
  {
    id: 'hardcore',
    label: 'Hardcore Mode',
    desc: 'Hint and guess costs are DOUBLED!',
  },
  {
    id: 'autofill',
    label: 'Autofill Suggestions',
    desc: 'Show matching country names as you type.',
  },
];

// The main function to control the operations of the settings modal
function SettingsModal({ onClose, theme, onThemeChange, hardcore, onHardcoreChange, autofill, onAutofillChange }) {
  const [confirming, setConfirming] = useState(false);

// If the user chooses to reset, this calls resetStats from stats.js to wipe stored data, and calls .reload to force a page refresh
  function handleReset() {
    resetStats();
    window.location.reload();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--settings" onClick={(e) => e.stopPropagation()}>

        {/* The header, which includes the title and close buttons as seen in various other popups */}
        <div className="modal__header">
          <div className="modal__title-row">
            <hr className="modal__rule" />
            <span className="modal__title">&nbsp;Settings</span>
            <hr className="modal__rule" />
          </div>
          <button className="modal__close-btn" onClick={onClose} aria-label="Close"><MapPin /></button>
        </div>

        {/* The settings, each of which appear in a pre-defined and staggered animation sequence, including their own slider buttons*/}
        <div className="settings__section">
          {SETTINGS_ROWS.map(({ id, label, desc }, i) => (
            <div
              key={id}
              className="settings__row"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="settings__row-info">
                <span className="settings__row-label">{label}</span>
                <span className="settings__row-desc">{desc}</span>
              </div>

              {/* Theme setting */}
              {id === 'theme' && (
                <div className="settings__theme-picker" role="group" aria-label="Theme">
                  <button
                    className={`settings__theme-btn${theme === 'light' ? ' settings__theme-btn--active' : ''}`}
                    onClick={() => onThemeChange('light')}
                    aria-pressed={theme === 'light'}
                  >
                    <SunIcon />
                    Light
                  </button>
                  <button
                    className={`settings__theme-btn${theme === 'dark' ? ' settings__theme-btn--active' : ''}`}
                    onClick={() => onThemeChange('dark')}
                    aria-pressed={theme === 'dark'}
                  >
                    <MoonIcon />
                    Dark
                  </button>
                </div>
              )}

              {/* Hardcore setting */}
              {id === 'hardcore' && (
                <button
                  className={`settings__toggle${hardcore ? ' settings__toggle--on-hardcore' : ''}`}
                  onClick={() => onHardcoreChange(!hardcore)}
                  role="switch"
                  aria-checked={hardcore}
                  aria-label="Toggle hardcore mode"
                >
                  <span className="settings__toggle-thumb" />
                </button>
              )}

              {/* Autofill suggestions setting */}
              {id === 'autofill' && (
                <button
                  className={`settings__toggle${autofill ? ' settings__toggle--on-autofill' : ''}`}
                  onClick={() => onAutofillChange(!autofill)}
                  role="switch"
                  aria-checked={autofill}
                  aria-label="Toggle autofill suggestions"
                >
                  <span className="settings__toggle-thumb" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Reset section, which includes its own button and is seperate from the previous settings */}
        <div className="settings__reset-section">
          {!confirming ? (
            <button
              className="settings__reset-btn"
              onClick={() => setConfirming(true)}
            >
              Reset 
            </button>
          ) : (

            <div className="settings__confirm-panel">
              <div className="settings__confirm-header">
                <WarnIcon />
                <span>Are you sure you want to proceed?</span>
              </div>

              {/* Providing additional context for what happens if the user chooses to reset through a confirmation message */}
              <p className="settings__confirm-body">
                Your scores, streaks, and game history will be permanently deleted.
                The daily puzzle will also be reset, allowing you to play it again.
              </p>
              <div className="settings__confirm-actions">
                <button
                  className="settings__confirm-cancel"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
                <button
                  className="settings__confirm-ok"
                  onClick={handleReset}
                >
                  Yes, reset everything
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SettingsModal;
