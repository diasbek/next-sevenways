import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DESTINATIONS } from "@/data/tours/catalog";
import { OFFICES } from "@/data/offices";
import {
  OverviewDashboardClient,
  type CmsHealthBadge,
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

  const cmsBadges: CmsHealthBadge[] = [
    {
      id: "tours",
      label: "Tours",
      href: "/dashboard/tours/",
      status: "seed",
      detail: "using seed",
    },
    {
      id: "offices",
      label: "Offices",
      href: "/dashboard/offices/",
      status: "seed",
      detail: "using seed",
    },
    {
      id: "news",
      label: "News",
      href: "/dashboard/news/",
      status: "seed",
      detail: "using seed",
    },
    {
      id: "operators",
      label: "Operators",
      href: "/dashboard/operators/",
      status: "seed",
      detail: "using seed",
    },
    {
      id: "content",
      label: "Content",
      href: "/dashboard/content/",
      status: "seed",
      detail: "using seed",
    },
  ];

  if (hasSupabaseAdminConfig()) {
    try {
      const admin = createSupabaseAdminClient();
      const [
        leads,
        inProgress,
        won,
        news,
        destinations,
        destinationsUnpub,
        offices,
        officesUnpub,
        operators,
        operatorsUnpub,
        siteCopy,
        newsDrafts,
      ] = await Promise.all([
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
        admin
          .from("sw_destinations")
          .select("*", { count: "exact", head: true })
          .eq("is_published", false),
        admin.from("sw_offices").select("*", { count: "exact", head: true }),
        admin
          .from("sw_offices")
          .select("*", { count: "exact", head: true })
          .eq("is_published", false),
        admin.from("sw_operators").select("*", { count: "exact", head: true }),
        admin
          .from("sw_operators")
          .select("*", { count: "exact", head: true })
          .eq("is_published", false),
        admin.from("sw_site_copy").select("*", { count: "exact", head: true }),
        admin
          .from("sw_news")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft"),
      ]);
      leadsCount = leads.count ?? 0;
      inProgressCount = inProgress.count ?? 0;
      wonCount = won.count ?? 0;
      newsCount = news.count ?? 0;
      if ((destinations.count ?? 0) > 0) {
        destinationsCount = destinations.count ?? destinationsCount;
        const unpub = destinationsUnpub.count ?? 0;
        cmsBadges[0] = {
          id: "tours",
          label: "Tours",
          href: "/dashboard/tours/",
          status: unpub > 0 ? "unpublished" : "ok",
          detail:
            unpub > 0
              ? `${unpub} unpublished`
              : `${destinations.count} in CMS`,
        };
      }
      if ((offices.count ?? 0) > 0) {
        officesCount = offices.count ?? officesCount;
        const unpub = officesUnpub.count ?? 0;
        cmsBadges[1] = {
          id: "offices",
          label: "Offices",
          href: "/dashboard/offices/",
          status: unpub > 0 ? "unpublished" : "ok",
          detail:
            unpub > 0 ? `${unpub} unpublished` : `${offices.count} in CMS`,
        };
      }
      if ((news.count ?? 0) > 0 || (newsDrafts.count ?? 0) > 0) {
        const drafts = newsDrafts.count ?? 0;
        cmsBadges[2] = {
          id: "news",
          label: "News",
          href: "/dashboard/news/",
          status: drafts > 0 ? "unpublished" : "ok",
          detail:
            drafts > 0
              ? `${drafts} drafts`
              : `${news.count} published`,
        };
      }
      if ((operators.count ?? 0) > 0) {
        const unpub = operatorsUnpub.count ?? 0;
        cmsBadges[3] = {
          id: "operators",
          label: "Operators",
          href: "/dashboard/operators/",
          status: unpub > 0 ? "unpublished" : "ok",
          detail:
            unpub > 0
              ? `${unpub} unpublished`
              : `${operators.count} in CMS`,
        };
      }
      if ((siteCopy.count ?? 0) > 0) {
        cmsBadges[4] = {
          id: "content",
          label: "Content",
          href: "/dashboard/content/",
          status: "ok",
          detail: `${siteCopy.count} keys`,
        };
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
      cmsBadges={cmsBadges}
      canImport={
        canMutate(user.role, "tours") ||
        canMutate(user.role, "offices") ||
        canMutate(user.role, "news") ||
        canMutate(user.role, "operators")
      }
    />
  );
}
