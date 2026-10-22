import { PrismaClient } from '@prisma/client';
import { INCLUDED, SAMPLE_PRICES, SLIDES, TOURS } from './seed-data';

const db = new PrismaClient();
const LOCALES = ['hy', 'ru', 'en'] as const;

async function main() {
  // Tours: upsert by slug so re-seeding never duplicates and keeps admin edits to prices.
  for (const [i, t] of TOURS.entries()) {
    const tour = await db.tour.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        slug: t.slug,
        category: t.category,
        duration: t.duration,
        durationUnit: t.unit,
        coverImage: t.cover,
        gallery: JSON.stringify(t.gallery),
        featured: t.featured,
        sortOrder: i * 10,
        priceFrom: SAMPLE_PRICES[t.slug]?.[0] ?? null,
        currency: SAMPLE_PRICES[t.slug]?.[1] ?? 'USD',
      },
    });
    for (const locale of LOCALES) {
      const data = {
        title: t.title[locale],
        summary: t.summary[locale],
        description: t.description[locale],
        included: JSON.stringify(t.included.map((k) => INCLUDED[k][locale])),
        itinerary: JSON.stringify(t.days.map(([title, text]) => ({ title: title[locale], text: text[locale] }))),
      };
      await db.tourTranslation.upsert({
        where: { tourId_locale: { tourId: tour.id, locale } },
        update: {},
        create: { tourId: tour.id, locale, ...data },
      });
    }
  }

  if ((await db.heroSlide.count()) === 0) {
    for (const [i, s] of SLIDES.entries()) {
      const tour = await db.tour.findUnique({ where: { slug: s.tour } });
      await db.heroSlide.create({
        data: {
          image: s.image,
          tourId: tour?.id,
          sortOrder: i * 10,
          translations: {
            create: LOCALES.map((locale) => ({
              locale,
              kicker: s.kicker[locale],
              title: s.title[locale],
              accent: s.accent[locale],
              name: s.name[locale],
              when: s.when[locale],
              text: s.text[locale],
            })),
          },
        },
      });
    }
  }

  console.log(`Seeded ${await db.tour.count()} tours and ${await db.heroSlide.count()} hero slides.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
