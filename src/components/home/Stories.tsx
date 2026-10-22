import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { TestimonialView } from '@/lib/data';
import { placeholderFor } from '@/lib/utils';
import { Play } from '../Icons';
import { PlayButton } from './PlayButton';

export async function Stories({ testimonials, instagram }: { testimonials: TestimonialView[]; instagram: string }) {
  const t = await getTranslations('home');
  const chips = t.raw('chips') as string[];
  const review = testimonials[0];

  return (
    <section
      id="stories"
      className="panel flex flex-wrap gap-8 bg-cream px-10 py-12 text-ink ph:gap-6 ph:px-5 ph:py-9"
    >
      <div className="flex flex-[1_1_320px] flex-col gap-6">
        <h2 className="m-0 text-[38px] font-medium leading-[1.1] tracking-[-0.02em] tab:text-[32px]">
          {t('storiesH2a')} <span className="text-muted">{t('storiesH2b')}</span>
        </h2>
        <p className="m-0 text-[15px] leading-[1.6] text-body-muted">{t('storiesIntro')}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {chips.map((c) => (
            <li key={c} className="rounded-full border border-line-2 px-3.5 py-2 text-[13px]">
              {c}
            </li>
          ))}
        </ul>
        {/* Admin-managed testimonials: hidden until a real review is added. */}
        {review ? (
          <figure className="m-0 rounded-[20px] bg-white p-[22px]">
            <blockquote className="m-0 text-[16px] leading-[1.55]">“{review.text}”</blockquote>
            <figcaption className="mt-4 text-[14px]">
              <b>{review.name}</b>
              {review.place ? <span className="text-body-muted"> · {review.place}</span> : null}
            </figcaption>
          </figure>
        ) : null}
      </div>

      <div className="grid flex-[2_1_520px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 ph:flex-[1_1_100%]">
        <div className="relative min-h-[420px] overflow-hidden rounded-card ph:min-h-[360px]">
          <Image
            src="/images/maldives-plane.jpg"
            alt={t('seaplaneAlt')}
            fill
            sizes="(max-width: 700px) 100vw, 480px"
            quality={75}
            placeholder={placeholderFor('/images/maldives-plane.jpg')}
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.6))]" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-[12px] opacity-85">{t('seaplaneKicker')}</p>
            <p className="text-[19px] font-semibold leading-[1.25]">{t('seaplaneTitle')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-card">
            <Image
              src="/images/hurghada-reef.jpg"
              alt={t('reefAlt')}
              fill
              sizes="(max-width: 700px) 100vw, 480px"
              quality={75}
              placeholder={placeholderFor('/images/hurghada-reef.jpg')}
              className="object-cover"
            />
            <PlayButton label={t('play')} />
          </div>
          <div>
            <p className="text-[17px] font-semibold">{t('videoTitle')}</p>
            <p className="mt-1.5 text-[14px] leading-[1.5] text-body-muted">{t('videoText')}</p>
          </div>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-[50px] items-center justify-between rounded-full border border-ink pl-5 pr-1.5 text-[14px] font-semibold text-ink no-underline transition-colors hover:bg-ink hover:text-cream"
          >
            {t('watch')}
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink text-cream">
              <Play size={14} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
