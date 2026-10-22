# Karin Travel website: build brief

This brief is the source of truth for building the Karin Travel website. The design is approved: **"Dusk"**. Rebuild it as a production website that matches the reference pixel-for-pixel on desktop and mobile, and add the working backend described below.

## 0. What's in this folder

| Path | What it is |
|---|---|
| `BRIEF.md` | This file: requirements, design spec and content. |
| `START_PROMPT.txt` | The first message to paste into Claude Code. |
| `design/dusk-reference.html` | **The approved design, live.** Open it in a browser. Sliders, tabs, the mobile menu and the mobile action bar all work. Match this. |
| `design/dusk-source.dc.html` | The same design's raw markup, inline styles and logic (template syntax: `{{value}}`, `<sc-for>` = loop, `<sc-if>` = condition). Use it to read exact sizes, colors and copy. |
| `design/screenshots/` | `desktop-full.png` (1440 px), `mobile-full.png` (390 px), `mobile-menu.png`. |
| `assets/images/` | 30 photos, 1600 px wide. All are from Unsplash: free for commercial use, no credit required. |

The reference HTML is a **prototype**. Don't copy its runtime. Rebuild it with the stack below using proper components.

---

## 1. The client

**Karin Travel**: a travel agency in Yerevan, Armenia. It mainly sells trips abroad, plus some tours inside Armenia.

- **Address:** Marshal Baghramyan Ave 79, Arabkir district, Yerevan 0033, Armenia
- **Phones:** 098 555 085 (+374 98 555 085), 095 099 993 (+374 95 099 993)
- **Instagram:** https://www.instagram.com/karin_travel/ (about 5,100 followers)
- **WhatsApp:** +374 98 555 085 *(assumed to be the same number; confirm with the client)*
- **Services (from their Instagram bio):**
  1. Tours
  2. Air tickets
  3. Hotel booking
  4. Visa support
  5. Social-package service: Armenian state employees can pay for a holiday with their social package
- **Main destinations:** Maldives, Hurghada / Egypt, Dubai (UAE), Prague (Czechia), Germany. Also good for the site: Santorini, Istanbul, Rome, Paris, Bali, Swiss Alps, Tbilisi, plus Armenia (Khor Virap, Tatev, Etchmiadzin).
- **Trust facts:** attended ITB Berlin 2025.
- **How they sell:** clients message on WhatsApp, Telegram or Instagram, or call, or visit the office. The site's main job is to **get the visitor to send an enquiry or message**. There's no online checkout.

**Languages:** Armenian (default), Russian, English. Every piece of text must be translatable.

---

## 2. Tech stack (recommended)

- **Next.js 14+** (App Router) + **TypeScript**
- **Tailwind CSS**, with the design tokens from section 4 set up in `tailwind.config`
- **next-intl** for routes `/hy`, `/ru`, `/en`; `/` redirects to `/hy`
- **Prisma** + **PostgreSQL** (SQLite is fine for local development)
- **Admin panel** at `/admin`, protected by a login (NextAuth credentials or similar; one admin user from env vars)
- **Notifications:** every new enquiry is sent to the agency through a Telegram bot (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) and optionally by email
- `next/image` for all photos (responsive sizes, lazy loading, blur placeholders)
- The developer works on **Windows**: use cross-platform npm scripts with no bash-only commands. Include `.env.example`.

---

## 3. Pages and features

### Public pages
1. **Home** (`/[locale]`): exactly the Dusk layout, section by section (section 5).
2. **Tours list** (`/[locale]/tours`): grid of tours with filters (category: Beach / Europe / Cities / Armenia; duration; price range). Same card style as on Home.
3. **Tour detail** (`/[locale]/tours/[slug]`):
   - Hero photo with title, nights, and a "from" price
   - What's included (chips)
   - Day-by-day itinerary
   - Photo gallery
   - Enquiry form (prefilled with the tour)
   - Related tours
4. **Services** (`/[locale]/services` with an anchor per service, or one page per service): Tour packages, Air tickets, Hotels, Visa support, Social package. Each has a short explanation plus its own enquiry form variant (e.g. the air-ticket form asks for from/to/dates/passengers).
5. **How to book / FAQ** (`/[locale]/how-to-book`): the 4 steps plus a FAQ accordion.
6. **Contacts** (`/[locale]/contacts`): address, phones, messengers, opening hours `[confirm]`, and an embedded map link (Google Maps: "Baghramyan 79, Yerevan").
7. **404** page in the same style.

