export type LocalizedString = {
  uz: string;
  ru: string;
  en: string;
};

export type Destination = {
  slug: string;
  name: LocalizedString;
  countryCode: string;
  fromPriceUsd: number;
  /** Amount currency for fromPriceUsd (legacy name kept). */
  fromCurrency?: "UZS" | "USD";
  blurb: LocalizedString;
  resorts: string[];
};

export type Resort = {
  slug: string;
  name: LocalizedString;
  destinationSlug: string;
  blurb: LocalizedString;
};

export type TourOffer = {
  id: string;
  destinationSlug: string;
  resortSlug?: string;
  hotel: string;
  rating?: number;
  nights: number;
  board: LocalizedString;
  room: LocalizedString;
  dateFrom: string;
  dateTo: string;
  /** Price amount; interpret with `currency`. */
  pricePerPersonUsd: number;
  priceTwoUsd: number;
  currency?: "UZS" | "USD";
  badges?: Array<"on_request" | "seats" | "save">;
  featured?: boolean;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "dubai",
    name: { uz: "Dubay", ru: "Дубай", en: "Dubai" },
    countryCode: "AE",
    fromPriceUsd: 496,
    blurb: {
      uz: "Toʻgʻridan-toʻgʻri parvoz ~3,5 soat. Mehmonxonalar Dubay, Sharja va Ajmanda.",
      ru: "Прямой перелёт ~3,5 часа. Отели в Дубае, Шардже и Аджмане.",
      en: "Direct flight ~3.5 hours. Hotels in Dubai, Sharjah and Ajman.",
    },
    resorts: ["dubai", "sharjah"],
  },
  {
    slug: "turkey",
    name: { uz: "Turkiya", ru: "Турция", en: "Turkey" },
    countryCode: "TR",
    fromPriceUsd: 531,
    blurb: {
      uz: "Istanbul va Antalya — dengiz, tarix va all inclusive.",
      ru: "Стамбул и Анталья — море, история и all inclusive.",
      en: "Istanbul and Antalya — sea, history and all inclusive.",
    },
    resorts: ["istanbul"],
  },
  {
    slug: "egypt",
    name: { uz: "Misr", ru: "Египет", en: "Egypt" },
    countryCode: "EG",
    fromPriceUsd: 512,
    blurb: {
      uz: "Sharm ash-Shayx — Qizil dengiz va all inclusive kurortlar.",
      ru: "Шарм-эль-Шейх — Красное море и all inclusive.",
      en: "Sharm El Sheikh — Red Sea and all-inclusive resorts.",
    },
    resorts: ["sharm-el-sheikh"],
  },
  {
    slug: "georgia",
    name: { uz: "Gruziya", ru: "Грузия", en: "Georgia" },
    countryCode: "GE",
    fromPriceUsd: 568,
    blurb: {
      uz: "Tbilisi — qisqa parvoz, vinolar va shahar sayohatlari.",
      ru: "Тбилиси — короткий перелёт, вино и городские прогулки.",
      en: "Tbilisi — short flight, wine and city walks.",
    },
    resorts: ["tbilisi"],
  },
  {
    slug: "azerbaijan",
    name: { uz: "Ozarbayjon", ru: "Азербайджан", en: "Azerbaijan" },
    countryCode: "AZ",
    fromPriceUsd: 481,
    blurb: {
      uz: "Boku va Gabala — yaqin yoʻnalish, qulay narx.",
      ru: "Баку и Габала — близко и доступно.",
      en: "Baku and Gabala — close and affordable.",
    },
    resorts: ["baku"],
  },
  {
    slug: "thailand",
    name: { uz: "Tailand", ru: "Таиланд", en: "Thailand" },
    countryCode: "TH",
    fromPriceUsd: 627,
    blurb: {
      uz: "Pattaya va Phuket — tropik dengiz va ekspressiya.",
      ru: "Паттайя и Пхукет — тропики и море.",
      en: "Pattaya and Phuket — tropics and sea.",
    },
    resorts: ["pattaya"],
  },
  {
    slug: "sri-lanka",
    name: { uz: "Shri-Lanka", ru: "Шри-Ланка", en: "Sri Lanka" },
    countryCode: "LK",
    fromPriceUsd: 690,
    blurb: {
      uz: "Unavatuna va Kolombo — choy plantatsiyalari va plyaj.",
      ru: "Унаватуна и Коломбо — чай и пляж.",
      en: "Unawatuna and Colombo — tea and beach.",
    },
    resorts: ["unawatuna"],
  },
  {
    slug: "malaysia",
    name: { uz: "Malayziya", ru: "Малайзия", en: "Malaysia" },
    countryCode: "MY",
    fromPriceUsd: 640,
    blurb: {
      uz: "Kuala-Lumpur — zamonaviy megapolis va orollar.",
      ru: "Куала-Лумпур — мегаполис и острова.",
      en: "Kuala Lumpur — megacity and islands.",
    },
    resorts: ["kuala-lumpur"],
  },
  {
    slug: "vietnam",
    name: { uz: "Vetnam", ru: "Вьетнам", en: "Vietnam" },
    countryCode: "VN",
    fromPriceUsd: 605,
    blurb: {
      uz: "Nha Trang — dengiz, ovqat va oilaviy dam olish.",
      ru: "Нячанг — море, кухня и семейный отдых.",
      en: "Nha Trang — sea, food and family holidays.",
    },
    resorts: ["nha-trang"],
  },
  {
    slug: "china",
    name: { uz: "Xitoy", ru: "Китай", en: "China" },
    countryCode: "CN",
    fromPriceUsd: 602,
    blurb: {
      uz: "Sanya va Hainan — plyaj va qulay mehmonxonalar.",
      ru: "Санья и Хайнань — пляж и комфорт.",
      en: "Sanya and Hainan — beach and comfort.",
    },
    resorts: ["sanya"],
  },
  {
    slug: "maldives",
    name: { uz: "Maldiv", ru: "Мальдивы", en: "Maldives" },
    countryCode: "MV",
    fromPriceUsd: 980,
    blurb: {
      uz: "Orzu qilingan atollar — premium dam olish.",
      ru: "Атоллы мечты — премиальный отдых.",
      en: "Dream atolls — premium getaway.",
    },
    resorts: ["male"],
  },
];

