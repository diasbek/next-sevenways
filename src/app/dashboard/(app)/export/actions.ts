"use server";

import { requireDashboardUser } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { writeAuditLog } from "@/lib/cms/revalidate";

export type CmsExportBundle = {
  exportedAt: string;
  destinations: unknown[];
  resorts: unknown[];
  offers: unknown[];
  offices: unknown[];
  news: unknown[];
  site_copy: unknown[];
  operators: unknown[];
  legal: unknown[];
  settings: unknown[];
};

export async function exportCmsBundleAction(): Promise<CmsExportBundle> {
  const actor = await requireDashboardUser("overview");
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase not configured");
  }

  const admin = createSupabaseAdminClient();
  const [
    destinations,
    resorts,
    offers,
    offices,
    news,
    site_copy,
    operators,
    legal,
    settings,
  ] = await Promise.all([
    admin.from("sw_destinations").select("*"),
    admin.from("sw_resorts").select("*"),
    admin.from("sw_tour_offers").select("*"),
    admin.from("sw_offices").select("*"),
    admin.from("sw_news").select("*"),
    admin.from("sw_site_copy").select("*"),
    admin.from("sw_operators").select("*"),
    admin.from("sw_legal_pages").select("*"),
    admin.from("sw_site_settings").select("*"),
  ]);

  const bundle: CmsExportBundle = {
    exportedAt: new Date().toISOString(),
    destinations: destinations.data ?? [],
    resorts: resorts.data ?? [],
    offers: offers.data ?? [],
    offices: offices.data ?? [],
    news: news.data ?? [],
    site_copy: site_copy.data ?? [],
    operators: operators.data ?? [],
    legal: legal.data ?? [],
    settings: settings.data ?? [],
  };

  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "export.cms",
    entityType: "backup",
  });

  return bundle;
}
