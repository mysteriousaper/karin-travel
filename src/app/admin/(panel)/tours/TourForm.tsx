import Image from 'next/image';
import type { Tour, TourTranslation } from '@prisma/client';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { CATEGORIES, parseJson } from '@/lib/utils';
import { deleteTour, saveTour } from '../../actions';
import { Box, btn, Check, Field } from '../ui';

const LOCALES = [
  { code: 'hy', label: 'Armenian (HY)' },
  { code: 'ru', label: 'Russian (RU)' },
  { code: 'en', label: 'English (EN)' },
] as const;

function libraryImages() {
  try {
    return readdirSync(path.join(process.cwd(), 'public', 'images'))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .map((f) => `/images/${f}`);
  } catch {
    return [];
  }
}

export function TourForm({ tour }: { tour?: Tour & { translations: TourTranslation[] } }) {
  const tr = (l: string) => tour?.translations.find((x) => x.locale === l);
  const gallery = parseJson<string[]>(tour?.gallery, []);
  const images = libraryImages();

  return (
    <>
      <form action={saveTour} className="flex flex-col gap-5">
        {tour ? <input type="hidden" name="id" value={tour.id} /> : null}
        <datalist id="library">
          {images.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>

        <Box title="Basics">
          <div className="grid grid-cols-3 gap-4 tab:grid-cols-2 ph:grid-cols-1">
            <Field label="Slug (URL)" name="slug" defaultValue={tour?.slug} required hint="Latin letters and dashes, e.g. maldives" />
            <div>
              <label htmlFor="f-category" className="label">Category *</label>
              <select id="f-category" name="category" defaultValue={tour?.category ?? 'beach'} className="field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Field label="Badge (optional)" name="badge" defaultValue={tour?.badge} placeholder="e.g. Hot offer" />
            <Field label="Length" name="duration" type="number" defaultValue={tour?.duration ?? 7} required />
            <div>
              <label htmlFor="f-unit" className="label">Unit</label>
              <select id="f-unit" name="durationUnit" defaultValue={tour?.durationUnit ?? 'nights'} className="field">
                <option value="nights">nights</option>
                <option value="days">days</option>
              </select>
            </div>
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={tour?.sortOrder ?? 0} hint="Lower comes first" />
            <Field label="Price from (per person)" name="priceFrom" type="number" defaultValue={tour?.priceFrom} hint="Visitors see it converted to ֏ $ € ₽ at the Central Bank rate. Empty shows [price]." />
            <div>
              <label htmlFor="f-currency" className="label">Currency</label>
              <select id="f-currency" name="currency" defaultValue={tour?.currency ?? 'USD'} className="field">
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="AMD">AMD ֏</option>
                <option value="RUB">RUB ₽</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <Check label="Published" name="published" defaultChecked={tour?.published ?? true} />
              <Check label="Featured on Home" name="featured" defaultChecked={tour?.featured ?? false} />
            </div>
          </div>
        </Box>

        <Box title="Photos">
          <div className="grid grid-cols-2 gap-6 tab:grid-cols-1">
            <div>
              {tour?.coverImage ? (
                <span className="relative mb-3 block aspect-[16/10] overflow-hidden rounded-2xl bg-line">
                  <Image src={tour.coverImage} alt="" fill sizes="400px" className="object-cover" />
                </span>
              ) : null}
              <Field label="Cover image path" name="coverImage" defaultValue={tour?.coverImage} list="library" hint="Pick from the library or upload a new photo below." />
              <label htmlFor="f-coverFile" className="label mt-3">…or upload a cover</label>
              <input id="f-coverFile" name="coverFile" type="file" accept="image/*" className="text-[13px]" />
            </div>
            <div>
              {gallery.length ? (
                <div className="mb-3 grid grid-cols-4 gap-2">
                  {gallery.map((g) => (
                    <span key={g} className="relative aspect-square overflow-hidden rounded-xl bg-line">
                      <Image src={g} alt="" fill sizes="100px" className="object-cover" />
                    </span>
                  ))}
                </div>
              ) : null}
              <Field label="Gallery (one path per line)" name="gallery" textarea rows={5} defaultValue={gallery.join('\n')} hint="Delete a line to remove a photo." />
              <label htmlFor="f-galleryFiles" className="label mt-3">Add photos to the gallery</label>
              <input id="f-galleryFiles" name="galleryFiles" type="file" accept="image/*" multiple className="text-[13px]" />
            </div>
          </div>
        </Box>

        {LOCALES.map((l) => {
          const t = tr(l.code);
          const itinerary = parseJson<{ title: string; text: string }[]>(t?.itinerary, []);
          return (
            <details key={l.code} open={l.code === 'en' || !tour} className="rounded-[22px] bg-white p-6 ph:p-4">
              <summary className="cursor-pointer text-[16px] font-semibold">{l.label}</summary>
              <div className="mt-4 grid grid-cols-2 gap-4 tab:grid-cols-1">
                <Field label="Title" name={`${l.code}.title`} defaultValue={t?.title} required={l.code === 'en'} />
                <Field label="One line for cards" name={`${l.code}.summary`} defaultValue={t?.summary} />
                <Field label="Description" name={`${l.code}.description`} defaultValue={t?.description} textarea rows={4} className="col-span-2 tab:col-span-1" />
                <Field
                  label="What's included (one per line)"
                  name={`${l.code}.included`}
                  defaultValue={parseJson<string[]>(t?.included, []).join('\n')}
                  textarea
                  rows={6}
                />
                <Field
                  label="Itinerary (one day per line: Title | text)"
                  name={`${l.code}.itinerary`}
                  defaultValue={itinerary.map((d) => `${d.title} | ${d.text}`).join('\n')}
                  textarea
                  rows={6}
                />
              </div>
            </details>
          );
        })}

        <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-full bg-ink/95 p-2 pl-5 text-cream backdrop-blur">
          <span className="text-[13px]">Changes go live on the site right after saving.</span>
          <button type="submit" className="ml-auto inline-flex min-h-[44px] items-center rounded-full bg-cream px-6 text-[14px] font-semibold text-ink">
            Save tour
          </button>
        </div>
      </form>

      {tour ? (
        <form action={deleteTour} className="mt-8">
          <input type="hidden" name="id" value={tour.id} />
          <button className={btn.danger}>Delete this tour</button>
        </form>
      ) : null}
    </>
  );
}
