import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  contact: z.string().trim().min(3).max(120),
  locale: z.enum(['hy', 'ru', 'en']).default('hy'),
});

function normalise(contact: string) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return contact.toLowerCase();
  const d = contact.replace(/\D/g, '');
  if (d.length < 8 || !/^[+\d\s()-]+$/.test(contact)) return null;
  // 098555085 → +37498555085; anything already international stays as is.
  if (d.length === 9 && d.startsWith('0')) return `+374${d.slice(1)}`;
  return `+${d}`;
}

export async function POST(req: Request) {
  if (!rateLimit(`sub:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'too_many' }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  const contact = parsed.success ? normalise(parsed.data.contact) : null;
  if (!parsed.success || !contact) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  await db.subscriber.upsert({
    where: { contact },
    update: {},
    create: { contact, locale: parsed.data.locale },
  });
  return NextResponse.json({ ok: true });
}
