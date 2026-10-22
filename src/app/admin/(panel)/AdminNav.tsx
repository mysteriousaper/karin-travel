'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';

const ITEMS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/enquiries', label: 'Enquiries' },
  { href: '/admin/tours', label: 'Tours' },
  { href: '/admin/slides', label: 'Hero slides' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/subscribers', label: 'Subscribers' },
  { href: '/admin/settings', label: 'Site settings' },
];

export function AdminNav({ fresh }: { fresh: number }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="no-scrollbar mt-8 flex flex-col gap-1 tab:mt-4 tab:flex-row tab:overflow-x-auto">
      {ITEMS.map((i) => {
        const on = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={on ? 'page' : undefined}
            className={cx(
              'flex min-h-[44px] shrink-0 items-center justify-between gap-3 rounded-[14px] px-3.5 text-[14px] no-underline',
              on ? 'bg-cream font-semibold text-ink' : 'text-cream hover:bg-card'
            )}
          >
            {i.label}
            {i.href === '/admin/enquiries' && fresh > 0 ? (
              <span className="rounded-full bg-amber px-2 py-0.5 text-[11px] font-bold text-ink">{fresh}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
