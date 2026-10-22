import {
  Cormorant_Garamond,
  Golos_Text,
  Inter,
  Literata,
  Lora,
  Manrope,
  Montserrat,
  Noto_Sans,
  Noto_Sans_Armenian,
  Noto_Serif,
  Noto_Serif_Armenian,
  Playfair_Display,
} from 'next/font/google';

// Every family the font pairings (src/lib/font-pairings.ts) can use. Nothing
// is preloaded: a browser only downloads the files of the pairing that is
// actually on screen, and only for the alphabets on the page (unicode-range).
// (next/font needs literal options, so `display`/`preload` repeat on each.)

const manrope = Manrope({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600', '700'], variable: '--f-manrope' });
const cormorant = Cormorant_Garamond({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['500'], style: ['italic'], variable: '--f-cormorant' });
const notoSans = Noto_Sans({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600', '700'], variable: '--f-noto-sans' });
const notoSerif = Noto_Serif({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['500'], style: ['italic'], variable: '--f-noto-serif' });
const inter = Inter({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600', '700'], variable: '--f-inter' });
const playfair = Playfair_Display({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['500'], style: ['italic'], variable: '--f-playfair' });
const montserrat = Montserrat({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['300', '400', '500', '600', '700'], variable: '--f-montserrat' });
const lora = Lora({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['500'], style: ['italic'], variable: '--f-lora' });
const golos = Golos_Text({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--f-golos' });
const literata = Literata({ display: 'swap', preload: false, subsets: ['latin', 'cyrillic'], weight: ['500'], style: ['italic'], variable: '--f-literata' });

// Manrope, Cormorant and most Latin/Cyrillic families have no Armenian
// letters; the browser falls back to these per character.
const notoArmenian = Noto_Sans_Armenian({ display: 'swap', preload: false, subsets: ['armenian'], weight: ['300', '400', '500', '600', '700'], variable: '--f-arm-sans' });
const notoSerifArmenian = Noto_Serif_Armenian({ display: 'swap', preload: false, subsets: ['armenian'], weight: ['500'], variable: '--f-arm-serif' });

export const fontVars = [
  manrope,
  cormorant,
  notoSans,
  notoSerif,
  inter,
  playfair,
  montserrat,
  lora,
  golos,
  literata,
  notoArmenian,
  notoSerifArmenian,
]
  .map((f) => f.variable)
  .join(' ');
