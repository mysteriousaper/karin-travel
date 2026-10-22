import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMeta } from '@/lib/seo';
import { placeholderFor, cx, type ServiceKind } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { PageHero, SectionPill } from '@/components/PageHero';
import { EnquiryForm } from '@/components/EnquiryForm';
import { Check } from '@/components/Icons';

type Props = { params: Promise<{ locale: string }> };

const SERVICES: { id: string; kind: ServiceKind; img: string }[] = [
  { id: 'tours', kind: 'tour', img: '/images/maldives-1.jpg' },
  { id: 'air', kind: 'air', img: '/images/plane.jpg' },
  { id: 'hotels', kind: 'hotel', img: '/images/hurghada-resort.jpg' },
  { id: 'visa', kind: 'visa', img: '/images/passport.jpg' },
  { id: 'social', kind: 'social', img: '/images/couple.jpg' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMeta({ locale, path: '/services', title: t('servicesTitle'), description: t('servicesDescription'), image: '/images/plane-window.jpg' });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('servicesPage');

  return (
    <>
      <PageHero image="/images/plane-window.jpg" alt="" kicker={t('kicker')} title={t('title')} accent={t('accent')} active="services">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[480px] text-[15px] leading-[1.55] text-hero-muted">{t('intro')}</p>
          <nav aria-label={t('kicker')} className="no-scrollbar flex gap-1.5 ph:-mx-5 ph:w-[calc(100%+40px)] ph:overflow-x-auto ph:px-5">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="glass inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-[13px] text-cream no-underline hover:text-cream"
              >
                {t(`items.${s.id}.title`)}
              </a>
            ))}
          </nav>
        </div>
      </PageHero>

      {SERVICES.map((s, i) => {
        const points = t.raw(`items.${s.id}.points`) as string[];
        const dark = i % 2 === 1;
        return (
          <section
            key={s.id}
            id={s.id}
            className={cx('panel scroll-mt-4', dark ? 'bg-panel text-cream' : 'bg-cream text-ink')}
          >
            <div className="grid grid-cols-2 gap-12 px-10 py-14 tab:grid-cols-1 tab:gap-8 ph:px-5 ph:py-10">
              <div className="flex flex-col">
                <div>
                  <SectionPill dark={dark}>{String(i + 1).padStart(2, '0')}</SectionPill>
                </div>
                <h2 className="mt-5 text-[44px] font-medium leading-[1.08] tracking-[-0.03em] tab:text-[32px]">
                  {t(`items.${s.id}.title`)}
                </h2>
                <p className={cx('mt-4 max-w-[520px] text-[17px] leading-[1.55]', dark ? 'text-foot-muted' : 'text-body-muted')}>
                  {t(`items.${s.id}.lead`)}
                </p>
                <ul className="mt-7 flex list-none flex-col gap-3 p-0">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                      <span
                        className={cx(
                          'mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                          dark ? 'bg-cream text-ink' : 'bg-ink text-cream'
                        )}
                      >
                        <Check size={13} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-9 min-h-[260px] flex-1 overflow-hidden rounded-card ph:min-h-[220px]">
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 960px) 100vw, 640px"
                    quality={72}
                    placeholder={placeholderFor(s.img)}
                    className="object-cover"
                  />
                </div>
                {s.id === 'tours' ? (
                  <Link
                    href="/tours"
                    className="mt-5 inline-flex min-h-[46px] w-fit items-center rounded-full border border-ink px-5 text-[14px] font-semibold text-ink no-underline hover:bg-ink hover:text-cream"
                  >
                    {t('items.tours.title')} →
                  </Link>
                ) : null}
              </div>
              <div className="rounded-[24px] bg-white p-7 text-ink ph:p-5">
                <h3 className="text-[22px] font-medium tracking-[-0.02em]">{t('formTitle')}</h3>
                <EnquiryForm className="mt-5" kind={s.kind} lockKind source={`services#${s.id}`} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
