# HANDOFF — сайт турагентства Karin Travel

Документ передачи проекта в новую сессию. Составлен 21.10.2026 в конце рабочей сессии Claude Code
(Windows 11, проект в `C:\Users\user\Desktop\karin travel agency`). Новая сессия не имеет доступа к
компьютеру и истории чата — здесь записано всё, что нужно, чтобы продолжить без вопросов.

Связанные файлы: `README.md` (запуск и деплой), `TRANSLATIONS_TODO.md` (что проверить носителю языка),
`design-handoff/BRIEF.md` (исходное ТЗ), `_handoff/` (скриншоты, аудиты, логи, полный дизайн-пакет).

---

## 0. Коротко о состоянии

- Полноценный сайт на **Next.js 15 + TypeScript + Tailwind + next-intl + Prisma (SQLite локально)**.
- Три языка: **hy** (по умолчанию, `/` → `/hy`), **ru**, **en**. Переключатель в шапке.
- Цены показываются в **֏ AMD / $ USD / € EUR / ₽ RUB** по официальному курсу **ЦБ Армении** (api.cba.am).
- **6 вариантов шрифтов**, выбор в админке; по умолчанию — **Dusk** (Manrope + Cormorant Garamond), как в утверждённом макете.
- Админка `/admin`: заявки, туры (CRUD с загрузкой фото), слайды, отзывы, подписчики (CSV), настройки.
- Заявки сохраняются в БД и отправляются в **Telegram** (код готов, **не протестировано** — нет токена бота).
- Есть **офлайн-копия** сайта (`website-offline/`, 66 страниц), открывается двойным кликом без сервера.
- **Цены туров — ОБРАЗЦЫ (SAMPLE)**, выдуманы для демонстрации валют. Перед запуском заменить.
- Сайт **нигде не опубликован** (хостинга нет). **Код на GitHub: https://github.com/mysteriousaper/karin-travel** (ветка `main`, загружен 22.10.2026; репозиторий создан пользователем вручную с автоматическим README, который объединён с проектом — в истории коммиты `7c47535` проект, `737fd80` README от GitHub, `b16751c` merge). На ПК установлен GitHub CLI 2.103.0 (вход в `gh` не завершён — не нужен); git push работает через Git Credential Manager (вход выполнен).
- ✅ **Зависимости обновлены 22.10.2026**: next 15.4→**15.5.28** (critical устранена), sharp **0.35.5**, nodemailer **10.2.0**. Остаток npm audit — 12 уязвимостей только в инструментах сборки (Tailwind 3, CLI Prisma, postcss внутри Next), см. §7.3.

---

## 1. Цель проекта и исходные требования пользователя

### 1.1 Первое сообщение пользователя (дословно, с опечатками оригинала)

> based on this design, which we created with you, you need to act as senior web development team and make full stack website from it with actual code, the website should be build according ro the design strictly, you are free to access each file or web in my computer and also in internet, make the website full human made and eye catching, the website also should be optimized for all devices and wprk smoothly, all the information here take realiable from web by researching the Karin travel agency, be sharp and creative without any ai buzzling and hallucinatoon like the rea; human, I repeat not ask questions you are all free to do anythiung you want I guve you permission

Вложение: `C:\Users\user\Downloads\karin-website-handoff.zip` (дизайн-пакет, см. раздел 3).

Ключевые требования из этого сообщения:
1. Full-stack сайт с реальным кодом, **строго по дизайну**.
2. Можно пользоваться файлами компьютера и интернетом.
3. «Human made», цепляющий, без «AI-воды» и выдумок.
4. Оптимизирован под все устройства, работает плавно.
5. Информацию об агентстве брать **достоверно из интернета**.
6. **Не задавать вопросов** — полное право решать самостоятельно.

### 1.2 Требования из ТЗ дизайн-пакета (`design-handoff/BRIEF.md`) — главный источник истины
- Стек: Next.js 14+ App Router, TypeScript, Tailwind, next-intl (`/hy`, `/ru`, `/en`, `/` → `/hy`), Prisma + PostgreSQL (SQLite локально), админка с логином, Telegram-уведомления, `next/image`, кроссплатформенные npm-скрипты (разработчик на Windows), `.env.example`.
- Страницы: Home (точно по макету Dusk), Tours list (фильтры: категория, длительность, цена), Tour detail (hero, включено, программа по дням, галерея, форма, похожие), Services (5 услуг, свой вариант формы у каждой), How to book / FAQ, Contacts (адрес, телефоны, мессенджеры, часы `[confirm]`, карта), 404.
- Глобально: мобильная панель Call · WhatsApp · Book a trip; переключатель языков; модальное окно заявки (имя, телефон*, мессенджер, даты, путешественники, сообщение) → БД + Telegram + сообщение «We'll message you within [15 minutes]…»; подписка на горящие предложения; SEO (метаданные, hreflang, OG, sitemap, robots, JSON-LD TravelAgency + TouristTrip); единое место для аналитики; Lighthouse mobile ≥ 90 (Perf), ≥ 95 (A11y, SEO); доступность (контраст 4.5:1, фокус, alt, prefers-reduced-motion).
- Правила контента: всё в `[скобках]` — плейсхолдеры; **не выдумывать цены, отзывы, рейтинги, лицензии, часы работы**; отзывы только реальные (пусто = скрыто); подпись «Photos: Unsplash»; HY/RU отметить в `TRANSLATIONS_TODO.md`.
- `START_PROMPT.txt` из пакета просил сначала предложить план и ждать OK — **пользователь это отменил** («не задавай вопросов»), поэтому план не согласовывался.

---

## 2. Стек, версии, структура

### 2.1 Окружение и версии (фактически установлены)
| Что | Версия |
|---|---|
| Node.js | 22.20.0 |
| npm | 11.6.2 |
| next | **15.5.28** (закреплена точно; была 15.5.4 — обновлена 22.10.2026 из-за уязвимостей; 16-я не бралась — там middleware переименован в proxy) |
| react / react-dom | 19.1.1 |
| next-intl | 4.14.9 |
| prisma / @prisma/client | 6.19.3 (7-я не бралась — там обязательны driver adapters и prisma.config) |
| tailwindcss | 3.4.19 (v3, потому что в ТЗ упоминается `tailwind.config`) |
| sharp | **0.35.5** (ресайз загрузок, блюр-превью; была 0.34.5) |
| zod | 3.25.76 |
| jose | 5.10.0 (JWT-сессия админа) |
| nodemailer | **10.2.0** (опционально e-mail; была 6.10.1; @types/nodemailer 8.0.2) |
| typescript | 5.9.3 |
| tsx | 4.23.x (сид и скрипты) |
| server-only | 0.0.1 |

ОС разработки: Windows 11 Pro. Git 2.51. Локальный репозиторий: `user.name = mysteriousaper`, `user.email = mysteriousaper@users.noreply.github.com` (заданы только для этого репозитория), remote `origin` = https://github.com/mysteriousaper/karin-travel.git.

