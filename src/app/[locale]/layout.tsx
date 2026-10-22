import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { contactsFor, getSettings } from '@/lib/settings';
import { siteUrl } from '@/lib/utils';
import { absolute } from '@/lib/seo';
import { fontVars } from '../fonts';
import '../google-sans.css';
import { getRates } from '@/lib/rates';
import { DEFAULT_FONT, isFontPairing } from '@/lib/font-pairings';
import { FontPicker } from '@/components/FontPicker';
import { SiteProvider } from '@/components/SiteProvider';
import { Footer } from '@/components/Footer';
import { MobileBar } from '@/components/MobileBar';
import { JsonLd } from '@/components/JsonLd';
import { Analytics } from '@/components/Analytics';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0F0F0E',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t('homeTitle'), template: `%s · Karin Travel` },
    description: t('homeDescription'),
    applicationName: 'Karin Travel',
    formatDetection: { telephone: false },
    icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [settings, rates] = await Promise.all([getSettings(), getRates()]);
  const font = isFontPairing(settings.fontPairing) ? settings.fontPairing : DEFAULT_FONT;
  const contacts = contactsFor(settings, locale);
  const t = await getTranslations({ locale, namespace: 'common' });

  const agency = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl()}/#agency`,
    name: 'Karin Travel',
    url: `${siteUrl()}/${locale}`,
    image: absolute('/images/egypt-camels.jpg'),
    logo: absolute('/apple-icon.png'),
    telephone: [settings.phone1, settings.phone2],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Marshal Baghramyan Ave 79',
      addressLocality: 'Yerevan',
      addressRegion: 'Arabkir',
      postalCode: '0033',
      addressCountry: 'AM',
    },
    sameAs: [settings.instagram],
    areaServed: 'AM',
    knowsLanguage: ['hy', 'ru', 'en'],
  };

  return (
    <html lang={locale} className={fontVars} data-font={font} suppressHydrationWarning>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-cream px-5 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t('skip')}
        </a>
        <NextIntlClientProvider>
          <SiteProvider contacts={contacts} rates={rates}>
            <div className="min-h-screen bg-ink p-4 text-cream ph:px-2 ph:pb-24 ph:pt-2">
              <main id="main">{children}</main>
              <Footer contacts={contacts} rates={rates} />
            </div>
            <MobileBar />
            {process.env.NEXT_PUBLIC_SHOW_FONT_PICKER === '1' ? <FontPicker siteFont={font} /> : null}
          </SiteProvider>
        </NextIntlClientProvider>
        <JsonLd data={agency} />
        <Analytics />
      </body>
    </html>
  );
}
