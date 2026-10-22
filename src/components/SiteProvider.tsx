'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import type { PublicContacts } from '@/lib/settings';
import type { ServiceKind } from '@/lib/utils';
import { convert, CURRENCIES, formatMoney, roundPrice, type Currency, type Rates } from '@/lib/money';
import { EnquiryModal } from './EnquiryModal';
import { VideoModal } from './VideoModal';

export type EnquiryPreset = {
  kind?: ServiceKind;
  tourSlug?: string;
  tourTitle?: string;
};

type Ctx = {
  contacts: PublicContacts;
  openEnquiry: (preset?: EnquiryPreset) => void;
  openVideo: () => void;
  rates: Rates;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Formats a price stored in `base` currency in the visitor's chosen currency. */
  money: (amount: number, base: string) => string;
};

const SiteContext = createContext<Ctx | null>(null);
const CURRENCY_KEY = 'karin.currency';
const DEFAULT_CURRENCY: Record<string, Currency> = { hy: 'AMD', ru: 'RUB', en: 'USD' };

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}

export function SiteProvider({
  contacts,
  rates,
  children,
}: {
  contacts: PublicContacts;
  rates: Rates;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const [preset, setPreset] = useState<EnquiryPreset | null>(null);
  const [video, setVideo] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY[locale] ?? 'AMD');

  // A currency the visitor picked earlier wins over the language default.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY);
      if (saved && (CURRENCIES as readonly string[]).includes(saved)) setCurrencyState(saved as Currency);
    } catch {
      // storage blocked
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      // storage blocked
    }
  }, []);

  const money = useCallback(
    (amount: number, base: string) => {
      const value = base === currency ? amount : roundPrice(convert(amount, base, currency, rates.amd), currency);
      return formatMoney(value, currency, locale);
    },
    [currency, rates, locale]
  );

  const openEnquiry = useCallback((p: EnquiryPreset = {}) => setPreset(p), []);
  const openVideo = useCallback(() => setVideo(true), []);
  const value = useMemo(
    () => ({ contacts, openEnquiry, openVideo, rates, currency, setCurrency, money }),
    [contacts, openEnquiry, openVideo, rates, currency, setCurrency, money]
  );

  return (
    <SiteContext.Provider value={value}>
      {children}
      <EnquiryModal preset={preset} onClose={() => setPreset(null)} />
      <VideoModal open={video} url={contacts.reelUrl} instagram={contacts.instagram} onClose={() => setVideo(false)} />
    </SiteContext.Provider>
  );
}