### 2.2 Структура и назначение файлов
```
karin travel agency/
├─ HANDOFF.md                 этот документ
├─ README.md                  установка, команды, env, деплой (Vercel + Neon/Supabase), офлайн-копия
├─ TRANSLATIONS_TODO.md       что проверить носителю языка + плейсхолдеры для клиента
├─ Open Karin website (offline).html   открывает website-offline/hy/index.html (двойной клик)
├─ start-site.cmd             двойной клик: npm install (если нужно) + npm run dev + открыть браузер
├─ .env.example               все переменные окружения (без секретов)
├─ .env                       ЛОКАЛЬНЫЕ секреты (в архив НЕ входит, в git игнорируется)
├─ .gitignore
├─ .claude/launch.json        конфиг для превью в Claude Code (npm run dev, порт 3000)
├─ package.json / package-lock.json
├─ next.config.ts             next-intl плагин; images: только WebP, deviceSizes; serverActions bodySizeLimit 12mb
├─ tailwind.config.ts         токены дизайна; брейкпоинты wide/mid/tab/ph (max-width, desktop-first)
├─ postcss.config.mjs, tsconfig.json
├─ design-handoff/            BRIEF.md + design/ (reference html, source, скриншоты) — справочно, в сборке не участвует
├─ _handoff/                  материалы передачи (см. раздел 13)
├─ prisma/
│  ├─ schema.prisma           модели (provider = sqlite; для прода сменить на postgresql)
│  ├─ seed-data.ts            17 туров и 5 слайдов на hy/ru/en + INCLUDED + SAMPLE_PRICES
│  ├─ seed.ts                 идемпотентный сид (upsert по slug; слайды только если их 0)
│  └─ dev.db                  локальная SQLite с сидом и sample-ценами (без заявок/подписчиков)
├─ public/
│  ├─ images/                 30 фото Unsplash из дизайн-пакета (1600px)
│  ├─ fonts/google-sans/      самохостинг Google Sans (OFL), 10 woff2 (latin/latin-ext/cyrillic/cyrillic-ext/armenian × normal/italic)
│  ├─ icon.svg, apple-icon.png  иконка «K» Cormorant italic на тёмном
├─ scripts/
│  ├─ make-blur.mjs           генерирует src/lib/blur.json (16px JPEG data-URL превью)
│  ├─ fetch-google-sans.mjs   скачивает Google Sans и пишет src/app/google-sans.css
│  ├─ apply-sample-prices.ts  разово проставляет SAMPLE_PRICES турам без цены
│  └─ export-offline.mjs      делает website-offline/ из запущенного prod-сервера на :3100
├─ src/
│  ├─ middleware.ts           next-intl middleware; matcher исключает api, admin, _next, файлы
│  ├─ i18n/                   routing.ts (locales hy/ru/en, default hy, localeDetection false), navigation.ts, request.ts
│  ├─ messages/               hy.json, ru.json, en.json — ВСЕ тексты интерфейса
│  ├─ lib/
│  │  ├─ db.ts                Prisma client singleton
│  │  ├─ data.ts              запросы: getTours, getTourBySlug, getHomeTours, getSlides, getTestimonials (fallback перевода locale → en → hy)
│  │  ├─ settings.ts          SETTING_DEFAULTS (проверенные контакты), getSettings, contactsFor; пустое обязательное поле → дефолт
│  │  ├─ rates.ts             (server) SOAP к api.cba.am, кэш unstable_cache 1 ч, сохранение в Setting 'rates_cache', FALLBACK курсы 21.10.2026
│  │  ├─ money.ts             (client-safe) CURRENCIES, convert, roundPrice, formatNumber (ручной!), formatMoney, символы
│  │  ├─ font-pairings.ts     6 пар шрифтов (id, имя, описание)
│  │  ├─ auth.ts              логин по ADMIN_EMAIL/ADMIN_PASSWORD (timing-safe), JWT-cookie 7 дней, requireAdmin
│  │  ├─ notify.ts            Telegram sendMessage (HTML) + опционально SMTP; никогда не бросает
│  │  ├─ rate-limit.ts        in-memory лимитер (per instance) + clientIp
│  │  ├─ seo.ts               pageMeta (canonical + hreflang + OG/Twitter), absolute()
│  │  ├─ utils.ts             cx, placeholderFor, parseJson, digits, localPhone, siteUrl, CATEGORIES, SERVICE_KINDS
│  │  └─ blur.json            превью для public/images
│  ├─ app/
│  │  ├─ layout.tsx           корневой passthrough (html рендерят [locale]/layout и admin/layout)
│  │  ├─ not-found.tsx        404 вне локали
│  │  ├─ globals.css          Tailwind + CSS-переменные пар шрифтов + .serif/.brand-serif + правила для hy + marquee + reduced-motion
│  │  ├─ fonts.ts             12 семейств next/font (все preload:false) → fontVars
│  │  ├─ google-sans.css      @font-face Google Sans (сгенерирован)
│  │  ├─ sitemap.ts, robots.ts
│  │  ├─ [locale]/layout.tsx  html lang, data-font, NextIntlClientProvider, SiteProvider(contacts, rates), Footer, MobileBar, FontPicker, JSON-LD TravelAgency, Analytics
│  │  ├─ [locale]/page.tsx    Home: HeroSlider, HomeTours, Stories, ServicesPicker, HowToBook (revalidate 300)
│  │  ├─ [locale]/tours/page.tsx, tours/[slug]/page.tsx, services/page.tsx, how-to-book/page.tsx, contacts/page.tsx, not-found.tsx, [...rest]/page.tsx
│  │  ├─ api/enquiries/route.ts  POST: zod, honeypot `company`, rate-limit 5/мин, сохранение, notify
│  │  ├─ api/subscribe/route.ts  POST: телефон или e-mail, нормализация 0XX… → +374…, upsert
│  │  ├─ api/media/[id]/route.ts отдаёт загруженные в админке фото из БД (immutable cache)
│  │  └─ admin/               layout, login (LoginForm + useActionState), actions.ts (все server actions), (panel)/… страницы
│  └─ components/
│     ├─ SiteProvider.tsx     контекст: contacts, openEnquiry, openVideo, rates, currency, setCurrency, money()
│     ├─ Header.tsx           wordmark, nav-pill, LangSegment (desktop), LangMenuCompact (mobile), CurrencyMenu, Book now, бургер + drawer
│     ├─ home/HeroSlider.tsx  слайдер (crossfade 600ms, autoplay 6 c после первого взаимодействия, свайп, миниатюры)
│     ├─ home/HomeTours.tsx   табы Beach/Europe/Cities/Armenia + карточки 310/370/330/390
│     ├─ home/Stories.tsx, home/PlayButton.tsx, home/ServicesPicker.tsx
│     ├─ HowToBook.tsx, Footer.tsx, SubscribeForm.tsx, MobileBar.tsx
│     ├─ EnquiryForm.tsx      форма с вариантами полей по услуге (air/hotel/visa/social)
│     ├─ EnquiryModal.tsx, Dialog.tsx (native <dialog>), VideoModal.tsx (Instagram embed), MapEmbed.tsx (карта по клику)
│     ├─ TourCard.tsx (tone light/dark, цена), Price.tsx, PageHero.tsx (+SectionPill), BookButton.tsx
│     ├─ tours/ToursExplorer.tsx (фильтры), tours/Gallery.tsx (лайтбокс)
│     ├─ FontPicker.tsx       плавающая кнопка «Aa» для предпросмотра шрифтов (только при NEXT_PUBLIC_SHOW_FONT_PICKER=1)
│     └─ Icons.tsx, JsonLd.tsx, Analytics.tsx (GA4 + Meta Pixel, событие karin:lead)
└─ website-offline/           сгенерированная офлайн-копия (в архив НЕ входит — это сборка; пересоздаётся скриптом)
```

