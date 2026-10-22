'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { TourView } from '@/lib/data';
import { CATEGORIES, cx } from '@/lib/utils';
import { convert, formatMoney, roundPrice } from '@/lib/money';
import { TourCard } from '../TourCard';
import { useSite } from '../SiteProvider';

// Price filter steps, defined in USD and shown in the visitor's currency.
const PRICE_STEPS_USD = [500, 1000, 2000];
type Dur = 'any' | 'short' | 'medium' | 'long';

function nightsOf(t: TourView) {
  return t.durationUnit === 'days' ? 0 : t.duration;
}

export function ToursExplorer({ tours }: { tours: TourView[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const { openEnquiry, rates, currency } = useSite();
  const [cat, setCat] = useState<string>('all');

  // The page is static; pick up ?category=… (e.g. shared links) after hydration.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('category');
    if (c && (CATEGORIES as readonly string[]).includes(c)) setCat(c);
  }, []);
  const [dur, setDur] = useState<Dur>('any');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const anyPriced = tours.some((x) => x.priceFrom != null);

  const list = useMemo(
    () =>
      tours.filter((x) => {
        if (cat !== 'all' && x.category !== cat) return false;
        const n = nightsOf(x);
        if (dur === 'short' && n > 4) return false;
        if (dur === 'medium' && (n < 5 || n > 7)) return false;
        if (dur === 'long' && n < 8) return false;
        if (maxPrice != null) {
          if (x.priceFrom == null) return false;
          if (convert(x.priceFrom, x.currency, 'USD', rates.amd) > maxPrice) return false;
        }
        return true;
      }),
    [tours, cat, dur, maxPrice, rates]
  );

  const setCategory = (c: string) => {
    setCat(c);
    const url = new URL(window.location.href);
    if (c === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', c);
    window.history.replaceState(null, '', url);
  };

  const chip = (on: boolean) =>
    cx(
      'min-h-[44px] shrink-0 rounded-full px-5 text-[14px] transition-colors',
      on ? 'bg-ink font-semibold text-cream' : 'bg-tab text-ink hover:bg-line'
    );

  const stepLabel = (usd: number) => formatMoney(roundPrice(convert(usd, 'USD', currency, rates.amd), currency), currency, locale);

  return (
    <section className="panel bg-cream pb-14 pt-12 text-ink ph:pb-9 ph:pt-8">
      <h2 className="sr-only">{t('toursPage.kicker')}</h2>
      <div className="flex flex-col gap-4 px-8 ph:px-5" aria-label={t('toursPage.filters')} role="region">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="w-[110px] text-[13px] font-semibold text-body-muted ph:w-full">{t('toursPage.category')}</span>
          <div className="no-scrollbar flex gap-1.5 ph:-mx-5 ph:overflow-x-auto ph:px-5">
            {['all', ...CATEGORIES].map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCategory(c)} className={chip(cat === c)}>
                {t(`categories.${c}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="w-[110px] text-[13px] font-semibold text-body-muted ph:w-full">{t('toursPage.duration')}</span>
          <div className="no-scrollbar flex gap-1.5 ph:-mx-5 ph:overflow-x-auto ph:px-5">
            {(['any', 'short', 'medium', 'long'] as Dur[]).map((d) => (
              <button key={d} type="button" aria-pressed={dur === d} onClick={() => setDur(d)} className={chip(dur === d)}>
                {t(d === 'any' ? 'toursPage.anyDuration' : `toursPage.${d}`)}
              </button>
            ))}
          </div>
        </div>
        {anyPriced ? (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="w-[110px] text-[13px] font-semibold text-body-muted ph:w-full">{t('toursPage.price')}</span>
            <div className="no-scrollbar flex gap-1.5 ph:-mx-5 ph:overflow-x-auto ph:px-5">
              <button type="button" aria-pressed={maxPrice == null} onClick={() => setMaxPrice(null)} className={chip(maxPrice == null)}>
                {t('toursPage.anyPrice')}
              </button>
              {PRICE_STEPS_USD.map((p) => (
                <button key={p} type="button" aria-pressed={maxPrice === p} onClick={() => setMaxPrice(p)} className={chip(maxPrice === p)}>
                  {t('toursPage.under', { price: stepLabel(p) })}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between border-t border-line pt-5">
          <p className="text-[14px] text-body-muted" aria-live="polite">
            {t('toursPage.results', { count: list.length })}
          </p>
          {cat !== 'all' || dur !== 'any' || maxPrice != null ? (
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setDur('any');
                setMaxPrice(null);
              }}
              className="min-h-[44px] rounded-full border border-line-2 px-4 text-[13px] font-semibold hover:border-ink"
            >
              {t('toursPage.clear')}
            </button>
          ) : null}
        </div>
      </div>

      {list.length ? (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-4 gap-y-9 px-8 ph:grid-cols-1 ph:gap-y-7 ph:px-5">
          {list.map((x) => (
            <TourCard
              key={x.id}
              tour={x}
              height={340}
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px"
              showPrice
            />
          ))}
        </div>
      ) : (
        <div className="mx-8 mt-8 rounded-card bg-white p-8 text-center ph:mx-5">
          <p className="mx-auto max-w-[460px] text-[15px] leading-[1.6] text-body-muted">{t('toursPage.empty')}</p>
          <button
            type="button"
            onClick={() => openEnquiry({ kind: 'tour' })}
            className="mt-5 min-h-[46px] rounded-full bg-ink px-6 text-[14px] font-semibold text-cream"
          >
            {t('toursPage.custom')}
          </button>
        </div>
      )}
    </section>
  );
}
