// Seed content for the tours and hero slides shown in the approved design.
// Prices are intentionally empty: the site shows "[price]" until the agency
// fills them in through /admin. HY and RU strings need a native-speaker
// review (see TRANSLATIONS_TODO.md).

type L = { en: string; ru: string; hy: string };
type Day = [L, L];

export const INCLUDED: Record<string, L> = {
  flight: { en: 'Return flight from Yerevan', ru: 'Перелёт из Еревана и обратно', hy: 'Թռիչք Երևանից և վերադարձ' },
  hotel: { en: 'Hotel accommodation', ru: 'Проживание в отеле', hy: 'Կացություն հյուրանոցում' },
  resort: { en: 'Beach resort stay', ru: 'Проживание на пляжном курорте', hy: 'Կացություն ծովափնյա հանգստավայրում' },
  villa: { en: 'Overwater villa', ru: 'Вилла над водой', hy: 'Վիլլա ջրի վրա' },
  allInc: { en: 'All-inclusive meals', ru: 'Питание «всё включено»', hy: 'Սնունդ՝ ամեն ինչ ներառված' },
  halfBoard: { en: 'Half board', ru: 'Полупансион', hy: 'Կիսապանսիոն' },
  breakfast: { en: 'Daily breakfast', ru: 'Завтраки', hy: 'Նախաճաշ' },
  transfers: { en: 'Airport transfers', ru: 'Трансферы из аэропорта', hy: 'Օդանավակայանային տրանսֆեր' },
  seaplane: { en: 'Seaplane transfer', ru: 'Трансфер на гидросамолёте', hy: 'Տրանսֆեր հիդրոինքնաթիռով' },
  insurance: { en: 'Travel insurance', ru: 'Страховка', hy: 'Ճամփորդական ապահովագրություն' },
  visa: { en: 'Visa documents', ru: 'Визовые документы', hy: 'Վիզայի փաստաթղթեր' },
  schengen: { en: 'Schengen visa support', ru: 'Помощь с шенгенской визой', hy: 'Շենգենյան վիզայի աջակցություն' },
  excursions: { en: 'Guided excursions', ru: 'Экскурсии с гидом', hy: 'Էքսկուրսիաներ գիդով' },
  safari: { en: 'Desert safari evening', ru: 'Вечернее сафари в пустыне', hy: 'Երեկոյան սաֆարի անապատում' },
  cruise: { en: 'River cruise', ru: 'Речная прогулка', hy: 'Զբոսանք գետով' },
  transport: { en: 'Comfortable transport', ru: 'Комфортный транспорт', hy: 'Հարմարավետ տրանսպորտ' },
  guide: { en: 'Licensed guide', ru: 'Лицензированный гид', hy: 'Լիցենզավորված գիդ' },
  lunch: { en: 'Lunch with local food', ru: 'Обед с местной кухней', hy: 'Ճաշ տեղական խոհանոցով' },
  ropeway: { en: 'Wings of Tatev ropeway tickets', ru: 'Билеты на канатную дорогу «Крылья Татева»', hy: 'Տոմսեր «Տաթևի թևեր» ճոպանուղու համար' },
  stay: { en: 'One night in a guesthouse', ru: 'Одна ночь в гостевом доме', hy: 'Մեկ գիշեր հյուրատանը' },
};

// SAMPLE PRICES — illustrative "from" prices per person so the currency
// switch can be reviewed. They are NOT the agency's prices: replace them in
// Admin → Tours (or clear them to show [price]) before launch.
export const SAMPLE_PRICES: Record<string, [number, 'USD' | 'EUR' | 'AMD' | 'RUB']> = {
  maldives: [2450, 'USD'],
  hurghada: [690, 'USD'],
  santorini: [1290, 'EUR'],
  bali: [1850, 'USD'],
  'cairo-hurghada': [980, 'USD'],
  prague: [790, 'EUR'],
  germany: [1090, 'EUR'],
  rome: [890, 'EUR'],
  'swiss-alps': [1590, 'EUR'],
  dubai: [820, 'USD'],
  istanbul: [460, 'USD'],
  paris: [950, 'EUR'],
  tbilisi: [85000, 'AMD'],
  'khor-virap': [15000, 'AMD'],
  tatev: [24000, 'AMD'],
  etchmiadzin: [9000, 'AMD'],
  'northern-armenia': [45000, 'AMD'],
};

export type SeedTour = {
  slug: string;
  category: 'beach' | 'europe' | 'cities' | 'armenia';
  duration: number;
  unit: 'nights' | 'days';
  featured: boolean;
  cover: string;
  gallery: string[];
  included: (keyof typeof INCLUDED)[];
  title: L;
  summary: L;
  description: L;
  days: Day[];
};

const d = (en: string, ru: string, hy: string): L => ({ en, ru, hy });

