// OVERVIEW: This file acts as the root and "composer" for the entire app, holding the top-lkevel state and wiring together all major modals/groups
// Renders the decorative backgrounds, side decorations, and all other major shell components
// Almost all other files and portions of the project are imported here, making this file integral - edits should be thoroughly checked over

import React, { useState } from 'react';
import './App.css';
import { ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import AboutPage from './components/AboutPage';
import StatsModal from './components/StatsModal';
import HowToPlayModal from './components/HowToPlayModal';
import SettingsModal from './components/SettingsModal';
import CountryCardModal from './components/CountryCardModal';
import BadgesModal from './components/BadgesModal';
import BadgeEarnedPopup from './components/BadgeEarnedPopup';
import IntroScreen from './components/IntroScreen';
import { recordGame, getPuzzleNumber } from './utils/stats';

// Importing all the countries in the game and their relevant info (name, official name, cca2, region, subregion, UN status, aliases)
import countries from './data/countries.json';

const PUZZLE_NUMBER = getPuzzleNumber() + 1;

// Creating the lefthand SVG map art seen on the main page (longitude/latitude line coordinates, compass, e.t.c)
function DecoLeft() {
  return (
    <div className="app__deco app__deco--left" aria-hidden="true">
      <svg viewBox="0 0 200 900" preserveAspectRatio="xMidYMid slice"
           xmlns="http://www.w3.org/2000/svg" className="app__deco-svg">
        <defs>
          <radialGradient id="glow-l" cx="60%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#538d4e" stopOpacity="0.13"/>
            <stop offset="100%" stopColor="#538d4e" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Soft radial glow */}
        <ellipse cx="130" cy="300" rx="100" ry="140" fill="url(#glow-l)" />

        {/* Longitude arcs */}
        <g stroke="#538d4e" fill="none" opacity="0.18">
          <path d="M 170 0 Q 20 450 170 900" strokeWidth="0.8"/>
          <path d="M 145 0 Q -2 450 145 900" strokeWidth="0.6"/>
          <path d="M 118 0 Q -22 450 118 900" strokeWidth="0.4"/>
          <path d="M 92  0 Q -40 450 92  900" strokeWidth="0.3"/>
          <path d="M 200 0 Q 56 450 200 900" strokeWidth="0.35"/>
        </g>

        {/* Latitude lines */}
        <g stroke="#538d4e" fill="none" opacity="0.15" strokeWidth="0.45">
          {[120, 240, 360, 480, 600, 720].map(y => (
            <line key={y} x1="-10" y1={y} x2="210" y2={y}/>
          ))}
        </g>

        {/* Coordinate labels */}
        <g fontFamily="monospace" fontSize="7" fill="#538d4e" opacity="0.45">
          <text x="12" y="116">60°N</text>
          <text x="12" y="236">30°N</text>
          <text x="12" y="356">0°</text>
          <text x="12" y="476">30°S</text>
          <text x="12" y="596">60°S</text>
        </g>

        {/* Continent blob —-> Africa/Europe silhouette */}
        <g fill="#538d4e" stroke="#538d4e" strokeWidth="0.5">
          <path d="M155 195 Q172 215 168 258 Q162 302 146 324 Q130 340 118 320
                   Q106 300 112 268 Q107 242 122 226 Q138 208 155 195 Z"
                fillOpacity="0.07" strokeOpacity="0.2"/>
          <path d="M126 324 Q142 332 138 364 Q133 394 118 400 Q108 402 106 378
                   Q103 354 114 340 Q120 330 126 324 Z"
                fillOpacity="0.06" strokeOpacity="0.15"/>
        </g>

        {/* City-marker dots */}
        <g fill="#538d4e">
          <circle cx="153" cy="243" r="2.5" opacity="0.55"/>
          <circle cx="126" cy="336" r="1.8" opacity="0.45"/>
          <circle cx="116" cy="374" r="2.2" opacity="0.5"/>
          <circle cx="88"  cy="192" r="1.5" opacity="0.35"/>
          <circle cx="52"  cy="424" r="1.5" opacity="0.3"/>
          <circle cx="165" cy="155" r="1.5" opacity="0.3"/>
          {/* Tiny connection lines between some dots */}
          <line x1="153" y1="243" x2="126" y2="336" stroke="#538d4e" strokeWidth="0.4"
                strokeOpacity="0.2" strokeDasharray="3,4" fill="none"/>
          <line x1="126" y1="336" x2="116" y2="374" stroke="#538d4e" strokeWidth="0.4"
                strokeOpacity="0.2" strokeDasharray="3,4" fill="none"/>
        </g>

        {/* Compass rose */}
        <g transform="translate(58, 745)" fill="#538d4e" stroke="#538d4e" opacity="0.42">
          {/* 8 compass points */}
          <polygon points="0,-24 -5,-9 0,-13 5,-9"/>
          <polygon points="0,24 -5,9 0,13 5,9" opacity="0.55"/>
          <polygon points="24,0 9,-5 13,0 9,5" opacity="0.55"/>
          <polygon points="-24,0 -9,-5 -13,0 -9,5" opacity="0.55"/>
          <polygon points="15,-15 5,-9 9,-5" opacity="0.3"/>
          <polygon points="15,15 9,5 5,9"   opacity="0.3"/>
          <polygon points="-15,15 -5,9 -9,5" opacity="0.3"/>
          <polygon points="-15,-15 -9,-5 -5,-9" opacity="0.3"/>
          {/* Rings */}
          <circle r="3.5" strokeWidth="0" />
          <circle r="7"   fill="none" strokeWidth="0.9"/>
          <circle r="17"  fill="none" strokeWidth="0.5" strokeDasharray="2,3"/>
          {/* N label */}
          <text x="0" y="-30" textAnchor="middle" fontSize="8.5" fontWeight="bold"
                fontFamily="serif" fill="#538d4e">N</text>
        </g>
      </svg>
    </div>
  );
}

