// OVERVIEW: Renders the "About" page on the site. This provides information on the Nationle backstory and more information on me
// Toggled from App.js, and acts as a personal page with a biography, photos, sticky notes, and customized designs

import React from 'react';
import { MapPin } from './icons';

import photo1 from '../photos/AboutMeOne.jpeg';
import photo2 from '../photos/AboutMeTwo.jpeg';

// Email Icon, which is used in the contact-links section
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

// GitHub Icon, which is used in the contact-links section
const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

// Linkedln Icon, which is used in the contact-links section
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// Google Froms Icon, which is used in the contact-links section
const FormIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 2h6l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
    <polyline points="9,11 12,14 16,9"/>
  </svg>
);

const TICK_COUNT = 6;

// Function that create a reusable photo frame that appears around the two images on the righthand side of the screen
function GeoPhotoFrame({ label, coords, photoSrc, note, noteWide }) {
  const ticks = Array.from({ length: TICK_COUNT });

  return (
    <div className="about__photo-slot">

      {/* Floating waypoint above the image */}
      <div className="about__waypoint">
        <div className="about__waypoint-pin">
          <MapPin size={18} />
        </div>
        <span className="about__waypoint-label">{label}</span>
      </div>

      {/* Photo and its surronding frame  */}
      <div className="about__photo-frame">

        {/* Corner crosshairs, lines, and tick marks  */}
        <svg className="about__frame-svg" viewBox="0 0 100 100"
             preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">

          {/* Cross signs located on the four corners of the squares */}
          {[[2,2],[98,2],[2,98],[98,98]].map(([x,y], i) => (
            <g key={i} stroke="#ffffff" strokeWidth="0.4" opacity="0.70">
              <line x1={x-3} y1={y} x2={x+3} y2={y}/>
              <line x1={x} y1={y-3} x2={x} y2={y+3}/>
            </g>
          ))}

          {/* Ticks marks on the top and bottom of photo */}
          {ticks.map((_, i) => {
            const x = 10 + (i * 80 / (TICK_COUNT - 1));
            return (
              <g key={i} stroke="#ffffff" strokeWidth="0.4" opacity="0.70">
                <line x1={x} y1={0} x2={x} y2={2.5}/>
                <line x1={x} y1={97.5} x2={x} y2={100}/>
              </g>
            );
          })}

          {/* Tick marks on the left and right of photo */}
          {ticks.map((_, i) => {
            const y = 10 + (i * 80 / (TICK_COUNT - 1));
            return (
              <g key={i} stroke="#ffffff" strokeWidth="0.4" opacity="0.70">
                <line x1={0} y1={y} x2={2.5} y2={y}/>
                <line x1={97.5} y1={y} x2={100} y2={y}/>
              </g>
            );
          })}
        </svg>
        
        {/* Inside photo itself - includes a placeholder incase the photo cannot be rendered properly from source / src */}
        <div className="about__photo-inner">
          {photoSrc
            ? <img src={photoSrc} alt={label} className="about__photo-img" />
            : (
              <div className="about__photo-placeholder">
                <MapPin size={28} />
                <span>Photo coming soon</span>
              </div>
            )
          }
        </div>

        {/* Sticky note, which appears in the left corner of both photos */}
        {note && (
          <div className={`about__sticky-note${noteWide ? ' about__sticky-note--wide' : ''}`}>
            {note}
          </div>
        )}
      </div>

      {/* Coordinates badge - accurate to real life - below each image */}
      <div className="about__photo-coords">
        <span>{coords}</span>
      </div>

    </div>
  );
}

