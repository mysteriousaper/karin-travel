'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cx, type ServiceKind } from '@/lib/utils';
import { Check, Phone, TelegramIcon, WhatsAppIcon } from './Icons';

type Props = {
  kind?: ServiceKind;
  /** Hide the "what do you need" chips (service pages fix the kind). */
  lockKind?: boolean;
  tourSlug?: string;
  tourTitle?: string;
  source: string;
  autoFocus?: boolean;
  className?: string;
};

const KIND_CHOICES: ServiceKind[] = ['tour', 'air', 'hotel', 'visa', 'social'];
const MESSENGERS = ['whatsapp', 'telegram', 'call'] as const;

// Extra fields per service. They are stored together in `details`.
const EXTRA: Partial<Record<ServiceKind, { name: string; type?: string; ph?: string; half?: boolean }[]>> = {
  air: [
    { name: 'from', ph: 'fromPlaceholder', half: true },
    { name: 'to', ph: 'toPlaceholder', half: true },
    { name: 'departDate', type: 'date', half: true },
    { name: 'returnDate', type: 'date', half: true },
    { name: 'passengers', type: 'number', half: true },
  ],
  hotel: [
    { name: 'city' },
    { name: 'checkin', type: 'date', half: true },
    { name: 'checkout', type: 'date', half: true },
    { name: 'guests', type: 'number', half: true },
  ],
  visa: [
    { name: 'country', ph: 'countryPlaceholder' },
    { name: 'travelDate', type: 'date', half: true },
    { name: 'applicants', type: 'number', half: true },
  ],
  social: [{ name: 'destinationIdea' }, { name: 'organization' }],
};

