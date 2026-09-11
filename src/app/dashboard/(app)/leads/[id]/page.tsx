import Link from "next/link";
import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LeadStatusForm } from "../LeadStatusForm";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser("leads");
  const { id } = await params;
  if (!hasSupabaseAdminConfig()) notFound();

  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("sw_leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <Link href="/dashboard/leads/" className="text-sm text-primary hover:underline">
        ← Leads
      </Link>
      <h1 className="text-2xl font-semibold">{data.id}</h1>
      <div className="rounded-2xl border border-black/8 bg-white p-5 text-sm">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Type</dt>
            <dd className="font-medium">{data.type}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Status</dt>
            <dd className="mt-1">
              <LeadStatusForm id={data.id} status={data.status} />
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Name</dt>
            <dd className="font-medium">{data.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Phone</dt>
            <dd className="font-medium">{data.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Locale</dt>
            <dd className="font-medium">{data.locale}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Created</dt>
            <dd className="font-medium">
              {new Date(data.created_at).toLocaleString()}
            </dd>
          </div>
        </dl>
        <pre className="mt-6 overflow-x-auto rounded-xl bg-surface-muted p-4 text-xs">
          {JSON.stringify(data.payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