export const RESORTS: Resort[] = [
  {
    slug: "dubai",
    name: { uz: "Dubay", ru: "Дубай", en: "Dubai" },
    destinationSlug: "dubai",
    blurb: {
      uz: "Deira, Marina, Jumeirah — har qanday byudjet.",
      ru: "Дейра, Марина, Джумейра — любой бюджет.",
      en: "Deira, Marina, Jumeirah — any budget.",
    },
  },
  {
    slug: "sharjah",
    name: { uz: "Sharja", ru: "Шарджа", en: "Sharjah" },
    destinationSlug: "dubai",
    blurb: {
      uz: "Oilaviy dam olish uchun qulay narx.",
      ru: "Семейный отдых по приятной цене.",
      en: "Family stay at a gentle price.",
    },
  },
  {
    slug: "istanbul",
    name: { uz: "Istanbul", ru: "Стамбул", en: "Istanbul" },
    destinationSlug: "turkey",
    blurb: {
      uz: "Bosfor, Sultonahmet va zamonaviy mehmonxonalar.",
      ru: "Босфор, Султанахмет и современные отели.",
      en: "Bosphorus, Sultanahmet and modern hotels.",
    },
  },
  {
    slug: "sharm-el-sheikh",
    name: { uz: "Sharm ash-Shayx", ru: "Шарм-эль-Шейх", en: "Sharm El Sheikh" },
    destinationSlug: "egypt",
    blurb: {
      uz: "Qizil dengiz, riflar va all inclusive.",
      ru: "Красное море, рифы и all inclusive.",
      en: "Red Sea, reefs and all inclusive.",
    },
  },
  {
    slug: "tbilisi",
    name: { uz: "Tbilisi", ru: "Тбилиси", en: "Tbilisi" },
    destinationSlug: "georgia",
    blurb: {
      uz: "Eski shahar, vannalar va yurishlar.",
      ru: "Старый город, бани и прогулки.",
      en: "Old Town, baths and walks.",
    },
  },
  {
    slug: "baku",
    name: { uz: "Boku", ru: "Баку", en: "Baku" },
    destinationSlug: "azerbaijan",
    blurb: {
      uz: "Flame Towers va dengiz boʻyi.",
      ru: "Flame Towers и набережная.",
      en: "Flame Towers and the waterfront.",
    },
  },
  {
    slug: "pattaya",
    name: { uz: "Pattaya", ru: "Паттайя", en: "Pattaya" },
    destinationSlug: "thailand",
    blurb: {
      uz: "Plyaj, parklar va tungi hayot.",
      ru: "Пляж, парки и ночная жизнь.",
      en: "Beach, parks and nightlife.",
    },
  },
  {
    slug: "unawatuna",
    name: { uz: "Unavatuna", ru: "Унаватуна", en: "Unawatuna" },
    destinationSlug: "sri-lanka",
    blurb: {
      uz: "Janubiy plyaj va tinch dam olish.",
      ru: "Южный пляж и спокойный отдых.",
      en: "Southern beach and quiet rest.",
    },
  },
  {
    slug: "kuala-lumpur",
    name: { uz: "Kuala-Lumpur", ru: "Куала-Лумпур", en: "Kuala Lumpur" },
    destinationSlug: "malaysia",
    blurb: {
      uz: "Petronas Towers va shopping.",
      ru: "Башни Петронас и шопинг.",
      en: "Petronas Towers and shopping.",
    },
  },
  {
    slug: "nha-trang",
    name: { uz: "Nha Trang", ru: "Нячанг", en: "Nha Trang" },
    destinationSlug: "vietnam",
    blurb: {
      uz: "Koʻrfaz, orollar va spa.",
      ru: "Залив, острова и спа.",
      en: "Bay, islands and spa.",
    },
  },
  {
    slug: "sanya",
    name: { uz: "Sanya", ru: "Санья", en: "Sanya" },
    destinationSlug: "china",
    blurb: {
      uz: "Hainan plyajlari.",
      ru: "Пляжи Хайнаня.",
      en: "Hainan beaches.",
    },
  },
  {
    slug: "male",
    name: { uz: "Male", ru: "Мале", en: "Malé" },
    destinationSlug: "maldives",
    blurb: {
      uz: "Atollar va suv uylari.",
      ru: "Атоллы и надводные виллы.",
      en: "Atolls and overwater villas.",
    },
  },
];

