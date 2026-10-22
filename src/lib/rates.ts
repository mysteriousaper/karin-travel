import { unstable_cache } from 'next/cache';
import { db } from './db';
import type { Rates } from './money';

// Official daily rates of the Central Bank of Armenia (api.cba.am, SOAP).
// AMD per 1 unit of each currency. Refreshed hourly; the last good answer is
// kept in the database so the site still shows prices if the CBA is down.

// Used only if the CBA has never been reached: CBA rates of 21 Oct 2026.
const FALLBACK: Rates = {
  date: '2026-10-21',
  source: 'fallback',
  amd: { AMD: 1, USD: 361.4, EUR: 405.92, RUB: 4.4121 },
};

const SOAP = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExchangeRatesLatest xmlns="http://www.cba.am/" /></soap:Body></soap:Envelope>`;

function rateFor(xml: string, iso: string) {
  const m = xml.match(new RegExp(`<ISO>${iso}</ISO>\\s*<Amount>([\\d.]+)</Amount>\\s*<Rate>([\\d.]+)</Rate>`));
  if (!m) return null;
  const amount = Number(m[1]);
  const rate = Number(m[2]);
  return amount > 0 && rate > 0 ? rate / amount : null;
}

async function fetchCba(): Promise<Rates> {
  const res = await fetch('https://api.cba.am/exchangerates.asmx', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: '"http://www.cba.am/ExchangeRatesLatest"',
    },
    body: SOAP,
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`CBA ${res.status}`);
  const xml = await res.text();
  const usd = rateFor(xml, 'USD');
  const eur = rateFor(xml, 'EUR');
  const rub = rateFor(xml, 'RUB');
  const date = xml.match(/<CurrentDate>(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!usd || !eur || !rub || !date) throw new Error('CBA response incomplete');
  return { date, source: 'cba', amd: { AMD: 1, USD: usd, EUR: eur, RUB: rub } };
}

async function loadRates(): Promise<Rates> {
  try {
    const rates = await fetchCba();
    await db.setting
      .upsert({
        where: { key: 'rates_cache' },
        update: { value: JSON.stringify(rates) },
        create: { key: 'rates_cache', value: JSON.stringify(rates) },
      })
      .catch(() => undefined);
    return rates;
  } catch (e) {
    console.warn('[rates] CBA unavailable, using saved rates:', (e as Error).message);
    try {
      const row = await db.setting.findUnique({ where: { key: 'rates_cache' } });
      if (row) return { ...(JSON.parse(row.value) as Rates), source: 'saved' };
    } catch {
      // no database
    }
    return FALLBACK;
  }
}

export const getRates = unstable_cache(loadRates, ['cba-rates'], { revalidate: 3600, tags: ['rates'] });
