import type { Locale } from "@/i18n/config";

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
};

const SEED: Record<string, Record<Locale, NewsArticle>> = {
  "welcome-seven-ways": {
    uz: {
      slug: "welcome-seven-ways",
      title: "Seven Ways sayti ochildi",
      excerpt: "Toshkentdan paket turlar — yangi saytda.",
      body: "Seven Ways endi online: yoʻnalishlar, ofislar va ariza shakli. Narxlar orientir — yakuniy summani menejer tasdiqlaydi.",
      publishedAt: "2026-09-01",
    },
    ru: {
      slug: "welcome-seven-ways",
      title: "Сайт Seven Ways открыт",
      excerpt: "Пакетные туры из Ташкента — на новом сайте.",
      body: "Seven Ways теперь онлайн: направления, офисы и форма заявки. Цены ориентировочные — итоговую сумму подтверждает менеджер.",
      publishedAt: "2026-09-01",
    },
    en: {
      slug: "welcome-seven-ways",
      title: "Seven Ways site is live",
      excerpt: "Package tours from Tashkent — on the new site.",
      body: "Seven Ways is online: destinations, offices and a request form. Prices are indicative — a manager confirms the final amount.",
      publishedAt: "2026-09-01",
    },
  },
};

export const SEED_NEWS: NewsArticle[] = Object.values(SEED).map((m) => m.uz);

export function listPublishedSlugs() {
  return Object.keys(SEED);
}

export function getNewsBySlug(slug: string, locale: Locale): NewsArticle | null {
  const entry = SEED[slug];
  if (!entry) return null;
  return entry[locale] ?? entry.uz;
}

export function listNews(locale: Locale): NewsArticle[] {
  return listPublishedSlugs()
    .map((slug) => getNewsBySlug(slug, locale))
    .filter((a): a is NewsArticle => Boolean(a));
}
