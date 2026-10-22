# Karin Travel — website

Production website for **Karin Travel**, a travel agency at Marshal Baghramyan Ave 79, Yerevan.
Built from the approved "Dusk" design (`design-handoff/`), in Armenian, Russian and English,
with an admin panel, an enquiry inbox and Telegram notifications.

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · next-intl · Prisma · SQLite (local) / PostgreSQL (production)
- **Languages:** `/hy` (default — `/` redirects here), `/ru`, `/en`
- **Admin:** `/admin`

---

## 1. Run it locally (Windows)

You need **Node.js 20 or newer** (`node -v`). All commands work in PowerShell, cmd or Git Bash.

```bash
npm install
```

```bash
copy .env.example .env
```

Open `.env` and set at least `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `AUTH_SECRET` (any long random string — the comment in the file shows how to generate one). Then create and fill the database:

```bash
npm run setup
```

```bash
npm run dev
```

Open http://localhost:3000 — it redirects to `/hy`. The admin panel is at http://localhost:3000/admin.

### Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run setup` | Generate the Prisma client, create tables, seed tours and slides |
| `npm run db:seed` | Seed again (safe: existing tours and slides are kept) |
| `npm run db:reset` | **Wipe** the database and seed from scratch |
| `npm run blur` | Rebuild blur placeholders after adding photos to `public/images` |
| `npm run typecheck` | TypeScript check |

---

### Offline copy (open from files, no server)

Double-click **`Open Karin website (offline).html`** in the project folder. It opens `website-offline/`, a copy of all 66 pages (HY/RU/EN) with photos, fonts and the working slider, menus and language/currency/font switches. Forms show a note instead of sending, because there is no server offline. To refresh it after changes:

```bash
npm run build
```

```bash
npx next start -p 3100
```

Then, in a second terminal:

```bash
node scripts/export-offline.mjs
```

## 2. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | `file:./dev.db` locally; a Postgres URL in production |
| `NEXT_PUBLIC_SITE_URL` | yes | Public address, e.g. `https://karintravel.am` (sitemap, canonical links, Open Graph) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | yes | The one admin login |
| `AUTH_SECRET` | yes | Signs the admin session cookie (16+ characters) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | recommended | Every new enquiry is posted to this chat |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` | optional | Also e-mail each enquiry |
| `NEXT_PUBLIC_GA_ID` | optional | Google Analytics 4 (`G-XXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | optional | Meta Pixel |

### Telegram in 3 minutes

1. In Telegram, open **@BotFather**, send `/newbot`, copy the token into `TELEGRAM_BOT_TOKEN`.
2. Create a group for the managers and add the bot to it (or just send the bot a message).
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates`, find `"chat":{"id": …}` and put that number (groups start with `-`) into `TELEGRAM_CHAT_ID`.
4. Restart the server and send a test request from the site. The admin Overview shows a yellow banner while Telegram is not configured.

---

## 3. What's where

```
prisma/
  schema.prisma        data model (tours, slides, enquiries, subscribers, testimonials, settings, media)
  seed.ts, seed-data.ts  the 17 tours and 5 hero slides from the design, in HY/RU/EN
public/images/         the 30 Unsplash photos from the handoff (free for commercial use)
src/
  app/[locale]/        public pages: home, tours, tours/[slug], services, how-to-book, contacts, 404
  app/admin/           admin panel (login, overview, enquiries, tours, slides, testimonials, subscribers, settings)
  app/api/             enquiries, subscribe, media (uploaded photos)
  components/          Header, HeroSlider, TourCard, EnquiryForm/Modal, Footer, MobileBar …
  messages/            hy.json, ru.json, en.json — every piece of interface text
  lib/                 db, data queries, settings, auth, notifications, SEO helpers
