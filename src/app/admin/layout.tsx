import type { Metadata } from 'next';
import { fontVars } from '../fonts';
import '../google-sans.css';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Karin admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body className="bg-ink font-sans text-cream">{children}</body>
    </html>
  );
}
