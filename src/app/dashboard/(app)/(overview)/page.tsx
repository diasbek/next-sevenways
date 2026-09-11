import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DESTINATIONS } from "@/data/tours/catalog";
import { OFFICES } from "@/data/offices";
import {
  OverviewDashboardClient,
  type OverviewKpi,
} from "@/components/dashboard/OverviewDashboardClient";

export default async function OverviewPage() {
  const user = await requireDashboardUser("overview");

  let leadsCount = 0;
  let inProgressCount = 0;
  let wonCount = 0;
  let newsCount = 0;
  let destinationsCount = DESTINATIONS.length;
  let officesCount = OFFICES.length;

  if (hasSupabaseAdminConfig()) {
    try {
      const admin = createSupabaseAdminClient();
      const [leads, inProgress, won, news, destinations, offices] =
        await Promise.all([
          admin.from("sw_leads").select("*", { count: "exact", head: true }),
          admin
            .from("sw_leads")
            .select("*", { count: "exact", head: true })
            .eq("status", "in_progress"),
          admin
            .from("sw_leads")
            .select("*", { count: "exact", head: true })
            .eq("status", "won"),
          admin
            .from("sw_news")
            .select("*", { count: "exact", head: true })
            .eq("status", "published"),
          admin
            .from("sw_destinations")
            .select("*", { count: "exact", head: true }),
          admin.from("sw_offices").select("*", { count: "exact", head: true }),
        ]);
      leadsCount = leads.count ?? 0;
      inProgressCount = inProgress.count ?? 0;
      wonCount = won.count ?? 0;
      newsCount = news.count ?? 0;
      if ((destinations.count ?? 0) > 0) {
        destinationsCount = destinations.count ?? destinationsCount;
      }
      if ((offices.count ?? 0) > 0) {
        officesCount = offices.count ?? officesCount;
      }
    } catch {
      // empty
    }
  }

  const kpis: OverviewKpi[] = [
    {
      id: "leads",
      label: "Leads",
      value: leadsCount,
      href: "/dashboard/leads/",
      tone: "primary",
    },
    {
      id: "in_progress",
      label: "In progress",
      value: inProgressCount,
      href: "/dashboard/leads/",
      tone: "amber",
    },
    {
      id: "won",
      label: "Won",
      value: wonCount,
      href: "/dashboard/leads/",
      tone: "green",
    },
    {
      id: "destinations",
      label: "Destinations",
      value: destinationsCount,
      href: "/dashboard/tours/",
      tone: "neutral",
    },
    {
      id: "offices",
      label: "Offices",
      value: officesCount,
      href: "/dashboard/offices/",
      tone: "neutral",
    },
    {
      id: "news",
      label: "Published news",
      value: newsCount,
      href: "/dashboard/news/",
      tone: "green",
    },
  ];

  return (
    <OverviewDashboardClient
      displayName={user.displayName || user.email}
      kpis={kpis}
      supabaseReady={hasSupabaseAdminConfig()}
    />
  );
}
