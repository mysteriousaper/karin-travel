import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { contactsFor, getSettings } from '@/lib/settings';
import { pageMeta } from '@/lib/seo';
import { digits, localPhone } from '@/lib/utils';
import { PageHero, SectionPill } from '@/components/PageHero';
import { EnquiryForm } from '@/components/EnquiryForm';
import { MapEmbed } from '@/components/MapEmbed';
import { Clock, InstagramIcon, Phone, Pin, TelegramIcon, WhatsAppIcon } from '@/components/Icons';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMeta({ locale, path: '/contacts', title: t('contactsTitle'), description: t('contactsDescription'), image: '/images/yerevan-ararat.jpg' });
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream">{icon}</span>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-body-muted">{title}</h2>
      </div>
      <div className="mt-4 text-[17px] leading-[1.55]">{children}</div>
    </div>
  );
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contactsPage');
  const tc = await getTranslations('common');
  const c = contactsFor(await getSettings(), locale);
  const mapQ = encodeURIComponent(c.mapQuery);
  const pill =
    'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line-2 px-4 text-[14px] font-semibold text-ink no-underline hover:border-ink hover:text-ink';

  return (
    <>
      <PageHero image="/images/yerevan-ararat.jpg" alt="Yerevan and Mount Ararat" kicker={t('kicker')} title={t('title')} accent={t('accent')} active={null}>
        <p className="max-w-[480px] text-[15px] leading-[1.55] text-hero-muted">{t('intro')}</p>
      </PageHero>

      <section className="panel bg-cream px-10 py-14 text-ink ph:px-5 ph:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 tab:grid-cols-1">
          <div className="grid grid-cols-2 gap-4 ph:grid-cols-1">
            <Card icon={<Pin size={17} />} title={t('address')}>
              <p>{t('addressFull')}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[14px] font-semibold text-ink underline underline-offset-4 hover:text-muted"
              >
                {t('openMap')}
              </a>
            </Card>
            <Card icon={<Phone size={17} />} title={t('phones')}>
              <p className="flex flex-col">
                <a href={`tel:+${digits(c.phone1)}`} className="text-ink no-underline hover:text-muted">{localPhone(c.phone1)}</a>
                <a href={`tel:+${digits(c.phone2)}`} className="text-ink no-underline hover:text-muted">{localPhone(c.phone2)}</a>
              </p>
            </Card>
            <Card icon={<WhatsAppIcon size={17} />} title={t('messengers')}>
              <div className="flex flex-wrap gap-2">
                <a href={`https://wa.me/${digits(c.whatsapp)}`} target="_blank" rel="noopener noreferrer" className={pill}>
                  <WhatsAppIcon size={16} /> {tc('whatsapp')}
                </a>
                {c.telegram ? (
                  <a href={c.telegram} target="_blank" rel="noopener noreferrer" className={pill}>
                    <TelegramIcon size={16} /> {tc('telegram')}
                  </a>
                ) : null}
                <a href={c.instagram} target="_blank" rel="noopener noreferrer" className={pill}>
                  <InstagramIcon size={16} /> {tc('instagram')}
                </a>
              </div>
            </Card>
            <Card icon={<Clock size={17} />} title={t('hours')}>
              <p className="whitespace-pre-line">{c.hours || t('hoursValue')}</p>
            </Card>
            <div className="col-span-2 rounded-card bg-ink p-6 text-cream ph:col-span-1">
              <p className="text-[15px] leading-[1.6]">{t('instagram')}</p>
              <p className="mt-3 text-[14px] leading-[1.6] text-foot-muted">{t('itb')}</p>
            </div>
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-card bg-line ph:min-h-[340px]">
            <MapEmbed query={c.mapQuery} locale={locale} title={t('map')} label={t('showMap')} />
          </div>
        </div>
      </section>

      <section className="panel bg-panel px-10 py-14 ph:px-5 ph:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 tab:grid-cols-1">
          <div>
            <SectionPill dark>Karin Travel</SectionPill>
            <h2 className="mt-5 text-[44px] font-medium leading-[1.08] tracking-[-0.03em] tab:text-[32px]">{t('formTitle')}</h2>
          </div>
          <div className="rounded-[24px] bg-cream p-7 text-ink ph:p-5">
            <EnquiryForm source="contacts" />
          </div>
        </div>
      </section>
    </>
  );
}
