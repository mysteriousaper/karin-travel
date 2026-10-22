import type { Config } from 'tailwindcss';

// Tokens come straight from the approved "Dusk" design (BRIEF.md §4).
// The design is desktop-first, so breakpoints are max-width queries:
//   tab  → ≤ 960px (tablet + phone)
//   ph   → ≤ 700px (phone)
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      wide: { raw: '(min-width: 1181px)' },
      mid: { raw: '(max-width: 1180px)' },
      tab: { raw: '(max-width: 960px)' },
      ph: { raw: '(max-width: 700px)' },
    },
    extend: {
      colors: {
        ink: '#0F0F0E',
        cream: '#F2EEE7',
        panel: '#1A1918',
        card: '#252321',
        'line-dark': '#34312D',
        'line-dark-2': '#3A3733',
        'line-foot': '#2C2A27',
        line: '#D7D0C4',
        'line-2': '#CFC7B9',
        tab: '#E5DFD4',
        muted: '#857D70',
        'body-muted': '#5F584E',
        'foot-muted': '#A8A196',
        'hero-muted': '#E4DDD2',
        plus: '#B2A998',
        gold: '#F6D7A8',
        amber: '#E8A33D',
        whatsapp: '#25D366',
        'whatsapp-ink': '#0B1F12',
      },
      fontFamily: {
        // Set per font pairing in globals.css (html[data-font="…"]).
        sans: ['var(--font-body)'],
        serif: ['var(--font-accent)'],
      },
      maxWidth: { page: '1400px' },
      borderRadius: { panel: '30px', card: '22px' },
      transitionTimingFunction: { calm: 'cubic-bezier(.2,.7,.2,1)' },
    },
  },
  plugins: [],
};

export default config;
