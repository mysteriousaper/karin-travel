import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { TourView } from '@/lib/data';
import { placeholderFor, cx } from '@/lib/utils';
import { ArrowUpRight } from './Icons';
import { Price } from './Price';

/** The photo card from "Our tours". `height` drives the staggered layout on Home. */
export function TourCard({
  tour,
  height = 330,
  sizes = '(max-width: 700px) 78vw, (max-width: 1100px) 50vw, 340px',
  className,
  showPrice,
  tone = 'light',
}: {
  tour: TourView;
  height?: number;
  sizes?: string;
  className?: string;
  /** Show "[price]" when the tour has no price yet (tours list). */
  showPrice?: boolean;
  /** "dark" for cards placed on the dark panels. */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  const t = useTranslations();
  const length = t(`duration.${tour.durationUnit}`, { count: tour.duration });
  const href = `/tours/${tour.slug}`;

  return (
    <article className={cx('group flex flex-col gap-3', className)}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block overflow-hidden rounded-card bg-line ph:!h-[340px]"
        style={{ height }}
      >
        <Image
          src={tour.coverImage}
          alt={tour.title}
          fill
          sizes={sizes}
          quality={75}
          placeholder={placeholderFor(tour.coverImage)}
          className="object-cover transition-transform duration-[600ms] ease-calm group-hover:scale-[1.04]"
        />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/[0.92] px-[11px] py-[5px] text-[12px] font-semibold text-ink">
          {length}
        </span>
        {tour.badge ? (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-ink/80 px-[11px] py-[5px] text-[12px] font-semibold text-cream backdrop-blur">
            {tour.badge}
          </span>
        ) : null}
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-[17px] font-semibold">
            <Link href={href} className={cx('no-underline', dark ? 'text-cream hover:text-cream' : 'text-ink hover:text-ink')}>
              {tour.title}
            </Link>
          </h3>
          <p className={cx('mt-1 text-[13px] leading-[1.5]', dark ? 'text-foot-muted' : 'text-body-muted')}>{tour.summary}</p>
          {tour.priceFrom != null ? (
            <p className={cx('mt-1.5 text-[13px]', dark ? 'text-cream' : 'text-ink')}>
              <span className={dark ? 'text-foot-muted' : 'text-body-muted'}>{t('tour.from')}</span>{' '}
              <span className="font-semibold">
                <Price amount={tour.priceFrom} base={tour.currency} />
              </span>
            </p>
          ) : showPrice ? (
            <p className="mt-1.5 text-[13px] font-semibold">{t('tour.price')}</p>
          ) : null}
        </div>
        <Link
          href={href}
          aria-label={t('home.open', { title: tour.title })}
          className={cx(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors',
            dark
              ? 'border-line-dark-2 text-cream hover:border-cream hover:bg-cream hover:text-ink'
              : 'border-line-2 text-ink hover:border-ink hover:bg-ink hover:text-cream'
          )}
        >
          <ArrowUpRight />
        </Link>
      </div>
    </article>
  );
}
