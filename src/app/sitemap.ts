import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { locales } from '@/i18n/routing';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ['', '/tours', '/services', '/how-to-book', '/contacts'];
  let tours: { slug: string; updatedAt: Date }[] = [];
  try {
    tours = await db.tour.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  } catch {
    // no database at build time
  }

  const entry = (path: string, lastModified?: Date, priority = 0.7): MetadataRoute.Sitemap[number] => ({
    url: `${base}/hy${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency: 'weekly',
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])) },
  });

  return [
    ...pages.map((p) => entry(p, undefined, p === '' ? 1 : 0.8)),
    ...tours.map((t) => entry(`/tours/${t.slug}`, t.updatedAt, 0.7)),
  ];
}