### 2.3 Модель данных (prisma/schema.prisma)
- `Tour` (slug unique, category beach|europe|cities|armenia, duration + durationUnit nights|days, priceFrom Int?, currency USD|EUR|AMD|RUB, badge?, coverImage, gallery JSON-строка, featured, published, sortOrder) + `TourTranslation` (tourId+locale unique; title, summary, description, included JSON, itinerary JSON `{title,text}[]`).
- `HeroSlide` (image, tourId?, active, sortOrder) + `HeroSlideTranslation` (kicker, title, accent, name, when, text).
- `Enquiry` (name, phone, messenger whatsapp|telegram|call, dates, travelers, message, kind tour|air|hotel|visa|social|general, tourSlug, tourTitle, details JSON, locale, source, status new|in_progress|done, notified).
- `Subscriber` (contact unique, locale), `Testimonial` (name, place, text, locale all|hy|ru|en, published, sortOrder), `Setting` (key/value), `Media` (filename, mime, width, height, data Bytes).
- JSON хранится строками (совместимо с SQLite и Postgres).

---

## 3. Дизайн

### 3.1 Источник
`C:\Users\user\Downloads\karin-website-handoff.zip` — дизайн «Dusk», ранее созданный пользователем с Claude. Содержимое: `BRIEF.md`, `START_PROMPT.txt`, `README.md`, `design/dusk-reference.html` (рабочий прототип), `design/dusk-source.dc.html` (разметка с инлайн-стилями, шаблон `{{}}`, `<sc-for>`, `<sc-if>`), `design/screenshots/` (desktop-full 1440, mobile-full 390, mobile-menu), `assets/images/` (30 фото Unsplash).
Полная распакованная копия: **`_handoff/design/karin-website-handoff/`**. В проекте также `design-handoff/` (BRIEF + design/, без assets — фото лежат в `public/images`).

Соответствие фото (из карты blob-хешей в reference html):
- Слайды: egypt-camels, maldives-2, dubai-1, prague-1, santorini.
- Beach: maldives-3, hurghada-resort, santorini, bali. Europe: prague-2, germany, rome, alps. Cities: dubai-2, istanbul, paris, tbilisi. Armenia: khor-virap, tatev, etchmiadzin, armenia-green.
- Карточки услуг: maldives-1 (Tour packages), plane-window (Air), passport (Hotels & visas), pool (Social).
- Stories: maldives-plane (высокое фото), hurghada-reef (видео).

### 3.2 Токены (tailwind.config.ts)
Цвета: ink `#0F0F0E`, cream `#F2EEE7`, panel `#1A1918`, card `#252321`, line-dark `#34312D`, line-dark-2 `#3A3733`, line-foot `#2C2A27`, line `#D7D0C4`, line-2 `#CFC7B9`, tab `#E5DFD4`, muted `#857D70`, body-muted `#5F584E`, foot-muted `#A8A196`, hero-muted `#E4DDD2`, plus `#B2A998`, gold `#F6D7A8`, amber `#E8A33D`, whatsapp `#25D366` (текст `#0B1F12`).
Радиусы: panel 30px (24 на телефоне), card 22px, мелкие 16–18, пилюли 999. max-width 1400. Внешний отступ страницы 16px (8 на телефоне), между панелями 16px (8).

### 3.3 Шрифты
- Утверждённые: **Manrope** 300–700 (всё) + **Cormorant Garamond italic 500** (акцентные слова + вордмарк «Karin»).
- Manrope/Cormorant **не содержат армянских букв** → по символам браузер берёт **Noto Sans Armenian** / **Noto Serif Armenian** (у Noto Serif Armenian нет italic — браузер наклоняет синтетически).
- По просьбе пользователя добавлено 6 пар (`src/lib/font-pairings.ts`, CSS в `globals.css` через `[data-font='…']`):
  1. **dusk** — Manrope + Cormorant Garamond Italic (ПО УМОЛЧАНИЮ, подтверждено пользователем)
  2. **google-sans** — Google Sans + Google Sans Italic (единственный шрифт с армянским, кириллицей и латиницей в одном дизайне; самохостинг)
  3. **noto** — Noto Sans + Noto Serif Italic
  4. **editorial** — Inter + Playfair Display Italic
  5. **bold** — Montserrat + Lora Italic
  6. **soft** — Golos Text + Literata Italic
  Для всех, кроме Google Sans, армянский — Noto Sans/Serif Armenian. `--accent-scale` подгоняет размер акцентного шрифта (Cormorant мелкий).
- Вордмарк «Karin» всегда Cormorant (`.brand-serif`) независимо от пары.
- Выбор для всех: Админка → Site settings → Font pairing (Setting `fontPairing`, дефолт `dusk`, в БД строки нет). Предпросмотр: кнопка «Aa» (виден при `NEXT_PUBLIC_SHOW_FONT_PICKER=1`, сейчас включено в `.env`; **выключить перед запуском**), выбор хранится в localStorage `karin.font-preview`.
- Проверено (Google Fonts metadata, 21.10.2026): армянский subset есть только у Google Sans, Handjet, Iosevka Charon (+Mono), Noto Sans Armenian, Noto Serif Armenian. Google Sans **нет** в next/font у Next 15.5.4 → поэтому самохостинг.

### 3.4 Брейкпоинты (desktop-first, max-width)
`wide` ≥1181, `mid` ≤1180, `tab` ≤960 (планшет+телефон: скрыт nav, показан бургер, скрыта лента миниатюр), `ph` ≤700 (телефон). Дополнительно: **армянская шапка переходит в компактный режим (бургер) при ≤1320px**, потому что армянские пункты меню длинные и не помещались на 961–1280 (замерено).

### 3.5 Анимации
- Crossfade слайдов 600ms; текст слайда — fade-up только при смене (не при первой загрузке).
- Autoplay каждые 6 c, пауза при hover/фокусе; после касания на телефоне autoplay выключается; стартует **только после первого взаимодействия** (pointer/scroll/key/touch) — ради LCP.
- Бегущая строка направлений 28 c linear; карточки: scale 1.04 за 600ms при hover.
- `prefers-reduced-motion`: всё отключено.

