import { getTranslations } from 'next-intl/server';
import { localPhone } from '@/lib/utils';

/** "How to book your trip": giant heading, looping destination strip, 4 steps. */
export async function HowToBook({ phone, headingLevel = 'h2' }: { phone: string; headingLevel?: 'h1' | 'h2' }) {
  const t = await getTranslations('home');
  const marquee = t.raw('marquee') as string[];
  const steps = t.raw('steps') as { title: string; text: string }[];
  const Heading = headingLevel;
  const strip = [...marquee, ...marquee];

  return (
    <section id="book" className="panel bg-cream text-ink">
      <div className="px-8 pb-5 pt-14 ph:px-5 ph:pb-4 ph:pt-10">
        <Heading className="m-0 text-[112px] font-semibold leading-[0.95] tracking-[-0.045em] mid:text-[88px] tab:text-[46px]">
          {t('bookH2')}
        </Heading>
      </div>
      <div aria-hidden="true" className="overflow-hidden whitespace-nowrap border-y border-line py-[18px] text-[24px] ph:py-3.5 ph:text-[19px]">
        <div className="marquee-track">
          {strip.map((m, i) => (
            <span key={i} className="flex gap-7">
              <span>{m}</span>
              <span className="text-plus">+</span>
            </span>
          ))}
        </div>
      </div>
      <ol className="m-0 grid list-none grid-cols-5 p-0 mid:grid-cols-[1.2fr_repeat(4,1fr)] tab:grid-cols-2 ph:grid-cols-1">
        <li className="border-r border-line px-8 py-9 tab:col-span-2 tab:border-b tab:border-r-0 ph:col-span-1 ph:border-b-0 ph:px-5 ph:py-[22px]">
          <p className="text-[24px] font-semibold">{t('stepsTitle')}</p>
          <p className="mt-2.5 text-[14px] leading-[1.55] text-body-muted">
            {t('stepsIntro', { phone: localPhone(phone) })}
          </p>
        </li>
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={[
              'border-line px-8 py-9 ph:grid ph:grid-cols-[52px_1fr] ph:gap-x-2 ph:border-r-0 ph:border-t ph:px-5 ph:py-[22px]',
              i < steps.length - 1 ? 'border-r border-line' : '',
              i % 2 === 1 ? 'tab:border-r-0' : '',
              i < 2 ? 'tab:border-b' : '',
            ].join(' ')}
          >
            <p className="text-[28px] font-semibold ph:row-span-2 ph:text-[22px]">{String(i + 1).padStart(2, '0')}.</p>
            <p className="mt-[18px] text-[17px] font-semibold ph:mt-0">{s.title}</p>
            <p className="mt-2 text-[14px] leading-[1.55] text-body-muted ph:col-start-2">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
