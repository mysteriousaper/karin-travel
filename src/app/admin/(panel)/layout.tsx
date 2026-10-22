import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { logout } from '../actions';
import { AdminNav } from './AdminNav';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const fresh = await db.enquiry.count({ where: { status: 'new' } });

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] gap-4 p-4 tab:grid-cols-1 ph:gap-2 ph:p-2">
      <aside className="flex flex-col rounded-panel bg-panel p-5 tab:rounded-[24px]">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-cream no-underline">
            <span className="serif text-[30px]">Karin</span>
            <span className="ml-2 text-[11px] tracking-[0.2em] opacity-70">ADMIN</span>
          </Link>
          <a href="/hy" target="_blank" className="text-[12px] text-foot-muted underline hover:text-amber">
            Open site ↗
          </a>
        </div>
        <AdminNav fresh={fresh} />
        <div className="mt-auto border-t border-line-foot pt-4 text-[12px] text-foot-muted tab:mt-4">
          <p className="truncate">{session.email}</p>
          <form action={logout}>
            <button type="submit" className="mt-2 min-h-[40px] rounded-full border border-line-dark-2 px-4 text-[13px] text-cream hover:border-cream">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 rounded-panel bg-cream p-8 text-ink tab:rounded-[24px] ph:p-4">{children}</main>
    </div>
  );
}
