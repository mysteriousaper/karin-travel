import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { PublicContacts } from '@/lib/settings';
import { formatNumber, type Rates } from '@/lib/money';
import { digits, localPhone } from '@/lib/utils';
import { SubscribeForm } from './SubscribeForm';

const linkCls = 'text-cream underline decoration-1 underline-offset-[3px] hover:text-amber';

export async function Footer({ contacts, rates }: { contacts: PublicContacts; rates: Rates }) {
  const t = await getTranslations('footer');
  const tc = await getTranslations('common');
  const tr = await getTranslations('currency');
  const locale = await getLocale();
  const nf = (n: number) => formatNumber(n, locale, 2);
  const year = new Date().getFullYear();

  return (
    <footer className="panel bg-panel px-10 pb-7 pt-14 ph:px-5 ph:pb-6 ph:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-10">
        <div className="max-w-[560px]">
          <h2 className="m-0 text-[44px] font-normal leading-[1.1] tracking-[-0.03em] tab:text-[32px]">
            {t('h2a')} <span className="serif text-gold">{t('h2b')}</span>
          </h2>
          <p className="mt-3 text-[15px] text-foot-muted">{t('sub')}</p>
        </div>
        <SubscribeForm />
      </div>

      <div className="mt-14 flex flex-wrap justify-between gap-8 border-t border-line-foot pt-7 text-[14px] text-foot-muted">
        <div>
          <span className="brand-serif text-[30px] text-cream">Karin</span>
          <p className="mt-2 leading-[1.6]">
            {contacts.address}
            <br />
            <a href={`tel:+${digits(contacts.phone1)}`} className="text-foot-muted no-underline hover:text-amber">
              {localPhone(contacts.phone1)}
            </a>
            {' · '}
            <a href={`tel:+${digits(contacts.phone2)}`} className="text-foot-muted no-underline hover:text-amber">
              {localPhone(contacts.phone2)}
            </a>
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-12 ph:gap-x-10 ph:gap-y-6">
          <div className="flex flex-col gap-2.5">
            <Link href="/tours" className={linkCls}>{t('tours')}</Link>
            <Link href="/services#air" className={linkCls}>{t('air')}</Link>
            <Link href="/services#hotels" className={linkCls}>{t('hotels')}</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/services#visa" className={linkCls}>{t('visa')}</Link>
            <Link href="/services#social" className={linkCls}>{t('social')}</Link>
            <Link href="/how-to-book" className={linkCls}>{t('how')}</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <a href={contacts.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {tc('instagram')}
            </a>
            <a href={`https://wa.me/${digits(contacts.whatsapp)}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {tc('whatsapp')}
            </a>
            {contacts.telegram ? (
              <a href={contacts.telegram} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {tc('telegram')}
              </a>
            ) : null}
            <a href={`tel:+${digits(contacts.phone2)}`} className={linkCls}>
              {tc('callUs')}
            </a>
            <Link href="/contacts" className={linkCls}>{t('contacts')}</Link>
          </div>
        </nav>
      </div>
      <p className="mt-7 max-w-[760px] text-[12px] leading-[1.5] text-foot-muted">
        {tr('footer', {
          date: rates.date.split('-').reverse().join('.'),
          usd: nf(rates.amd.USD),
          eur: nf(rates.amd.EUR),
          rub: nf(rates.amd.RUB),
        })}
      </p>
      <p className="mt-3 text-[12px] text-foot-muted">{t('rights', { year })}</p>
    </footer>
  );
}
