"use client";

import type { HTMLAttributes } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useDashLocale, useDashT } from "@/components/dashboard/DashLocaleProvider";
import { dashIntlLocale } from "@/i18n/dashboard";
import {
  formatDashDate,
  leadClientLabel,
  leadTypeLabel,
} from "@/lib/cms/lead-display";
import { cn } from "@/lib/cn";
import type { LeadListRow } from "@/components/dashboard/LeadsListClient";

function LeadKanbanCardBody({
  row,
  showHandle,
  handleProps,
}: {
  row: LeadListRow;
  showHandle?: boolean;
  handleProps?: HTMLAttributes<HTMLButtonElement>;
}) {
  const t = useDashT();
  const { locale } = useDashLocale();
  const intlLocale = dashIntlLocale(locale);
  const label = leadClientLabel(row.name, row.phone, row.payload);

  return (
    <div className="flex items-start gap-2">
      {showHandle ? (
        <button
          type="button"
          className="mt-0.5 inline-flex shrink-0 cursor-grab touch-none rounded-md p-0.5 text-black/30 hover:bg-black/[0.04] hover:text-black/55 active:cursor-grabbing"
          aria-label="Drag"
          {...handleProps}
        >
          <GripVertical className="size-4" />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <Link
          href={`/dashboard/leads/${row.id}/`}
          className="block truncate text-sm font-semibold text-ink hover:text-primary hover:underline"
        >
          {label}
        </Link>
        <p className="m-0 mt-1 truncate text-xs text-black/50">
          {row.phone ?? "—"}
          {row.email ? ` · ${row.email}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] text-black/40">
          <span>{leadTypeLabel(row.type)}</span>
          <span>·</span>
          <span>/{row.locale}</span>
          <span>·</span>
          <span>{formatDashDate(row.created_at, intlLocale)}</span>
        </div>
        <Link
          href={`/dashboard/leads/${row.id}/`}
          className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
        >
          {t.common.open} →
        </Link>
      </div>
    </div>
  );
}

export function LeadsKanbanCardPreview({ row }: { row: LeadListRow }) {
  return (
    <article className="rounded-xl border border-black/[0.08] bg-white p-3 shadow-[0_12px_28px_rgb(15_18_24/0.14)]">
      <LeadKanbanCardBody row={row} />
    </article>
  );
}

export function LeadsKanbanCard({
  row,
  dragDisabled,
}: {
  row: LeadListRow;
  dragDisabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    disabled: dragDisabled,
    data: { status: row.status },
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "rounded-xl border border-black/[0.08] bg-white p-3 shadow-[0_1px_2px_rgb(15_18_24/0.04)]",
        isDragging && "z-10 opacity-40",
        dragDisabled ? "cursor-default" : null,
      )}
    >
      <LeadKanbanCardBody
        row={row}
        showHandle={!dragDisabled}
        handleProps={{ ...attributes, ...listeners }}
      />
    </article>
  );
}
