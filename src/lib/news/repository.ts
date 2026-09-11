import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CMS_TAGS, cmsReady, pickLocale } from "@/lib/cms/overlay";

export type NewsArticle = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl?: string;
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

type NewsRow = {
  id: string;
  slug: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  excerpt_uz: string;
  excerpt_ru: string;
  excerpt_en: string;
  body_uz: string;
  body_ru: string;
  body_en: string;
  cover_url: string | null;
  status: string;
  published_at: string | null;
};

function mapNews(row: NewsRow, locale: Locale): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: pickLocale(
      { uz: row.title_uz, ru: row.title_ru, en: row.title_en },
      locale,
    ),
    excerpt: pickLocale(
      { uz: row.excerpt_uz, ru: row.excerpt_ru, en: row.excerpt_en },
      locale,
    ),
    body: pickLocale(
      { uz: row.body_uz, ru: row.body_ru, en: row.body_en },
      locale,
    ),
    coverUrl: row.cover_url || undefined,
    publishedAt: (row.published_at || "").slice(0, 10),
  };
}

async function fetchCmsNews(locale: Locale): Promise<NewsArticle[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_news")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error || !data?.length) return [];
    return (data as NewsRow[]).map((row) => mapNews(row, locale));
  } catch {
    return [];
  }
}

function seedList(locale: Locale): NewsArticle[] {
  return Object.keys(SEED)
    .map((slug) => SEED[slug]?.[locale] ?? SEED[slug]?.uz)
    .filter((a): a is NewsArticle => Boolean(a));
}

export async function listNews(locale: Locale): Promise<NewsArticle[]> {
  const cached = unstable_cache(
    async () => {
      const cms = await fetchCmsNews(locale);
      if (cms.length) return cms;
      return seedList(locale);
    },
    [`cms-news-${locale}`],
    { tags: [CMS_TAGS.news], revalidate: 60 },
  );
  return cached();
}

export async function listPublishedSlugs(): Promise<string[]> {
  const articles = await listNews("uz");
  return articles.map((a) => a.slug);
}

export async function getNewsBySlug(
  slug: string,
  locale: Locale,
): Promise<NewsArticle | null> {
  const all = await listNews(locale);
  const hit = all.find((a) => a.slug === slug);
  if (hit) return hit;
  return SEED[slug]?.[locale] ?? SEED[slug]?.uz ?? null;
}
