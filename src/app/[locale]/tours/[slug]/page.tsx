import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/lib/db';
import { getTourBySlug, getTours } from '@/lib/data';
import { getSettings } from '@/lib/settings';
import { absolute, pageMeta } from '@/lib/seo';
import { digits, siteUrl } from '@/lib/utils';
import { Price } from '@/components/Price';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { PageHero, SectionPill } from '@/components/PageHero';
import { BookButton } from '@/components/BookButton';
import { EnquiryForm } from '@/components/EnquiryForm';
import { Gallery } from '@/components/tours/Gallery';
import { TourCard } from '@/components/TourCard';
import { JsonLd } from '@/components/JsonLd';
import { ChevronLeft, WhatsAppIcon } from '@/components/Icons';

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const tours = await db.tour.findMany({ where: { published: true }, select: { slug: true } });
    return routing.locales.flatMap((locale) => tours.map((t) => ({ locale, slug: t.slug })));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug, locale);
  if (!tour) return {};
  return pageMeta({
    locale,
    path: `/tours/${slug}`,
    title: tour.title,
    description: tour.description || tour.summary,
    image: tour.coverImage,
  });
}

export default async function TourPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tour = await getTourBySlug(slug, locale);
  if (!tour) notFound();

  const t = await getTranslations();
  const [all, settings] = await Promise.all([getTours(locale), getSettings()]);
  const related = [
    ...all.filter((x) => x.category === tour.category && x.slug !== tour.slug),
    ...all.filter((x) => x.category !== tour.category),
  ].slice(0, 4);

  const length = t(`duration.${tour.durationUnit}`, { count: tour.duration });
  const price = tour.priceFrom != null ? <Price amount={tour.priceFrom} base={tour.currency} /> : t('tour.price');
  const gallery = tour.gallery.length ? tour.gallery : [tour.coverImage];
  const waText = encodeURIComponent(`${t('enquiry.titleFor', { name: tour.title })} — ${siteUrl()}/${locale}/tours/${tour.slug}`);

  const tripLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description || tour.summary,
    image: [absolute(tour.coverImage), ...tour.gallery.map(absolute)],
    url: `${siteUrl()}/${locale}/tours/${tour.slug}`,
    touristType: t(`categories.${tour.category}`),
    provider: { '@id': `${siteUrl()}/#agency` },
    itinerary: tour.itinerary.length
      ? {
          '@type': 'ItemList',
          itemListElement: tour.itinerary.map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'TouristAttraction', name: d.title, description: d.text },
          })),
        }
      : undefined,
    ...(tour.priceFrom != null
      ? { offers: { '@type': 'Offer', price: tour.priceFrom, priceCurrency: tour.currency, availability: 'https://schema.org/InStock' } }
      : {}),
  };

  return (
    <>
      <PageHero
        image={tour.coverImage}
        alt={tour.title}
        kicker={t(`categories.${tour.category}`)}
        title={tour.title}
        active="tours"
        tall
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[420px]">
            <p className="text-[22px] font-medium leading-[1.25]">{tour.summary}</p>
            <p className="mt-1 text-[14px] text-hero-muted">{length}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass flex min-h-[46px] items-baseline gap-2 rounded-full !bg-white/[0.12] px-5 py-2">
              <span className="text-[13px] text-hero-muted">{t('tour.from')}</span>
              <span className="text-[22px] font-light tracking-[-0.02em]">{price}</span>
              {tour.priceFrom != null ? <span className="text-[12px] text-hero-muted">{t('currency.perPerson')}</span> : null}
            </div>
            <BookButton preset={{ kind: 'tour', tourSlug: tour.slug, tourTitle: tour.title }}>{t('tour.book')}</BookButton>
          </div>
        </div>
      </PageHero>

      <section className="panel bg-cream text-ink">
        <div className="grid grid-cols-[minmax(0,1fr)_440px] gap-12 px-10 py-14 mid:grid-cols-[minmax(0,1fr)_380px] tab:grid-cols-1 ph:gap-10 ph:px-5 ph:py-10">
          <div className="min-w-0">
            <Link href="/tours" className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-ink no-underline hover:text-muted">
              <ChevronLeft size={15} /> {t('tour.back')}
            </Link>
            {tour.description ? (
              <p className="mt-4 max-w-[680px] text-[22px] font-normal leading-[1.45] tracking-[-0.01em] ph:text-[18px]">
                {tour.description}
              </p>
            ) : null}

            {tour.included.length ? (
              <div id="included" className="mt-12 scroll-mt-6">
                <SectionPill>{t('tour.included')}</SectionPill>
                <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                  {tour.included.map((i) => (
                    <li key={i} className="rounded-full border border-line-2 bg-white/50 px-4 py-2.5 text-[14px]">
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tour.itinerary.length ? (
              <div className="mt-12">
                <SectionPill>{t('tour.itinerary')}</SectionPill>
                <p className="mt-4 max-w-[560px] text-[14px] leading-[1.55] text-body-muted">{t('tour.note')}</p>
                <ol className="mt-6 list-none border-t border-line p-0">
                  {tour.itinerary.map((d, i) => (
                    <li key={i} className="grid grid-cols-[120px_1fr] gap-4 border-b border-line py-6 ph:grid-cols-[64px_1fr]">
                      <span className="text-[15px] font-semibold text-body-muted ph:text-[13px]">
                        {t('tour.day', { n: i + 1 })}
                      </span>
                      <div>
                        <p className="text-[18px] font-semibold tracking-[-0.01em]">{d.title}</p>
                        <p className="mt-1.5 text-[15px] leading-[1.6] text-body-muted">{d.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>

          <aside className="tab:order-last">
            <div className="sticky top-6 rounded-[24px] bg-white p-7 ph:p-5">
              <h2 className="text-[24px] font-medium leading-[1.15] tracking-[-0.02em]">{t('tour.formTitle')}</h2>
              <p className="mt-2 text-[14px] leading-[1.55] text-body-muted">{t('tour.formText')}</p>
              <EnquiryForm className="mt-6" kind="tour" tourSlug={tour.slug} tourTitle={tour.title} source="tour-page" />
              <a
                href={`https://wa.me/${digits(settings.whatsapp)}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-whatsapp text-[14px] font-bold text-whatsapp-ink no-underline hover:text-whatsapp-ink"
              >
                <WhatsAppIcon size={17} /> {t('tour.ask')}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="panel bg-cream px-10 py-14 text-ink ph:px-5 ph:py-10">
        <SectionPill>{t('tour.gallery')}</SectionPill>
        <div className="mt-6">
          <Gallery images={gallery} title={tour.title} />
        </div>
      </section>

      {related.length ? (
        <section className="panel bg-panel px-8 py-14 ph:px-0 ph:py-10">
          <h2 className="text-center text-[44px] font-medium leading-[1.1] tracking-[-0.03em] tab:text-[32px] ph:px-5">
            {t('tour.related')}
          </h2>
          <div className="no-scrollbar mt-10 grid grid-cols-4 gap-4 tab:grid-cols-2 ph:flex ph:snap-x ph:snap-mandatory ph:gap-3 ph:overflow-x-auto ph:px-5">
            {related.map((r) => (
              <TourCard key={r.id} tour={r} height={300} tone="dark" className="ph:shrink-0 ph:grow-0 ph:basis-[78%] ph:snap-center" />
            ))}
          </div>
        </section>
      ) : null}

      <JsonLd data={tripLd} />
    </>
  );
}
