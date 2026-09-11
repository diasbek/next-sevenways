"use client";

import Link from "next/link";
import { useDashLocale, useDashT } from "@/components/dashboard/DashLocaleProvider";
import { DashStatusBadge } from "@/components/dashboard/DashStatusBadge";
import { DashCrudPage, DashListView } from "@/components/dashboard/ds";
import { dashIntlLocale } from "@/i18n/dashboard";
import { formatDashDate } from "@/lib/cms/lead-display";
import { dashBtnPrimary, dashBtnRowSecondary } from "@/styles/dashboard";

export type NewsListRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at?: string | null;
  cover_url?: string | null;
  seed?: boolean;
};

export function NewsListClient({ rows }: { rows: NewsListRow[] }) {
  const t = useDashT();
  const { locale } = useDashLocale();
  const intlLocale = dashIntlLocale(locale);

  return (
    <DashCrudPage
      title={t.news.title}
      lead={t.news.lead}
      primaryAction={
        <Link href="/dashboard/news/new/" className={dashBtnPrimary}>
          {t.news.newArticle}
        </Link>
      }
    >
      <DashListView
        storageKey="news"
        rows={rows}
        rowKey={(r) => r.id}
        emptyTitle={t.news.emptyTitle}
        emptyLead={t.news.emptyLead}
        defaultSortId="updated"
        defaultSortDir="desc"
        filters={[
          {
            id: "status",
            label: t.list.status,
            options: [
              { value: "draft", label: t.badge.news.draft },
              { value: "published", label: t.badge.news.published },
              { value: "archived", label: "archived" },
              { value: "seed", label: "seed" },
            ],
            getValue: (r) => r.status,
          },
        ]}
        columns={[
          {
            id: "title",
            header: t.list.title,
            searchText: (r) => `${r.title} ${r.slug}`,
            sortValue: (r) => r.title,
            cell: (r) => (
              <div className="min-w-0">
                <p className="m-0 font-medium text-ink">{r.title}</p>
                <p className="m-0 mt-0.5 text-xs text-black/45">/{r.slug}/</p>
              </div>
            ),
          },
          {
            id: "status",
            header: t.list.status,
            sortValue: (r) => r.status,
            cell: (r) =>
              r.status === "seed" ? (
                <span className="text-xs font-semibold text-black/40">seed</span>
              ) : (
                <DashStatusBadge kind="news" value={r.status} />
              ),
          },
          {
            id: "updated",
            header: t.list.updated,
            sortValue: (r) => r.updated_at ?? "",
            cell: (r) => (
              <span className="text-xs text-black/45">
                {r.updated_at ? formatDashDate(r.updated_at, intlLocale) : "—"}
              </span>
            ),
          },
        ]}
        actions={(r) =>
          r.seed ? null : (
            <Link
              href={`/dashboard/news/${r.id}/`}
              className={dashBtnRowSecondary}
            >
              {t.common.edit}
            </Link>
          )
        }
      />
    </DashCrudPage>
  );
}
