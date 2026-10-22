import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getHomeTours, getSlides, getTestimonials } from '@/lib/data';
import { getSettings } from '@/lib/settings';
import { pageMeta } from '@/lib/seo';
import { HeroSlider } from '@/components/home/HeroSlider';
import { HomeTours } from '@/components/home/HomeTours';
import { Stories } from '@/components/home/Stories';
import { ServicesPicker } from '@/components/home/ServicesPicker';
import { HowToBook } from '@/components/HowToBook';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMeta({ locale, path: '/', title: t('homeTitle'), description: t('homeDescription'), absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [slides, groups, testimonials, settings] = await Promise.all([
    getSlides(locale),
    getHomeTours(locale),
    getTestimonials(locale),
    getSettings(),
  ]);

  return (
    <>
      <HeroSlider slides={slides} />
      <HomeTours groups={groups} />
      <Stories testimonials={testimonials} instagram={settings.instagram} />
      <ServicesPicker />
      <HowToBook phone={settings.phone1} />
    </>
  );
}