export const TOURS: SeedTour[] = [
  // ---------------- Beach ----------------
  {
    slug: 'maldives',
    category: 'beach',
    duration: 7,
    unit: 'nights',
    featured: true,
    cover: '/images/maldives-3.jpg',
    gallery: ['/images/maldives-1.jpg', '/images/maldives-2.jpg', '/images/maldives-plane.jpg', '/images/maldives-3.jpg'],
    included: ['flight', 'villa', 'halfBoard', 'seaplane', 'insurance'],
    title: d('Maldives', 'Мальдивы', 'Մալդիվներ'),
    summary: d('Overwater villas, seaplane transfer.', 'Виллы над водой, трансфер на гидросамолёте.', 'Վիլլաներ ջրի վրա, տրանսֆեր հիդրոինքնաթիռով։'),
    description: d(
      'A week on one island: a villa on stilts over the lagoon, a house reef a few steps from your deck and a seaplane ride from Malé that most travelers call the best part of the trip. The Maldives give a free 30-day visa on arrival.',
      'Неделя на одном острове: вилла на сваях над лагуной, домашний риф в нескольких шагах от террасы и перелёт на гидросамолёте из Мале, который многие называют лучшей частью поездки. На Мальдивах бесплатная виза по прилёте на 30 дней.',
      'Մեկ շաբաթ մեկ կղզում. վիլլա ջրի վրա, խութ՝ ձեր տեռասից մի քանի քայլ հեռավորության վրա, և թռիչք հիդրոինքնաթիռով Մալեից, որը շատերն անվանում են ուղևորության լավագույն մասը։ Մալդիվներում ժամանելիս տրվում է անվճար 30-օրյա վիզա։'
    ),
    days: [
      [d('Fly to Malé', 'Перелёт в Мале', 'Թռիչք դեպի Մալե'), d('Flight from Zvartnots with one connection. Meet-and-greet at Velana airport and seaplane to your island.', 'Перелёт из Звартноца с одной пересадкой. Встреча в аэропорту Велана и гидросамолёт на остров.', 'Թռիչք Զվարթնոցից մեկ տարանցումով։ Դիմավորում Վելանա օդանավակայանում և հիդրոինքնաթիռ դեպի կղզի։')],
      [d('Lagoon days', 'Дни в лагуне', 'Օրեր լագունում'), d('Snorkelling on the house reef, kayaks, spa or simply your deck. Half board at the resort.', 'Снорклинг на домашнем рифе, каяки, спа или просто ваша терраса. Полупансион.', 'Սնորքլինգ խութի մոտ, կայակներ, սպա կամ պարզապես ձեր տեռասը։ Կիսապանսիոն։')],
      [d('Optional trips', 'Дополнительные поездки', 'Լրացուցիչ ուղևորություններ'), d('Sandbank picnic, sunset dolphin cruise or a dive with manta rays — booked on the spot or in advance.', 'Пикник на песчаной косе, закатная прогулка с дельфинами или дайвинг с мантами — на месте или заранее.', 'Պիկնիկ ավազե կղզյակում, մայրամուտի զբոսանք դելֆինների հետ կամ սուզում մանտաների հետ։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Seaplane back to Malé and flight to Yerevan.', 'Гидросамолёт в Мале и перелёт в Ереван.', 'Հիդրոինքնաթիռով դեպի Մալե և թռիչք Երևան։')],
    ],
  },
  {
    slug: 'hurghada',
    category: 'beach',
    duration: 7,
    unit: 'nights',
    featured: true,
    cover: '/images/hurghada-resort.jpg',
    gallery: ['/images/hurghada-resort.jpg', '/images/hurghada-reef.jpg', '/images/pool.jpg'],
    included: ['flight', 'resort', 'allInc', 'transfers', 'insurance'],
    title: d('Hurghada', 'Хургада', 'Հուրղադա'),
    summary: d('All-inclusive on the Red Sea.', '«Всё включено» на Красном море.', 'Ամեն ինչ ներառված՝ Կարմիր ծովում։'),
    description: d(
      'Warm sea most of the year, coral reefs right off the beach and resorts where you don’t think about money once you check in. A favourite of our families with children.',
      'Тёплое море почти круглый год, коралловые рифы у самого пляжа и отели, где о деньгах не думаешь после заселения. Любимое направление наших семей с детьми.',
      'Տաք ծով գրեթե ամբողջ տարին, կորալային խութեր հենց լողափի մոտ և հանգստավայրեր, որտեղ գրանցվելուց հետո փողի մասին չես մտածում։ Երեխաներով ընտանիքների սիրելի ուղղությունը։'
    ),
    days: [
      [d('Arrival', 'Прилёт', 'Ժամանում'), d('Flight to Hurghada, transfer to the resort, welcome dinner.', 'Перелёт в Хургаду, трансфер в отель, ужин.', 'Թռիչք Հուրղադա, տրանսֆեր հանգստավայր, ընթրիք։')],
      [d('Beach and reef', 'Пляж и риф', 'Լողափ և խութ'), d('Days at the resort with the reef a short swim from the pier.', 'Дни в отеле, риф в нескольких метрах от пирса.', 'Օրեր հանգստավայրում, խութը՝ նավամատույցից մի քանի մետր հեռու։')],
      [d('Giftun Island', 'Остров Гифтун', 'Գիֆթուն կղզի'), d('Optional boat day with snorkelling stops and lunch on board.', 'По желанию — морская прогулка со снорклингом и обедом на борту.', 'Ըստ ցանկության՝ նավով զբոսանք սնորքլինգով և ճաշով։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Transfer to the airport and flight to Yerevan.', 'Трансфер в аэропорт и перелёт в Ереван.', 'Տրանսֆեր օդանավակայան և թռիչք Երևան։')],
    ],
  },
  {
    slug: 'santorini',
    category: 'beach',
    duration: 6,
    unit: 'nights',
    featured: true,
    cover: '/images/santorini.jpg',
    gallery: ['/images/santorini.jpg', '/images/couple.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'schengen'],
    title: d('Santorini', 'Санторини', 'Սանտորինի'),
    summary: d('Caldera views and sunsets.', 'Вид на кальдеру и закаты.', 'Տեսարան դեպի կալդերա և մայրամուտներ։'),
    description: d(
      'A cliffside hotel above the caldera, white villages linked by footpaths and the Oia sunset a short walk away. Greece is in Schengen — we prepare the visa file for you.',
      'Отель на скале над кальдерой, белые деревни, связанные тропами, и закат в Ии в нескольких минутах. Греция входит в Шенген — визовые документы готовим мы.',
      'Հյուրանոց ժայռի վրա՝ կալդերայի վերևում, սպիտակ գյուղեր և Իայի մայրամուտը՝ մի քանի րոպե հեռու։ Հունաստանը Շենգենում է. վիզայի փաթեթը պատրաստում ենք մենք։'
    ),
    days: [
      [d('Arrival in Fira', 'Прилёт, Фира', 'Ժամանում, Ֆիրա'), d('Flight via Athens, transfer to your hotel on the caldera.', 'Перелёт через Афины, трансфер в отель на кальдере.', 'Թռիչք Աթենքով, տրանսֆեր հյուրանոց։')],
      [d('Fira to Oia on foot', 'Пешком из Фиры в Ию', 'Ֆիրայից Իա՝ ոտքով'), d('The cliff path between villages and sunset at Oia.', 'Тропа по краю кальдеры и закат в Ии.', 'Արահետ կալդերայի եզրով և մայրամուտ Իայում։')],
      [d('Caldera by boat', 'Кальдера с воды', 'Կալդերան՝ ջրից'), d('Optional catamaran trip to the volcano and hot springs.', 'По желанию — катамаран к вулкану и горячим источникам.', 'Ըստ ցանկության՝ կատամարան դեպի հրաբուխ և տաք աղբյուրներ։')],
      [d('Beaches', 'Пляжи', 'Լողափեր'), d('Red and black sand beaches in the south of the island.', 'Красный и чёрный пляжи на юге острова.', 'Կարմիր և սև ավազով լողափեր կղզու հարավում։')],
    ],
  },
  {
    slug: 'bali',
    category: 'beach',
    duration: 10,
    unit: 'nights',
    featured: true,
    cover: '/images/bali.jpg',
    gallery: ['/images/bali.jpg', '/images/pool.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'excursions'],
    title: d('Bali', 'Бали', 'Բալի'),
    summary: d('Rice terraces, temples, beaches.', 'Рисовые террасы, храмы, пляжи.', 'Բրնձի դարավանդներ, տաճարներ, լողափեր։'),
    description: d(
      'Ten nights split between Ubud in the green interior and a beach hotel in the south — rice terraces, sea temples and long dinners by the ocean.',
      'Десять ночей: Убуд среди зелени и пляжный отель на юге — рисовые террасы, храмы у моря и долгие ужины у океана.',
      'Տասը գիշեր՝ Ուբուդ կանաչ կենտրոնում և ծովափնյա հյուրանոց հարավում. բրնձի դարավանդներ, ծովափնյա տաճարներ և երկար ընթրիքներ օվկիանոսի ափին։'
    ),
    days: [
      [d('Arrival and Ubud', 'Прилёт и Убуд', 'Ժամանում և Ուբուդ'), d('Flight to Denpasar, transfer to Ubud.', 'Перелёт в Денпасар, трансфер в Убуд.', 'Թռիչք Դենպասար, տրանսֆեր Ուբուդ։')],
      [d('Terraces and temples', 'Террасы и храмы', 'Դարավանդներ և տաճարներ'), d('Tegallalang rice terraces and the water temple of Tirta Empul.', 'Рисовые террасы Тегаллаланг и храм Тирта Эмпул.', 'Թեգալալանգի դարավանդներ և Թիրթա Էմպուլ տաճար։')],
      [d('South coast', 'Южное побережье', 'Հարավային ափ'), d('Move to the beach. Sunset at Uluwatu or Tanah Lot temple.', 'Переезд к морю. Закат у храма Улувату или Танах Лот.', 'Տեղափոխում ծովափ։ Մայրամուտ Ուլուվատու կամ Թանահ Լոտ տաճարի մոտ։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Transfer to Denpasar airport.', 'Трансфер в аэропорт Денпасара.', 'Տրանսֆեր Դենպասարի օդանավակայան։')],
    ],
  },
  {
    slug: 'cairo-hurghada',
    category: 'beach',
    duration: 8,
    unit: 'nights',
    featured: false,
    cover: '/images/egypt-camels.jpg',
    gallery: ['/images/egypt-camels.jpg', '/images/egypt-pyramid.jpg', '/images/hurghada-reef.jpg', '/images/hurghada-resort.jpg'],
    included: ['flight', 'hotel', 'resort', 'allInc', 'transfers', 'excursions'],
    title: d('Cairo & Hurghada combo', 'Каир и Хургада', 'Կահիրե և Հուրղադա'),
    summary: d('Pyramids first, then the Red Sea.', 'Сначала пирамиды, потом Красное море.', 'Նախ բուրգերը, հետո Կարմիր ծովը։'),
    description: d(
      'Two days with the pyramids and the Sphinx, then a week of Red Sea reefs at an all-inclusive resort.',
      'Два дня с пирамидами и Сфинксом, затем неделя на рифах Красного моря в отеле «всё включено».',
      'Երկու օր բուրգերի և Սֆինքսի հետ, հետո մեկ շաբաթ Կարմիր ծովի խութերի մոտ՝ «ամեն ինչ ներառված» հանգստավայրում։'
    ),
    days: [
      [d('Cairo', 'Каир', 'Կահիրե'), d('Flight to Cairo, transfer to a hotel near Giza.', 'Перелёт в Каир, отель рядом с Гизой.', 'Թռիչք Կահիրե, հյուրանոց Գիզայի մոտ։')],
      [d('Giza plateau', 'Плато Гиза', 'Գիզայի սարահարթ'), d('The pyramids and the Sphinx with a guide, camel ride at sunset, Egyptian Museum.', 'Пирамиды и Сфинкс с гидом, прогулка на верблюдах на закате, Египетский музей.', 'Բուրգերը և Սֆինքսը գիդի հետ, ուղտերով զբոսանք մայրամուտին, Եգիպտական թանգարան։')],
      [d('To the Red Sea', 'К Красному морю', 'Դեպի Կարմիր ծով'), d('Transfer to Hurghada and six nights all-inclusive.', 'Переезд в Хургаду и шесть ночей «всё включено».', 'Տեղափոխում Հուրղադա և վեց գիշեր «ամեն ինչ ներառված»։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Flight from Hurghada to Yerevan.', 'Перелёт из Хургады в Ереван.', 'Թռիչք Հուրղադայից Երևան։')],
    ],
  },
  // ---------------- Europe ----------------
  {
    slug: 'prague',
    category: 'europe',
    duration: 5,
    unit: 'nights',
    featured: true,
    cover: '/images/prague-2.jpg',
    gallery: ['/images/prague-1.jpg', '/images/prague-2.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'schengen', 'insurance'],
    title: d('Prague', 'Прага', 'Պրահա'),
    summary: d('Old town, castle, river.', 'Старый город, замок, река.', 'Հին քաղաք, դղյակ, գետ։'),
    description: d(
      'Castle views, old-town squares and Czech cafés — with your Schengen visa prepared by us. A hotel within walking distance of Charles Bridge.',
      'Виды на замок, площади Старого города и чешские кафе — шенгенскую визу готовим мы. Отель в пешей доступности от Карлова моста.',
      'Տեսարաններ դեպի դղյակ, Հին քաղաքի հրապարակներ և չեխական սրճարաններ. Շենգենյան վիզան պատրաստում ենք մենք։ Հյուրանոց՝ Կառլի կամրջից քայլելու հեռավորության վրա։'
    ),
    days: [
      [d('Arrival', 'Прилёт', 'Ժամանում'), d('Flight to Prague, transfer, evening walk to Old Town Square.', 'Перелёт в Прагу, трансфер, вечерняя прогулка к Староместской площади.', 'Թռիչք Պրահա, երեկոյան զբոսանք Հին քաղաքի հրապարակ։')],
      [d('Castle and Charles Bridge', 'Град и Карлов мост', 'Դղյակ և Կառլի կամուրջ'), d('Prague Castle, St Vitus Cathedral, Lesser Town and the bridge at dusk.', 'Пражский Град, собор Святого Вита, Мала Страна и мост на закате.', 'Պրահայի դղյակ, Սուրբ Վիտի տաճար, Մալա Ստրանա և կամուրջը մայրամուտին։')],
      [d('Vltava and day trip', 'Влтава и выезд', 'Վլտավա և ուղևորություն'), d('River cruise, or a day trip to Český Krumlov or Karlovy Vary.', 'Прогулка по реке или поездка в Чески-Крумлов или Карловы Вары.', 'Զբոսանք գետով կամ ուղևորություն Չեսկի Կրումլով կամ Կառլովի Վարի։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Transfer to Václav Havel Airport.', 'Трансфер в аэропорт Вацлава Гавела.', 'Տրանսֆեր Վացլավ Հավելի օդանավակայան։')],
    ],
  },
  {
    slug: 'germany',
    category: 'europe',
    duration: 6,
    unit: 'nights',
    featured: true,
    cover: '/images/germany.jpg',
    gallery: ['/images/germany.jpg', '/images/plane-window.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'schengen', 'excursions'],
    title: d('Germany', 'Германия', 'Գերմանիա'),
    summary: d('Bavaria and Neuschwanstein.', 'Бавария и Нойшванштайн.', 'Բավարիա և Նոյշվանշտայն։'),
    description: d(
      'Munich as a base, the fairy-tale castle of Neuschwanstein, Alpine lakes and beer gardens. Schengen visa file prepared by our team.',
      'Мюнхен как база, сказочный замок Нойшванштайн, альпийские озёра и пивные сады. Документы на шенгенскую визу готовит наша команда.',
      'Մյունխենը՝ որպես կենտրոն, Նոյշվանշտայնի հեքիաթային դղյակը, ալպյան լճեր և գարեջրի այգիներ։ Շենգենյան վիզայի փաթեթը պատրաստում է մեր թիմը։'
    ),
    days: [
      [d('Munich', 'Мюнхен', 'Մյունխեն'), d('Flight to Munich, Marienplatz and the old town.', 'Перелёт в Мюнхен, Мариенплац и старый город.', 'Թռիչք Մյունխեն, Մարիենպլաց և հին քաղաք։')],
      [d('Neuschwanstein', 'Нойшванштайн', 'Նոյշվանշտայն'), d('Day trip to Neuschwanstein and Hohenschwangau castles.', 'Поездка в замки Нойшванштайн и Хоэншвангау.', 'Ուղևորություն Նոյշվանշտայն և Հոհենշվանգաու դղյակներ։')],
      [d('Lakes and Alps', 'Озёра и Альпы', 'Լճեր և Ալպեր'), d('Königssee or Garmisch-Partenkirchen.', 'Кёнигсзе или Гармиш-Партенкирхен.', 'Քյոնիգսզե կամ Գարմիշ-Պարտենկիրխեն։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Transfer to Munich airport.', 'Трансфер в аэропорт Мюнхена.', 'Տրանսֆեր Մյունխենի օդանավակայան։')],
    ],
  },
  {
    slug: 'rome',
    category: 'europe',
    duration: 5,
    unit: 'nights',
    featured: true,
    cover: '/images/rome.jpg',
    gallery: ['/images/rome.jpg', '/images/couple.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'schengen', 'excursions'],
    title: d('Rome', 'Рим', 'Հռոմ'),
    summary: d('Colosseum, Vatican, Trevi.', 'Колизей, Ватикан, Треви.', 'Կոլիզեում, Վատիկան, Տրևի։'),
    description: d(
      'Five nights in the centre: skip-the-line Colosseum and Vatican, evenings in Trastevere and a coin in the Trevi Fountain.',
      'Пять ночей в центре: Колизей и Ватикан без очереди, вечера в Трастевере и монетка в фонтан Треви.',
      'Հինգ գիշեր կենտրոնում. Կոլիզեում և Վատիկան՝ առանց հերթի, երեկոներ Տրաստևերեում և մետաղադրամ Տրևիի շատրվանում։'
    ),
    days: [
      [d('Arrival', 'Прилёт', 'Ժամանում'), d('Flight to Rome, evening at Piazza Navona and the Pantheon.', 'Перелёт в Рим, вечер на площади Навона и у Пантеона.', 'Թռիչք Հռոմ, երեկո Նավոնա հրապարակում և Պանթեոնի մոտ։')],
      [d('Ancient Rome', 'Античный Рим', 'Հին Հռոմ'), d('Colosseum, Roman Forum and Palatine Hill with a guide.', 'Колизей, Римский форум и Палатин с гидом.', 'Կոլիզեում, Հռոմեական ֆորում և Պալատին՝ գիդի հետ։')],
      [d('Vatican', 'Ватикан', 'Վատիկան'), d('St Peter’s Basilica, Vatican Museums and the Sistine Chapel.', 'Собор Святого Петра, музеи Ватикана и Сикстинская капелла.', 'Սուրբ Պետրոսի տաճար, Վատիկանի թանգարաններ և Սիքստինյան կապելլա։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Transfer to Fiumicino.', 'Трансфер в Фьюмичино.', 'Տրանսֆեր Ֆիումիչինո։')],
    ],
  },
  {
    slug: 'swiss-alps',
    category: 'europe',
    duration: 6,
    unit: 'nights',
    featured: true,
    cover: '/images/alps.jpg',
    gallery: ['/images/alps.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'schengen'],
    title: d('Swiss Alps', 'Швейцарские Альпы', 'Շվեյցարական Ալպեր'),
    summary: d('Lakes, trains, mountain villages.', 'Озёра, поезда, горные деревни.', 'Լճեր, գնացքներ, լեռնային գյուղեր։'),
    description: d(
      'Zurich, Lucerne and the Jungfrau region by panoramic train — lakes, glaciers and chalets without driving a single kilometre.',
      'Цюрих, Люцерн и регион Юнгфрау на панорамных поездах — озёра, ледники и шале без единого километра за рулём.',
      'Ցյուրիխ, Լյուցեռն և Յունգֆրաուի շրջան՝ համայնապատկերային գնացքներով. լճեր, սառցադաշտեր և շալեներ՝ առանց մեքենա վարելու։'
    ),
    days: [
      [d('Zurich to Lucerne', 'Цюрих — Люцерн', 'Ցյուրիխ — Լյուցեռն'), d('Flight to Zurich, train to Lucerne, Chapel Bridge.', 'Перелёт в Цюрих, поезд в Люцерн, Капелльбрюкке.', 'Թռիչք Ցյուրիխ, գնացք Լյուցեռն, Մատուռի կամուրջ։')],
      [d('Mount Pilatus or Rigi', 'Пилатус или Риги', 'Պիլատուս կամ Ռիգի'), d('Cogwheel train and lake boat.', 'Зубчатая железная дорога и кораблик по озеру.', 'Ատամնավոր երկաթուղի և զբոսանավ լճով։')],
      [d('Interlaken and Grindelwald', 'Интерлакен и Гриндельвальд', 'Ինտերլակեն և Գրինդելվալդ'), d('Mountain villages and the Jungfrau region.', 'Горные деревни и регион Юнгфрау.', 'Լեռնային գյուղեր և Յունգֆրաուի շրջան։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Train to Zurich airport.', 'Поезд в аэропорт Цюриха.', 'Գնացք Ցյուրիխի օդանավակայան։')],
    ],
  },
  // ---------------- Cities ----------------
  {
    slug: 'dubai',
    category: 'cities',
    duration: 5,
    unit: 'nights',
    featured: true,
    cover: '/images/dubai-2.jpg',
    gallery: ['/images/dubai-1.jpg', '/images/dubai-2.jpg', '/images/pool.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'safari'],
    title: d('Dubai', 'Дубай', 'Դուբայ'),
    summary: d('Skyline, malls, desert safari.', 'Небоскрёбы, моллы, сафари в пустыне.', 'Երկնաքերեր, մոլեր, սաֆարի անապատում։'),
    description: d(
      'About three hours from Yerevan: Burj Khalifa at sunset, a desert safari evening and beach days on Jumeirah.',
      'Около трёх часов от Еревана: Бурдж-Халифа на закате, вечер сафари в пустыне и пляжные дни на Джумейре.',
      'Մոտ երեք ժամ Երևանից. Բուրջ Խալիֆա մայրամուտին, երեկոյան սաֆարի անապատում և լողափնյա օրեր Ջումեյրայում։'
    ),
    days: [
      [d('Arrival', 'Прилёт', 'Ժամանում'), d('Flight to Dubai, transfer, evening at Dubai Marina.', 'Перелёт в Дубай, трансфер, вечер в Дубай Марине.', 'Թռիչք Դուբայ, տրանսֆեր, երեկո Դուբայ Մարինայում։')],
      [d('Downtown', 'Даунтаун', 'Դաունթաուն'), d('Burj Khalifa observation deck, Dubai Mall and the fountain show.', 'Смотровая площадка Бурдж-Халифы, Дубай Молл и шоу фонтанов.', 'Բուրջ Խալիֆայի դիտահարթակ, Դուբայ Մոլ և շատրվանների շոու։')],
      [d('Desert safari', 'Сафари', 'Սաֆարի'), d('Dune drive, sunset in the desert and dinner at a camp.', 'Поездка по дюнам, закат в пустыне и ужин в лагере.', 'Ուղևորություն ավազաթմբերով, մայրամուտ անապատում և ընթրիք ճամբարում։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Beach morning and flight to Yerevan.', 'Утро на пляже и перелёт в Ереван.', 'Առավոտ լողափում և թռիչք Երևան։')],
    ],
  },
  {
    slug: 'istanbul',
    category: 'cities',
    duration: 4,
    unit: 'nights',
    featured: true,
    cover: '/images/istanbul.jpg',
    gallery: ['/images/istanbul.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'cruise'],
    title: d('Istanbul', 'Стамбул', 'Ստամբուլ'),
    summary: d('Bosphorus and the old city.', 'Босфор и старый город.', 'Բոսֆոր և հին քաղաք։'),
    description: d(
      'Four nights between two continents: Hagia Sophia, the Grand Bazaar, a Bosphorus cruise and fish sandwiches at Galata.',
      'Четыре ночи между двумя континентами: Святая София, Гранд-базар, прогулка по Босфору и рыбные сэндвичи у Галаты.',
      'Չորս գիշեր երկու մայրցամաքների միջև. Այա Սոֆիա, Մեծ շուկա, զբոսանք Բոսֆորով և ձկան սենդվիչներ Գալաթայի մոտ։'
    ),
    days: [
      [d('Arrival', 'Прилёт', 'Ժամանում'), d('Flight to Istanbul, hotel in the old city.', 'Перелёт в Стамбул, отель в старом городе.', 'Թռիչք Ստամբուլ, հյուրանոց հին քաղաքում։')],
      [d('Sultanahmet', 'Султанахмет', 'Սուլթանահմեթ'), d('Hagia Sophia, the Blue Mosque, Topkapı Palace.', 'Святая София, Голубая мечеть, дворец Топкапы.', 'Այա Սոֆիա, Կապույտ մզկիթ, Թոփքափը պալատ։')],
      [d('Bosphorus', 'Босфор', 'Բոսֆոր'), d('Cruise between Europe and Asia, Galata Tower, Istiklal Street.', 'Прогулка между Европой и Азией, Галатская башня, улица Истикляль.', 'Զբոսանք Եվրոպայի և Ասիայի միջև, Գալաթայի աշտարակ, Իստիքլալ փողոց։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Grand Bazaar in the morning, flight to Yerevan.', 'Утром Гранд-базар, перелёт в Ереван.', 'Առավոտյան Մեծ շուկա, թռիչք Երևան։')],
    ],
  },
  {
    slug: 'paris',
    category: 'cities',
    duration: 5,
    unit: 'nights',
    featured: true,
    cover: '/images/paris.jpg',
    gallery: ['/images/paris.jpg', '/images/couple.jpg'],
    included: ['flight', 'hotel', 'breakfast', 'transfers', 'schengen', 'cruise'],
    title: d('Paris', 'Париж', 'Փարիզ'),
    summary: d('For two, with a Seine cruise.', 'Для двоих, с прогулкой по Сене.', 'Երկուսի համար՝ զբոսանք Սենով։'),
    description: d(
      'A trip for two: a hotel in a walkable arrondissement, the Louvre, Montmartre at night and an evening cruise on the Seine.',
      'Поездка для двоих: отель в удобном районе, Лувр, ночной Монмартр и вечерняя прогулка по Сене.',
      'Ուղևորություն երկուսի համար. հյուրանոց հարմար թաղամասում, Լուվր, գիշերային Մոնմարտր և երեկոյան զբոսանք Սենով։'
    ),
    days: [
      [d('Arrival', 'Прилёт', 'Ժամանում'), d('Flight to Paris, evening at the Eiffel Tower.', 'Перелёт в Париж, вечер у Эйфелевой башни.', 'Թռիչք Փարիզ, երեկո Էյֆելյան աշտարակի մոտ։')],
      [d('Louvre and the Seine', 'Лувр и Сена', 'Լուվր և Սեն'), d('The Louvre, Tuileries garden and the evening cruise.', 'Лувр, сад Тюильри и вечерняя прогулка по реке.', 'Լուվր, Թյուիլրի այգի և երեկոյան զբոսանք գետով։')],
      [d('Montmartre', 'Монмартр', 'Մոնմարտր'), d('Sacré-Cœur, artists’ square, dinner in Le Marais.', 'Сакре-Кёр, площадь художников, ужин в Маре.', 'Սակրե-Քյոռ, նկարիչների հրապարակ, ընթրիք Մարեում։')],
      [d('Fly home', 'Возвращение', 'Վերադարձ'), d('Transfer to Charles de Gaulle.', 'Трансфер в аэропорт Шарль-де-Голль.', 'Տրանսֆեր Շառլ դը Գոլ օդանավակայան։')],
    ],
  },
  {
    slug: 'tbilisi',
    category: 'cities',
    duration: 3,
    unit: 'nights',
    featured: true,
    cover: '/images/tbilisi.jpg',
    gallery: ['/images/tbilisi.jpg'],
    included: ['transport', 'hotel', 'breakfast', 'excursions'],
    title: d('Tbilisi', 'Тбилиси', 'Թբիլիսի'),
    summary: d('A weekend next door.', 'Выходные по соседству.', 'Հանգստյան օրեր հարևանությամբ։'),
    description: d(
      'Three nights next door — no visa needed for Armenian citizens. Old Tbilisi, sulphur baths, Narikala fortress and a day in Mtskheta.',
      'Три ночи по соседству — гражданам Армении виза не нужна. Старый Тбилиси, серные бани, крепость Нарикала и день в Мцхете.',
      'Երեք գիշեր հարևանությամբ. ՀՀ քաղաքացիներին վիզա պետք չէ։ Հին Թբիլիսի, ծծմբային բաղնիքներ, Նարիկալա ամրոց և մեկ օր Մցխեթայում։'
    ),
    days: [
      [d('Road to Tbilisi', 'Дорога в Тбилиси', 'Ճանապարհ դեպի Թբիլիսի'), d('Transfer from Yerevan by car or minibus, evening in the old town.', 'Трансфер из Еревана на машине или микроавтобусе, вечер в старом городе.', 'Տրանսֆեր Երևանից մեքենայով կամ միկրոավտոբուսով, երեկո հին քաղաքում։')],
      [d('Old Tbilisi', 'Старый Тбилиси', 'Հին Թբիլիսի'), d('Narikala by cable car, Abanotubani baths, Rustaveli Avenue.', 'Нарикала на канатке, бани Абанотубани, проспект Руставели.', 'Նարիկալա՝ ճոպանուղով, Աբանոթուբանի բաղնիքներ, Ռուսթավելի պողոտա։')],
      [d('Mtskheta', 'Мцхета', 'Մցխեթա'), d('Jvari monastery and Svetitskhoveli cathedral.', 'Монастырь Джвари и собор Светицховели.', 'Ջվարի վանք և Սվետիցխովելի տաճար։')],
      [d('Back to Yerevan', 'Возвращение', 'Վերադարձ'), d('Transfer home.', 'Трансфер домой.', 'Տրանսֆեր տուն։')],
    ],
  },
  // ---------------- Armenia ----------------
  {
    slug: 'khor-virap',
    category: 'armenia',
    duration: 1,
    unit: 'days',
    featured: true,
    cover: '/images/khor-virap.jpg',
    gallery: ['/images/khor-virap.jpg', '/images/yerevan-ararat.jpg'],
    included: ['transport', 'guide'],
    title: d('Khor Virap', 'Хор Вирап', 'Խոր Վիրապ'),
    summary: d('Ararat at its closest.', 'Арарат ближе всего.', 'Արարատը՝ ամենամոտիկից։'),
    description: d(
      'The monastery where Gregory the Illuminator was held, standing right below Mount Ararat. Combine it with Noravank and the Areni wine village.',
      'Монастырь, где держали в заточении Григория Просветителя, у самого подножия Арарата. Можно совместить с Нораванком и винной деревней Арени.',
      'Վանքը, որտեղ բանտարկված էր Գրիգոր Լուսավորիչը, Արարատի հենց ստորոտին։ Կարելի է համատեղել Նորավանքի և Արենիի գինու գյուղի հետ։'
    ),
    days: [
      [d('Khor Virap', 'Хор Вирап', 'Խոր Վիրապ'), d('Morning departure from Yerevan, the monastery and the view of Ararat.', 'Утренний выезд из Еревана, монастырь и вид на Арарат.', 'Առավոտյան մեկնում Երևանից, վանքը և տեսարանը դեպի Արարատ։')],
      [d('Areni and Noravank', 'Арени и Нораванк', 'Արենի և Նորավանք'), d('Optional: wine tasting in Areni and the red-cliff monastery of Noravank.', 'По желанию: дегустация вина в Арени и Нораванк среди красных скал.', 'Ըստ ցանկության՝ գինու համտես Արենիում և Նորավանք կարմիր ժայռերի միջև։')],
    ],
  },
  {
    slug: 'tatev',
    category: 'armenia',
    duration: 1,
    unit: 'days',
    featured: true,
    cover: '/images/tatev.jpg',
    gallery: ['/images/tatev.jpg'],
    included: ['transport', 'guide', 'ropeway', 'lunch'],
    title: d('Tatev', 'Татев', 'Տաթև'),
    summary: d('Monastery above the gorge.', 'Монастырь над ущельем.', 'Վանք կիրճի վերևում։'),
    description: d(
      'A long but rewarding day: the Wings of Tatev ropeway over the Vorotan gorge to the 9th-century monastery on the cliff edge.',
      'Долгий, но стоящий день: канатная дорога «Крылья Татева» над ущельем Воротан к монастырю IX века на краю обрыва.',
      'Երկար, բայց արժանի օր. «Տաթևի թևեր» ճոպանուղին Որոտանի կիրճի վրայով դեպի IX դարի վանքը ժայռի եզրին։'
    ),
    days: [
      [d('Drive south', 'Дорога на юг', 'Ճանապարհ դեպի հարավ'), d('Early departure through the Ararat valley and Vayots Dzor.', 'Ранний выезд через Араратскую долину и Вайоц Дзор.', 'Վաղ մեկնում Արարատյան դաշտով և Վայոց ձորով։')],
      [d('Wings of Tatev', 'Крылья Татева', 'Տաթևի թևեր'), d('Ropeway over the gorge, Tatev monastery, lunch and return to Yerevan.', 'Канатная дорога над ущельем, монастырь Татев, обед и возвращение в Ереван.', 'Ճոպանուղի կիրճի վրայով, Տաթևի վանք, ճաշ և վերադարձ Երևան։')],
    ],
  },
  {
    slug: 'etchmiadzin',
    category: 'armenia',
    duration: 1,
    unit: 'days',
    featured: true,
    cover: '/images/etchmiadzin.jpg',
    gallery: ['/images/etchmiadzin.jpg', '/images/yerevan-ararat.jpg'],
    included: ['transport', 'guide'],
    title: d('Etchmiadzin', 'Эчмиадзин', 'Էջմիածին'),
    summary: d('The mother cathedral.', 'Кафедральный собор.', 'Մայր տաճարը։'),
    description: d(
      'Half a day from Yerevan: the Mother Cathedral of Etchmiadzin, the churches of St Hripsime and St Gayane and the ruins of Zvartnots — all UNESCO-listed.',
      'Полдня от Еревана: Кафедральный собор Эчмиадзина, церкви Святой Рипсиме и Святой Гаяне и руины Звартноца — всё в списке ЮНЕСКО.',
      'Կես օր Երևանից. Էջմիածնի Մայր տաճարը, Սուրբ Հռիփսիմե և Սուրբ Գայանե եկեղեցիները և Զվարթնոցի ավերակները՝ բոլորը ՅՈՒՆԵՍԿՕ-ի ցանկում։'
    ),
    days: [
      [d('Zvartnots', 'Звартноц', 'Զվարթնոց'), d('The 7th-century cathedral ruins on the way out of Yerevan.', 'Руины собора VII века на выезде из Еревана.', 'VII դարի տաճարի ավերակները Երևանից դուրս գալիս։')],
      [d('Etchmiadzin', 'Эчмиадзин', 'Էջմիածին'), d('The Mother Cathedral, St Hripsime and St Gayane.', 'Кафедральный собор, Святая Рипсиме и Святая Гаяне.', 'Մայր տաճար, Սուրբ Հռիփսիմե և Սուրբ Գայանե։')],
    ],
  },
  {
    slug: 'northern-armenia',
    category: 'armenia',
    duration: 2,
    unit: 'days',
    featured: true,
    cover: '/images/armenia-green.jpg',
    gallery: ['/images/armenia-green.jpg'],
    included: ['transport', 'guide', 'stay', 'breakfast'],
    title: d('Northern Armenia', 'Северная Армения', 'Հյուսիսային Հայաստան'),
    summary: d('Green gorges and villages.', 'Зелёные ущелья и деревни.', 'Կանաչ կիրճեր և գյուղեր։'),
    description: d(
      'Two days through Lake Sevan, the forests of Dilijan and the Debed canyon with the monasteries of Haghpat and Sanahin.',
      'Два дня: озеро Севан, леса Дилижана и ущелье Дебед с монастырями Ахпат и Санаин.',
      'Երկու օր՝ Սևանա լիճ, Դիլիջանի անտառներ և Դեբեդի կիրճը՝ Հաղպատի և Սանահինի վանքերով։'
    ),
    days: [
      [d('Sevan and Dilijan', 'Севан и Дилижан', 'Սևան և Դիլիջան'), d('Sevanavank on the peninsula, Haghartsin monastery in the forest, night in a guesthouse.', 'Севанаванк на полуострове, монастырь Агарцин в лесу, ночь в гостевом доме.', 'Սևանավանք թերակղզում, Հաղարծին վանք անտառում, գիշեր հյուրատանը։')],
      [d('Debed canyon', 'Ущелье Дебед', 'Դեբեդի կիրճ'), d('Haghpat and Sanahin monasteries, return to Yerevan.', 'Монастыри Ахпат и Санаин, возвращение в Ереван.', 'Հաղպատ և Սանահին վանքեր, վերադարձ Երևան։')],
    ],
  },
];

export const SLIDES: {
  image: string;
  tour: string;
  kicker: L;
  title: L;
  accent: L;
  name: L;
  when: L;
  text: L;
}[] = [
  {
    image: '/images/egypt-camels.jpg',
    tour: 'cairo-hurghada',
    kicker: d('Egypt · Giza & Hurghada', 'Египет · Гиза и Хургада', 'Եգիպտոս · Գիզա և Հուրղադա'),
    title: d('Sunset at the', 'Закат у', 'Մայրամուտ'),
    accent: d('Pyramids', 'пирамид', 'բուրգերի մոտ'),
    name: d('Cairo & Hurghada combo', 'Каир и Хургада', 'Կահիրե և Հուրղադա'),
    when: d('8 nights · flights from Yerevan', '8 ночей · вылет из Еревана', '8 գիշեր · թռիչք Երևանից'),
    text: d(
      'Two days with the pyramids and the Sphinx, then a week of Red Sea reefs at an all-inclusive resort.',
      'Два дня с пирамидами и Сфинксом, затем неделя на рифах Красного моря в отеле «всё включено».',
      'Երկու օր բուրգերի և Սֆինքսի հետ, հետո մեկ շաբաթ Կարմիր ծովի խութերի մոտ՝ «ամեն ինչ ներառված» հանգստավայրում։'
    ),
  },
  {
    image: '/images/maldives-2.jpg',
    tour: 'maldives',
    kicker: d('Maldives', 'Мальдивы', 'Մալդիվներ'),
    title: d('Wake up', 'Просыпайтесь', 'Արթնացեք'),
    accent: d('above the lagoon', 'над лагуной', 'լագունի վերևում'),
    name: d('Maldives overwater villa', 'Вилла над водой, Мальдивы', 'Վիլլա ջրի վրա, Մալդիվներ'),
    when: d('7 nights · seaplane transfer', '7 ночей · гидросамолёт', '7 գիշեր · հիդրոինքնաթիռ'),
    text: d(
      'A villa on stilts over turquoise water, half board and a seaplane from Malé to your island.',
      'Вилла на сваях над бирюзовой водой, полупансион и гидросамолёт из Мале на ваш остров.',
      'Վիլլա փիրուզագույն ջրի վրա, կիսապանսիոն և հիդրոինքնաթիռ Մալեից դեպի ձեր կղզի։'
    ),
  },
  {
    image: '/images/dubai-1.jpg',
    tour: 'dubai',
    kicker: d('United Arab Emirates', 'Объединённые Арабские Эмираты', 'Արաբական Միացյալ Էմիրություններ'),
    title: d('Golden hour', 'Золотой час', 'Ոսկե ժամ'),
    accent: d('in Dubai', 'в Дубае', 'Դուբայում'),
    name: d('Dubai city & desert', 'Дубай: город и пустыня', 'Դուբայ. քաղաք և անապատ'),
    when: d('5 nights · 3h flight', '5 ночей · 3 часа полёта', '5 գիշեր · 3 ժամ թռիչք'),
    text: d(
      'Burj Khalifa at sunset, a desert safari evening and beach days on Jumeirah.',
      'Бурдж-Халифа на закате, вечер сафари в пустыне и пляжные дни на Джумейре.',
      'Բուրջ Խալիֆա մայրամուտին, երեկոյան սաֆարի անապատում և լողափնյա օրեր Ջումեյրայում։'
    ),
  },
  {
    image: '/images/prague-1.jpg',
    tour: 'prague',
    kicker: d('Czech Republic', 'Чехия', 'Չեխիա'),
    title: d('Evenings on', 'Вечера на', 'Երեկոներ'),
    accent: d('Charles Bridge', 'Карловом мосту', 'Կառլի կամրջին'),
    name: d('Prague old town', 'Старая Прага', 'Հին Պրահա'),
    when: d('5 nights · Schengen visa help', '5 ночей · помощь с шенгенской визой', '5 գիշեր · Շենգենյան վիզայի աջակցություն'),
    text: d(
      'Castle views, old-town squares and Czech cafés — with your visa prepared by us.',
      'Виды на замок, площади Старого города и чешские кафе — визу готовим мы.',
      'Տեսարաններ դեպի դղյակ, Հին քաղաքի հրապարակներ և չեխական սրճարաններ. վիզան պատրաստում ենք մենք։'
    ),
  },
  {
    image: '/images/santorini.jpg',
    tour: 'santorini',
    kicker: d('Greece', 'Греция', 'Հունաստան'),
    title: d('White walls,', 'Белые стены,', 'Սպիտակ պատեր,'),
    accent: d('blue Aegean', 'синее Эгейское', 'կապույտ Էգեյան'),
    name: d('Santorini, Oia', 'Санторини, Ия', 'Սանտորինի, Իա'),
    when: d('6 nights · summer 2027', '6 ночей · лето 2027', '6 գիշեր · ամառ 2027'),
    text: d(
      'Cliffside hotel with a caldera view and the famous Oia sunset a short walk away.',
      'Отель на скале с видом на кальдеру и знаменитый закат в Ии в нескольких минутах.',
      'Հյուրանոց ժայռի վրա՝ տեսարանով դեպի կալդերա, և Իայի հայտնի մայրամուտը՝ մի քանի րոպե հեռու։'
    ),
  },
];
