// OVERVIEW: Creates the instructional popup that provides the user with the rules on how to play the game
// This popup is only accesible from the header, and also is the only way to access the tips and tricks popup

import React, { useState } from 'react';
import TipsModal from './TipsModal';
import { MapPin } from './icons';

// An array of strings that are used to display the rules of the game, as in the order they appear within the popup
const RULES = [
  'Every day, a <strong>random country</strong> is chosen, and your goal is to figure out what it is!',
  'You start with <strong>100 points</strong>, with the lowest score possible being <strong>10 points</strong>.',
  'You may reveal up to <strong>6 hints</strong>, each of which subtract <strong>10 points</strong> and reveal more info.',
  'Every guess made, unless correct, also subtracts <strong>10 points</strong> from your score.',
  'Find the mystery country with as many points remaining as possible!',
];

function HowToPlayModal({ onClose }) {
  const [showTips, setShowTips] = useState(false);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal modal--htp" onClick={(e) => e.stopPropagation()}>

          {/* The header, which includes the title and close buttons as seen in various other popups */}
          <div className="modal__header">
            <div className="modal__title-row">
              <hr className="modal__rule" />
              <span className="modal__title">&nbsp;How To Play</span>
              <hr className="modal__rule" />
            </div>
            <button className="modal__close-btn" onClick={onClose} aria-label="Close"><MapPin /></button>
          </div>

          {/* Subtitle, which reveals the purpose of the popup */}
          <p className="htp__subtitle">Guess the Country!</p>

          {/* The rules, each of which appear in a pre-defined and staggered animation sequence, including clear numbering */}
          <div className="htp__rules">
            {RULES.map((rule, i) => (
              <div
                key={i}
                className="htp__rule"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <span className="htp__rule-num">{i + 1}</span>
                <span
                  className="htp__rule-text"
                  dangerouslySetInnerHTML={{ __html: rule }}
                />
              </div>
            ))}
          </div>

          {/* Two additional notes that detail when the game refreshes and which countries are included, as per the United Nations definition */}
          <p className="modal__refresh-note">&nbsp;Refreshes at midnight (EST) every day.</p>
          <p className="modal__refresh-note">&nbsp;Countries include all members recognized by the United Nations and some partially recognized states.</p>

          {/* The footer, which contains a button that leads to the tips and tricks popup*/}
          <div className="modal__footer">
            <button
              className="modal__secondary-btn"
              onClick={() => setShowTips(true)}
            >
              Tips and Tricks&nbsp;→
            </button>
          </div>

        </div>
      </div>

      {showTips && <TipsModal onClose={() => setShowTips(false)} />}
    </>
  );
}

export default HowToPlayModal;
