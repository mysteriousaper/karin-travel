'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { CURRENCIES, currencySymbol, formatNumber, type Currency } from '@/lib/money';
import { cx } from '@/lib/utils';
import { ArrowUpRight, Burger, Close } from './Icons';
import { useSite } from './SiteProvider';

export type NavKey = 'home' | 'tours' | 'services' | 'how' | 'stories' | null;

const NAV: { key: Exclude<NavKey, null>; href: string; label: string }[] = [
  { key: 'home', href: '/', label: 'home' },
  { key: 'tours', href: '/tours', label: 'tours' },
  { key: 'services', href: '/services', label: 'services' },
  { key: 'how', href: '/how-to-book', label: 'howToBook' },
  { key: 'stories', href: '/#stories', label: 'stories' },
];

const LANG_NAME: Record<string, string> = { hy: 'Հայերեն', ru: 'Русский', en: 'English' };

/** The brand wordmark keeps Cormorant whatever font pairing is active. */
export function Wordmark({ size = 34 }: { size?: number }) {
  return (
    <>
      <span className="brand-serif" style={{ fontSize: size, lineHeight: 1 }}>
        Karin
      </span>
      <span className="ml-2 text-[12px] tracking-[0.2em] opacity-80">TRAVEL</span>
    </>
  );
}

/** Closes a popover on outside click or Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

/** HY · RU · EN as one glass pill — always visible on desktop. */
function LangSegment() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  return (
    <nav aria-label={t('language')} className="lang-seg glass flex gap-0.5 rounded-full !bg-white/[0.12] !border-white/20 p-[4px] tab:hidden">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          title={LANG_NAME[l]}
          aria-current={l === locale ? 'true' : undefined}
          className={cx(
            'flex h-[36px] min-w-[40px] items-center justify-center rounded-full px-2.5 text-[13px] tracking-[0.04em] no-underline transition-colors',
            l === locale ? 'bg-cream font-semibold text-ink hover:text-ink' : 'text-cream hover:bg-white/10 hover:text-cream'
          )}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}

/** Phones: the current language as a round glass button with a small list. */
function LangMenuCompact() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div ref={ref} className="lang-compact relative hidden tab:block">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('language')}: ${LANG_NAME[locale]}`}
        onClick={() => setOpen((o) => !o)}
        className="glass flex h-[46px] w-[46px] items-center justify-center rounded-full text-[13px] font-semibold tracking-[0.04em] text-cream"
      >
        {locale.toUpperCase()}
      </button>
      {open ? (
        <div className="fade-up absolute right-0 top-[calc(100%+8px)] z-30 flex w-[150px] flex-col gap-0.5 rounded-[18px] bg-[rgba(20,19,18,0.94)] p-1.5 backdrop-blur-[14px]">
          {locales.map((l) => (
            <Link
              key={l}
              href={pathname}
              locale={l}
              lang={l}
              onClick={() => setOpen(false)}
              aria-current={l === locale ? 'true' : undefined}
              className={cx(
                'flex min-h-[44px] items-center justify-between rounded-[12px] px-3 text-[15px] no-underline',
                l === locale ? 'bg-cream font-semibold text-ink hover:text-ink' : 'text-cream hover:bg-card hover:text-cream'
              )}
            >
              {LANG_NAME[l]}
              <span className="text-[11px] opacity-60">{l.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function rateLabel(c: Currency, amd: number, locale: string) {
  if (c === 'AMD') return '';
  return `${formatNumber(amd, locale, 2)} ֏`;
}

/** Currency picker (desktop): shows each currency with today's CBA rate. */
function CurrencyMenu() {
  const t = useTranslations('currency');
  const locale = useLocale();
  const { currency, setCurrency, rates } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div ref={ref} className="cur-menu relative tab:hidden">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('label')}: ${currency}`}
        onClick={() => setOpen((o) => !o)}
        className="glass flex h-[46px] items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-cream"
      >
        <span className="text-[15px]">{currencySymbol(currency)}</span>
        {currency}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden className={cx('transition-transform', open && 'rotate-180')}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div className="fade-up absolute right-0 top-[calc(100%+8px)] z-30 w-[230px] rounded-[18px] bg-[rgba(20,19,18,0.94)] p-1.5 backdrop-blur-[14px]">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={c === currency}
              onClick={() => {
                setCurrency(c);
                setOpen(false);
              }}
              className={cx(
                'flex min-h-[44px] w-full items-center justify-between rounded-[12px] px-3 text-left text-[14px]',
                c === currency ? 'bg-cream font-semibold text-ink' : 'text-cream hover:bg-card'
              )}
            >
              <span>
                <span className="inline-block w-5">{currencySymbol(c)}</span>
                {t(c)}
              </span>
              <span className="text-[12px] tabular-nums opacity-60">{rateLabel(c, rates.amd[c], locale)}</span>
            </button>
          ))}
          <p className="px-3 pb-1.5 pt-2 text-[11px] leading-[1.4] text-foot-muted">{t('source', { date: rates.date.split('-').reverse().join('.') })}</p>
        </div>
      ) : null}
    </div>
  );
}

