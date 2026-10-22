// Client-safe money helpers. Rates come from the Central Bank of Armenia
// (see rates.ts) as AMD per 1 unit of each currency.

export const CURRENCIES = ['AMD', 'USD', 'EUR', 'RUB'] as const;
export type Currency = (typeof CURRENCIES)[number];

export type Rates = {
  date: string; // YYYY-MM-DD, the CBA's rate date
  source: 'cba' | 'saved' | 'fallback';
  amd: Record<Currency, number>;
};

/** Converts between any two of AMD / USD / EUR / RUB through AMD. */
export function convert(amount: number, from: string, to: Currency, rates: Rates['amd']) {
  const fromRate = rates[from as Currency] ?? 1;
  return (amount * fromRate) / rates[to];
}

/** "From" prices look better rounded: ֏ to 1 000, ₽ to 100, $ / € to 10. */
export function roundPrice(value: number, currency: Currency) {
  const step = currency === 'AMD' ? 1000 : currency === 'RUB' ? 100 : 10;
  return Math.round(value / step) * step;
}

const SYMBOL: Record<Currency, string> = { AMD: '֏', USD: '$', EUR: '€', RUB: '₽' };
export const currencySymbol = (c: Currency) => SYMBOL[c];

/**
 * Number formatting done by hand: Node and browsers ship different locale
 * data for hy/ru (comma vs space), which would break hydration.
 * English groups with commas; Armenian and Russian with a narrow space.
 */
export function formatNumber(value: number, locale: string, decimals = 0) {
  const [int, frac] = Math.abs(value).toFixed(decimals).split('.');
  const sep = locale === 'en' ? ',' : ' ';
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  const dec = locale === 'en' ? '.' : ',';
  return `${value < 0 ? '−' : ''}${grouped}${frac ? dec + frac : ''}`;
}

export function formatMoney(value: number, currency: Currency, locale: string) {
  const n = formatNumber(value, locale);
  // $ and € lead in English; everywhere else the symbol follows the number.
  if (locale === 'en' && (currency === 'USD' || currency === 'EUR')) return `${SYMBOL[currency]}${n}`;
  return `${n} ${SYMBOL[currency]}`;
}
