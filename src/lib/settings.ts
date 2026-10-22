import { cache } from 'react';
import { db } from './db';

// Every contact detail on the site comes from here, so the agency can change
// it in /admin/settings without touching code. Defaults are the verified
// public details (Spyur.am listing + Instagram bio).
export const SETTING_DEFAULTS = {
  phone1: '+37498555085',
  phone2: '+37495099993',
  whatsapp: '+37498555085',
  telegram: '',
  instagram: 'https://www.instagram.com/karin_travel/',
  email: '',
  address_hy: 'Մարշալ Բաղրամյան պող. 79, Երևան',
  address_ru: 'пр. Маршала Баграмяна 79, Ереван',
  address_en: 'Marshal Baghramyan Ave 79, Yerevan',
  hours_hy: '',
  hours_ru: '',
  hours_en: '',
  reelUrl: 'https://www.instagram.com/karin_travel/reel/DbEX0bWi_z7/',
  mapQuery: 'Marshal Baghramyan Ave 79, Yerevan 0033',
  fontPairing: 'dusk',
};

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SiteSettings = Record<SettingKey, string>;

export const SETTING_KEYS = Object.keys(SETTING_DEFAULTS) as SettingKey[];

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const out: SiteSettings = { ...SETTING_DEFAULTS };
  try {
    const rows = await db.setting.findMany();
    for (const row of rows) {
      // An emptied required field (phones, address…) falls back to the default.
      if (!(row.key in out)) continue;
      if (row.value || SETTING_DEFAULTS[row.key as SettingKey] === '') out[row.key as SettingKey] = row.value;
    }
  } catch {
    // Database not reachable (e.g. during a static build without DB): use defaults.
  }
  return out;
});

/** The subset of settings the client components need. */
export type PublicContacts = {
  phone1: string;
  phone2: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  email: string;
  address: string;
  hours: string;
  reelUrl: string;
  mapQuery: string;
};

export function contactsFor(s: SiteSettings, locale: string): PublicContacts {
  const l = (['hy', 'ru', 'en'].includes(locale) ? locale : 'en') as 'hy' | 'ru' | 'en';
  return {
    phone1: s.phone1,
    phone2: s.phone2,
    whatsapp: s.whatsapp,
    telegram: s.telegram,
    instagram: s.instagram,
    email: s.email,
    address: s[`address_${l}`],
    hours: s[`hours_${l}`],
    reelUrl: s.reelUrl,
    mapQuery: s.mapQuery,
  };
}
