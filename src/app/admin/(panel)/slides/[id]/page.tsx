import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { BackLink, PageHead, Saved } from '../../ui';
import { SlideForm } from '../SlideForm';

export const metadata = { title: 'Edit slide' };

export default async function EditSlide({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const slide = await db.heroSlide.findUnique({ where: { id }, include: { translations: true } });
  if (!slide) notFound();
  const en = slide.translations.find((t) => t.locale === 'en');
  return (
    <>
      <BackLink href="/admin/slides">All slides</BackLink>
      <PageHead title={en ? `${en.title} ${en.accent}` : 'Slide'} />
      <Saved show={!!saved} />
      <SlideForm slide={slide} />
    </>
  );
}
