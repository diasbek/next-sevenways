import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DESTINATIONS, TOUR_OFFERS } from "@/data/tours/catalog";
import { OFFICES } from "@/data/offices";
import Link from "next/link";

export default async function OverviewPage() {
  await requireDashboardUser("overview");

  let leadsCount = 0;
  let newsCount = 0;
  if (hasSupabaseAdminConfig()) {
    try {
      const admin = createSupabaseAdminClient();
      const [leads, news] = await Promise.all([
        admin.from("sw_leads").select("*", { count: "exact", head: true }),
        admin
          .from("sw_news")
          .select("*", { count: "exact", head: true })
          .eq("status", "published"),
      ]);
      leadsCount = leads.count ?? 0;
      newsCount = news.count ?? 0;
    } catch {
      // empty
    }
  }

  const cards = [
    { label: "Leads", value: leadsCount, href: "/dashboard/leads/" },
    { label: "Destinations (seed)", value: DESTINATIONS.length, href: "/dashboard/tours/" },
    { label: "Tour offers (seed)", value: TOUR_OFFERS.length, href: "/dashboard/tours/" },
    { label: "Offices (seed)", value: OFFICES.length, href: "/dashboard/offices/" },
    { label: "Published news", value: newsCount, href: "/dashboard/news/" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Seven Ways CMS — leads, tours, offices, news.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm hover:border-primary/30"
          >
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
      {!hasSupabaseAdminConfig() ? (
        <p className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-ink-muted">
          Supabase admin env is not configured. Public site works from seed data;
          connect SUPABASE_* keys to enable CRM and CMS writes.
        </p>
      ) : null}
    </div>
  );
}
