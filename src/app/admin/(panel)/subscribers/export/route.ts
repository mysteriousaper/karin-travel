import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export async function GET() {
  if (!(await getSession())) return new Response('Unauthorized', { status: 401 });
  const rows = await db.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  const csv = [
    'contact,locale,created_at',
    ...rows.map((r) => [cell(r.contact), r.locale, r.createdAt.toISOString()].join(',')),
  ].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  // BOM so Excel opens UTF-8 correctly.
  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="karin-subscribers-${date}.csv"`,
    },
  });
}
