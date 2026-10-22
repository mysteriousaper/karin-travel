// Font pairings the agency can choose from (Admin → Site settings, or the
// live "Aa" picker while reviewing). Each pairing sets a body font and an
// accent font for the gold italic words; both cover Latin and Cyrillic.
// Only Google Sans also draws Armenian itself; the others hand Armenian
// letters to Noto Sans / Noto Serif Armenian. The CSS lives in globals.css
// under html[data-font="…"].

export const FONT_PAIRINGS = [
  {
    id: 'dusk',
    name: 'Dusk (approved design)',
    body: 'Manrope',
    accent: 'Cormorant Garamond Italic',
    armenian: 'Noto Sans Armenian',
    note: 'The fonts from the approved design: clean, airy, with a classic serif accent.',
  },
  {
    id: 'google-sans',
    name: 'Google Sans',
    body: 'Google Sans',
    accent: 'Google Sans Italic',
    armenian: 'Google Sans (native Armenian)',
    note: 'One family draws all three alphabets, so Armenian, Russian and English look exactly alike.',
  },
  {
    id: 'noto',
    name: 'Noto Harmony',
    body: 'Noto Sans',
    accent: 'Noto Serif Italic',
    armenian: 'Noto Sans Armenian',
    note: 'One design system for every script: the most even look between HY, RU and EN.',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    body: 'Inter',
    accent: 'Playfair Display Italic',
    armenian: 'Noto Sans Armenian',
    note: 'Magazine feel: neutral text, high-contrast serif for the accent words.',
  },
  {
    id: 'bold',
    name: 'Bold Modern',
    body: 'Montserrat',
    accent: 'Lora Italic',
    armenian: 'Noto Sans Armenian',
    note: 'Wider, more confident letters; warmer bookish accent.',
  },
  {
    id: 'soft',
    name: 'Soft Grotesk',
    body: 'Golos Text',
    accent: 'Literata Italic',
    armenian: 'Noto Sans Armenian',
    note: 'Friendly and very readable on phones, designed with Cyrillic first.',
  },
] as const;

export type FontPairingId = (typeof FONT_PAIRINGS)[number]['id'];
export const DEFAULT_FONT: FontPairingId = 'dusk';

export function isFontPairing(v: string | null | undefined): v is FontPairingId {
  return FONT_PAIRINGS.some((p) => p.id === v);
}