// Creating the righthand SVG map art seen on the main page (longitude/latitude line coordinates, compass, e.t.c)
function DecoRight() {
  return (
    <div className="app__deco app__deco--right" aria-hidden="true">
      <svg viewBox="0 0 200 900" preserveAspectRatio="xMidYMid slice"
           xmlns="http://www.w3.org/2000/svg" className="app__deco-svg">
        <defs>
          <radialGradient id="glow-r" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#538d4e" stopOpacity="0.11"/>
            <stop offset="100%" stopColor="#538d4e" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <ellipse cx="70" cy="300" rx="100" ry="140" fill="url(#glow-r)" />

        {/* Longitude arcs (mirrored) */}
        <g stroke="#538d4e" fill="none" opacity="0.18">
          <path d="M 30  0 Q 180 450 30  900" strokeWidth="0.8"/>
          <path d="M 55  0 Q 202 450 55  900" strokeWidth="0.6"/>
          <path d="M 82  0 Q 222 450 82  900" strokeWidth="0.4"/>
          <path d="M 108 0 Q 240 450 108 900" strokeWidth="0.3"/>
          <path d="M 0   0 Q 144 450 0   900" strokeWidth="0.35"/>
        </g>

        {/* Latitude lines */}
        <g stroke="#538d4e" fill="none" opacity="0.15" strokeWidth="0.45">
          {[120, 240, 360, 480, 600, 720].map(y => (
            <line key={y} x1="-10" y1={y} x2="210" y2={y}/>
          ))}
        </g>

        {/* Coordinate labels (right-aligned) */}
        <g fontFamily="monospace" fontSize="7" fill="#538d4e" opacity="0.45" textAnchor="end">
          <text x="188" y="116">60°N</text>
          <text x="188" y="236">30°N</text>
          <text x="188" y="356">0°</text>
          <text x="188" y="476">30°S</text>
          <text x="188" y="596">60°S</text>
        </g>

        {/* Americas-style continent silhouette */}
        <g fill="#538d4e" stroke="#538d4e" strokeWidth="0.5">
          <path d="M52 158 Q68 138 84 162 Q96 188 84 228 Q78 268 62 280
                   Q46 286 38 260 Q30 232 40 196 Q44 175 52 158 Z"
                fillOpacity="0.07" strokeOpacity="0.2"/>
          <path d="M57 284 Q73 273 78 304 Q81 336 68 372 Q57 397 44 392
                   Q31 384 33 356 Q31 326 41 305 Q48 288 57 284 Z"
                fillOpacity="0.06" strokeOpacity="0.15"/>
        </g>

        {/* City dots */}
        <g fill="#538d4e">
          <circle cx="74"  cy="194" r="2.5" opacity="0.55"/>
          <circle cx="62"  cy="254" r="1.8" opacity="0.45"/>
          <circle cx="57"  cy="328" r="2.2" opacity="0.5"/>
          <circle cx="120" cy="208" r="1.5" opacity="0.35"/>
          <circle cx="152" cy="442" r="1.5" opacity="0.3"/>
          <circle cx="35"  cy="148" r="1.5" opacity="0.3"/>
          <line x1="74" y1="194" x2="62" y2="254" stroke="#538d4e" strokeWidth="0.4"
                strokeOpacity="0.2" strokeDasharray="3,4" fill="none"/>
          <line x1="62" y1="254" x2="57" y2="328" stroke="#538d4e" strokeWidth="0.4"
                strokeOpacity="0.2" strokeDasharray="3,4" fill="none"/>
        </g>

        {/* Scale bar */}
        <g transform="translate(130, 748)" stroke="#538d4e" opacity="0.38" fill="#538d4e">
          <line x1="-32" y1="0" x2="32" y2="0" strokeWidth="1"/>
          <line x1="-32" y1="-4" x2="-32" y2="4" strokeWidth="1"/>
          <line x1="0"   y1="-3" x2="0"   y2="3" strokeWidth="0.7"/>
          <line x1="32"  y1="-4" x2="32"  y2="4" strokeWidth="1"/>
          <text x="0" y="-9" textAnchor="middle" fontSize="7" fontFamily="monospace">1000 km</text>
        </g>
      </svg>
    </div>
  );
}

