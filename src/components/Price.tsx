'use client';

import { useSite } from './SiteProvider';

/** A tour price, converted to the visitor's currency at the CBA rate. */
export function Price({ amount, base }: { amount: number; base: string }) {
  const { money } = useSite();
  return <span className="tabular-nums">{money(amount, base)}</span>;
}
