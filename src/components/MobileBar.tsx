'use client';

import { useTranslations } from 'next-intl';
import { digits, localPhone } from '@/lib/utils';
import { Phone, WhatsAppIcon } from './Icons';
import { useSite } from './SiteProvider';

/** Fixed bottom bar on phones: Call · WhatsApp · Book a trip. */
export function MobileBar() {
  const t = useTranslations('mbar');
  const { contacts, openEnquiry } = useSite();

  return (
    <div
      role="group"
      aria-label={t('group')}
      className="fixed bottom-[calc(8px+env(safe-area-inset-bottom,0px))] left-2 right-2 z-30 hidden gap-2 rounded-full bg-[rgba(20,19,18,0.92)] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-[12px] ph:flex"
    >
      <a
        href={`tel:+${digits(contacts.phone1)}`}
        aria-label={t('call', { phone: localPhone(contacts.phone1) })}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-dark-2 text-cream hover:text-cream"
      >
        <Phone />
      </a>
      <a
        href={`https://wa.me/${digits(contacts.whatsapp)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp text-[15px] font-bold text-whatsapp-ink no-underline hover:text-whatsapp-ink"
      >
        <WhatsAppIcon size={17} />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => openEnquiry()}
        className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-cream text-[15px] font-bold text-ink"
      >
        {t('book')}
      </button>
    </div>
  );
}