// Creates the faint depiction of a flat world map seen in the background of the main game
// Utilizes react-simple-maps, which is sourced from public/countries-110m.json
function WorldMap() {
  return (
    <div className="world-map-backdrop" aria-hidden="true">
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{ scale: 153, center: [10, 5] }}
        className="world-map-svg"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="map-vignette" cx="50%" cy="50%" r="55%">
            <stop offset="40%" stopColor="transparent" stopOpacity="0"/>
            <stop offset="100%" stopColor="#121213" stopOpacity="0.7"/>
          </radialGradient>
        </defs>

        {/* Graticule grid lines */}
        <Graticule
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.5}
          step={[30, 30]}
        />

        {/* Country fills + borders */}
        <Geographies geography="/countries-110m.json">
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={0.45}
                style={{ outline: 'none' }}
              />
            ))
          }
        </Geographies>

        {/* Vignette overlay —> fades edges into background */}
        <rect x="-10%" y="-10%" width="120%" height="120%"
              fill="url(#map-vignette)" style={{ pointerEvents: 'none' }}/>
      </ComposableMap>
    </div>
  );
}

// Creates a spinning globle SVG effect in the central background to act as another piece of decoration
function GlobeBackdrop() {
  const CX = 260, CY = 270, R = 215;

  // Latitude rings: [y-fraction-of-R, opacity]
  const lats = [
    [-0.87, 0.038], [-0.5, 0.052], [0, 0.075], [0.5, 0.052], [0.87, 0.038],
  ];

  // Longitude meridians rx values (fraction of R) —-> shown as spinning ellipses
  const lonFracs = [0.29, 0.5, 0.71, 0.87, 1.0];

  return (
    <div className="globe-backdrop" aria-hidden="true">
      <svg viewBox="0 0 520 540" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Outer sphere circle */}
        <circle cx={CX} cy={CY} r={R} stroke="#538d4e" strokeWidth="0.8" opacity="0.07"/>

        {/* Latitude lines —-> static */}
        {lats.map(([yFrac, opac], i) => {
          const dy  = yFrac * R;
          const rx  = Math.sqrt(1 - yFrac * yFrac) * R;
          const ry  = rx * 0.28;
          return (
            <ellipse key={i} cx={CX} cy={CY + dy} rx={rx} ry={ry}
                     stroke="#538d4e" strokeWidth="0.5" opacity={opac}/>
          );
        })}

        {/* Tropic / polar dashed accent rings */}
        <circle cx={CX} cy={CY} r={R * 0.42}
                stroke="#538d4e" strokeWidth="0.35" strokeDasharray="3,9" opacity="0.04"/>
        <circle cx={CX} cy={CY} r={R * 0.77}
                stroke="#538d4e" strokeWidth="0.35" strokeDasharray="4,11" opacity="0.035"/>

        {/* Longitude meridians —-> spinning group */}
        <g className="globe-backdrop__spin"
           style={{ transformOrigin: `${CX}px ${CY}px` }}>

          {/* Prime meridian as a line */}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R}
                stroke="#538d4e" strokeWidth="0.5" opacity="0.055"/>
          {lonFracs.map((f, i) => (
            <ellipse key={i} cx={CX} cy={CY} rx={f * R} ry={R}
                     stroke="#538d4e" strokeWidth="0.45" opacity="0.05"/>
          ))}
        </g>
      </svg>
    </div>
  );
}

