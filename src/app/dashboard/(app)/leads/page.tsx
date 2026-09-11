import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  LeadsListClient,
  type LeadListRow,
} from "@/components/dashboard/LeadsListClient";
import { updateLeadStatusAction } from "./actions";

export default async function LeadsPage() {
  const user = await requireDashboardUser("leads");
  let leads: LeadListRow[] = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_leads")
      .select(
        "id, type, status, locale, name, phone, email, created_at, payload, kanban_sort",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    leads = (data as LeadListRow[]) ?? [];
  }

  return (
    <LeadsListClient
      rows={leads}
      readOnly={!canMutate(user.role, "leads")}
      updateStatusAction={updateLeadStatusAction}
    />
  );
}
