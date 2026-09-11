import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { ExportAdminClient } from "@/components/dashboard/ExportAdminClient";

export default async function ExportAdminPage() {
  await requireDashboardUser("overview");
  return <ExportAdminClient cmsReady={hasSupabaseAdminConfig()} />;
}