// The fundamental function which is the application of state + composition
function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [pendingCountryCard, setPendingCountryCard] = useState(null);
  const [countryCardData, setCountryCardData] = useState(null);
  const [currentPage, setCurrentPage] = useState('game');
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState([]);
  const [badgePopupIndex, setBadgePopupIndex] = useState(0);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState(

// Determining if certain game states are on, which are relevant for site design (hardcore mode, light mode, autofill, e.t.c)
    () => localStorage.getItem('nationle-theme') || 'dark'
  );
  const [hardcore, setHardcore] = useState(
    () => localStorage.getItem('nationle-hardcore') === 'true'
  );
  const [autofill, setAutofill] = useState(
    () => localStorage.getItem('nationle-autofill') !== 'false'
  );

  const openModal  = (name) => setActiveModal(name);
  const closeModal = ()     => setActiveModal(null);

// Handling a change in theme if the user swaps between light and dark mode
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('nationle-theme', newTheme);
  };

// Handling when the user toggles between having hardcode mode on or off
  const handleHardcoreChange = (val) => {
    setHardcore(val);
    localStorage.setItem('nationle-hardcore', val ? 'true' : 'false');
  };

// Handling when the user toggles between having autofill mode on or off
  const handleAutofillChange = (val) => {
    setAutofill(val);
    localStorage.setItem('nationle-autofill', val ? 'true' : 'false');
  };

// Handling when a badge alert / notificatiomn appears on screen, based on certain reqs
  const triggerBadgePopup = (badges) => {
    if (badges && badges.length > 0) {
      setBadgePopupIndex(0);
      setNewlyEarnedBadges(badges);
      setShowBadgePopup(true);
    }
  };

  const handleStatsClose = () => {
    if (pendingCountryCard) {
      setCountryCardData(pendingCountryCard);
      setPendingCountryCard(null);
      setActiveModal('countryCard');
    } else {
      setActiveModal(null);
      triggerBadgePopup(newlyEarnedBadges);
    }
  };

  const handleCountryCardClose = () => {
    setCountryCardData(null);
    setActiveModal(null);
    triggerBadgePopup(newlyEarnedBadges);
  };

  const handleBadgePopupNext = () => {
    setBadgePopupIndex(i => i + 1);
  };

  const handleBadgePopupViewBadges = () => {
    setShowBadgePopup(false);
    setNewlyEarnedBadges([]);
    openModal('badges');
  };

  const handleBadgePopupClose = () => {
    setShowBadgePopup(false);
    setNewlyEarnedBadges([]);
  };

  // Most important section --> handles the behaviour of the app when a game is completed
  // Key processes: Checks for new badges, gets the country data for the wikipedia card, gets the statistics on screen, e.t.c
  const handleGameEnd = (won, points, hintsUsed, guessCount, countryName) => {
    const { newBadges } = recordGame(won, points, PUZZLE_NUMBER, hintsUsed, guessCount, countryName);
    setLastResult({ won, points, hintsUsed, guessCount });
    if (newBadges.length > 0) setNewlyEarnedBadges(newBadges);
    const countryData = countries.find(c => c.name === countryName);
    setPendingCountryCard({ countryName, cca2: countryData?.cca2 ?? '' });
    setTimeout(() => setActiveModal('stats'), 1500);
  };

  const toggleAbout = () => setCurrentPage(p => p === 'about' ? 'game' : 'about');

  const handleLogoClick = () => {
    if (currentPage === 'about') {
      setCurrentPage('game');
    } else {
      setShowIntro(true);
    }
  };

