'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FONT_PAIRINGS, isFontPairing, type FontPairingId } from '@/lib/font-pairings';
import { cx } from '@/lib/utils';
import { Close } from './Icons';

const KEY = 'karin.font-preview';

/**
 * Review tool: a floating "Aa" button that previews the font pairings on the
 * live site. The preview is stored in this browser only; the pairing every
 * visitor sees is set in Admin → Site settings. Hidden unless
 * NEXT_PUBLIC_SHOW_FONT_PICKER=1.
 */
export function FontPicker({ siteFont }: { siteFont: FontPairingId }) {
  const t = useTranslations('fonts');
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState<FontPairingId>(siteFont);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (isFontPairing(saved)) setFont(saved);
    } catch {
      // storage blocked
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.font = font;
  }, [font]);

  const pick = (id: FontPairingId) => {
    setFont(id);
    try {
      if (id === siteFont) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, id);
    } catch {
      // storage blocked
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="font-picker"
        className="fixed bottom-6 left-6 z-40 flex h-[52px] items-center gap-2 rounded-full bg-cream pl-1.5 pr-5 text-[14px] font-semibold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.4)] ph:bottom-[calc(80px+env(safe-area-inset-bottom))] ph:left-3 ph:h-[44px]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[15px] text-cream ph:h-8 ph:w-8">Aa</span>
        {t('button')}
      </button>

      {open ? (
        <div
          id="font-picker"
          role="dialog"
          aria-label={t('title')}
          className="fade-up fixed bottom-[88px] left-6 z-40 max-h-[calc(100dvh-120px)] w-[400px] overflow-y-auto rounded-[24px] bg-panel p-4 text-cream shadow-[0_20px_60px_rgba(0,0,0,0.5)] ph:bottom-[calc(132px+env(safe-area-inset-bottom))] ph:left-2 ph:right-2 ph:w-auto"
        >
          <div className="flex items-start justify-between gap-3 px-1">
            <div>
              <p className="text-[17px] font-semibold">{t('title')}</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-foot-muted">{t('intro')}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-dark-2 hover:border-cream"
            >
              <Close size={16} />
            </button>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {FONT_PAIRINGS.map((p) => {
              const on = p.id === font;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(p.id)}
                    data-font={p.id}
                    className={cx(
                      'w-full rounded-[18px] border p-4 text-left transition-colors',
                      on ? 'border-cream bg-cream text-ink' : 'border-line-dark bg-card hover:border-cream'
                    )}
                  >
                    <span className="flex items-center justify-between gap-2 font-sans text-[12px] font-semibold uppercase tracking-[0.08em] opacity-70">
                      {p.name}
                      {on ? <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] text-cream">{t('active')}</span> : null}
                      {p.id === siteFont && !on ? <span className="text-[10px]">★</span> : null}
                    </span>
                    <span className="mt-2 block font-sans text-[26px] font-light leading-[1.1] tracking-[-0.02em]">
                      {t('sample')} <span className={cx('serif', on ? 'text-[#9A6B1F]' : 'text-gold')}>{t('accent')}</span>
                    </span>
                    <span className="mt-2 block font-sans text-[13px] leading-[1.45] opacity-80">
                      Մայրամուտ բուրգերի մոտ · Закат у пирамид · Sunset
                    </span>
                    <span className="mt-2 block font-sans text-[11px] leading-[1.45] opacity-60">
                      {p.body} + {p.accent} · Armenian: {p.armenian}
                    </span>
                    <span className="mt-1 block font-sans text-[12px] leading-[1.45] opacity-80">{p.note}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {font !== siteFont ? (
            <button
              type="button"
              onClick={() => pick(siteFont)}
              className="mt-3 min-h-[44px] w-full rounded-full border border-line-dark-2 text-[13px] font-semibold hover:border-cream"
            >
              {t('reset')}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
