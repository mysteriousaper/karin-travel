import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/PageHero';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <PageHero image="/images/plane-window.jpg" alt="" kicker={t('kicker')} title={t('title')} accent={t('accent')} active={null} tall>
      <div className="mx-auto flex max-w-[520px] flex-col items-center pb-6 text-center">
        <p className="text-[15px] leading-[1.6] text-hero-muted">{t('text')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="inline-flex min-h-[46px] items-center rounded-full bg-cream px-[22px] text-[14px] font-semibold text-ink no-underline hover:text-ink">
            {t('home')}
          </Link>
          <Link href="/tours" className="inline-flex min-h-[46px] items-center rounded-full border border-white/40 px-[18px] text-[14px] text-cream no-underline hover:border-white hover:text-cream">
            {t('tours')}
          </Link>
        </div>
      </div>
    </PageHero>
  );
}