design-handoff/        the approved design and brief (reference only, not used by the build)
```

Design tokens (colours, radii, breakpoints `tab` ≤ 960px and `ph` ≤ 700px) live in `tailwind.config.ts`.

### Languages, currencies, fonts

- **Languages:** HY / RU / EN switch in the header (desktop), a round language button on phones, and both in the phone menu. The Armenian header uses the compact menu below 1320px because its labels are longer.
- **Currencies:** visitors pick ֏ / $ / € / ₽ (default: ֏ in Armenian, ₽ in Russian, $ in English; remembered in the browser). Each tour price is stored in one currency (Admin → Tours) and converted with the **Central Bank of Armenia** official rates from `api.cba.am`, refreshed hourly (`src/lib/rates.ts`). If the CBA is unreachable the last saved rates are used. The rate date and values are shown in the currency menu and in the footer. Converted prices are rounded (֏ to 1 000, ₽ to 100, $/€ to 10).
- **Fonts:** six pairings in `src/lib/font-pairings.ts` (Dusk, Google Sans, Noto Harmony, Editorial, Bold Modern, Soft Grotesk). Choose the one every visitor sees in *Admin → Site settings → Font pairing*. While `NEXT_PUBLIC_SHOW_FONT_PICKER=1`, an "Aa" button on the site previews them live (saved only in that browser) — set it to `0` before launch. Google Sans is self-hosted in `public/fonts/google-sans` (OFL licence; `node scripts/fetch-google-sans.mjs` refreshes it).

### Content rules followed

- **Prices are SAMPLES.** To show the currency conversion, every tour has an illustrative "from" price (`SAMPLE_PRICES` in `prisma/seed-data.ts`). They are not the agency's prices — replace them in Admin → Tours (or clear a price to show `[price]`) before launch.
- **No invented reviews.** The review card on Home is driven by *Admin → Testimonials* and stays hidden while that list is empty.
- **Opening hours** show `[opening hours — to be confirmed]` until filled in under *Admin → Site settings*.
- The reply time "[15 minutes]" in the success message and FAQ is a placeholder for the agency to confirm (edit it in `src/messages/*.json`).
- Contact details (both phones, address, Instagram) were checked against the agency's Spyur.am listing and Instagram profile. WhatsApp is assumed to be 098 555 085 — confirm with the client and change it in *Site settings* if needed. Telegram is hidden until a link is added there.

### Using the admin

- **Enquiries:** filter by status/type, search, one-click call and WhatsApp, mark *New → In progress → Done*.
- **Tours:** add/edit in all three languages; upload a cover and gallery photos (they're resized to WebP and stored in the database, so this also works on Vercel). *Featured on Home* puts a tour into the Home tabs (first four per category by sort order).
- **Hero slides:** the Home slider; each slide links to a tour for "Book this trip" and "What's included".
- **Subscribers:** export to CSV (opens in Excel with Armenian/Russian characters intact).
- **Site settings:** phones, WhatsApp, Telegram, Instagram, address, opening hours, the Instagram reel used by "Video highlights".

---

## 4. Deploy (Vercel + Neon/Supabase)

1. Create a Postgres database on **Neon** or **Supabase** and copy its connection string.
2. In `prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`. Commit.
3. Push the project to GitHub and import it in **Vercel**.
4. In Vercel → Settings → Environment Variables add everything from section 2 (`DATABASE_URL` = the Postgres URL, `NEXT_PUBLIC_SITE_URL` = the real domain).
5. Create the tables and seed once, from your computer, pointing at the production database:

   ```bash
   npx prisma db push
   ```

   ```bash
   npm run db:seed
   ```

   (Run them with `DATABASE_URL` set to the production URL — e.g. temporarily in `.env`.)
6. Deploy. Add the domain in Vercel and update `NEXT_PUBLIC_SITE_URL`.

Pages are statically generated and refreshed every 5 minutes; anything saved in the admin is pushed live immediately.

---

## 5. SEO, analytics, accessibility

- Per-page titles/descriptions in each language, canonical links and `hreflang` alternates, Open Graph images.
- `/sitemap.xml` (all pages × 3 languages) and `/robots.txt` (admin and API excluded).
- JSON-LD: `TravelAgency` on every page, `TouristTrip` on each tour, `FAQPage` on How to book.
- Analytics: set the env variables above. Successful enquiries fire `generate_lead` (GA4) and `Lead` (Pixel). Everything is in `src/components/Analytics.tsx`.
- Real buttons/links, visible focus ring, alt text, keyboard-operable tabs, dialogs and menus, `prefers-reduced-motion` respected (marquee and autoplay stop).
- Armenian text uses Noto Sans Armenian / Noto Serif Armenian automatically (Manrope and Cormorant have no Armenian letters).

Photos: Unsplash.
