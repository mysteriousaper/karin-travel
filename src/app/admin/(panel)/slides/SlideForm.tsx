import Image from 'next/image';
import type { HeroSlide, HeroSlideTranslation } from '@prisma/client';
import { db } from '@/lib/db';
import { deleteSlide, saveSlide } from '../../actions';
import { Box, btn, Check, Field } from '../ui';

const LOCALES = [
  { code: 'hy', label: 'Armenian (HY)' },
  { code: 'ru', label: 'Russian (RU)' },
  { code: 'en', label: 'English (EN)' },
] as const;

export async function SlideForm({ slide }: { slide?: HeroSlide & { translations: HeroSlideTranslation[] } }) {
  const tours = await db.tour.findMany({
    include: { translations: { where: { locale: 'en' } } },
    orderBy: { sortOrder: 'asc' },
  });
  const tr = (l: string) => slide?.translations.find((x) => x.locale === l);

  return (
    <>
      <form action={saveSlide} className="flex flex-col gap-5">
        {slide ? <input type="hidden" name="id" value={slide.id} /> : null}
        <Box title="Slide">
          <div className="grid grid-cols-2 gap-6 tab:grid-cols-1">
            <div>
              {slide?.image ? (
                <span className="relative mb-3 block aspect-[16/9] overflow-hidden rounded-2xl bg-line">
                  <Image src={slide.image} alt="" fill sizes="500px" className="object-cover" />
                </span>
              ) : null}
              <Field label="Image path" name="image" defaultValue={slide?.image} hint="e.g. /images/maldives-2.jpg — or upload below" />
              <label htmlFor="f-imageFile" className="label mt-3">Upload image</label>
              <input id="f-imageFile" name="imageFile" type="file" accept="image/*" className="text-[13px]" />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="f-tourId" className="label">Linked tour</label>
                <select id="f-tourId" name="tourId" defaultValue={slide?.tourId ?? ''} className="field">
                  <option value="">— none —</option>
                  {tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.translations[0]?.title ?? t.slug}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[12px] text-body-muted">“Book this trip” and “What's included” use this tour.</p>
              </div>
              <Field label="Sort order" name="sortOrder" type="number" defaultValue={slide?.sortOrder ?? 0} />
              <Check label="Active" name="active" defaultChecked={slide?.active ?? true} />
            </div>
          </div>
        </Box>
        {LOCALES.map((l) => {
          const t = tr(l.code);
          return (
            <details key={l.code} open={l.code === 'en' || !slide} className="rounded-[22px] bg-white p-6 ph:p-4">
              <summary className="cursor-pointer text-[16px] font-semibold">{l.label}</summary>
              <div className="mt-4 grid grid-cols-2 gap-4 tab:grid-cols-1">
                <Field label="Kicker (small pill)" name={`${l.code}.kicker`} defaultValue={t?.kicker} placeholder="Egypt · Giza & Hurghada" />
                <Field label="Name (bottom left)" name={`${l.code}.name`} defaultValue={t?.name} placeholder="Cairo & Hurghada combo" />
                <Field label="Headline" name={`${l.code}.title`} defaultValue={t?.title} placeholder="Sunset at the" />
                <Field label="Accent word (gold italic)" name={`${l.code}.accent`} defaultValue={t?.accent} placeholder="Pyramids" />
                <Field label="When" name={`${l.code}.when`} defaultValue={t?.when} placeholder="8 nights · flights from Yerevan" />
                <Field label="Short text (hidden on phones)" name={`${l.code}.text`} defaultValue={t?.text} textarea rows={2} />
              </div>
            </details>
          );
        })}
        <div className="sticky bottom-3 z-10 flex items-center gap-3 rounded-full bg-ink/95 p-2 pl-5 text-cream">
          <span className="text-[13px]">Changes go live right after saving.</span>
          <button type="submit" className="ml-auto inline-flex min-h-[44px] items-center rounded-full bg-cream px-6 text-[14px] font-semibold text-ink">
            Save slide
          </button>
        </div>
      </form>
      {slide ? (
        <form action={deleteSlide} className="mt-8">
          <input type="hidden" name="id" value={slide.id} />
          <button className={btn.danger}>Delete this slide</button>
        </form>
      ) : null}
    </>
  );
}
