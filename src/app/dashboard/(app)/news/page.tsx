import Link from "next/link";
import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listPublishedSlugs, getNewsBySlug } from "@/lib/news/repository";

export default async function NewsAdminPage() {
  await requireDashboardUser("news");

  let rows: Array<{ id: string; slug: string; title: string; status: string }> =
    [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_news")
      .select("id, slug, title_en, status")
      .order("updated_at", { ascending: false });
    rows =
      data?.map((r) => ({
        id: r.id as string,
        slug: r.slug as string,
        title: (r.title_en as string) || (r.slug as string),
        status: r.status as string,
      })) ?? [];
  }

  const seed = listPublishedSlugs().map((slug) => {
    const a = getNewsBySlug(slug, "en")!;
    return { id: `seed-${slug}`, slug, title: a.title, status: "seed" };
  });

  const items = rows.length ? rows : seed;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">News</h1>
        <Link
          href="/dashboard/news/new/"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          New article
        </Link>
      </div>
      <ul className="divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-ink-muted">/{item.slug}/ · {item.status}</p>
            </div>
            {item.status !== "seed" ? (
              <Link
                href={`/dashboard/news/${item.id}/`}
                className="text-primary hover:underline"
              >
                Edit
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
