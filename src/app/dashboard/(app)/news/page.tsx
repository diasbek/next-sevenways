import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listPublishedSlugs, getNewsBySlug } from "@/lib/news/repository";
import {
  NewsListClient,
  type NewsListRow,
} from "@/components/dashboard/NewsListClient";

export default async function NewsAdminPage() {
  await requireDashboardUser("news");

  let rows: NewsListRow[] = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_news")
      .select("id, slug, title_en, title_uz, title_ru, status, updated_at, cover_url")
      .order("updated_at", { ascending: false });
    rows =
      data?.map((r) => ({
        id: r.id as string,
        slug: r.slug as string,
        title:
          (r.title_en as string) ||
          (r.title_uz as string) ||
          (r.title_ru as string) ||
          (r.slug as string),
        status: r.status as string,
        updated_at: (r.updated_at as string | null) ?? null,
        cover_url: (r.cover_url as string | null) ?? null,
      })) ?? [];
  }

  if (!rows.length) {
    const slugs = await listPublishedSlugs();
    const seedRows: NewsListRow[] = [];
    for (const slug of slugs) {
      const a = await getNewsBySlug(slug, "en");
      if (!a) continue;
      seedRows.push({
        id: `seed-${slug}`,
        slug,
        title: a.title,
        status: "seed",
        seed: true,
      });
    }
    rows = seedRows;
  }

  return <NewsListClient rows={rows} />;
}
