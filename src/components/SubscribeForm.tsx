'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export function SubscribeForm() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'invalid' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const contact = String(new FormData(e.currentTarget).get('contact') ?? '').trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = contact.replace(/\D/g, '').length >= 8 && /^[+\d\s()-]+$/.test(contact);
    if (!isEmail && !isPhone) return setState('invalid');
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, locale }),
      });
      setState(res.ok ? 'done' : res.status === 400 ? 'invalid' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className="max-w-[480px] flex-[1_1_360px] rounded-[24px] border border-line-dark-2 px-5 py-4 text-[15px] text-cream">
        {t('subscribed')}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-label={t('subscribe')} noValidate className="flex max-w-[480px] flex-[1_1_360px] flex-wrap gap-2">
      <label className="flex flex-[1_1_220px]">
        <span className="sr-only">{t('placeholder')}</span>
        <input
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder={t('placeholder')}
          aria-invalid={state === 'invalid'}
          onChange={() => state !== 'idle' && setState('idle')}
          className="min-h-[50px] w-full rounded-full border border-line-dark-2 bg-ink px-[18px] text-[15px] text-cream placeholder:text-foot-muted focus:border-cream focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={state === 'sending'}
        className="min-h-[50px] rounded-full bg-amber px-6 text-[14px] font-bold text-ink transition-colors hover:bg-[#F0B456] disabled:opacity-70"
      >
        {state === 'sending' ? t('subscribing') : t('subscribe')}
      </button>
      {state === 'invalid' || state === 'error' ? (
        <p role="alert" className="basis-full pl-[18px] text-[13px] text-amber">
          {t('subError')}
        </p>
      ) : null}
    </form>
  );
}
