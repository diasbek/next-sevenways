import Link from "next/link";
import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LeadStatusForm } from "./LeadStatusForm";

type LeadRow = {
  id: string;
  type: string;
  status: string;
  locale: string;
  name: string | null;
  phone: string | null;
  created_at: string;
};

export default async function LeadsPage() {
  await requireDashboardUser("leads");
  let leads: LeadRow[] = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_leads")
      .select("id, type, status, locale, name, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    leads = (data as LeadRow[]) ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Leads</h1>
      {!hasSupabaseAdminConfig() ? (
        <p className="text-sm text-ink-muted">Connect Supabase to store leads.</p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/8 bg-surface-muted text-ink-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/leads/${lead.id}/`}
                    className="font-medium text-primary hover:underline"
                  >
                    {lead.id}
                  </Link>
                </td>
                <td className="px-4 py-3">{lead.type}</td>
                <td className="px-4 py-3">{lead.name ?? "—"}</td>
                <td className="px-4 py-3">{lead.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <LeadStatusForm id={lead.id} status={lead.status} />
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {!leads.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  No leads yet
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