### Global
- Sticky **mobile action bar** on every page at phone width: **Call · WhatsApp · Book a trip**.
- **Language switcher** HY / RU / EN, in the header on desktop and in the mobile menu.
- **Enquiry modal**: every "Book" or "Book this trip" button opens it with the tour/service preselected. Fields: name, phone (required), messenger preference (WhatsApp / Telegram / Call), dates, number of travelers, message. On submit: save to DB, notify by Telegram, show a success state ("We'll message you within [15 minutes] during working hours").
- **Newsletter / hot offers** signup (phone or email), saved to DB.
- **SEO:**
  - Metadata per page and locale, with hreflang
  - Open Graph images
  - `sitemap.xml` and `robots.txt`
  - JSON-LD: `TravelAgency` with address and phones, and `TouristTrip` for each tour
- **Analytics-ready:** a single place to add Google Analytics / Meta Pixel later.
- **Performance:** Lighthouse ≥ 90 on mobile. Preload the hero image, lazy-load the rest.
- **Accessibility:**
  - Real buttons and links
  - Visible focus
  - Alt text on every photo
  - Contrast ≥ 4.5:1
  - Respect `prefers-reduced-motion`

### Admin (`/admin`)
- **Tours CRUD:**
  - Title/description per language
  - Slug, category, nights, "from" price + currency (AMD / USD), badge, included items
  - Itinerary days, cover + gallery images (upload), featured on Home (yes/no), sort order
- **Hero slides CRUD:** kicker, title, accent word, name, when, text, image, linked tour (used by the Home slider).
- **Enquiries inbox:**
  - List with filters
  - Status: new / in progress / done
  - Click-to-call and WhatsApp links
- **Subscribers list:** export to CSV.
- **Site settings:** phones, WhatsApp number, Telegram link, Instagram, address, opening hours.

Seed the database with the tours and slides currently shown in the reference, using the photos in `assets/images/`.

---

## 4. Design tokens (from the approved design)

### Colors
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0F0F0E` | page background, dark text on light panels |
| `cream` | `#F2EEE7` | light panels, light text on dark |
| `panel-dark` | `#1A1918` | dark sections (services, footer) |
| `card-dark` | `#252321` | unselected service cards |
| `line-dark` | `#34312D` / `#3A3733` | borders on dark |
| `line` | `#D7D0C4` | borders on cream |
| `line-2` | `#CFC7B9` | chip/button borders on cream |
| `tab` | `#E5DFD4` | inactive tab pill on cream |
| `muted` | `#857D70` | second tone inside headings |
| `body-muted` | `#5F584E` | secondary text on cream |
| `foot-muted` | `#A8A196` | secondary text on dark |
| `gold` | `#F6D7A8` | italic serif accent words |
| `amber` | `#E8A33D` | subscribe button |
| `whatsapp` | `#25D366` | WhatsApp button (text `#0B1F12`) |

### Typography
- **Manrope** 300 / 400 / 500 / 600 / 700, used for everything.
- **Cormorant Garamond** *italic* 500, only for accent words in headings and the "Karin" wordmark.
- Both fonts support Cyrillic. For Armenian, check rendering: if Manrope lacks Armenian glyphs, use **Noto Sans Armenian** for the HY locale with the same weights, and keep Cormorant for Latin accent words only (or swap it for Noto Serif Armenian italic).

| Element | Desktop | Mobile |
|---|---|---|
| Hero H1 | 84px / weight 300 / lh 1 / tracking −0.035em | 40px |
| Section H2 | 44–48px / 500 / lh 1.08 / −0.03em | 32px |
| "How to book" giant heading | 112px / 600 / lh 0.95 / −0.045em | 46px |
| Body | 14–16px, lh 1.55 | |
| Small labels | 12–13px | |

### Shape and space
- **Page:** dark background with a 16px outer padding (8px on mobile). Sections are rounded panels stacked with a **16px gap** (8px on mobile).
- **Radius:** section panels 30px (24px mobile), cards and images 22px, small images 16–18px, pills/buttons 999px.
- **Container:** max-width 1400px. Section inner padding 72px top/bottom on desktop, 44px on mobile; side padding 20px on mobile.
- **Buttons:** min height 44–50px, pill shaped.
  - Primary: cream on dark, or ink on cream.
  - Secondary: 1px outline.
  - Round 44px icon buttons for arrows.
- **Photo overlays:** dark gradient from transparent to `rgba(0,0,0,0.6–0.7)` at the bottom, so white text stays readable.
- **Glass elements on the hero:** `rgba(255,255,255,0.12–0.16)` background, 1px `rgba(255,255,255,0.2–0.3)` border, `backdrop-filter: blur(10px)`.

