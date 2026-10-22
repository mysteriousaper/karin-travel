# Translations to review

The English copy follows the approved design. The Armenian (HY) and Russian (RU) texts were
written for this build and **need a native speaker's read-through** before launch.

## Where the text lives

| Text | File / place |
|---|---|
| All interface text (menus, buttons, headings, forms, FAQ, services) | `src/messages/hy.json`, `src/messages/ru.json` |
| Tours: titles, one-liners, descriptions, "what's included", itineraries | `prisma/seed-data.ts` (initial) → afterwards edit in **Admin → Tours** |
| Hero slides | `prisma/seed-data.ts` (initial) → afterwards **Admin → Hero slides** |
| Address in the footer/contacts | **Admin → Site settings** |

## Please check in particular

- [ ] HY: the tours heading `toursH2a/b/c` — the split into grey/black parts must still read naturally.
- [ ] HY: hero accent words (`բուրգերի մոտ`, `լագունի վերևում`, `Դուբայում`, `Կառլի կամրջին`, `կապույտ Էգեյան`) — they are shown in gold italics after the headline.
- [ ] HY: footer `Թեժ առաջարկներ՝ քանի դեռ կան։`
- [ ] HY/RU: service names — "Սոցփաթեթ / Սոցիալական փաթեթ", "Соцпакет" — match the wording the agency uses on Instagram.
- [ ] HY/RU: FAQ answers about visas, payment and the social package (`howPage.faq`) — confirm they describe the agency's real process.
- [ ] RU: plural forms (`ночь/ночи/ночей`, `тур/тура/туров`) look right in the tour cards and filters.
- [ ] HY/RU: the itinerary texts in `prisma/seed-data.ts` (place names: Մալե/Мале, Գիֆթուն/Гифтун, Չեսկի Կրումլով/Чески-Крумлов, Սվետիցխովելի/Светицховели …).

## Placeholders the agency must confirm (all languages)

- [ ] Reply time "[15 minutes]" — `enquiry.successText` and the second FAQ answer.
- [ ] Opening hours — Admin → Site settings (until then the contacts page shows a placeholder).
- [ ] **Prices — the current ones are SAMPLES** for demonstrating ֏/$/€/₽. Replace every tour price in Admin → Tours.
- [ ] Font pairing — pick one in Admin → Site settings, then set `NEXT_PUBLIC_SHOW_FONT_PICKER=0`.
- [ ] WhatsApp number (assumed 098 555 085) and Telegram link — Admin → Site settings.
- [ ] Client reviews — Admin → Testimonials (the review card is hidden until one is added).
