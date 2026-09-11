"use client";

import { cn } from "@/lib/cn";
import { dashBadgeBase } from "@/styles/dashboard";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import type { DashCopy } from "@/i18n/dashboard";

type Tone = {
  label: string;
  className: string;
};

const LEAD_CLASS: Record<string, string> = {
  draft: "bg-black/[0.06] text-black/50",
  new: "bg-primary-soft text-primary",
  in_progress: "bg-[#fef3c7] text-[#b45309]",
  done: "bg-[#dcfce7] text-[#15803d]",
  won: "bg-[#dcfce7] text-[#15803d]",
  lost: "bg-black/[0.06] text-black/50",
  spam: "bg-black/[0.06] text-black/50",
};

const NEWS_CLASS: Record<string, string> = {
  draft: "bg-black/[0.06] text-black/50",
  published: "bg-[#dcfce7] text-[#15803d]",
};

const ROLE_CLASS: Record<string, string> = {
  owner: "bg-primary-soft text-primary",
  editor: "bg-[#dbeafe] text-[#1d4ed8]",
  crm: "bg-[#fef3c7] text-[#b45309]",
  viewer: "bg-black/[0.06] text-black/50",
};

const SOURCE_CLASS: Record<string, string> = {
  telegram_contact: "bg-[#e0f2fe] text-[#0369a1]",
  manual: "bg-black/[0.06] text-black/50",
  website: "bg-[#f3e8ff] text-[#7c3aed]",
  webapp: "bg-[#e0f2fe] text-[#0369a1]",
};

function toneFrom(
  labels: Record<string, string>,
  classes: Record<string, string>,
  value: string,
): Tone {
  return {
    label: labels[value] ?? value,
    className: classes[value] ?? "bg-black/[0.06] text-black/50",
  };
}

export function badgeLabelsFromCopy(copy: DashCopy) {
  return {
    lead: copy.badge.lead as Record<string, string>,
    news: copy.badge.news as Record<string, string>,
    role: copy.badge.role as Record<string, string>,
    source: copy.badge.source as Record<string, string>,
  };
}

export function DashStatusBadge({
  kind,
  value,
}: {
  kind: "lead" | "news" | "role" | "source";
  value: string;
}) {
  const t = useDashT();
  const labels = badgeLabelsFromCopy(t);
  const tone =
    kind === "lead"
      ? toneFrom(labels.lead, LEAD_CLASS, value)
      : kind === "news"
        ? toneFrom(labels.news, NEWS_CLASS, value)
        : kind === "role"
          ? toneFrom(labels.role, ROLE_CLASS, value)
          : toneFrom(labels.source, SOURCE_CLASS, value);

  return (
    <span className={cn(dashBadgeBase, tone.className)}>{tone.label}</span>
  );
}

export function useLeadStatusLabels() {
  const t = useDashT();
  return t.badge.lead as Record<string, string>;
}
