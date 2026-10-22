import Image from 'next/image';
import { cx } from '@/lib/utils';
import { Header, type NavKey } from './Header';

/** Photo panel used at the top of inner pages: same header, smaller height. */
export function PageHero({
  image,
  alt,
  kicker,
  title,
  accent,
  active,
  children,
  tall,
}: {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  accent?: string;
  active: NavKey;
  children?: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <section
      className={cx(
        'relative mx-auto flex max-w-page flex-col overflow-hidden rounded-panel bg-[#2A1C17] ph:rounded-[24px]',
        // On phones the panel is a fixed share of the screen, tall enough that a
        // font swap never changes its height (no layout shift below it).
        tall ? 'min-h-[640px] ph:min-h-[calc(100svh-120px)]' : 'min-h-[520px] ph:min-h-[max(560px,calc(100svh-180px))]'
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1432px) 100vw, 1400px"
        quality={78}
        fetchPriority="high"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.15) 35%,rgba(0,0,0,0.2) 60%,rgba(0,0,0,0.72) 100%)',
        }}
      />
      <Header active={active} />
      <div className="relative px-6 pt-10 text-center ph:px-5 ph:pt-7">
        <span className="glass inline-block rounded-full !bg-white/[0.16] px-4 py-[7px] text-[13px] backdrop-blur-[8px]">
          {kicker}
        </span>
        <h1
          className="mx-auto mt-5 max-w-[1000px] text-[72px] font-light leading-none tracking-[-0.035em] tab:text-[44px] ph:text-[38px] ph:leading-[1.05]"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.25)' }}
        >
          {title}
          {accent ? (
            <>
              {' '}
              <span className="serif text-gold">{accent}</span>
            </>
          ) : null}
        </h1>
      </div>
      <div className="relative mt-auto px-8 pb-8 pt-10 ph:px-5 ph:pb-[22px]">{children}</div>
    </section>
  );
}

/** "+ Label" pill used above section headings. */
export function SectionPill({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full py-[5px] pl-[5px] pr-3.5 text-[13px]',
        dark ? 'bg-cream text-ink' : 'border border-line'
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-cream">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      {children}
    </span>
  );
}
