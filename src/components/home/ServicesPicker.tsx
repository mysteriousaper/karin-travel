'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { placeholderFor, cx, type ServiceKind } from '@/lib/utils';
import { ArrowRight, Plus } from '../Icons';
import { useSite } from '../SiteProvider';

const PACKS: { key: string; kind: ServiceKind; img: string }[] = [
  { key: 'tours', kind: 'tour', img: '/images/maldives-1.jpg' },
  { key: 'air', kind: 'air', img: '/images/plane-window.jpg' },
  { key: 'hotels', kind: 'hotel', img: '/images/passport.jpg' },
  { key: 'social', kind: 'social', img: '/images/pool.jpg' },
];

export function ServicesPicker() {
  const t = useTranslations();
  const { openEnquiry } = useSite();
  const [picked, setPicked] = useState(0);

  return (
    <section id="packages" className="panel bg-panel px-8 py-[72px] ph:px-0 ph:pb-9 ph:pt-11">
      <div className="text-center ph:px-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-cream py-[5px] pl-[5px] pr-3.5 text-[13px] text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream">
            <Plus />
          </span>
          {t('home.servicesPill')}
        </span>
        <h2 className="mx-auto mt-[18px] max-w-[680px] text-[44px] font-medium leading-[1.1] tracking-[-0.03em] tab:text-[32px]">
          {t('home.servicesH2a')} <span className="serif text-gold">{t('home.servicesH2b')}</span>
        </h2>
      </div>

      <div
        role="radiogroup"
        aria-label={t('home.serviceGroup')}
        className="no-scrollbar mx-auto mt-11 grid max-w-[1160px] grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 ph:flex ph:snap-x ph:snap-mandatory ph:gap-3 ph:overflow-x-auto ph:px-5"
      >
        {PACKS.map((p, i) => {
          const on = i === picked;
          return (
            <div
              key={p.key}
              className={cx(
                'flex flex-col rounded-[24px] border px-3.5 pb-[22px] pt-3.5 text-left transition-colors duration-300 ph:shrink-0 ph:grow-0 ph:basis-[78%] ph:snap-center',
                on ? 'border-cream bg-cream text-ink' : 'border-line-dark bg-card text-cream'
              )}
            >
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPicked(i)}
                className="flex flex-1 flex-col rounded-[16px] text-left"
              >
                <span className="relative block h-[150px] w-full overflow-hidden rounded-[16px]">
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 78vw, 280px"
                    quality={70}
                    placeholder={placeholderFor(p.img)}
                    className="object-cover"
                  />
                </span>
                <span className="mt-5 block text-[24px] font-medium leading-[1.2]">{t(`services.${p.key}.name`)}</span>
                <span className="mt-2.5 block text-[14px] leading-[1.55] opacity-[0.78]">{t(`services.${p.key}.text`)}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPicked(i);
                  openEnquiry({ kind: p.kind });
                }}
                className="mt-[22px] flex min-h-[46px] items-center justify-between border-t border-current pt-3.5 text-[14px] font-semibold"
              >
                {t(`services.${p.key}.cta`)}
                <ArrowRight />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
