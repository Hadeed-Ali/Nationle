import React, { useState } from 'react';
import logo from '../photos/NationleLogo.png';

// Creating the various strings / blurbs that appear under the name of the game as a daily message
// Focused on creating messags that are 1-2 sentences, easy to read, catchy, and reference a game feature if possible
const BLURBS = [
  "196 countries across the world, and just one to find today.",
  "Inspired by Wordle, yet forging a path of its own. Welcome to Nationle!",
  "The perfect score of 100 is achieved only by legends. Can you be next?",
  "From languages to capitals, the hints are your guiding light. Good luck.",
  "It is you against the nations of the world. Do you have what it takes?",
  "Some say this game is too challenging. Can you prove them wrong?",
  "Each guess and hint slowly drain you score. Don't lose your head!",
  "We highly discourage cheating, unless it is a random pacific island nation."
];

function IntroScreen({ puzzleNumber, onPlay }) {
  const [leaving, setLeaving] = useState(false);

  // Formats the current date with respect to New York in the United States for proper Eastern Standard Time (EST) dating
  // Formats the date as a string, which is then formatted
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });

  // Picks out a blurb such that they are cycled through as opposed to complete randomness
  // Allows for each puzzle to be associated with its own blurb, which will not change even upon refresh
  const blurb = BLURBS[(puzzleNumber - 1) % BLURBS.length];

  // Sets a slight, but noticable 350ms delay so that the fading and sliding animations can play out
  const handlePlay = () => {
    setLeaving(true);
    setTimeout(onPlay, 350);
  };

  return (

    <div className={`intro${leaving ? ' intro--leaving' : ''}`} aria-modal="true" role="dialog" aria-label="Welcome to Nationle">
      <div className="intro__content">
        <div className="intro__logo-wrap">
          <img className="intro__logo" src={logo} alt="Nationle globe logo" />
        </div>

        {/* The title of the game - Nationle - formatted as a header object */}
        <h1 className="intro__title">Nationle</h1>

        {/* Divider between the title and blurb, which consists of a dot and two lines with a slightly lowered opacity */}
        <div className="intro__divider" aria-hidden="true">
          <span className="intro__divider-line" />
          <span className="intro__divider-dot" />
          <span className="intro__divider-line" />
        </div>

        {/* Displays the chosen blurb under the title*/}
        <p className="intro__blurb">{blurb}</p>

        {/* Button which redirects the user to the main page / game board of the site */}
        <button className="intro__play-btn" onClick={handlePlay} autoFocus>
          Play
          <svg className="intro__play-arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </button>

        {/* Bottom section - puzzle number, creator, and a footnote that the game is best played on a computer/desktop */}
        <div className="intro__meta">
          <span className="intro__meta-date">{today}</span>
          <span className="intro__meta-puzzle">Puzzle #{puzzleNumber}</span>
          <span className="intro__meta-creator">Crafted by Hadeed Ali</span>
        </div>

        <p className="intro__note">Best experienced on a computer!</p>
      </div>
    </div>
  );
}

export default IntroScreen;
