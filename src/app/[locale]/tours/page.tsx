import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getTours } from '@/lib/data';
import { pageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { BookButton } from '@/components/BookButton';
import { ToursExplorer } from '@/components/tours/ToursExplorer';

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMeta({ locale, path: '/tours', title: t('toursTitle'), description: t('toursDescription'), image: '/images/maldives-2.jpg' });
}

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('toursPage');
  const tours = await getTours(locale);

  return (
    <>
      <PageHero
        image="/images/maldives-2.jpg"
        alt=""
        kicker={t('kicker')}
        title={t('title')}
        accent={t('accent')}
        active="tours"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[460px] text-[15px] leading-[1.55] text-hero-muted">{t('intro')}</p>
          <BookButton preset={{ kind: 'tour' }}>{t('custom')}</BookButton>
        </div>
      </PageHero>
      <ToursExplorer tours={tours} />
    </>
  );
}
