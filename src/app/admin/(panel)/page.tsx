import Link from 'next/link';
import { db } from '@/lib/db';
import { Box, PageHead, STATUS_CLS, STATUS_LABEL } from './ui';

export const metadata = { title: 'Overview' };

export default async function Overview() {
  const [fresh, inProgress, total, tours, subs, latest] = await Promise.all([
    db.enquiry.count({ where: { status: 'new' } }),
    db.enquiry.count({ where: { status: 'in_progress' } }),
    db.enquiry.count(),
    db.tour.count({ where: { published: true } }),
    db.subscriber.count(),
    db.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);
  const telegram = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

  const stats = [
    { label: 'New enquiries', value: fresh, href: '/admin/enquiries?status=new' },
    { label: 'In progress', value: inProgress, href: '/admin/enquiries?status=in_progress' },
    { label: 'All enquiries', value: total, href: '/admin/enquiries' },
    { label: 'Published tours', value: tours, href: '/admin/tours' },
    { label: 'Subscribers', value: subs, href: '/admin/subscribers' },
  ];

  return (
    <>
      <PageHead title="Overview" sub="Enquiries from the website arrive here and in Telegram." />
      {!telegram ? (
        <p className="mb-6 rounded-2xl bg-[#FBE9CC] px-4 py-3 text-[14px] text-[#5E3B07]">
          Telegram notifications are off. Set <code>TELEGRAM_BOT_TOKEN</code> and <code>TELEGRAM_CHAT_ID</code> in the environment (see README).
        </p>
      ) : null}
      <div className="grid grid-cols-5 gap-3 mid:grid-cols-3 ph:grid-cols-2">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-[22px] bg-white p-5 text-ink no-underline hover:shadow-[0_0_0_1px_#0F0F0E]">
            <p className="text-[34px] font-light tabular-nums">{s.value}</p>
            <p className="mt-1 text-[13px] text-body-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      <Box title="Latest enquiries" className="mt-6">
        {latest.length ? (
          <ul className="divide-y divide-line">
            {latest.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[15px] font-semibold">
                    {e.name} · <span className="font-normal">{e.phone}</span>
                  </p>
                  <p className="text-[13px] text-body-muted">
                    {e.tourTitle ?? e.kind} · {e.createdAt.toLocaleString('en-GB', { timeZone: 'Asia/Yerevan' })}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${STATUS_CLS[e.status]}`}>{STATUS_LABEL[e.status]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-body-muted">No enquiries yet.</p>
        )}
        <Link href="/admin/enquiries" className="mt-4 inline-block text-[14px] font-semibold text-ink underline">
          Open inbox →
        </Link>
      </Box>
    </>
  );
}