export const TOUR_OFFERS: TourOffer[] = [
  {
    id: "az-crossway",
    destinationSlug: "azerbaijan",
    resortSlug: "baku",
    hotel: "Cross Way Hotel",
    rating: 8.8,
    nights: 7,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Dbl Standard", ru: "Dbl Standard", en: "Dbl Standard" },
    dateFrom: "2026-09-14",
    dateTo: "2026-09-21",
    pricePerPersonUsd: 481,
    priceTwoUsd: 963,
    currency: "USD",
    badges: ["on_request"],
    featured: true,
  },
  {
    id: "uz-samarkand-local",
    destinationSlug: "georgia",
    hotel: "Local UZS package (sample)",
    nights: 3,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Standard", ru: "Standard", en: "Standard" },
    dateFrom: "2026-10-01",
    dateTo: "2026-10-04",
    pricePerPersonUsd: 3_500_000,
    priceTwoUsd: 6_800_000,
    currency: "UZS",
    badges: ["seats"],
  },
  {
    id: "ae-hiex",
    destinationSlug: "dubai",
    resortSlug: "dubai",
    hotel: "Holiday Inn Express Dubai Airport",
    rating: 9.2,
    nights: 5,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Standard", ru: "Standard", en: "Standard" },
    dateFrom: "2026-09-15",
    dateTo: "2026-09-20",
    pricePerPersonUsd: 496,
    priceTwoUsd: 992,
    currency: "USD",
    badges: ["seats"],
    featured: true,
  },
  {
    id: "eg-badawia",
    destinationSlug: "egypt",
    resortSlug: "sharm-el-sheikh",
    hotel: "NEW BADAWIA SHARM RESORT",
    rating: 7.5,
    nights: 7,
    board: { uz: "All inclusive", ru: "All inclusive", en: "All inclusive" },
    room: { uz: "Standard", ru: "Standard", en: "Standard" },
    dateFrom: "2026-09-16",
    dateTo: "2026-09-23",
    pricePerPersonUsd: 512,
    priceTwoUsd: 1025,
    currency: "USD",
    badges: ["save"],
    featured: true,
  },
  {
    id: "tr-business",
    destinationSlug: "turkey",
    resortSlug: "istanbul",
    hotel: "Business Life Hotel Gunesli",
    rating: 8.0,
    nights: 5,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Standard Double", ru: "Standard Double", en: "Standard Double" },
    dateFrom: "2026-09-14",
    dateTo: "2026-09-19",
    pricePerPersonUsd: 531,
    priceTwoUsd: 1062,
    badges: ["save"],
    featured: true,
  },
  {
    id: "ge-toma",
    destinationSlug: "georgia",
    resortSlug: "tbilisi",
    hotel: "Hotel Toma's House",
    rating: 9.4,
    nights: 5,
    board: { uz: "Faqat xona", ru: "Без питания", en: "Room only" },
    room: { uz: "Econom Double", ru: "Econom Double", en: "Econom Double" },
    dateFrom: "2026-09-14",
    dateTo: "2026-09-19",
    pricePerPersonUsd: 568,
    priceTwoUsd: 1135,
    badges: ["seats", "on_request"],
    featured: true,
  },
  {
    id: "vn-astica",
    destinationSlug: "vietnam",
    resortSlug: "nha-trang",
    hotel: "Astica Hotel Nha Trang",
    rating: 9.4,
    nights: 8,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Deluxe Twin", ru: "Deluxe Twin", en: "Deluxe Twin" },
    dateFrom: "2026-09-15",
    dateTo: "2026-09-23",
    pricePerPersonUsd: 605,
    priceTwoUsd: 1210,
    featured: true,
  },
  {
    id: "cn-bihai",
    destinationSlug: "china",
    resortSlug: "sanya",
    hotel: "BIHAI JINSHA",
    rating: 9.0,
    nights: 8,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Garden view", ru: "Garden view", en: "Garden view" },
    dateFrom: "2026-09-16",
    dateTo: "2026-09-24",
    pricePerPersonUsd: 603,
    priceTwoUsd: 1205,
    badges: ["seats"],
  },
  {
    id: "th-pattaya-1",
    destinationSlug: "thailand",
    resortSlug: "pattaya",
    hotel: "Golden Beach Hotel",
    rating: 8.1,
    nights: 7,
    board: { uz: "Nonushta", ru: "Завтрак", en: "Breakfast" },
    room: { uz: "Superior", ru: "Superior", en: "Superior" },
    dateFrom: "2026-09-20",
    dateTo: "2026-09-27",
    pricePerPersonUsd: 627,
    priceTwoUsd: 1254,
  },
];

export function getDestination(slug: string) {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function getResort(slug: string) {
  return RESORTS.find((r) => r.slug === slug);
}

export function offersForDestination(slug: string) {
  return TOUR_OFFERS.filter((o) => o.destinationSlug === slug);
}

export function offersForResort(slug: string) {
  return TOUR_OFFERS.filter((o) => o.resortSlug === slug);
}

export function featuredOffers() {
  return TOUR_OFFERS.filter((o) => o.featured);
}

export function destinationPath(slug: string) {
  return `/tours/${slug}/`;
}

export function resortPath(slug: string) {
  return `/kurort/${slug}/`;
}
