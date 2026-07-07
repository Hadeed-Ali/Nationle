// OVERVIEW: Creates a popup displaying a series of tailored tricks and tips for succeeding in Nationle
// Secondary and nested modal - it can only be acccesed from within the larger HowToPlay Modal
// Clicking the bottomb button in the HowToPlay Modal will lead here

import React from 'react';
import { MapPin } from './icons';

// Creating the JSX fragments for the tips, which include bolding using <strong> to place emphasis on certain ideas
// Tips are arranged in chronological order, and each focus on a different aspect of the Nationle experience
const TIPS = [
  <><strong>Work backwards</strong> - Create a mental list of countries that fit the first hints, and slowly shrink it down after each revealed hint.</>,
  <><strong>Avoid guessing early</strong> - You want to preserve points, and guessing can drain your total fast. Save guesses for later.</>,
  <><strong>Focus on geographic hints</strong> - These hints are the strongest for narrowing down the answer, so use them carefully.</>,
  <><strong>Don't reveal hints too easily</strong> - The hints get stronger as the game goes on. By hint 5, you likely have enough information to make a strong guess. Take your time!</>,
  <><strong>HAVE FUN!</strong> Show off your geography expertise and earn all nine badgess!</>,
];


// The TipsModal itself, creating a series of tips arranged into number rows with a stagger animation prior to display
function TipsModal({ onClose }) {

  return (

    <div className="modal-overlay modal-overlay--elevated" onClick={onClose}>
      <div className="modal modal--tips" onClick={(e) => e.stopPropagation()}>

        {/* Header, following the same format as other modals - title, lines/rulers, and closing button/pin */}
        <div className="modal__header">
          <div className="modal__title-row">
            <hr className="modal__rule" />
            <span className="modal__title">Tips &amp; Tricks</span>
            <hr className="modal__rule" />
          </div>
          <button className="modal__close-btn" onClick={onClose} aria-label="Close"><MapPin /></button>
        </div>

        {/* Tips - each tip contains its number, text, and a scaled animation delay depending on its order in the sequence */}
        <div className="tips__items">
          {TIPS.map((tip, i) => (
            <div
              key={i}
              className="tips__item"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <span className="tips__item-num">{i + 1}</span>
              <span className="tips__item-text">{tip}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default TipsModal;
