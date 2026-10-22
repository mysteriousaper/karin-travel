import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { cx } from '@/lib/utils';
import { btn, PageHead } from '../ui';

export const metadata = { title: 'Hero slides' };

export default async function SlidesAdmin() {
  const slides = await db.heroSlide.findMany({
    include: { translations: { where: { locale: 'en' } } },
    orderBy: { sortOrder: 'asc' },
  });
  return (
    <>
      <PageHead
        title="Hero slides"
        sub="The slider at the top of the Home page. Active slides show in sort order."
        action={<Link href="/admin/slides/new" className={btn.primary}>+ Add slide</Link>}
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {slides.map((s) => {
          const tr = s.translations[0];
          return (
            <Link key={s.id} href={`/admin/slides/${s.id}`} className={cx('group overflow-hidden rounded-[22px] bg-white text-ink no-underline', !s.active && 'opacity-50')}>
              <span className="relative block aspect-[16/10] bg-line">
                <Image src={s.image} alt="" fill sizes="320px" className="object-cover" />
              </span>
              <span className="block p-4">
                <span className="block text-[16px] font-semibold">
                  {tr?.title} <span className="serif">{tr?.accent}</span>
                </span>
                <span className="block text-[13px] text-body-muted">
                  #{s.sortOrder} · {tr?.name}
                  {s.active ? '' : ' · hidden'}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
