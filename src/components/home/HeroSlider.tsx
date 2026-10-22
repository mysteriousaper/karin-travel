'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { SlideView } from '@/lib/data';
import { placeholderFor, cx } from '@/lib/utils';
import { Header } from '../Header';
import { ChevronLeft, ChevronRight } from '../Icons';
import { useSite } from '../SiteProvider';
import { Price } from '../Price';

const AUTOPLAY_MS = 6000;
const pad = (n: number) => String(n).padStart(2, '0');

export function HeroSlider({ slides }: { slides: SlideView[] }) {
  const t = useTranslations('hero');
  const { openEnquiry } = useSite();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false); // after a touch, autoplay stays off
  // Autoplay and the other slides' photos wait for the first sign of a person
  // (pointer, scroll, key, touch) or 3.5 s after the page has loaded. Loading
  // them earlier competes with the first photo on slow mobile networks
  // (measured: Lighthouse LCP 3.7 s → 6.1 s). A slide picked before then still
  // loads at once and shows its blurred preview meanwhile.
  const [awake, setAwake] = useState(false);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  // The photo actually on screen. It switches to a newly picked slide once that
  // photo has loaded (or after a short wait, showing its blurred preview), so
  // the hero never flashes an empty panel.
  const [shown, setShown] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = slides.length;

  // Text fades in only on slide changes, never on first paint.
  const [moved, setMoved] = useState(false);
  const go = useCallback(
    (i: number) => {
      setMoved(true);
      setIdx(((i % n) + n) % n);
    },
    [n]
  );
  const fade = moved ? 'fade-up' : '';

  useEffect(() => {
    const wake = () => setAwake(true);
    const events = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, wake, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, wake));
  }, []);

  const mountAll = useCallback(() => setMounted(new Set(slides.map((_, i) => i))), [slides]);
  useEffect(() => {
    if (awake) mountAll();
  }, [awake, mountAll]);
  useEffect(() => {
    let t = 0;
    const later = () => (t = window.setTimeout(mountAll, 3500));
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later, { once: true });
    return () => {
      window.removeEventListener('load', later);
      window.clearTimeout(t);
    };
  }, [mountAll]);

  const onLoaded = useCallback((i: number) => setLoaded((l) => (l.has(i) ? l : new Set([...l, i]))), []);

  useEffect(() => {
    setMounted((m) => (m.has(idx) ? m : new Set([...m, idx])));
    if (loaded.has(idx)) {
      setShown(idx);
      return;
    }
    const wait = window.setTimeout(() => setShown(idx), 700);
    return () => window.clearTimeout(wait);
  }, [idx, loaded]);

  useEffect(() => {
    if (n < 2 || paused || stopped || !awake) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      if (!document.hidden) go(idx + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [idx, paused, stopped, awake, go, n]);

  if (!n) return null;
  const slide = slides[idx];
  const thumbs = Array.from({ length: Math.min(4, n - 1) }, (_, k) => (idx + k + 1) % n);

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t('region')}
      className="relative mx-auto flex min-h-[780px] max-w-page flex-col overflow-hidden rounded-panel bg-[#2A1C17] ph:min-h-[calc(100svh-120px)] ph:rounded-[24px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => {
        setStopped(true);
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 48) go(idx + (dx < 0 ? 1 : -1));
      }}
    >
      {/* Photos are stacked and crossfaded (600ms). */}
      {slides.map((s, i) =>
        mounted.has(i) ? (
          <Image
            key={s.id}
            src={s.image}
            alt={i === shown ? s.name : ''}
            aria-hidden={i !== shown}
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            // Hidden slides must not be lazy: browsers never fetch a lazy image
            // that stays invisible, so it would still be loading when picked.
            loading={i === 0 ? undefined : 'eager'}
            sizes="(max-width: 1432px) 100vw, 1400px"
            quality={78}
            // The first photo is the page's largest paint and loads at once; the
            // others get a tiny blurred preview in case they're picked early.
            placeholder={i === 0 ? 'empty' : placeholderFor(s.image)}
            onLoad={() => onLoaded(i)}
            className={cx(
              'object-cover transition-opacity duration-[600ms] ease-calm',
              i === shown ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : null
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.1) 30%,rgba(0,0,0,0.15) 55%,rgba(0,0,0,0.7) 100%)',
        }}
      />

      <Header active="home" />

      <div className="relative px-6 pt-10 text-center ph:px-5 ph:pt-7">
        <span key={`k${idx}`} className={cx(fade, 'glass inline-block rounded-full !bg-white/[0.16] px-4 py-[7px] text-[13px] backdrop-blur-[8px]')}>
          {slide.kicker}
        </span>
        <h1
          key={`h${idx}`}
          className={cx(fade, 'mx-auto mt-5 max-w-[960px] text-[84px] font-light leading-none tracking-[-0.035em] tab:text-[44px] ph:text-[40px] ph:leading-[1.04]')}
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.25)' }}
        >
          {slide.title} <span className="serif text-gold">{slide.accent}</span>
        </h1>
      </div>

      <div className="relative mt-auto flex flex-wrap items-end justify-between gap-8 px-8 pb-8 ph:gap-[18px] ph:px-5 ph:pb-[22px]">
        <div className="max-w-[360px]">
          <div key={`n${idx}`} className={fade}>
            <p className="text-[22px] font-medium leading-[1.25]">{slide.name}</p>
            <p className="mt-1 text-[14px] text-hero-muted">
              {slide.when}
              {slide.priceFrom != null ? (
                <>
                  {' · '}
                  {t('from')} <span className="font-semibold text-cream"><Price amount={slide.priceFrom} base={slide.currency} /></span>
                </>
              ) : null}
            </p>
            <p className="mt-3.5 text-[14px] leading-[1.55] text-hero-muted ph:hidden">{slide.text}</p>
          </div>
          <div className="mt-[18px] flex gap-2">
            <button
              type="button"
              onClick={() =>
                openEnquiry({ kind: 'tour', tourSlug: slide.tourSlug ?? undefined, tourTitle: slide.tourTitle ?? slide.name })
              }
              className="inline-flex min-h-[46px] items-center whitespace-nowrap rounded-full bg-cream px-[22px] text-[14px] font-semibold text-ink transition-colors hover:bg-white"
            >
              {t('bookThisTrip')}
            </button>
            <Link
              href={slide.tourSlug ? `/tours/${slide.tourSlug}#included` : '/tours'}
              className="inline-flex min-h-[46px] items-center whitespace-nowrap rounded-full border border-white/40 px-[18px] text-[14px] text-cream no-underline transition-colors hover:border-white hover:text-cream"
            >
              {t('whatsIncluded')}
            </Link>
          </div>
        </div>

        <div className="flex max-w-[740px] flex-[1_1_420px] flex-col gap-[18px] ph:flex-[1_1_100%]">
          <div className="flex items-end justify-end gap-3 tab:hidden">
            {thumbs.map((i, k) => {
              const s = slides[i];
              const first = k === 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t('show', { name: s.name })}
                  className={cx(
                    'group relative shrink-0 overflow-hidden rounded-[18px] bg-[#333] p-0 transition-[width,height] duration-[600ms] ease-calm',
                    first ? 'h-[210px] w-[230px] shadow-[0_0_0_2px_#F2EEE7]' : 'h-[170px] w-[120px]'
                  )}
                >
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="230px"
                    quality={70}
                    placeholder={placeholderFor(s.image)}
                    className="object-cover transition-transform duration-[600ms] ease-calm group-hover:scale-[1.04]"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(0,0,0,0.65))]" />
                  <span className="absolute bottom-3 left-3 right-3 text-left text-[13px] font-semibold leading-[1.25] text-white">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[28px] font-light tabular-nums">
              {pad(idx + 1)}
              <span className="text-[14px] text-hero-muted">/{pad(n)}</span>
            </span>
            <div className="relative h-0.5 flex-1 bg-white/30">
              <div
                className="absolute left-0 top-[-1px] h-1 rounded bg-cream transition-[width] duration-[600ms] ease-calm"
                style={{ width: `${((idx + 1) / n) * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => go(idx - 1)}
              aria-label={t('prev')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-cream transition-colors hover:border-white"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(idx + 1)}
              aria-label={t('next')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream text-ink transition-colors hover:bg-white"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
