import { defineRouting } from 'next-intl/routing';

export const locales = ['hy', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'hy',
  localePrefix: 'always',
  // Armenian is the agency's first language: "/" always lands on /hy.
  localeDetection: false,
});
