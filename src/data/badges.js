// Importing the .png images for each of the nine badges within the game, which are stored in the badges folder in src
import betaPlayerImg      from '../badges/Nationle Beta Player icon.png';
import firstGameImg       from '../badges/Nationle First Game icon.png';
import enjoyerImg         from '../badges/Nationle Enjoyer Badge.png';
import specialistImg      from '../badges/Nationle Specialist Badge.png';
import masterImg          from '../badges/National Master Badge.png';
import sharpshooterImg    from '../badges/Sharpshooter Badge.png';
import noHintsImg         from '../badges/Help Not Wanted Badge.png';
import mysteryImg         from '../badges/Mystery Badge.png';
import creatorApprovalImg from '../badges/Nationle Creator approval icon.png';

// Constant reference, which includes information for all nine badges within the game for easy referencing and utilization
// Badge information includes an id, the official name, the description seen under the badge, and its associated image file
const BADGES = [
  {
    id: 'firstGame',
    name: 'First Game',
    desc: 'Complete your first daily puzzle',
    img: firstGameImg,
  },
  {
    id: 'betaPlayer',
    name: 'Beta Player',
    desc: 'Complete a puzzle during the initial launch of the game',
    img: betaPlayerImg,
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    desc: 'Earn 100 point, the maximum score, on a daily puzzle',
    img: sharpshooterImg,
  },
  {
    id: 'enjoyer',
    name: 'Nationle Enjoyer',
    desc: 'Complete 5 daily puzzles',
    img: enjoyerImg,
  },
  {
    id: 'specialist',
    name: 'Nationle Specialist',
    desc: 'Complete 10 daily puzzles',
    img: specialistImg,
  },
  {
    id: 'master',
    name: 'Nationle Master',
    desc: 'Complete 20 daily puzzles',
    img: masterImg,
  },
  {
    id: 'noHints',
    name: 'Help Not Wanted',
    desc: 'Complete a daily puzzle without revealing any hints',
    img: noHintsImg,
  },
  {
    id: 'tenGuesses',
    name: '???',
    desc: '???',
    mystery: true,
    revealedDesc: 'Make at least 10 guesses on a single puzzle',
    img: mysteryImg,
  },
  {
    id: 'creatorApproval',
    name: '???',
    desc: '???',
    mystery: true,
    revealedDesc: "Complete a puzzle for the creator's nations of Canada or Pakistan",
    img: creatorApprovalImg,
  },
];

export default BADGES;
