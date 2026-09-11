import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { uzCopy } from "@/data/uz";
import { ruCopy } from "@/data/ru";
import { enCopy } from "@/data/en";
import { ContentAdminClient } from "@/components/dashboard/ContentAdminClient";

export default async function ContentAdminPage() {
  const user = await requireDashboardUser("content");
  const cmsReady = hasSupabaseAdminConfig();

  let rows: Array<{
    key: string;
    label: string;
    payload: Record<string, unknown>;
  }> = [];

  if (cmsReady) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_site_copy")
      .select("key, label, payload")
      .order("key");
    rows = (data as typeof rows) ?? [];
  }

  return (
    <ContentAdminClient
      rows={rows}
      seedByLocale={{ uz: uzCopy, ru: ruCopy, en: enCopy }}
      canWrite={canMutate(user.role, "content")}
      cmsReady={cmsReady}
    />
  );
}
