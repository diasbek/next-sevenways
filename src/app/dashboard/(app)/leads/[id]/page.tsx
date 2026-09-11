import Link from "next/link";
import { notFound } from "next/navigation";
import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LeadStatusSelect } from "@/components/dashboard/LeadStatusSelect";
import { DashStatusBadge } from "@/components/dashboard/DashStatusBadge";
import { DashBreadcrumbs, DashPageHeader } from "@/components/dashboard/ui";
import {
  formatDashDate,
  leadClientLabel,
  leadPayloadData,
  leadTypeLabel,
} from "@/lib/cms/lead-display";
import { dashCardPad, dashSectionTitle } from "@/styles/dashboard";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireDashboardUser("leads");
  const { id } = await params;
  if (!hasSupabaseAdminConfig()) notFound();

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("sw_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const readOnly = !canMutate(user.role, "leads");
  const payload = leadPayloadData(data.payload);
  const title = leadClientLabel(data.name, data.phone, data.payload);
  const payloadEntries = Object.entries(payload).filter(
    ([, value]) => value != null && value !== "",
  );

  return (
    <div className="space-y-5">
      <DashBreadcrumbs
        items={[
          { href: "/dashboard/leads/", label: "Leads" },
          { label: data.id },
        ]}
      />
      <DashPageHeader
        title={title}
        lead={`${leadTypeLabel(data.type)} · /${data.locale} · ${formatDashDate(data.created_at)}`}
        actions={
          <Link
            href="/dashboard/leads/"
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Back
          </Link>
        }
      />

      <section className={`${dashCardPad} space-y-4`}>
        <h2 className={dashSectionTitle}>Contact</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Name
            </dt>
            <dd className="mt-1 font-medium text-ink">{data.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Phone
            </dt>
            <dd className="mt-1 font-medium text-ink">{data.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Email
            </dt>
            <dd className="mt-1 font-medium text-ink">{data.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Status
            </dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <DashStatusBadge kind="lead" value={data.status} />
              <LeadStatusSelect
                id={data.id}
                status={data.status}
                disabled={readOnly}
              />
            </dd>
          </div>
        </dl>
      </section>

      <section className={`${dashCardPad} space-y-4`}>
        <h2 className={dashSectionTitle}>Request</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Type
            </dt>
            <dd className="mt-1 font-medium text-ink">
              {leadTypeLabel(data.type)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Locale
            </dt>
            <dd className="mt-1 font-medium text-ink">{data.locale}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Page
            </dt>
            <dd className="mt-1 break-all text-sm text-ink">
              {data.page_url || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Created
            </dt>
            <dd className="mt-1 font-medium text-ink">
              {formatDashDate(data.created_at)}
            </dd>
          </div>
        </dl>
      </section>

      {payloadEntries.length ? (
        <section className={`${dashCardPad} space-y-4`}>
          <h2 className={dashSectionTitle}>Details</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {payloadEntries.map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-black/40">
                  {key}
                </dt>
                <dd className="mt-1 break-words text-sm text-ink">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
