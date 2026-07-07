// OVERVIEW: This short file contains the MapPin, which is used by most modals and other components as a close/exit icon
// This pin is contained in its own seperate file so other components can easily import it from its file and use as required
// File is closely linked to all components - each file imports the pin from icons.js
// Pin is imported using: import { MapPin } from './icons'; - can be found near the start of many relevant files


import React from 'react';

// Creaing the pin itself as a vector graphic
export const MapPin = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>
);
