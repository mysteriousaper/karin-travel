import type { Metadata } from 'next';
import { locales } from '@/i18n/routing';
import { siteUrl } from './utils';

const OG_LOCALE: Record<string, string> = { hy: 'hy_AM', ru: 'ru_RU', en: 'en_US' };

/** Per-page metadata with canonical + hreflang alternates for all three locales. */
export function pageMeta({
  locale,
  path,
  title,
  description,
  image = '/images/egypt-camels.jpg',
  absoluteTitle,
}: {
  locale: string;
  path: string; // without locale, starting with "/" ("/" for home)
  title: string;
  description: string;
  image?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}${clean}`;
  languages['x-default'] = `/hy${clean}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: `/${locale}${clean}`, languages },
    openGraph: {
      type: 'website',
      siteName: 'Karin Travel',
      title,
      description,
      url: `/${locale}${clean}`,
      locale: OG_LOCALE[locale],
      images: [{ url: image, width: 1600, height: 1066 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function absolute(path: string) {
  return path.startsWith('http') ? path : `${siteUrl()}${path}`;
}
