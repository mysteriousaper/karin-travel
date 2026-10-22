'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { TourView } from '@/lib/data';
import { CATEGORIES, cx } from '@/lib/utils';
import { Plus } from '../Icons';
import { TourCard } from '../TourCard';

const HEIGHTS = [310, 370, 330, 390];

export function HomeTours({ groups }: { groups: Record<string, TourView[]> }) {
  const t = useTranslations();
  const tabs = CATEGORIES.filter((c) => groups[c]?.length);
  const [tab, setTab] = useState<string>(tabs[0] ?? 'beach');
  const cards = groups[tab] ?? [];

  return (
    <section id="tours" className="panel bg-cream pb-14 pt-[72px] text-ink ph:pb-9 ph:pt-11">
      <div className="px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line py-[5px] pl-[5px] pr-3.5 text-[13px]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream">
            <Plus />
          </span>
          {t('home.toursPill')}
        </span>
        <h2 className="mx-auto mt-[18px] max-w-[760px] text-[48px] font-medium leading-[1.08] tracking-[-0.03em] tab:text-[32px]">
          {t('home.toursH2a')} <span className="text-muted">{t('home.toursH2b')}</span> {t('home.toursH2c')}
        </h2>
        <div
          role="tablist"
          aria-label={t('home.tabsLabel')}
          className="no-scrollbar mt-7 inline-flex flex-wrap justify-center gap-1.5 ph:-mx-6 ph:flex ph:max-w-[calc(100%+48px)] ph:flex-nowrap ph:justify-start ph:overflow-x-auto ph:px-5"
        >
          {tabs.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              id={`tab-${c}`}
              aria-selected={tab === c}
              aria-controls="tours-panel"
              onClick={() => setTab(c)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                const i = tabs.indexOf(c as (typeof tabs)[number]);
                const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }}
              tabIndex={tab === c ? 0 : -1}
              className={cx(
                'min-h-[44px] shrink-0 rounded-full px-5 text-[14px] transition-colors',
                tab === c ? 'bg-ink font-semibold text-cream' : 'bg-tab text-ink hover:bg-line'
              )}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
      </div>

      <div
        id="tours-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="no-scrollbar mt-10 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] items-end gap-4 px-8 ph:flex ph:snap-x ph:snap-mandatory ph:items-stretch ph:gap-3 ph:overflow-x-auto ph:px-5 ph:[scroll-padding-inline:20px]"
      >
        {cards.map((c, i) => (
          <TourCard
            key={c.id}
            tour={c}
            height={HEIGHTS[i % HEIGHTS.length]}
            className="ph:shrink-0 ph:grow-0 ph:basis-[78%] ph:snap-center"
          />
        ))}
      </div>
    </section>
  );
}
