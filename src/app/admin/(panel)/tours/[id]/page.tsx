import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { BackLink, PageHead, Saved } from '../../ui';
import { TourForm } from '../TourForm';

export const metadata = { title: 'Edit tour' };

export default async function EditTour({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const tour = await db.tour.findUnique({ where: { id }, include: { translations: true } });
  if (!tour) notFound();
  const en = tour.translations.find((t) => t.locale === 'en');

  return (
    <>
      <BackLink href="/admin/tours">All tours</BackLink>
      <PageHead
        title={en?.title ?? tour.slug}
        action={
          <a href={`/en/tours/${tour.slug}`} target="_blank" className="text-[14px] font-semibold text-ink underline">
            View on site ↗
          </a>
        }
      />
      <Saved show={!!saved} />
      <TourForm tour={tour} />
    </>
  );
}