### Motion
- Hero slider crossfade (≈600ms) when changing slides. Optional autoplay every 6s, paused on hover or touch.
- Destination strip in "How to book" scrolls on a 28s linear loop. It stops under `prefers-reduced-motion`.
- Card images zoom slightly on hover (`scale(1.04)`, 600ms).
- Nothing else. Keep it calm.

---

## 5. Home page, section by section

Follow `design/dusk-reference.html`. Desktop breakpoint ≥ 961px, tablet 701–960px, phone ≤ 700px.

1. **Hero slider** (full-bleed photo panel, min-height 780px desktop, about the full screen height on phone).
   - **Header inside the hero:**
     - "Karin" wordmark (Cormorant italic) + "TRAVEL" small caps
     - Center: glass pill nav (Home / Tours / Services / How to book / Stories)
     - Right: "Book now" glass pill
   - **Phone header:** wordmark + round "book" button + **menu button** that opens a dark rounded dropdown panel with large links and the HY/RU/EN switch.
   - **Centered:** kicker pill + huge light headline with the italic gold accent word (e.g. "Sunset at the *Pyramids*").
   - **Bottom-left:** slide name, "when", short text (hidden on phone), "Book this trip" + "What's included".
   - **Bottom-right (desktop/tablet only):**
     - Strip of the next 4 slides as clickable photo thumbnails; the first is larger with a cream ring
     - Counter `01/05`, progress line, prev/next round buttons
   - **Phone:** prev/next + counter stay; add swipe gestures.
   - **Slides (from admin):** Egypt (camels at the pyramids), Maldives, Dubai, Prague, Santorini.
2. **"Our tours"** (cream panel).
   - "+ Our tours" pill
   - Two-tone H2: "Every trip planned in Yerevan, *from the flight* to the last transfer."
   - Tabs: Beach / Europe / Cities / Armenia
   - 4 photo cards: nights badge, title, one line, round arrow link
   - Desktop: staggered heights (310 / 370 / 330 / 390px), aligned to the bottom
   - Phone: horizontal swipe carousel with scroll-snap, cards about 78% wide; tabs scroll sideways on one line
3. **"Capture the trip, not the paperwork"** (cream panel).
   - **Left:** "Every Karin package can include" chips (Flights from Zvartnots, Airport transfers, Hotel or resort, Visa documents, Travel insurance, Excursions) + a review card.
   - **Right:**
     - Tall Maldives seaplane photo with caption
     - Reef photo with a play button ("Video highlights"; opens an Instagram reel or video modal)
     - "Watch on Instagram" pill button
4. **"Choose what you need, *we handle the rest*"** (dark panel).
   - 4 selectable service cards, each with photo, name, text, divider and CTA:
     - Tour packages
     - Air tickets
     - Hotels & visas
     - Social package
   - The selected card turns cream.
   - Each CTA opens the enquiry modal for that service.
   - Phone: swipe carousel.
5. **"How to book your trip"** (cream panel).
   - Giant heading, then the looping destination strip between hairlines
   - Then a 5-column row: "4 easy steps" intro + steps 01–04 (Choose a destination → Get your offer → Visa & payment → Fly)
   - Phone: compact numbered rows
6. **Footer** (dark panel).
   - "Hot offers, *before they're gone.*" + phone/email input + amber Subscribe
   - Then a hairline, the wordmark, address and phones, and 3 link columns (Tours / Air tickets / Hotels · Visa support / Social package / How to book · Instagram / WhatsApp / Call us)
   - © line
7. **Mobile action bar** (phone only, fixed bottom, dark glass pill): round Call button · green WhatsApp · cream "Book a trip". Leave bottom padding so it never covers content.

---

## 6. Content rules

- **Placeholders:** everything in `[brackets]` is a placeholder the client must confirm. Never invent prices, reviews, ratings, license numbers or opening hours. Show `[price]` until the admin fills it in.
- **Reviews:** use only real reviews. Leave the review card as an admin-managed "testimonials" list (empty = hidden).
- **Image credit:** "Photos: Unsplash" in the footer.
- **Translations:** write English copy as in the reference, plus Russian and Armenian translations. Mark the HY/RU strings for a native-speaker review in a `TRANSLATIONS_TODO.md`.

## 7. Done means

- Home matches the reference at 1440px, 1024px, 768px and 390px widths, with no horizontal scroll at any width.
- All buttons do something: open the enquiry modal, navigate, call, or open WhatsApp/Instagram.
- An enquiry submitted from the site appears in `/admin` and arrives in Telegram.
- Admin can add a tour with photos, and it appears on Home and Tours in all 3 languages.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- `README.md` explains local setup on Windows, env vars, seeding, and deployment (Vercel + managed Postgres, e.g. Neon or Supabase).
