"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  IconCheck,
  IconChevron,
  IconInbox,
  IconMap,
  IconNews,
  IconPlus,
  IconProgress,
} from "@/components/dashboard/icons";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { cn } from "@/lib/cn";
import {
  dashBtnPrimary,
  dashBtnSecondary,
  dashCardPad,
  dashPageLead,
  dashPageTitle,
} from "@/styles/dashboard";
import {
  importNewsSeedAction,
  importOfficesSeedAction,
  importOperatorsSeedAction,
  importToursSeedAction,
} from "@/app/dashboard/(app)/import/actions";

export type OverviewKpi = {
  id: string;
  label: string;
  value: number;
  href: string;
  tone?: "primary" | "amber" | "green" | "neutral";
};

export type CmsHealthBadge = {
  id: string;
  label: string;
  href: string;
  status: "seed" | "ok" | "unpublished";
  detail: string;
};

function greetingFor(
  copy: {
    greetingMorning: string;
    greetingDay: string;
    greetingEvening: string;
  },
  date = new Date(),
) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Tashkent",
    }).format(date),
  );
  if (hour < 12) return copy.greetingMorning;
  if (hour < 18) return copy.greetingDay;
  return copy.greetingEvening;
}

const TONE: Record<
  NonNullable<OverviewKpi["tone"]>,
  { iconWrap: string; value: string }
> = {
  primary: {
    iconWrap: "bg-primary-soft text-primary",
    value: "text-ink",
  },
  amber: {
    iconWrap: "bg-[#fef3c7] text-[#b45309]",
    value: "text-ink",
  },
  green: {
    iconWrap: "bg-[#dcfce7] text-[#15803d]",
    value: "text-ink",
  },
  neutral: {
    iconWrap: "bg-black/[0.05] text-black/50",
    value: "text-ink",
  },
};

function KpiIcon({ id }: { id: string }) {
  if (id === "leads") return <IconInbox />;
  if (id === "in_progress") return <IconProgress />;
  if (id === "won") return <IconCheck />;
  if (id === "news") return <IconNews />;
  return <IconMap />;
}

function badgeClass(status: CmsHealthBadge["status"]) {
  if (status === "seed") return "border-[#fde68a] bg-[#fffbeb] text-[#92400e]";
  if (status === "unpublished")
    return "border-[#fed7aa] bg-[#fff7ed] text-[#9a3412]";
  return "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]";
}

export function OverviewDashboardClient({
  displayName,
  kpis,
  supabaseReady,
  cmsBadges,
  canImport,
}: {
  displayName: string;
  kpis: OverviewKpi[];
  supabaseReady: boolean;
  cmsBadges: CmsHealthBadge[];
  canImport: boolean;
}) {
  const t = useDashT();
  const router = useRouter();
  const greeting = greetingFor(t.overview);
  const name = displayName.trim() || t.you;
  const [busy, setBusy] = useState<string | null>(null);

  const runImport = async (
    id: string,
    fn: () => Promise<unknown>,
    okMessage: string,
  ) => {
    setBusy(id);
    try {
      await fn();
      toast.success(okMessage);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errors.saveFailed);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={dashPageTitle}>
            {greeting}, {name}
          </h1>
          <p className={dashPageLead}>{t.overview.lead}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/leads/" className={dashBtnPrimary}>
            <IconPlus className="size-4" />
            {t.nav.leads}
          </Link>
          <Link href="/dashboard/news/new/" className={dashBtnSecondary}>
            {t.news.newArticle}
          </Link>
          <Link href="/dashboard/export/" className={dashBtnSecondary}>
            Export JSON
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => {
          const tone = TONE[kpi.tone ?? "neutral"];
          return (
            <Link
              key={kpi.id}
              href={kpi.href}
              className={cn(
                dashCardPad,
                "group flex items-start justify-between gap-3 transition hover:border-primary/25",
              )}
            >
              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-black/40">
                  {kpi.label}
                </p>
                <p
                  className={cn(
                    "m-0 mt-2 font-display text-3xl font-bold tracking-[-0.03em]",
                    tone.value,
                  )}
                >
                  {kpi.value}
                </p>
              </div>
              <div className="flex flex-col items-end gap-6">
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-xl",
                    tone.iconWrap,
                  )}
                >
                  <KpiIcon id={kpi.id} />
                </span>
                <IconChevron className="size-4 text-black/25 transition group-hover:text-primary" />
              </div>
            </Link>
          );
        })}
      </div>

      {!supabaseReady ? (
        <p className="m-0 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
          Supabase admin env is not configured. Public site works from seed
          data; connect SUPABASE_* keys to enable CRM and CMS writes.
        </p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="m-0 text-sm font-semibold uppercase tracking-wide text-black/40">
              CMS health
            </h2>
            <div className="flex flex-wrap gap-2">
              {cmsBadges.map((badge) => (
                <Link
                  key={badge.id}
                  href={badge.href}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-medium",
                    badgeClass(badge.status),
                  )}
                >
                  {badge.label}: {badge.detail}
                </Link>
              ))}
            </div>
          </section>

          {canImport ? (
            <section className={cn(dashCardPad, "space-y-3")}>
              <h2 className="m-0 text-base font-semibold text-ink">
                Import seed → CMS
              </h2>
              <p className="m-0 text-sm text-black/55">
                Upserts code seed into Supabase. Safe to re-run; existing rows
                with the same primary key are updated.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={dashBtnPrimary}
                  disabled={busy !== null}
                  onClick={() =>
                    runImport(
                      "tours",
                      importToursSeedAction,
                      "Tours seed imported",
                    )
                  }
                >
                  {busy === "tours" ? "…" : "Import tours"}
                </button>
                <button
                  type="button"
                  className={dashBtnSecondary}
                  disabled={busy !== null}
                  onClick={() =>
                    runImport(
                      "offices",
                      importOfficesSeedAction,
                      "Offices seed imported",
                    )
                  }
                >
                  {busy === "offices" ? "…" : "Import offices"}
                </button>
                <button
                  type="button"
                  className={dashBtnSecondary}
                  disabled={busy !== null}
                  onClick={() =>
                    runImport(
                      "news",
                      importNewsSeedAction,
                      "News seed imported",
                    )
                  }
                >
                  {busy === "news" ? "…" : "Import news"}
                </button>
                <button
                  type="button"
                  className={dashBtnSecondary}
                  disabled={busy !== null}
                  onClick={() =>
                    runImport(
                      "operators",
                      importOperatorsSeedAction,
                      "Operators seed imported",
                    )
                  }
                >
                  {busy === "operators" ? "…" : "Import operators"}
                </button>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