// The About page itself, including a biograpphy section, contact links, and a return to game button
function AboutPage({ onReturnToGame }) {
  return (
    <div className="about">
      <div className="about__inner">

        {/* Headers and text on the left column */}
        <div className="about__text-col">

          {/* ABOUT ME */}
          <div className="about__section">
            <h2 className="about__section-title">| About Me</h2>
            <p className="about__section-body">
              Hey, I'm Hadeed. I am currently studying <strong> Computer Science </strong> at the
              <strong> University of Toronto Mississauga</strong>. I've been interested in geography and the nations of the
              world since I was a child. I used to binge watch <strong>Geography Now</strong> and speedrun naming all the countries in
              the world off a blank map as entertainment.
            </p>
            <p className="about__section-body-two">
            Fun Fact: My current record is 5:23 to name all 196 recognized nations!
            </p>
          </div>

          {/* THE INSPIRATION */}
          <div className="about__section">
            <h2 className="about__section-title">| The Inspiration</h2>
            <p className="about__section-body">
              During the summer, I needed another idea for a project to work on so I could stop doomscrolling.
              I enjoyed playing games such as Wordle and Globle, which made me 
              think <strong> "Why not create my own version, but with a twist?"</strong>. I wanted to make a game
              that would challenge even the smartest of geography experts; an experience that
              rewarded knowledge over lucky guesses. <strong>Nationle was born.</strong>
            </p>
          </div>

          {/* BUILDING NATIONLE */}
          <div className="about__section">
            <h2 className="about__section-title">| Building Nationle</h2>
            <p className="about__section-body">
              Nationle was built using <strong> React, HTML, CSS, and Javascript</strong>. Hint generation
              and puzzle formation were supported by <strong>Claude</strong>, which used a heavily refined prompt
               to create over <strong>1200 hints</strong>, which I spent <strong>15+</strong> hours cleaning up manually. Hosting was
               done using both <strong>Render and Vercel</strong>. The total development time, from initial brainstorming to launch, was roughly <strong> two months</strong>. 
               The project files and code can be found on the associated <strong>GitHub repository</strong>.
            </p>
          </div>

          {/* GET IN TOUCH */}
          <div className="about__section">
            <h2 className="about__section-title">| Get in Touch</h2>
            <p className="about__section-body">
              If you have any questions, suggestions, or just want to chat, you can always reach out to me on my socials!
            </p>
            <p className="about__section-body">
              For specific feedback and comments related to Nationle, feel free to use the official <strong>Google Form</strong> below! This is the easiest way to voice any concerns you have.
            </p>

            {/* CONTACT LINKS AND EXTERNAL MATERIALS */}
            <div className="about__contact-links">

              {/* Linkedln */}
              <a
                href="https://www.linkedin.com/in/hadeed-ali/"
                className="about__contact-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
                LinkedIn
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Hadeed-Ali"
                className="about__contact-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
                GitHub
              </a>

              {/* Personal email */}
              <a
                href="mailto:hadeedali647@gmail.com"
                className="about__contact-btn"
              >
                <EmailIcon />
                hadeedali647@gmail.com
              </a>

              {/* Google Forms */}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScswfYgUhvOaDAMc62-z75ua7AlRPUSlkGSwX_ZA0UBGbf7Ug/viewform?usp=sharing&ouid=113737790528996458717"
                className="about__contact-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormIcon />
                Nationle | Google Form
              </a>
            </div>
          </div>

        {/* Return to game button */}
          <button className="about__return-btn" onClick={onReturnToGame}>
            Return to Game
          </button>

        </div>

        {/* Applies the previously designed GeoPhotoFrame to create two photos on right side using photos located in directory */}
        <div className="about__photo-col">
          <GeoPhotoFrame
            label="Canada's Wonderland Trip"
            coords="43.8424° N, 79.5412° W"
            photoSrc={photo1}
            note="Can we finally admit that the Behemoth is way better than the Leviathan?"
          />
          <GeoPhotoFrame
            label="Presenting at Deerhacks"
            coords="43.5483 N, 79.6626° W"
            photoSrc={photo2}
            note="Deerhacks V was my first ever hackathon - my team and I finished third overall!"
            noteWide
          />
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
