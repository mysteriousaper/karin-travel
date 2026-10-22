import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSettings } from '@/lib/settings';
import { pageMeta } from '@/lib/seo';
import { PageHero, SectionPill } from '@/components/PageHero';
import { HowToBook } from '@/components/HowToBook';
import { BookButton } from '@/components/BookButton';
import { JsonLd } from '@/components/JsonLd';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMeta({ locale, path: '/how-to-book', title: t('howTitle'), description: t('howDescription'), image: '/images/plane.jpg' });
}

export default async function HowToBookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('howPage');
  const tn = await getTranslations('nav');
  const settings = await getSettings();
  const faq = t.raw('faq') as { q: string; a: string }[];

  return (
    <>
      <PageHero image="/images/plane.jpg" alt="" kicker={t('kicker')} title={t('title')} accent={t('accent')} active="how">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[480px] text-[15px] leading-[1.55] text-hero-muted">{t('intro')}</p>
          <BookButton>{tn('bookNow')}</BookButton>
        </div>
      </PageHero>

      <HowToBook phone={settings.phone1} />

      <section className="panel bg-cream px-10 py-14 text-ink ph:px-5 ph:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 tab:grid-cols-1 tab:gap-6">
          <div>
            <SectionPill>FAQ</SectionPill>
            <h2 className="mt-5 text-[44px] font-medium leading-[1.08] tracking-[-0.03em] tab:text-[32px]">{t('faqTitle')}</h2>
          </div>
          <div className="border-t border-line">
            {faq.map((f, i) => (
              <details key={i} className="group border-b border-line" open={i === 0}>
                <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-4 text-[18px] font-semibold tracking-[-0.01em] ph:text-[16px]">
                  {f.q}
                  <span className="faq-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-2 transition-transform duration-300 group-hover:border-ink">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[720px] pb-6 pr-14 text-[15px] leading-[1.65] text-body-muted ph:pr-0">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
    </>
  );
}
