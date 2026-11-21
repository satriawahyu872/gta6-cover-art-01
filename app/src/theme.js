// Midnight Boulevard — looks, sizes and the default cast.
// Every colour and label below is this entry's own design.

const LOOKS = {
  midnight: {
    name: 'Midnight Noir',
    bg: '#0b0e1a',
    bandTop: '#141a3d',
    bandBottom: '#241145',
    tint: 'rgba(24, 32, 96, 0.30)',
    tintMode: 'overlay',
    accent: '#ff2d78',
    accent2: '#22d3ee',
    chip: 'rgba(8, 10, 26, 0.88)',
  },
  crimson: {
    name: 'Crimson Rush',
    bg: '#170a0e',
    bandTop: '#42101f',
    bandBottom: '#7d1230',
    tint: 'rgba(150, 22, 42, 0.28)',
    tintMode: 'overlay',
    accent: '#ff453a',
    accent2: '#ffb347',
    chip: 'rgba(26, 8, 12, 0.88)',
  },
  electric: {
    name: 'Electric Dawn',
    bg: '#08131f',
    bandTop: '#0e2f4d',
    bandBottom: '#14486b',
    tint: 'rgba(18, 96, 168, 0.28)',
    tintMode: 'overlay',
    accent: '#00e5ff',
    accent2: '#ff9f1c',
    chip: 'rgba(6, 16, 28, 0.88)',
  },
  silver: {
    name: 'Silver Screen',
    bg: '#101010',
    bandTop: '#2a2a2a',
    bandBottom: '#4d4d4d',
    tint: 'rgba(130, 130, 130, 0.24)',
    tintMode: 'overlay',
    accent: '#f2f2f2',
    accent2: '#a8a8a8',
    chip: 'rgba(12, 12, 12, 0.88)',
  },
};

const SIZES = {
  portrait: { w: 1080, h: 1350, label: 'Portrait 1080×1350' },
  square: { w: 1080, h: 1080, label: 'Square 1080×1080' },
  wide: { w: 1920, h: 1080, label: 'Wide 1920×1080' },
};

// The seven panels of the poster: one hero and a six-panel crew grid.
const CAST = [
  { id: 'hero', role: 'THE LEAD', cap: 'Runs the boulevard', photo: 'lead.jpg', zoom: 1.0, fx: 0.5, fy: 0.42 },
  { id: 'p1', role: 'THE DRIVER', cap: 'Never misses a turn', photo: 'driver.jpg', zoom: 1.05, fx: 0.5, fy: 0.38 },
  { id: 'p2', role: 'THE HACKER', cap: 'Owns every camera', photo: 'hacker.jpg', zoom: 1.0, fx: 0.5, fy: 0.45 },
  { id: 'p3', role: 'THE ROOKIE', cap: 'In over his head', photo: 'rookie.jpg', zoom: 1.05, fx: 0.5, fy: 0.4 },
  { id: 'p4', role: 'THE FIXER', cap: 'Cleans up messes', photo: 'street.jpg', zoom: 1.15, fx: 0.5, fy: 0.6 },
  { id: 'p5', role: 'THE LOOKOUT', cap: 'Sees it all first', photo: 'hacker.jpg', zoom: 1.45, fx: 0.62, fy: 0.35 },
  { id: 'p6', role: 'THE INSIDER', cap: 'Knows the vault code', photo: 'driver.jpg', zoom: 1.3, fx: 0.35, fy: 0.5 },
];

// The credits line printed under the quote ribbon.
const CREDITS = 'STARRING THE LEAD  ·  THE DRIVER  ·  THE HACKER  ·  THE ROOKIE  ·  THE FIXER  ·  THE LOOKOUT  ·  THE INSIDER';

function lookNames() {
  return Object.entries(LOOKS).map(([key, look]) => ({ key, name: look.name }));
}

function defaultState() {
  return {
    look: 'midnight',
    size: 'portrait',
    title: 'MIDNIGHT BOULEVARD',
    tagline: 'ONE CITY. SEVEN LIVES. NO WAY OUT.',
    quote: 'Every street has a price.',
    credits: CREDITS,
    panels: CAST.map((c) => ({ ...c, dataUrl: null })),
  };
}