// Returns all necessary components and visual aspects with their respective names and CSS configurations
  return (
    <div className="app" data-theme={theme}>
      <Header
        onStatsClick    ={() => openModal('stats')}
        onBadgesClick   ={() => openModal('badges')}
        onHelpClick     ={() => openModal('howToPlay')}
        onSettingsClick ={() => openModal('settings')}
        onAboutClick    ={toggleAbout}
        onLogoClick     ={handleLogoClick}
        currentPage     ={currentPage}
      />
      <WorldMap />
      <GlobeBackdrop />
      <DecoLeft />
      <DecoRight />

      {currentPage === 'about' ? (
        <AboutPage onReturnToGame={() => setCurrentPage('game')} />
      ) : (
        <main className="app__main">
          <div className="gameboard-frame">
            <span className="gameboard-frame__tl" aria-hidden="true"/>
            <span className="gameboard-frame__tr" aria-hidden="true"/>
            <span className="gameboard-frame__bl" aria-hidden="true"/>
            <span className="gameboard-frame__br" aria-hidden="true"/>
            <GameBoard onGameEnd={handleGameEnd} puzzleNumber={PUZZLE_NUMBER} hardcore={hardcore} autofill={autofill} />
          </div>
        </main>
      )}

      <footer className="app__footer">
        <span className="app__footer-left">
          © {new Date().getFullYear()} Nationle &nbsp;|&nbsp; Personal Project
        </span>
        <span className="app__footer-center">Version <span className="app__footer-version-num">1.0</span></span>
        <span className="app__footer-right">
          <span className="app__footer-madeby">Crafted by:</span>{' '}
          <a
            href="https://www.linkedin.com/in/hadeed-ali/"
            className="app__footer-name"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hadeed Ali
          </a>
        </span>
      </footer>

      {activeModal === 'stats'       && <StatsModal       onClose={handleStatsClose} lastResult={lastResult} />}
      {activeModal === 'badges'      && <BadgesModal      onClose={closeModal} />}
      {activeModal === 'howToPlay'  && <HowToPlayModal  onClose={closeModal} />}
      {activeModal === 'settings'   && <SettingsModal   onClose={closeModal} theme={theme} onThemeChange={handleThemeChange} hardcore={hardcore} onHardcoreChange={handleHardcoreChange} autofill={autofill} onAutofillChange={handleAutofillChange} />}
      {activeModal === 'countryCard' && countryCardData && (
        <CountryCardModal
          onClose={handleCountryCardClose}
          countryName={countryCardData.countryName}
          cca2={countryCardData.cca2}
        />
      )}

      {showBadgePopup && newlyEarnedBadges.length > 0 && (
        <BadgeEarnedPopup
          badgeIds={newlyEarnedBadges}
          currentIndex={badgePopupIndex}
          onNext={handleBadgePopupNext}
          onViewBadges={handleBadgePopupViewBadges}
          onClose={handleBadgePopupClose}
        />
      )}

      {showIntro && (
        <IntroScreen
          puzzleNumber={PUZZLE_NUMBER}
          onPlay={() => setShowIntro(false)}
        />
      )}
    </div>
  );
}

export default App;
