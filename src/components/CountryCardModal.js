// OVERVIEW: Creates a popup that displays the daily nation, its official name, and a link to its Wikipedia page
// Follows the stats page in the closing sequence and comes before the badges popup 
// Provides information on the nation for additional research, should the user be interested

import React from 'react';
import { MapPin } from './icons';

// Builds a flag using flagcdn.com - flag searching is done using the country's cca2 code, whcih is defined in countries.json
// Depedns on an external service, which is not associated with the project itself
function CountryCardModal({ onClose, countryName, cca2 }) {
  const flagSrc = cca2
    ? `https://flagcdn.com/${cca2.toLowerCase()}.svg`
    : null;

// Creates a Wikipedia URL, leveraging the wikipedia link formatting to include the country name at the end for proper sourcing
// Assumes that the country name matches the wikipedia article directly - fine in most cases
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(countryName)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--country-card" onClick={e => e.stopPropagation()}>

        {/* Header, following the same pattern as other modals - title, closing pin button, line/ruler patterns */}
        <div className="modal__header">
          <div className="modal__title-row">
            <hr className="modal__rule" />
            <span className="modal__title">&nbsp;Today's Country</span>
            <hr className="modal__rule" />
          </div>
          <button className="modal__close-btn" onClick={onClose} aria-label="Close">
            <MapPin />
          </button>
        </div>

        {/* Body, which includes the flag of the nation as sourced earlier and the name of the country */}
        <div className="country-card__body">
          {flagSrc && (
            <img
              className="country-card__flag"
              src={flagSrc}
              alt={`Flag of ${countryName}`}
            />
          )}
          <h2 className="country-card__name">{countryName}</h2>

          {/* Button which redirects the user to the Wikipedia page of the daily nation */}
          <a
            className="country-card__wiki-btn"
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More On Wikipedia ↗
          </a>
        </div>

      </div>
    </div>
  );
}

export default CountryCardModal;