### 3.6 Отступления от макета и причины
| Отступление | Причина |
|---|---|
| Пункты nav ведут на страницы (/tours, /services, /how-to-book, /#stories), а не на якоря | В ТЗ отдельные страницы |
| «Book now», «Book this trip», «Book a trip», CTA карточек услуг открывают модалку заявки (в макете — якорь #packages) | ТЗ: «каждая Book-кнопка открывает модалку» |
| В шапке добавлены переключатель HY/RU/EN и меню валют; на телефоне — круглая кнопка языка | Просьба пользователя (сообщение №3) |
| Цены на карточках туров, в слайдере, на странице тура | Просьба пользователя (сообщение №3); в макете цен нет |
| Армянские заголовки: letter-spacing 0 + word-spacing 0.12em; «How to book» в hy вес 500 и word-spacing 0.18em | Просьба пользователя (сообщение №7): буквы слипались |
| Армянская шапка компактная ≤1320px | Иначе пункты меню наезжали |
| Карточка отзыва скрыта, пока нет отзывов в админке | ТЗ: только реальные отзывы, пусто = скрыто |
| Карта Google на /contacts грузится по клику | Иначе ~1 МБ скриптов, Lighthouse contacts 71 → 90 |
| Блюр-превью — растянутый 16px JPEG вместо SVG-блюра Next; у первого слайда превью нет | SVG-фильтр дорогой в отрисовке; первый слайд — LCP |
| Кнопка «Aa» шрифтов | Инструмент выбора шрифтов по просьбе пользователя, выключается env |
| Drawer на телефоне: добавлены «Контакты», переключатели языка и валюты | Нужен доступ к /contacts и валюте на телефоне |
| В футере строка с курсами ЦБ и ссылка «Контакты» | Прозрачность конверсии цен |
| Шаги «How to book» на планшете — 2 колонки | auto-fit из макета ломал рамки на 768 |
| Ссылки «See all tours» на главной нет | Строгое следование макету (есть в nav) |

---

## 4. Информация об агентстве Karin Travel и источники

### 4.1 Проверено (с источниками)
| Факт | Значение | Источник | Статус |
|---|---|---|---|
| Название | KARIN TRAVEL | https://www.spyur.am/en/companies/41143 | ✅ |
| Адрес | Marshal Baghramyan Ave., 79 Building (Arabkir adm. district), Yerevan 0033, Armenia | Spyur | ✅ (запись обновлена 24.03.2026) |
| Телефоны | +374-98-555085 (mobile), +374-95-099993 (mobile) | Spyur | ✅ |
| Instagram | https://www.instagram.com/karin_travel/ — 5 136 подписчиков (на 21.10.2026) | Instagram | ✅ |
| Био Instagram | «Karin Travel 📍Տուրիզմ 📍Ավիատոմսեր 📍Հյուրանոցների ամրագրում 📍Վիզայի աջակցություն 📍Սո…» (туризм, авиабилеты, бронирование отелей, визовая поддержка, соц[пакет]) | Instagram | ✅ (обрезано на «Սո…») |
| Хайлайты Instagram | Maldives, Hurghada, ITB Berlin 25, Dubai, «Актуальное», Egypt, Germany, Prague, Address | Instagram | ✅ |
| ITB Berlin 2025 | Участие (хайлайт «ITB Berlin 25») | Instagram | ✅ |
| Виды деятельности | Outbound tourism, Incoming tourism | Spyur | ✅ |
| Пример рилса | https://www.instagram.com/karin_travel/reel/DbEX0bWi_z7/ (используется в «Video highlights») | Instagram | ✅ |

Также в ключевых словах Spyur: «06.02.2018» (возможно дата основания — **не подтверждено**, на сайте не используется), «999», «T 71/0, W 970» (смысл неизвестен).
Не найдено нигде: сайт, e-mail, часы работы, лицензия, цены, отзывы.

### 4.2 Под вопросом / плейсхолдеры
- **WhatsApp** = 098 555 085 — предположение из ТЗ («assumed, confirm with the client»).
- **Telegram** — ссылки нет, на сайте скрыт.
- **Часы работы** — неизвестны: на /contacts «[opening hours — to be confirmed]».
- **Время ответа** «[15 minutes]» — плейсхолдер из ТЗ (сообщение успеха + FAQ).
- **Цены** — ОБРАЗЦЫ (см. 4.4).
- **Отзывы** — нет, карточка скрыта.
- **Программы туров по дням** — написаны мной как «типичный маршрут» (общеизвестные факты о местах), помечено на сайте: «typical itinerary… adjusted to your dates». Агентство должно подтвердить.
- Факты о визах в текстах: Мальдивы — бесплатная виза по прилёте 30 дней; Грузия — для граждан РА без визы; страны Шенгена — нужна виза. Про ОАЭ/Египет намеренно ничего не утверждается.
- **Соцпакет**: описан общими словами (госслужащие могут оплатить отдых социальным пакетом), без сумм — подтвердить у агентства.

### 4.3 Туры (17, `prisma/seed-data.ts`; featured = на главной)
| slug | категория | длит. | featured | cover |
|---|---|---|---|---|
| maldives | beach | 7 ночей | ✅ | maldives-3 |
| hurghada | beach | 7 ночей | ✅ | hurghada-resort |
| santorini | beach | 6 ночей | ✅ | santorini |
| bali | beach | 10 ночей | ✅ | bali |
| cairo-hurghada | beach | 8 ночей | — (только для слайда №1) | egypt-camels |
| prague | europe | 5 ночей | ✅ | prague-2 |
| germany | europe | 6 ночей | ✅ | germany |
| rome | europe | 5 ночей | ✅ | rome |
| swiss-alps | europe | 6 ночей | ✅ | alps |
| dubai | cities | 5 ночей | ✅ | dubai-2 |
| istanbul | cities | 4 ночи | ✅ | istanbul |
| paris | cities | 5 ночей | ✅ | paris |
| tbilisi | cities | 3 ночи | ✅ | tbilisi |
| khor-virap | armenia | 1 день | ✅ | khor-virap |
| tatev | armenia | 1 день | ✅ | tatev |
| etchmiadzin | armenia | 1 день | ✅ | etchmiadzin |
| northern-armenia | armenia | 2 дня | ✅ | armenia-green |

У каждого тура на 3 языках: title, summary (одна строка — из макета), description, included (из словаря INCLUDED), itinerary 2–4 дня.
Слайды (5): Egypt «Sunset at the *Pyramids*» → cairo-hurghada; Maldives «Wake up *above the lagoon*» → maldives; UAE «Golden hour *in Dubai*» → dubai; Czech «Evenings on *Charles Bridge*» → prague; Greece «White walls, *blue Aegean*» → santorini. Тексты слайдов — из макета, переведены на hy/ru.

### 4.4 Цены — ОБРАЗЦЫ (SAMPLE_PRICES, «от», на человека)
maldives 2450 USD · hurghada 690 USD · santorini 1290 EUR · bali 1850 USD · cairo-hurghada 980 USD · prague 790 EUR · germany 1090 EUR · rome 890 EUR · swiss-alps 1590 EUR · dubai 820 USD · istanbul 460 USD · paris 950 EUR · tbilisi 85000 AMD · khor-virap 15000 AMD · tatev 24000 AMD · etchmiadzin 9000 AMD · northern-armenia 45000 AMD.
**Это НЕ цены агентства.** ТЗ запрещало выдумывать цены и требовало `[price]`; изначально так и было (все null). Пользователь затем попросил «illustrate the prices» в 4 валютах — для демонстрации введены образцы. Перед запуском — заменить в админке или очистить (тогда показывается `[price]`).

### 4.5 Курсы ЦБ Армении
API: `POST https://api.cba.am/exchangerates.asmx`, `SOAPAction: "http://www.cba.am/ExchangeRatesLatest"`. На 21.10.2026: **USD 361.40, EUR 405.92, RUB 4.4121** ֏ (они же FALLBACK в `rates.ts`). Кэш 1 ч, последнее удачное значение в Setting `rates_cache`. Округление: ֏ до 1000, ₽ до 100, $/€ до 10. Валюта по умолчанию: hy→AMD, ru→RUB, en→USD; выбор в localStorage `karin.currency`.

### 4.6 Тексты
Все тексты интерфейса: `src/messages/{hy,ru,en}.json`. EN — из макета; HY и RU написаны мной, **нужна вычитка носителем** (`TRANSLATIONS_TODO.md`). FAQ (8 вопросов), услуги (5 с пунктами), контакты, 404 — там же.

---

## 5. Принятые решения (и отклонённые варианты)
1. **Next 15.5.4, а не 16** — стабильность API middleware/next-intl. **Prisma 6, а не 7** — без driver adapters.
2. **SQLite локально, Postgres в проде** через смену `provider` (одна строка); отдельные схемы не заводились.
3. **Своя JWT-авторизация (jose)** вместо NextAuth — один админ из env, меньше зависимостей. Сравнение пароля timing-safe, лимит 8 попыток / 10 мин.
4. **Фото из админки хранятся в БД** (`Media`, WebP ≤2000px через sharp) — работает на read-only хостинге (Vercel) без отдельного хранилища. Отклонено: `public/uploads` (не работает на Vercel).
5. **Native `<dialog>`** для модалок (фокус-ловушка, Esc, top layer).
6. **Тексты в JSON next-intl**, туры/слайды — в БД с переводами; fallback locale → en → hy.
7. **Цены конвертируются на клиенте** (Price + SiteProvider), курс приходит с сервера; страницы остаются статическими (ISR).
8. **Форматирование чисел вручную** (`formatNumber`) — Node и браузер по-разному форматируют hy/ru (запятая vs пробел), был hydration mismatch.
9. **`/tours` читает `?category=` на клиенте** — чтобы страница была статической.
10. **Google Sans самохостинг** — нет в next/font. Отклонено: `<link>` на Google Fonts (блокирует рендер).
11. **Все шрифты preload:false** — 12 семейств; качается только активная пара и только нужные алфавиты (unicode-range).
12. **Образ next/image только WebP** — AVIF кодируется ~в 10 раз медленнее, из-за этого фото слайдов долго не появлялись.
13. **Слайды героя**: фото остальных слайдов монтируются с `loading="eager"` при первом взаимодействии (pointermove/pointerdown/scroll/keydown/touchstart) или через 3,5 с после `window.load`; выбранный слайд монтируется и грузится сразу; новое фото показывается, когда загружено, иначе через 700 мс с блюр-превью. Отклонено: (а) lazy — браузер не грузит невидимые lazy-картинки → баг пользователя №7; (б) грузить все сразу после первого фото (через ~0,5–1,2 с) — на медленной мобильной сети отнимает канал у первого фото: Lighthouse LCP 3,7 → 6,1 с (замерено 22.10.2026), поэтому заменено на вариант выше.
14. **Офлайн-копия через краулинг prod-сервера + патчи**, а не `output: 'export'` (тот не поддерживает API, middleware, server actions).
15. **Не публиковать как Artifact на claude.ai** — правило: не публиковать страницы реальной организации; сделаны локальные файлы.
16. **Не создавать репозиторий/не пушить** без явного разрешения пользователя (внешнее действие).

---

## 6. Что сделано / частично / не начато

### Сделано полностью (проверено в браузере)
- Главная по макету (1440, 1024, 768, 390 — без горизонтального скролла).
- Страницы туров, тура, услуг, how-to-book (FAQ-аккордеон), контактов, 404 (локализованная).
- Модалка заявки + формы услуг; API заявок/подписки (zod, honeypot, rate-limit) — протестировано curl и в браузере.
- Админка: логин, обзор, заявки (фильтры, поиск, статусы, call/WhatsApp), туры (CRUD, загрузка фото), слайды, отзывы, подписчики + CSV, настройки (контакты, часы, шрифт, показ курсов) — сохранение тура проверено (цена появилась на всех языках).
- Три языка, переключатели; валюты с курсами ЦБ; 6 пар шрифтов + предпросмотр.
- SEO: метаданные, canonical, hreflang, OG, sitemap.xml, robots.txt, JSON-LD TravelAgency/TouristTrip/FAQPage.
- Аналитика (GA4/Pixel по env), доступность (Lighthouse A11y 100).
- Офлайн-копия (66 страниц) — проверена в headless Chrome с диска: 0 ошибок.
- Исправлены баги из сообщения №7 (фото слайдов, армянские заголовки).

### Частично
- **Telegram/e-mail уведомления** — код есть, **не тестировались** (нет токена/SMTP).
- **Lighthouse mobile Performance** — 84–91 (калиброванно), 75–85 (дефолтный троттлинг на этом ПК); цель ≥90 достигнута не на всех страницах (раздел 8).
- **Переводы HY/RU** — написаны, не вычитаны носителем.
- **Деплой** — инструкция в README, сам деплой не делался.

### Не начато
- Публичный хостинг (Vercel + Neon/Supabase) и миграция на Postgres.
- Реальные цены, отзывы, часы, Telegram-ссылка от клиента.
- Пункт «3.» из сообщения пользователя №7 — **текст обрезан, суть неизвестна**.
- Автотесты (unit/e2e) в репозитории нет; проверки делались вручную/скриптами (см. 10.4).

---

## 7. Известные баги, ошибки и их история

### 7.1 «Падение production-сервера (exit code 1)» — НЕ баг приложения
Каждый раз сервер `npx next start -p 3100` запускался в фоне, логи показывают `✓ Ready` без ошибок. Exit code 1 появлялся потому, что **я сам принудительно завершал процесс** `taskkill //PID <pid> //F //T` после Lighthouse-аудитов или экспорта (порт 3100 нужно было освободить перед новой сборкой: `next build` перезаписывает `.next`, которым пользуется запущенный сервер). Принудительное завершение на Windows даёт код 1. Логи: `_handoff/logs/server-*.output`.
Аналогично dev-сервер (`npm run dev`) останавливался перед каждой prod-сборкой, т.к. dev и build делят папку `.next`.

### 7.2 Реальные ошибки, найденные и исправленные
1. **`Unexpected spread` в `src/app/fonts.ts`** — next/font требует литеральные опции; `{...common}` ломал компиляцию (dev-страница не открывалась). Исправлено: опции прописаны в каждом вызове. Лог: `_handoff/logs/dev-font-spread-error.txt`.
2. **Hydration mismatch** «354,000 ֏» (сервер) vs «354 000 ֏» (браузер) — разный ICU в Node и Chrome. Исправлено ручным `formatNumber`.
3. **CLS 0.284 на /services (телефон)** — hero ниже контента; при подмене шрифта рос. Исправлено: `ph:min-h-[max(560px,calc(100svh-180px))]`.
4. **Heading-order (A11y 98) на /tours** — h3 карточек без h2. Добавлен sr-only h2.
5. **Контраст «Day N»** (muted на cream 3.51:1) — заменён на body-muted.
6. **Label-content-name-mismatch** — убран aria-label у вордмарка.
7. **Armenian header overflow 961–1280px** — компактный режим ≤1320 для hy.
8. **Фото слайдов не показывались при выборе** (сообщение №7): (а) скрытые слайды были `loading="lazy"` → браузер их не грузил; (б) AVIF кодировался секундами; (в) onLoad первого (кэшированного) фото не срабатывал до гидрации → остальные не монтировались. Исправлено: eager-загрузка, WebP, таймер 1.2 c для монтирования, «показывать новое фото после загрузки или через 700 мс с превью».
9. **Армянские заголовки слипались** (сообщение №7) — `letter-spacing:0 !important; word-spacing:.12em` для hy h1–h3.
10. **Офлайн-копия**: картинки `/_next/image` и RSC-префетчи не работали с file:// — патч чанков (`unoptimized:!0`, publicPath) и shim (fetch `_rsc` → вечный pending). Тост «форма не отправлена» был под backdrop диалога — теперь вставляется внутрь открытого `<dialog>`.

### 7.3 Уязвимости зависимостей (npm audit, 22.10.2026)

**Статус: основные ИСПРАВЛЕНЫ 22.10.2026** (по просьбе пользователя №11): `next@15.5.28` (точно закреплена), `sharp@0.35.5`, `nodemailer@10.2.0`, `@types/nodemailer@8.0.2`.
Проверено после обновления: `tsc` без ошибок; `npm run build` (74 страницы); все страницы hy/ru/en отвечают 200, `/` → 307 на `/hy`, `/admin` → 307 на логин, 404, sitemap, robots; `/_next/image` 200; POST `/api/enquiries` и `/api/subscribe` ok; e2e в Chrome (`_handoff/tests/e2e-site-and-admin.mjs`): слайдер, смена валюты на €, язык, модальная форма «Заявка отправлена», вход в админку, создание тура с **загрузкой обложки (sharp → WebP 307 КБ через /api/media)**, страница тура на сайте, удаление тура; sharp и nodemailer 10 отдельно проверены теми же вызовами, что в коде (`_handoff/tests/libcheck-sharp-nodemailer.mjs`: resize→webp, blur jpeg, jsonTransport sendMail, SMTP transport); офлайн-копия пересобрана, патчи экспорта совпали с кодом Next 15.5.28, тесты 0 ошибок. Тестовые записи из БД удалены. Мелочь, найденная тестом и исправленная: `/favicon.ico` 404 в админке → в `src/app/admin/layout.tsx` добавлено `icons: { icon: '/icon.svg' }`.

**Осталось 12 (9 high, 3 moderate) — только инструменты сборки/CLI**, не код, работающий у посетителя (`_handoff/logs/npm-audit-2026-10-22-after-upgrade.txt`):
- `postcss` ≤8.5.22 **внутри** `next/node_modules` (обрабатывает только наш собственный CSS при сборке) — исправлено лишь в Next 16 (major).
- `braces`, `micromatch`, `fast-glob`, `chokidar`, `postcss-selector-parser`, `postcss-nested` — цепочка **Tailwind 3.4.19** (сборка CSS) — исправление: Tailwind 4 (major, другая конфигурация).
- `deepmerge-ts` в `@prisma/config` (CLI Prisma) — исправление: Prisma 7 (major, driver adapters + prisma.config.ts).

Ниже — исходное состояние до обновления (для истории). Полный отчёт: `_handoff/logs/npm-audit-2026-10-22.txt` / `.json`. 14 уязвимостей (1 critical, 11 high, 2 moderate):
- **next 15.5.4 — critical**: DoS через Image Optimizer remotePatterns (GHSA-9g9p-9gw9-jx7f), обход Middleware через segment-prefetch (GHSA-267c-6grr-h53f, GHSA-26hh-7cqf-hhc6), отравление кэша RSC (GHSA-vfv6-92ff-j949), DoS Cache Components (GHSA-mg66-mrh9-m8jx), SSRF в rewrites (GHSA-p9j2-gv94-2wf4). **Исправление: `next@15.5.28` (та же ветка 15.5)** — в package.json версия закреплена точно `15.5.4`, поэтому `npm audit fix` без `--force` её не поднимает. Также подтянет исправленный postcss.
- **nodemailer ≤10.0.5 — high** (CRLF-инъекция в EHLO, DoS addressparser, обход проверки домена). Фикс: nodemailer 10.x (major; API createTransport/sendMail совместим, но проверить).
- **sharp ≤0.35.5-rc.1 — high** (libvips/libheif/librsvg). Фикс: sharp 0.35.5 (minor-breaking; используется в admin/actions.ts и scripts/make-blur.mjs).
- **deepmerge-ts <8 (через prisma) — high**. Фикс требует prisma 7 (breaking) — оценить отдельно.
(Эти пункты закрыты обновлением выше, кроме postcss внутри Next и deepmerge-ts.)

### 7.4 Известные ограничения / риски
- `scripts/export-offline.mjs` патчит внутренности Next (`.p="/_next/"`, `path:"/_next/image"…unoptimized:!1`) — **может сломаться при обновлении Next**.
- In-memory rate-limit — по инстансу; на serverless не глобальный.
- Предупреждение Prisma: `package.json#prisma` deprecated (Prisma 7) — пока безопасно.
- `next build` читает БД (generateStaticParams туров) — в CI/Vercel нужна доступная БД (`getSettings` и sitemap имеют fallback, туры — нет: без БД будет 0 статических туров, но страницы отрендерятся по запросу).
- Hero: остальные 4 фото (~50–100 КБ каждое на телефоне) догружаются после первого взаимодействия или через 3,5 с после загрузки — переаудировано 22.10.2026 (см. §8, этап 7).
- Dev-режим: первая генерация оптимизированных картинок медленная (норма для dev).
- Панель превью Claude Code показывает локальные html-файлы как статический снимок без картинок/скриптов — офлайн-копию проверять в обычном браузере.
- В `dev.db` sample-цены; заявок/подписчиков нет (тестовые удалены).

---

## 8. Lighthouse (мобильный, если не указано иное)
Машина: CPU benchmarkIndex **~600–850** (ниже ~1000, на которые рассчитан дефолтный 4× троттлинг) → дефолтные цифры пессимистичны. «Калибр.» = `--throttling.cpuSlowdownMultiplier=2`.

| Этап | Страница | Perf | A11y | BP | SEO | LCP | Прим. |
|---|---|---|---|---|---|---|---|
| 1, дефолт | /hy | 74 | 100 | 100 | 92 | 5.1 s | SEO: canonical на :3000 при сервере на :3100 (артефакт теста) |
| 2, после отложенного autoplay/фото | /hy | 81 | 100 | 100 | 100 | 4.1 s | |
| 3, дефолт | /hy | 78 | 100 | 100 | 100 | 4.4 s | |
| 3, дефолт | /en/tours/maldives | 84 | 100 | 100 | 100 | 3.5 s | |
| 3, дефолт | /ru/services | 75 | 100 | 100 | 100 | 3.4 s | |
| 4, калибр. | /hy | 90 | 100 | 100 | 100 | 3.5 s | |
| 4, калибр. | /en/tours/maldives | 87 | 100 | 100 | 100 | 3.9 s | |
| 4, калибр. | /ru/services | 75 | 100 | 100 | 100 | 3.4 s | CLS 0.284 → исправлено |
| 4, калибр. | /en/tours | 82 | 98 | 100 | 100 | 4.4 s | heading-order → исправлено |
| 4, desktop | /hy | 98 | — | — | — | 1.0 s | |
| 5, калибр. | /ru/services | 91 | 100 | 100 | 100 | 3.2 s | |
| 5, калибр. | /en/tours | 83 | 100 | 100 | 100 | 4.4 s | |
| 5, калибр. | /hy/how-to-book | 95 | 100 | 100 | 100 | 2.8 s | |
| 5, калибр. | /en/contacts | 71 | 100 | 100 | 100 | 5.8 s | Google Maps → исправлено |
| 5, калибр. | /hy | 83 | 100 | 100 | 100 | 4.3 s | |
| 6 (финал), калибр. | /hy | 86 | 100 | 100 | 100 | 3.7 s | |
| 6, калибр. | /en/tours | 84 | 100 | 100 | 100 | 3.9 s | |
| 6, калибр. | /en/contacts | 90 | 100 | 100 | 100 | 3.2 s | |
| 6, калибр. | /ru/services | 87 | 100 | 100 | 100 | 3.4 s | |
| 6, калибр. | /en/tours/maldives | 85 | 100 | 100 | 100 | 3.6 s | |

| 7 (22.10, Next 15.5.28), калибр. | /hy — слайды грузились сразу после первого фото | 74 | 100 | 100 | 92* | 6.1 s | регрессия от фикса слайдера; benchmark 2029 |
| 7, калибр. | /hy — после переноса догрузки слайдов на взаимодействие / +3,5 с | 81 / 84 | 100 | 100 | 92* | 4.5 / 4.3 s | два прогона; benchmark 1681 / 2001 |

\* SEO 92 на этапе 7 — артефакт теста: сборка сделана без `NEXT_PUBLIC_SITE_URL=http://localhost:3100`, canonical указывает на :3000 (как на этапе 1). В нормальной сборке — 100.

Между этапами 6 и 7 добавлены валюты, 6 пар шрифтов, Google Sans, WebP-only, новая логика слайдов и Next 15.5.28. Этап 7 — **только главная**; остальные страницы после этих изменений не переаудированы. Benchmark машины на этапе 7 (1700–2000) заметно выше, чем на этапах 4–6 (~600–850), поэтому множитель 2 давал более лёгкий троттлинг — цифры этапов сравнимы лишь приблизительно. LCP главной 4,3–4,5 с против 3,7 с на этапе 6 — подозрение на дополнительную работу стилей из-за 12 подключённых семейств шрифтов (CSS @font-face для всех пар) — проверить, если цель ≥90 обязательна (вариант: подключать CSS только активной пары).
Без троттлинга в реальном браузере: DOMContentLoaded ~173 ms, long animation frames нет.
Главная причина задержки LCP по трейсу: один первый Layout ~400 ms (при 2× троттлинге) на ~434 объектах — подозрение на fallback-поиск шрифтов Windows в headless Chrome; ImageDecode ~318 ms.
**Что ещё оптимизировать:** прогнать PageSpeed Insights после деплоя; проверить влияние eager-слайдов на телефоне (возможно грузить остальные слайды только на ≥961px или по idle); уменьшить JS (next-intl messages целиком уходят на клиент — можно передавать только нужные namespaces); `browserslist` для legacy-JS (~11 КБ); проверить стоимость backdrop-filter.
Файлы отчётов: `_handoff/audits/`.

---

## 9. Переменные окружения (только названия; значения — в `.env.example`)
`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_SHOW_FONT_PICKER` (1 = кнопка «Aa», выключить перед запуском).
Локальный `.env` содержит сгенерированные `AUTH_SECRET` и `ADMIN_PASSWORD` — **в архив не включён**; создать новый: `copy .env.example .env` и заполнить.
`NEXT_PUBLIC_*` подставляются при сборке → после изменения перезапустить dev / пересобрать.

---

## 10. Точные команды (Windows, из папки проекта)

### 10.1 Установка и запуск
```
npm install
copy .env.example .env          (заполнить ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET)
npm run setup                   (prisma generate + db push + seed)
npm run dev                     → http://localhost:3000 (→ /hy), админка /admin
```
Или двойной клик `start-site.cmd`.
Генерация AUTH_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### 10.2 Сборка и прод
```
npm run build                   (prisma generate && next build; 74 статические страницы)
npm start                       (next start, порт 3000)
npx next start -p 3100          (как использовалось для аудитов/экспорта)
npm run typecheck               (tsc --noEmit — сейчас без ошибок)
```
Dev и build делят `.next` → остановить dev перед build.

### 10.3 БД и данные
```
npm run db:push                 prisma db push
npm run db:seed                 сид (безопасно повторять)
npm run db:reset                ПОЛНЫЙ сброс + сид
npx tsx scripts/apply-sample-prices.ts   образцы цен турам без цены
npm run blur                    пересоздать src/lib/blur.json после добавления фото
node scripts/fetch-google-sans.mjs       перекачать Google Sans
```

### 10.4 Офлайн-копия и проверки
```
npm run build
npx next start -p 3100          (второй терминал)
node scripts/export-offline.mjs → website-offline/ (66 страниц, ~21 МБ)
```
Проверка с диска делалась puppeteer-core 23.11.1 (в отдельной scratch-папке, не в проекте) скриптами `_handoff/tests/test.mjs`, `test2.mjs` (путь к Chrome: `C:/Program Files/Google/Chrome/Application/chrome.exe`).
Lighthouse: `npx -y lighthouse@12.8.2 http://localhost:3100/hy --chrome-flags="--headless=new" --throttling.cpuSlowdownMultiplier=2 --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=report.json`.
Для корректного canonical при аудите на 3100: собирать с `NEXT_PUBLIC_SITE_URL=http://localhost:3100`.

### 10.5 Деплой (не выполнялся)
Neon/Supabase Postgres → в `schema.prisma` `provider = "postgresql"` → GitHub → Vercel import → env из раздела 9 → `npx prisma db push` и `npm run db:seed` против прод-БД → деплой. Подробно: README §4.

---

## 11. Следующие шаги по приоритету
0. ~~Безопасность зависимостей~~ — **сделано 22.10.2026** (next 15.5.28, sharp 0.35.5, nodemailer 10.2.0, всё проверено, §7.3). Остаток — major-обновления инструментов сборки (Tailwind 4, Prisma 7, Next 16): планировать отдельно, не срочно для посетителей сайта.
1. **Выяснить пункт «3.»** из сообщения пользователя №7 (обрезан).
2. **Получить от клиента**: реальные цены (или очистить образцы), часы работы, подтверждение WhatsApp, ссылку Telegram, e-mail, реальные отзывы, время ответа вместо «[15 minutes]», подтверждение программ туров и формулировок о соцпакете.
3. **Вычитка HY/RU** носителем (`TRANSLATIONS_TODO.md`).
4. ~~Git + GitHub~~ — **сделано 22.10.2026**: https://github.com/mysteriousaper/karin-travel. Проверить в Settings, что репозиторий **Private** (видимость отсюда проверить не удалось). Новые изменения: `git add .` → `git commit -m "…"` → `git push`.
5. **Telegram-бот**: создать, вписать токен/chat id, отправить тестовую заявку.
6. **Деплой** Vercel + Neon, смена провайдера Prisma, домен, `NEXT_PUBLIC_SITE_URL`.
7. `NEXT_PUBLIC_SHOW_FONT_PICKER=0` перед запуском; при желании выбрать другую пару шрифтов в админке (сейчас dusk).
8. **Повторный Lighthouse** после деплоя (PageSpeed Insights) для всех страниц; главная сейчас 81–84 (цель 90) — оптимизации из раздела 8 (в первую очередь: CSS только активной пары шрифтов).
9. Опционально: e2e-тесты (Playwright), миграция с `package.json#prisma` на `prisma.config.ts`, глобальный rate-limit (Upstash/Redis).
10. Быстрый показ другим людям: zip `website-offline` или Netlify Drop (https://app.netlify.com/drop).

---

## 12. Хронология работы в этом чате (все просьбы пользователя по порядку)
1. **Создать full-stack сайт по дизайну** (см. 1.1). Сделано: распаковка пакета, исследование Spyur/Instagram, весь проект, сид, админка, API, SEO, тесты на 1440/390, Lighthouse-оптимизации, README/TRANSLATIONS_TODO, офлайн-копия позже.
2. **«make it in a way that I can open it here and see»** — запущен dev-сервер в панели браузера Claude Code; добавлен `start-site.cmd`.
3. **«the website should work in three languages armenian russian english and we need to see switch button for languages it sould illusttare the prices in dram euro dollar and rubli the exchange rates you can get from centeral bank of armenia and convert it from the centreal bank currency exchange. the shirfts should be also different, you need to also present me options for shirfts which we can change»** — сделано: видимый переключатель HY/RU/EN (+ компактный на телефоне, компактная армянская шапка ≤1320), валюты ֏/$/€/₽ по api.cba.am, образцы цен, 6 пар шрифтов («shirfts» интерпретировано как «шрифты»), кнопка «Aa», выбор в админке.
4. **«Keep the Dusk fonts from the approved design as the default.»** — подтверждено: dusk уже по умолчанию, предпросмотр сброшен.
5. **«so can i see the ready webiste?»** — показан сайт в панели, объяснено как смотреть.
6. **«your task now to show now the full website to me which i can open here and open in files as well»** — сделана офлайн-копия `website-offline/` + `Open Karin website (offline).html`, проверена в headless Chrome (0 ошибок).
7. **Баги со скриншотом армянского блока «Ինչպես ամրագրել ուղևորությունը»**: «1. in main page when i select pics from menu the pics does not being illustrated work on them that whenever I select the pics the photos clearly being showed, 2. the part wich i shared the writing should not be all tgth the make space between words, 3.» (пункт 3 обрезан) — исправлены 1 и 2, офлайн-копия пересобрана.
8. **«okay now tell me how to save it in github and to show it to other person as well»** — дана инструкция (GitHub приватный, zip офлайн-копии, Netlify Drop, Vercel).
9. **«how to take it in github tell me step by step»** — пошаговая инструкция (аккаунт, New repository private, cmd в папке, git config, init/add/commit/branch/remote/push, коллабораторы, решение ошибок). Выполнил ли пользователь — неизвестно.
10. (на русском) Подготовить HANDOFF.md, `_handoff/`, дизайн в `_handoff/design/`, архив `karin-full-handoff.zip` на рабочем столе без node_modules/.next/.git-кэша/сборок — сделано (34,4 МБ); при подготовке найдены уязвимости `npm audit`.
11. **«Обнови next до 15.5.28, а также sharp и nodemailer, проверь сборку и сайт, затем пересобери архив.»** — сделано: обновление, сборка, полная проверка (§7.3); найдена и исправлена регрессия LCP от вчерашнего фикса слайдера (решение №13, §8 этап 7); исправлен 404 favicon в админке; офлайн-копия пересобрана и проверена; архив пересобран.
12. **«make this project in a github new repsitory in a account of myserious aper»** → вход через `gh` не удался (кнопка Authorize в браузере была неактивна), пользователь попросил пошаговую инструкцию на английском, затем создал репозиторий сам и прислал ссылку https://github.com/mysteriousaper/karin-travel → коммит, объединение с авто-README, push через Git Credential Manager (пользователь подтвердил вход), проверено: 239/239 файлов, секретов нет.

---

## 13. Содержимое `_handoff/`
- `design/karin-website-handoff/` — полный распакованный дизайн-пакет (BRIEF, START_PROMPT, README, reference/source html, скриншоты, 30 фото).
- `screenshots/` — скриншоты офлайн-копии (главная, модалка «Request sent», hero Prague после фикса, блок How to book в hy после фикса) + скриншот пользователя с багом армянского заголовка (если сохранился).
- `audits/` — JSON-отчёты Lighthouse этапа 6 (калибр.) и трейс `trace/` (r-0.trace.json, devtoolslog, отчёт) для /en/tours.
- `logs/` (см. `logs/README.md`) — выводы фоновых prod-серверов (все `Ready`, затем exit 1 от taskkill), лог ошибок `Unexpected spread` и гидрации, первый `npm install`, полный `npm audit` (txt + json).
- `tests/` — puppeteer-скрипты: офлайн-копия (`test.mjs`, `test2.mjs`), e2e сайта и админки с загрузкой фото (`e2e-site-and-admin.mjs`, читает логин из `.env`), ранний выбор слайда (`slider-early-pick.mjs`), проверка sharp/nodemailer (`libcheck-sharp-nodemailer.mjs`) + README.
- `research/sources.md` — сводка исследования агентства, API ЦБ и шрифтов с армянским.
- `chat-requests.md` — дословные сообщения пользователя по порядку.
- `audits/README.md` — таблица цифр по файлам отчётов.

Архив `karin-full-handoff.zip` на рабочем столе содержит весь проект **без** `node_modules`, `.next`, `.git`, `website-offline` (сборка), `tsconfig.tsbuildinfo`, `next-env.d.ts`, и **без `.env`** (секреты). `prisma/dev.db` включён.