export function EnquiryForm({ kind: initialKind, lockKind, tourSlug, tourTitle, source, autoFocus, className }: Props) {
  const t = useTranslations('enquiry');
  const tc = useTranslations('common');
  const locale = useLocale();
  const uid = useId();
  const [kind, setKind] = useState<ServiceKind>(initialKind ?? 'tour');
  const [messenger, setMessenger] = useState<(typeof MESSENGERS)[number]>('whatsapp');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const extra = EXTRA[kind] ?? [];
  const usesGenericDates = !['air', 'hotel', 'visa'].includes(kind);
  const showKinds = !lockKind && !tourSlug;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get('phone') ?? '').trim();
    if (phone.replace(/\D/g, '').length < 6) {
      setPhoneError(phone ? t('invalidPhone') : t('required'));
      (e.currentTarget.elements.namedItem('phone') as HTMLInputElement | null)?.focus();
      return;
    }
    setPhoneError(null);
    const details: Record<string, string> = {};
    for (const f of extra) {
      const v = String(fd.get(f.name) ?? '').trim();
      if (v) details[f.name] = v;
    }
    setState('sending');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          phone,
          messenger,
          dates: fd.get('dates') || undefined,
          travelers: fd.get('travelers') || undefined,
          message: fd.get('message') || undefined,
          kind,
          tourSlug,
          tourTitle,
          details,
          locale,
          source: `${source} · ${window.location.pathname}`,
          company: fd.get('company'), // honeypot
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('done');
      window.dispatchEvent(new CustomEvent('karin:lead', { detail: { kind, tourSlug } }));
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className={cx('rounded-[22px] bg-white p-6 text-center', className)} role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
          <Check size={22} />
        </span>
        <p className="mt-4 text-[20px] font-medium tracking-[-0.01em]">{t('successTitle')}</p>
        <p className="mt-2 text-[14px] leading-[1.55] text-body-muted">{t('successText')}</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-5 min-h-[44px] rounded-full border border-line-2 px-5 text-[14px] font-semibold hover:bg-tab"
        >
          {t('again')}
        </button>
      </div>
    );
  }

  const id = (n: string) => `${uid}-${n}`;

  return (
    <form onSubmit={onSubmit} noValidate className={cx('flex flex-col gap-4', className)}>
      {tourTitle ? (
        <p className="flex items-center gap-2 text-[13px]">
          <span className="text-body-muted">{t('subject')}:</span>
          <span className="rounded-full bg-ink px-3 py-1 font-semibold text-cream">{tourTitle}</span>
        </p>
      ) : null}

      {showKinds ? (
        <fieldset>
          <legend className="label">{t('kinds.general')}</legend>
          <div className="flex flex-wrap gap-1.5">
            {KIND_CHOICES.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={cx(
                  'min-h-[40px] rounded-full px-4 text-[13px] transition-colors',
                  kind === k ? 'bg-ink font-semibold text-cream' : 'bg-tab text-ink hover:bg-line'
                )}
              >
                {t(`kinds.${k}`)}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="grid grid-cols-2 gap-3 ph:grid-cols-1">
        <div>
          <label htmlFor={id('name')} className="label">
            {t('name')}
          </label>
          <input id={id('name')} name="name" autoComplete="name" className="field" autoFocus={autoFocus} maxLength={80} />
        </div>
        <div>
          <label htmlFor={id('phone')} className="label">
            {t('phone')} <span aria-hidden="true">*</span>
          </label>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-required="true"
            aria-invalid={!!phoneError}
            aria-describedby={phoneError ? id('phone-err') : undefined}
            placeholder={t('phonePlaceholder')}
            className={cx('field', phoneError && 'border-[#B4442E]')}
            maxLength={30}
          />
          {phoneError ? (
            <p id={id('phone-err')} className="mt-1 text-[12px] font-semibold text-[#B4442E]">
              {phoneError}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset>
        <legend className="label">{t('messenger')}</legend>
        <div className="grid grid-cols-3 gap-1.5">
          {MESSENGERS.map((m) => {
            const Icon = m === 'whatsapp' ? WhatsAppIcon : m === 'telegram' ? TelegramIcon : Phone;
            const on = messenger === m;
            return (
              <label
                key={m}
                className={cx(
                  'flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full border text-[13px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber',
                  on ? 'border-ink bg-ink font-semibold text-cream' : 'border-line-2 bg-white text-ink hover:border-ink'
                )}
              >
                <input
                  type="radio"
                  name="messenger"
                  value={m}
                  checked={on}
                  onChange={() => setMessenger(m)}
                  className="sr-only"
                />
                <Icon size={15} />
                {tc(m)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {extra.length ? (
        <div className="grid grid-cols-2 gap-3">
          {extra.map((f) => (
            <div key={f.name} className={f.half ? '' : 'col-span-2'}>
              <label htmlFor={id(f.name)} className="label">
                {t(f.name)}
              </label>
              <input
                id={id(f.name)}
                name={f.name}
                type={f.type ?? 'text'}
                min={f.type === 'number' ? 1 : undefined}
                max={f.type === 'number' ? 50 : undefined}
                placeholder={f.ph ? t(f.ph) : undefined}
                className="field"
                maxLength={120}
              />
            </div>
          ))}
        </div>
      ) : null}

      {usesGenericDates ? (
        <div className="grid grid-cols-2 gap-3 ph:grid-cols-1">
          <div>
            <label htmlFor={id('dates')} className="label">
              {t('dates')}
            </label>
            <input id={id('dates')} name="dates" placeholder={t('datesPlaceholder')} className="field" maxLength={120} />
          </div>
          <div>
            <label htmlFor={id('travelers')} className="label">
              {t('travelers')}
            </label>
            <input
              id={id('travelers')}
              name="travelers"
              placeholder={t('travelersPlaceholder')}
              className="field"
              maxLength={80}
            />
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor={id('message')} className="label">
          {t('message')}
        </label>
        <textarea
          id={id('message')}
          name="message"
          rows={3}
          placeholder={t('messagePlaceholder')}
          className="field"
          maxLength={2000}
        />
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === 'error' ? (
        <p role="alert" className="rounded-2xl bg-[#F6DCD4] px-4 py-3 text-[13px] font-semibold text-[#7A2A19]">
          {t('error')}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex min-h-[50px] items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 text-[14px] font-semibold text-cream transition-opacity disabled:opacity-60"
        >
          {state === 'sending' ? t('sending') : t('submit')}
          <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-cream text-ink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </button>
        <p className="max-w-[260px] text-[12px] leading-[1.45] text-body-muted">{t('privacy')}</p>
      </div>
    </form>
  );
}
