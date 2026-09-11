"use client";

import Link from "next/link";
import {
  useDashLocale,
  useDashT,
} from "@/components/dashboard/DashLocaleProvider";
import { LeadStatusSelect } from "@/components/dashboard/LeadStatusSelect";
import { DashStatusBadge } from "@/components/dashboard/DashStatusBadge";
import { LeadsKanbanBoard } from "@/components/dashboard/LeadsKanbanBoard";
import { DashCrudPage, DashListView } from "@/components/dashboard/ds";
import { dashIntlLocale } from "@/i18n/dashboard";
import {
  formatDashDate,
  leadClientLabel,
  leadTypeLabel,
} from "@/lib/cms/lead-display";
import { updateLeadStatusAction } from "@/app/dashboard/(app)/leads/actions";
import { dashBtnRowSecondary } from "@/styles/dashboard";

export type LeadListRow = {
  id: string;
  type: string;
  status: string;
  locale: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  payload?: unknown;
  kanban_sort?: number | null;
};

export function LeadsListClient({
  rows,
  readOnly,
  updateStatusAction = updateLeadStatusAction,
}: {
  rows: LeadListRow[];
  readOnly: boolean;
  updateStatusAction?: (formData: FormData) => Promise<void>;
}) {
  const t = useDashT();
  const { locale } = useDashLocale();
  const intlLocale = dashIntlLocale(locale);

  return (
    <DashCrudPage title={t.leads.title} lead={t.leads.lead}>
      <DashListView
        storageKey="leads"
        rows={rows}
        rowKey={(r) => r.id}
        emptyTitle={t.leads.emptyTitle}
        emptyLead={t.leads.emptyLead}
        defaultSortId="created"
        defaultSortDir="desc"
        defaultPageSize={50}
        renderKanban={(filtered) => (
          <LeadsKanbanBoard rows={filtered} readOnly={readOnly} />
        )}
        filters={[
          {
            id: "status",
            label: t.leads.filterStatus,
            options: [
              { value: "new", label: t.badge.lead.new },
              { value: "in_progress", label: t.badge.lead.in_progress },
              { value: "won", label: t.badge.lead.won },
              { value: "lost", label: t.badge.lead.lost },
              { value: "spam", label: t.badge.lead.spam },
            ],
            getValue: (r) => r.status,
          },
          {
            id: "type",
            label: t.leads.filterType,
            options: [
              { value: "tour", label: "Tour" },
              { value: "price", label: t.leads.typePrice },
              { value: "business", label: t.leads.typeBusiness },
              { value: "contact", label: t.leads.typeContact },
            ],
            getValue: (r) => r.type,
          },
          {
            id: "locale",
            label: t.list.locale,
            options: [
              { value: "uz", label: "UZ" },
              { value: "ru", label: "RU" },
              { value: "en", label: "EN" },
            ],
            getValue: (r) => r.locale,
          },
        ]}
        columns={[
          {
            id: "id",
            header: "ID",
            searchText: true,
            sortValue: (r) => r.id,
            cell: (row) => (
              <Link
                href={`/dashboard/leads/${row.id}/`}
                className="font-mono text-xs font-semibold text-primary hover:underline"
              >
                {row.id}
              </Link>
            ),
          },
          {
            id: "client",
            header: t.list.client,
            searchText: (r) =>
              leadClientLabel(r.name, r.phone, r.payload) +
              ` ${r.phone ?? ""} ${r.email ?? ""}`,
            sortValue: (r) => leadClientLabel(r.name, r.phone, r.payload),
            cell: (row) => (
              <div className="min-w-0">
                <span className="font-medium text-ink">
                  {leadClientLabel(row.name, row.phone, row.payload)}
                </span>
                {row.phone ? (
                  <p className="m-0 mt-0.5 text-xs text-black/45">{row.phone}</p>
                ) : null}
              </div>
            ),
          },
          {
            id: "type",
            header: t.list.type,
            sortValue: (r) => r.type,
            cell: (row) => (
              <span className="text-xs font-medium text-black/55">
                {leadTypeLabel(row.type)}
                <span className="text-black/35"> /{row.locale}</span>
              </span>
            ),
          },
          {
            id: "status",
            header: t.list.status,
            sortValue: (r) => r.status,
            cell: (row) => (
              <div className="flex flex-col gap-2">
                <DashStatusBadge kind="lead" value={row.status} />
                <LeadStatusSelect
                  id={row.id}
                  status={row.status}
                  action={updateStatusAction}
                  disabled={readOnly}
                />
              </div>
            ),
          },
          {
            id: "created",
            header: t.list.when,
            sortValue: (r) => r.created_at,
            cell: (row) => (
              <span className="text-xs text-black/45">
                {formatDashDate(row.created_at, intlLocale)}
              </span>
            ),
          },
        ]}
        actions={(row) => (
          <Link
            href={`/dashboard/leads/${row.id}/`}
            className={dashBtnRowSecondary}
          >
            {t.common.open}
          </Link>
        )}
      />
    </DashCrudPage>
  );
}
