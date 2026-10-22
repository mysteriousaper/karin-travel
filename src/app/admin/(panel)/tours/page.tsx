import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { cx } from '@/lib/utils';
import { btn, PageHead } from '../ui';

export const metadata = { title: 'Tours' };

export default async function ToursAdmin() {
  const tours = await db.tour.findMany({
    include: { translations: { where: { locale: 'en' } } },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });

  return (
    <>
      <PageHead
        title="Tours"
        sub="Featured tours appear in the Home tabs (first four per category, by sort order)."
        action={<Link href="/admin/tours/new" className={btn.primary}>+ Add tour</Link>}
      />
      <div className="overflow-x-auto rounded-[22px] bg-white">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="border-b border-line text-[12px] uppercase tracking-[0.06em] text-body-muted">
            <tr>
              <th className="p-4">Tour</th>
              <th className="p-4">Category</th>
              <th className="p-4">Length</th>
              <th className="p-4">From</th>
              <th className="p-4">Home</th>
              <th className="p-4">Order</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tours.map((t) => (
              <tr key={t.id} className={cx(!t.published && 'opacity-50')}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-line">
                      <Image src={t.coverImage} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <div>
                      <p className="font-semibold">{t.translations[0]?.title ?? t.slug}</p>
                      <p className="text-[12px] text-body-muted">/{t.slug}{t.published ? '' : ' · hidden'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 capitalize">{t.category}</td>
                <td className="p-4">{t.duration} {t.durationUnit}</td>
                <td className="p-4">{t.priceFrom != null ? `${t.priceFrom} ${t.currency}` : <span className="text-body-muted">[price]</span>}</td>
                <td className="p-4">{t.featured ? '★' : ''}</td>
                <td className="p-4 tabular-nums">{t.sortOrder}</td>
                <td className="p-4 text-right">
                  <Link href={`/admin/tours/${t.id}`} className={btn.small}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
