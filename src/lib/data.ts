import { cache } from 'react';
import type { Prisma } from '@prisma/client';
import { db } from './db';
import { parseJson } from './utils';

export type ItineraryDay = { title: string; text: string };

export type TourView = {
  id: string;
  slug: string;
  category: string;
  duration: number;
  durationUnit: 'nights' | 'days';
  priceFrom: number | null;
  currency: string;
  badge: string | null;
  coverImage: string;
  gallery: string[];
  featured: boolean;
  title: string;
  summary: string;
  description: string;
  included: string[];
  itinerary: ItineraryDay[];
  updatedAt: Date;
};

export type SlideView = {
  id: string;
  image: string;
  kicker: string;
  title: string;
  accent: string;
  name: string;
  when: string;
  text: string;
  tourSlug: string | null;
  tourTitle: string | null;
  priceFrom: number | null;
  currency: string;
};

export type TestimonialView = { id: string; name: string; place: string; text: string };

const tourInclude = { translations: true } satisfies Prisma.TourInclude;
type TourWithTr = Prisma.TourGetPayload<{ include: typeof tourInclude }>;

// Fall back to English, then Armenian, so a half-translated tour still renders.
function pick<T extends { locale: string }>(rows: T[], locale: string): T | undefined {
  return (
    rows.find((r) => r.locale === locale) ??
    rows.find((r) => r.locale === 'en') ??
    rows.find((r) => r.locale === 'hy') ??
    rows[0]
  );
}

function toView(t: TourWithTr, locale: string): TourView {
  const tr = pick(t.translations, locale);
  return {
    id: t.id,
    slug: t.slug,
    category: t.category,
    duration: t.duration,
    durationUnit: t.durationUnit === 'days' ? 'days' : 'nights',
    priceFrom: t.priceFrom,
    currency: t.currency,
    badge: t.badge,
    coverImage: t.coverImage,
    gallery: parseJson<string[]>(t.gallery, []),
    featured: t.featured,
    title: tr?.title ?? t.slug,
    summary: tr?.summary ?? '',
    description: tr?.description ?? '',
    included: parseJson<string[]>(tr?.included, []),
    itinerary: parseJson<ItineraryDay[]>(tr?.itinerary, []),
    updatedAt: t.updatedAt,
  };
}

export const getTours = cache(async (locale: string): Promise<TourView[]> => {
  const rows = await db.tour.findMany({
    where: { published: true },
    include: tourInclude,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
  return rows.map((r) => toView(r, locale));
});

export const getTourBySlug = cache(async (slug: string, locale: string) => {
  const row = await db.tour.findFirst({ where: { slug, published: true }, include: tourInclude });
  return row ? toView(row, locale) : null;
});

/** Featured tours for the Home tabs: up to four per category. */
export async function getHomeTours(locale: string) {
  const tours = await getTours(locale);
  const groups: Record<string, TourView[]> = {};
  for (const t of tours) {
    if (!t.featured) continue;
    (groups[t.category] ??= []).push(t);
  }
  for (const k of Object.keys(groups)) groups[k] = groups[k].slice(0, 4);
  return groups;
}

export const getSlides = cache(async (locale: string): Promise<SlideView[]> => {
  const rows = await db.heroSlide.findMany({
    where: { active: true },
    include: { translations: true, tour: { include: tourInclude } },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((s) => {
    const tr = pick(s.translations, locale);
    const tourTr = s.tour ? pick(s.tour.translations, locale) : undefined;
    return {
      id: s.id,
      image: s.image,
      kicker: tr?.kicker ?? '',
      title: tr?.title ?? '',
      accent: tr?.accent ?? '',
      name: tr?.name ?? '',
      when: tr?.when ?? '',
      text: tr?.text ?? '',
      tourSlug: s.tour?.published ? s.tour.slug : null,
      tourTitle: tourTr?.title ?? null,
      priceFrom: s.tour?.published ? s.tour.priceFrom : null,
      currency: s.tour?.currency ?? 'USD',
    };
  });
});

export const getTestimonials = cache(async (locale: string): Promise<TestimonialView[]> => {
  const rows = await db.testimonial.findMany({
    where: { published: true, locale: { in: ['all', locale] } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return rows.map((r) => ({ id: r.id, name: r.name, place: r.place, text: r.text }));
});
