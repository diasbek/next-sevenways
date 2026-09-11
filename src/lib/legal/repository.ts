import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { legalDocuments } from "@/data/legal/documents";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CMS_TAGS, cmsReady, pickLocale } from "@/lib/cms/overlay";

export type LegalSlug = "privacy" | "terms";

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  paragraphs: string[];
};

type LegalRow = {
  slug: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  body_uz: string;
  body_ru: string;
  body_en: string;
};

function paragraphsFromBody(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

async function fetchCmsLegal(
  slug: LegalSlug,
  locale: Locale,
): Promise<LegalDoc | null> {
  if (!cmsReady()) return null;
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_legal_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as LegalRow;
    const title = pickLocale(
      { uz: row.title_uz, ru: row.title_ru, en: row.title_en },
      locale,
    );
    const body = pickLocale(
      { uz: row.body_uz, ru: row.body_ru, en: row.body_en },
      locale,
    );
    const paragraphs = paragraphsFromBody(body);
    if (!title && !paragraphs.length) return null;
    return { slug, title, paragraphs };
  } catch {
    return null;
  }
}

export async function getLegalDocument(
  slug: LegalSlug,
  locale: Locale,
): Promise<LegalDoc> {
  const cached = unstable_cache(
    async () => {
      const cms = await fetchCmsLegal(slug, locale);
      if (cms?.paragraphs.length) return cms;
      const seed = legalDocuments[slug][locale];
      return { slug, title: seed.title, paragraphs: seed.paragraphs };
    },
    [`cms-legal-${slug}-${locale}`],
    { tags: [CMS_TAGS.legal], revalidate: 60 },
  );
  return cached();
}