/** Four currency pills for the mobile drawer. */
function CurrencySegment({ className }: { className?: string }) {
  const { currency, setCurrency } = useSite();
  const t = useTranslations('currency');
  return (
    <div role="group" aria-label={t('label')} className={cx('flex gap-1.5', className)}>
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={c === currency}
          onClick={() => setCurrency(c)}
          className={cx(
            'flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-full border text-[14px]',
            c === currency ? 'border-cream bg-cream font-semibold text-ink' : 'border-line-dark-2 text-cream hover:border-cream'
          )}
        >
          {currencySymbol(c)} <span className="text-[12px]">{c}</span>
        </button>
      ))}
    </div>
  );
}

function LangSegmentDrawer({ onPick }: { onPick: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div className="flex gap-1.5">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={l}
          onClick={onPick}
          aria-current={l === locale ? 'true' : undefined}
          className={cx(
            'flex min-h-[44px] flex-1 items-center justify-center rounded-full border text-[14px] no-underline',
            l === locale ? 'border-cream bg-cream font-semibold text-ink hover:text-ink' : 'border-line-dark-2 text-cream hover:border-cream hover:text-cream'
          )}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function Header({ active }: { active: NavKey }) {
  const t = useTranslations('nav');
  const tc = useTranslations('currency');
  const tl = useTranslations('common');
  const { openEnquiry } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className="relative z-10 flex items-center justify-between gap-4 px-7 py-6 mid:gap-2.5 ph:p-4">
        <Link href="/" className="shrink-0 whitespace-nowrap text-cream no-underline hover:text-cream">
          <Wordmark />
        </Link>

        <nav aria-label={t('main')} className="nav-main glass flex gap-0.5 rounded-full !bg-white/[0.12] !border-white/20 p-[5px] tab:hidden">
          {NAV.map((n) => (
            <Link
              key={n.key}
              href={n.href}
              aria-current={active === n.key ? 'page' : undefined}
              className={cx(
                'whitespace-nowrap rounded-full px-[18px] py-[9px] text-[14px] no-underline transition-colors mid:px-3 mid:text-[13px]',
                active === n.key ? 'bg-cream font-semibold text-ink hover:text-ink' : 'text-cream hover:bg-white/10 hover:text-cream'
              )}
            >
              {t(n.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSegment />
          <LangMenuCompact />
          <CurrencyMenu />
          <button
            type="button"
            onClick={() => openEnquiry()}
            className="glass inline-flex min-h-[44px] items-center gap-2.5 rounded-full py-[5px] pl-[18px] pr-1.5 text-[14px] font-semibold text-cream mid:pl-1.5"
            aria-label={t('bookNow')}
          >
            <span className="whitespace-nowrap mid:hidden">{t('bookNow')}</span>
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-cream text-ink">
              <ArrowUpRight />
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="nav-burger hidden h-[46px] w-[46px] items-center justify-center rounded-full border border-white/30 bg-white/[0.14] text-cream backdrop-blur-[10px] tab:flex"
          >
            {menuOpen ? <Close /> : <Burger />}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label={t('mobile')}
          className="nav-drawer fade-up absolute left-2.5 right-2.5 top-[76px] z-20 hidden flex-col gap-0.5 rounded-[22px] bg-[rgba(20,19,18,0.94)] p-2.5 backdrop-blur-[14px] tab:flex"
        >
          {[
            { href: '/tours', label: t('tours') },
            { href: '/services#air', label: t('airHotelsVisas') },
            { href: '/services#social', label: t('socialPackage') },
            { href: '/how-to-book', label: t('howToBook') },
            { href: '/#stories', label: t('stories') },
            { href: '/contacts', label: t('contacts') },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="flex min-h-[52px] items-center rounded-[14px] px-4 text-[17px] text-cream no-underline hover:bg-card hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 px-1.5 pb-1 pt-2.5">
            <p className="px-1 text-[11px] uppercase tracking-[0.12em] text-foot-muted">{tl('language')}</p>
            <LangSegmentDrawer onPick={close} />
            <p className="mt-1 px-1 text-[11px] uppercase tracking-[0.12em] text-foot-muted">{tc('label')}</p>
            <CurrencySegment />
          </div>
        </nav>
      ) : null}
    </>
  );
}
