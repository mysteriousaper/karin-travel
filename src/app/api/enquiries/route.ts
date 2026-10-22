import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { notifyEnquiry } from '@/lib/notify';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { SERVICE_KINDS } from '@/lib/utils';

const opt = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const schema = z.object({
  name: z.string().trim().max(80).optional().default(''),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v.replace(/\D/g, '').length >= 6, 'phone'),
  messenger: z.enum(['whatsapp', 'telegram', 'call']).default('whatsapp'),
  dates: opt(120),
  travelers: opt(80),
  message: opt(2000),
  kind: z.enum(SERVICE_KINDS).default('general'),
  tourSlug: opt(120),
  tourTitle: opt(160),
  details: z.record(z.string().max(40), z.string().max(160)).optional().default({}),
  locale: z.enum(['hy', 'ru', 'en']).default('hy'),
  source: opt(200),
  company: z.string().optional().nullable(), // honeypot
});

export async function POST(req: Request) {
  if (!rateLimit(`enq:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'too_many' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { company, details, ...data } = parsed.data;

  // Bots fill the hidden field: pretend it worked, store nothing.
  if (company) return NextResponse.json({ ok: true });

  // Trust the tour title from the database, not from the client.
  let tourTitle = data.tourTitle;
  if (data.tourSlug) {
    const tr = await db.tourTranslation.findFirst({
      where: { tour: { slug: data.tourSlug }, locale: 'en' },
      select: { title: true },
    });
    tourTitle = tr?.title ?? tourTitle;
  }

  const enquiry = await db.enquiry.create({
    data: { ...data, name: data.name || '—', tourTitle, details: JSON.stringify(details) },
  });

  const notified = await notifyEnquiry(enquiry);
  if (notified) await db.enquiry.update({ where: { id: enquiry.id }, data: { notified: true } });

  return NextResponse.json({ ok: true, id: enquiry.id });
}
