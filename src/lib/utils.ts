import blurMap from './blur.json';

export const CATEGORIES = ['beach', 'europe', 'cities', 'armenia'] as const;
export type Category = (typeof CATEGORIES)[number];

export const SERVICE_KINDS = ['tour', 'air', 'hotel', 'visa', 'social', 'general'] as const;
export type ServiceKind = (typeof SERVICE_KINDS)[number];

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Placeholder for next/image: a 16px JPEG that the browser simply stretches,
 * which reads as a soft blur. Cheaper to paint than Next's SVG-filter blur.
 */
export function placeholderFor(src: string): `data:image/${string}` | 'empty' {
  const data = (blurMap as Record<string, string>)[src];
  return data ? (data as `data:image/${string}`) : 'empty';
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** "+374 98 555 085" → "37498555085" for wa.me / tel: links. */
export function digits(phone: string) {
  return phone.replace(/\D/g, '');
}

/** Local display format: +37498555085 → "098 555 085". */
export function localPhone(phone: string) {
  const d = digits(phone);
  const local = d.startsWith('374') ? d.slice(3) : d.replace(/^0/, '');
  if (local.length !== 8) return phone;
  return `0${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}
