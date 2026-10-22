'use client';

import { cx } from '@/lib/utils';
import { useSite, type EnquiryPreset } from './SiteProvider';

/** Any "Book" button: opens the enquiry modal with the tour/service preselected. */
export function BookButton({
  preset,
  className,
  children,
  variant = 'cream',
}: {
  preset?: EnquiryPreset;
  className?: string;
  children: React.ReactNode;
  variant?: 'cream' | 'ink' | 'outline-light' | 'outline-dark';
}) {
  const { openEnquiry } = useSite();
  return (
    <button
      type="button"
      onClick={() => openEnquiry(preset)}
      className={cx(
        'inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-[22px] text-[14px] font-semibold transition-colors',
        variant === 'cream' && 'bg-cream text-ink hover:bg-white',
        variant === 'ink' && 'bg-ink text-cream hover:bg-[#2a2826]',
        variant === 'outline-light' && 'border border-white/40 font-normal text-cream hover:border-white',
        variant === 'outline-dark' && 'border border-ink text-ink hover:bg-ink hover:text-cream',
        className
      )}
    >
      {children}
    </button>
  );
}
