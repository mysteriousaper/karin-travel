'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import sharp from 'sharp';
import { db } from '@/lib/db';
import { checkCredentials, createSession, destroySession, requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { SETTING_KEYS } from '@/lib/settings';
import { CATEGORIES } from '@/lib/utils';

const LOCALES = ['hy', 'ru', 'en'] as const;

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const lines = (v: string) =>
  v
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

function refreshSite() {
  revalidatePath('/', 'layout');
}

// ---------------------------------------------------------------- auth

export async function login(_prev: string | null, fd: FormData): Promise<string | null> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] ?? 'local';
  if (!rateLimit(`login:${ip}`, 8, 10 * 60_000)) return 'Too many attempts. Try again in a few minutes.';
  const email = str(fd, 'email');
  const password = String(fd.get('password') ?? '');
  if (!checkCredentials(email, password)) return 'Wrong e-mail or password.';
  await createSession(email);
  redirect('/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

// ---------------------------------------------------------------- uploads

/** Resizes an uploaded photo to max 2000px WebP and stores it in the DB. */
async function saveUpload(file: File | null): Promise<string | null> {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (!file.type.startsWith('image/')) throw new Error('Only images can be uploaded.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Image is larger than 12 MB.');
  const input = Buffer.from(await file.arrayBuffer());
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const media = await db.media.create({
    data: { filename: file.name, mime: 'image/webp', width: info.width, height: info.height, data: new Uint8Array(data) },
  });
  return `/api/media/${media.id}`;
}

async function saveUploads(files: FormDataEntryValue[]) {
  const out: string[] = [];
  for (const f of files) {
    const url = await saveUpload(f as File);
    if (url) out.push(url);
  }
  return out;
}

// ---------------------------------------------------------------- tours

export async function saveTour(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id');
  const slug = str(fd, 'slug')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('Slug is required.');
  const category = str(fd, 'category');
  if (!(CATEGORIES as readonly string[]).includes(category)) throw new Error('Unknown category.');

  const uploadedCover = await saveUpload(fd.get('coverFile') as File | null);
  const coverImage = uploadedCover ?? str(fd, 'coverImage');
  if (!coverImage) throw new Error('A cover image is required.');
  const gallery = [...lines(str(fd, 'gallery')), ...(await saveUploads(fd.getAll('galleryFiles')))];
  const price = str(fd, 'priceFrom');

  const data = {
    slug,
    category,
    duration: Math.max(1, Number(str(fd, 'duration')) || 1),
    durationUnit: str(fd, 'durationUnit') === 'days' ? 'days' : 'nights',
    priceFrom: price ? Math.round(Number(price)) || null : null,
    currency: ['AMD', 'USD', 'EUR', 'RUB'].includes(str(fd, 'currency')) ? str(fd, 'currency') : 'USD',
    badge: str(fd, 'badge') || null,
    coverImage,
    gallery: JSON.stringify(gallery),
    featured: fd.get('featured') === 'on',
    published: fd.get('published') === 'on',
    sortOrder: Number(str(fd, 'sortOrder')) || 0,
  };

  const tour = id ? await db.tour.update({ where: { id }, data }) : await db.tour.create({ data });

  for (const locale of LOCALES) {
    const title = str(fd, `${locale}.title`);
    if (!title) continue;
    const tr = {
      title,
      summary: str(fd, `${locale}.summary`),
      description: str(fd, `${locale}.description`),
      included: JSON.stringify(lines(str(fd, `${locale}.included`))),
      itinerary: JSON.stringify(
        lines(str(fd, `${locale}.itinerary`)).map((l) => {
          const [t, ...rest] = l.split('|');
          return { title: t.trim(), text: rest.join('|').trim() };
        })
      ),
    };
    await db.tourTranslation.upsert({
      where: { tourId_locale: { tourId: tour.id, locale } },
      update: tr,
      create: { tourId: tour.id, locale, ...tr },
    });
  }
  refreshSite();
  redirect(`/admin/tours/${tour.id}?saved=1`);
}

export async function deleteTour(fd: FormData) {
  await requireAdmin();
  await db.tour.delete({ where: { id: str(fd, 'id') } });
  refreshSite();
  redirect('/admin/tours');
}

// ---------------------------------------------------------------- hero slides

export async function saveSlide(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id');
  const image = (await saveUpload(fd.get('imageFile') as File | null)) ?? str(fd, 'image');
  if (!image) throw new Error('An image is required.');
  const data = {
    image,
    tourId: str(fd, 'tourId') || null,
    active: fd.get('active') === 'on',
    sortOrder: Number(str(fd, 'sortOrder')) || 0,
  };
  const slide = id ? await db.heroSlide.update({ where: { id }, data }) : await db.heroSlide.create({ data });
  for (const locale of LOCALES) {
    const tr = {
      kicker: str(fd, `${locale}.kicker`),
      title: str(fd, `${locale}.title`),
      accent: str(fd, `${locale}.accent`),
      name: str(fd, `${locale}.name`),
      when: str(fd, `${locale}.when`),
      text: str(fd, `${locale}.text`),
    };
    if (!tr.title && !tr.name) continue;
    await db.heroSlideTranslation.upsert({
      where: { slideId_locale: { slideId: slide.id, locale } },
      update: tr,
      create: { slideId: slide.id, locale, ...tr },
    });
  }
  refreshSite();
  redirect(`/admin/slides/${slide.id}?saved=1`);
}

export async function deleteSlide(fd: FormData) {
  await requireAdmin();
  await db.heroSlide.delete({ where: { id: str(fd, 'id') } });
  refreshSite();
  redirect('/admin/slides');
}

// ---------------------------------------------------------------- enquiries

export async function setEnquiryStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, 'status');
  if (!['new', 'in_progress', 'done'].includes(status)) return;
  await db.enquiry.update({ where: { id: str(fd, 'id') }, data: { status } });
  revalidatePath('/admin', 'layout');
}

export async function deleteEnquiry(fd: FormData) {
  await requireAdmin();
  await db.enquiry.delete({ where: { id: str(fd, 'id') } });
  revalidatePath('/admin', 'layout');
}

// ---------------------------------------------------------------- testimonials

export async function saveTestimonial(fd: FormData) {
  await requireAdmin();
  const id = str(fd, 'id');
  const data = {
    name: str(fd, 'name'),
    place: str(fd, 'place'),
    text: str(fd, 'text'),
    locale: ['hy', 'ru', 'en'].includes(str(fd, 'locale')) ? str(fd, 'locale') : 'all',
    published: fd.get('published') === 'on',
    sortOrder: Number(str(fd, 'sortOrder')) || 0,
  };
  if (!data.name || !data.text) throw new Error('Name and text are required.');
  if (id) await db.testimonial.update({ where: { id }, data });
  else await db.testimonial.create({ data });
  refreshSite();
  redirect('/admin/testimonials?saved=1');
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  await db.testimonial.delete({ where: { id: str(fd, 'id') } });
  refreshSite();
  redirect('/admin/testimonials');
}

// ---------------------------------------------------------------- subscribers & settings

export async function deleteSubscriber(fd: FormData) {
  await requireAdmin();
  await db.subscriber.delete({ where: { id: str(fd, 'id') } });
  revalidatePath('/admin/subscribers');
}

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  for (const key of SETTING_KEYS) {
    const value = str(fd, key);
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  refreshSite();
  redirect('/admin/settings?saved=1');
}
