import Link from 'next/link';
import { Fragment } from 'react';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { cx, digits, parseJson, SERVICE_KINDS } from '@/lib/utils';
import { deleteEnquiry, setEnquiryStatus } from '../../actions';
import { btn, PageHead, STATUS_CLS, STATUS_LABEL } from '../ui';

export const metadata = { title: 'Enquiries' };

type SP = Promise<{ status?: string; kind?: string; q?: string }>;

const DETAIL_LABEL: Record<string, string> = {
  from: 'From', to: 'To', departDate: 'Departure', returnDate: 'Return', passengers: 'Passengers',
  city: 'City', checkin: 'Check-in', checkout: 'Check-out', guests: 'Guests',
  country: 'Country', travelDate: 'Trip date', applicants: 'Applicants',
  organization: 'Employer', destinationIdea: 'Destination',
};

export default async function Enquiries({ searchParams }: { searchParams: SP }) {
  const { status = '', kind = '', q = '' } = await searchParams;
  const where: Prisma.EnquiryWhereInput = {};
  if (status) where.status = status;
  if (kind) where.kind = kind;
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }, { tourTitle: { contains: q } }];
  const list = await db.enquiry.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });

  const filterHref = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ status, kind, q, ...patch });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    const s = p.toString();
    return `/admin/enquiries${s ? `?${s}` : ''}`;
  };
  const chip = (on: boolean) =>
    cx('inline-flex min-h-[36px] items-center rounded-full px-3.5 text-[13px] no-underline', on ? 'bg-ink font-semibold text-cream' : 'bg-tab text-ink hover:bg-line');

  return (
    <>
      <PageHead title="Enquiries" sub={`${list.length} shown · newest first`} />

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['', 'new', 'in_progress', 'done'].map((s) => (
            <Link key={s || 'all'} href={filterHref({ status: s })} className={chip(status === s)}>
              {s ? STATUS_LABEL[s] : 'All statuses'}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['', ...SERVICE_KINDS].map((k) => (
            <Link key={k || 'all'} href={filterHref({ kind: k })} className={chip(kind === k)}>
              {k || 'All types'}
            </Link>
          ))}
        </div>
        <form className="flex max-w-[420px] gap-2">
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="kind" value={kind} />
          <input name="q" defaultValue={q} placeholder="Search name, phone or tour" className="field !min-h-[44px]" aria-label="Search" />
          <button className={btn.outline}>Search</button>
        </form>
      </div>

      {list.length === 0 ? <p className="text-[14px] text-body-muted">Nothing here.</p> : null}

      <ul className="flex flex-col gap-3">
        {list.map((e) => {
          const details = parseJson<Record<string, string>>(e.details, {});
          const phone = digits(e.phone);
          const intl = phone.length === 9 && phone.startsWith('0') ? `374${phone.slice(1)}` : phone;
          return (
            <li key={e.id} className="rounded-[22px] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${STATUS_CLS[e.status]}`}>{STATUS_LABEL[e.status]}</span>
                    <span className="rounded-full bg-tab px-3 py-1 text-[12px]">{e.kind}</span>
                    <span className="text-[12px] text-body-muted">
                      {e.createdAt.toLocaleString('en-GB', { timeZone: 'Asia/Yerevan' })} · {e.locale.toUpperCase()}
                      {e.notified ? ' · sent to Telegram' : ''}
                    </span>
                  </div>
                  <p className="mt-2 text-[18px] font-semibold">
                    {e.name} <span className="font-normal text-body-muted">· prefers {e.messenger}</span>
                  </p>
                  {e.tourTitle ? <p className="text-[14px]">Tour: <b>{e.tourTitle}</b>{e.tourSlug ? <> · <a href={`/en/tours/${e.tourSlug}`} target="_blank" className="text-ink underline">open</a></> : null}</p> : null}
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[14px]">
                    {e.dates ? (<><dt className="text-body-muted">Dates</dt><dd>{e.dates}</dd></>) : null}
                    {e.travelers ? (<><dt className="text-body-muted">Travelers</dt><dd>{e.travelers}</dd></>) : null}
                    {Object.entries(details).map(([k, v]) => (
                      <Fragment key={k}><dt className="text-body-muted">{DETAIL_LABEL[k] ?? k}</dt><dd>{v}</dd></Fragment>
                    ))}
                  </dl>
                  {e.message ? <p className="mt-3 whitespace-pre-line rounded-2xl bg-cream p-3 text-[14px] leading-[1.55]">{e.message}</p> : null}
                  {e.source ? <p className="mt-2 text-[12px] text-body-muted">From: {e.source}</p> : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <a href={`tel:+${intl}`} className={btn.primary}>Call {e.phone}</a>
                    <a href={`https://wa.me/${intl}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center rounded-full bg-whatsapp px-5 text-[14px] font-semibold text-whatsapp-ink no-underline">
                      WhatsApp
                    </a>
                  </div>
                  <form action={setEnquiryStatus} className="flex gap-1.5">
                    <input type="hidden" name="id" value={e.id} />
                    {(['new', 'in_progress', 'done'] as const).map((s) => (
                      <button key={s} name="status" value={s} disabled={e.status === s} className={cx(btn.small, e.status === s && 'border-ink bg-ink text-cream')}>
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </form>
                  <form action={deleteEnquiry}>
                    <input type="hidden" name="id" value={e.id} />
                    <button className="text-[12px] text-[#8A2F1C] underline">Delete</button>
                  </form>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
