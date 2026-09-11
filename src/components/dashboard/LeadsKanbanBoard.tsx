"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import { updateLeadBoardAction } from "@/app/dashboard/(app)/leads/actions";
import { DashStatusBadge } from "@/components/dashboard/DashStatusBadge";
import {
  LeadsKanbanCard,
  LeadsKanbanCardPreview,
} from "@/components/dashboard/LeadsKanbanCard";
import { LEAD_STATUSES, type LeadStatus } from "@/components/dashboard/LeadStatusSelect";
import type { LeadListRow } from "@/components/dashboard/LeadsListClient";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { cn } from "@/lib/cn";
import { dashCard } from "@/styles/dashboard";

function columnDropId(status: string) {
  return `column:${status}`;
}

function parseColumnId(id: string | number): LeadStatus | null {
  const raw = String(id);
  if (!raw.startsWith("column:")) return null;
  const status = raw.slice("column:".length);
  return (LEAD_STATUSES as readonly string[]).includes(status)
    ? (status as LeadStatus)
    : null;
}

function sortRows(rows: LeadListRow[]) {
  return [...rows].sort((a, b) => {
    const as = a.kanban_sort ?? 0;
    const bs = b.kanban_sort ?? 0;
    if (bs !== as) return bs - as;
    return b.created_at.localeCompare(a.created_at);
  });
}

function groupByStatus(rows: LeadListRow[]) {
  const map: Record<LeadStatus, LeadListRow[]> = {
    new: [],
    in_progress: [],
    won: [],
    lost: [],
    spam: [],
  };
  for (const row of sortRows(rows)) {
    const status = (LEAD_STATUSES as readonly string[]).includes(row.status)
      ? (row.status as LeadStatus)
      : "new";
    map[status].push(row);
  }
  return map;
}

function findStatusForId(
  columns: Record<LeadStatus, LeadListRow[]>,
  id: string,
): LeadStatus | null {
  for (const status of LEAD_STATUSES) {
    if (columns[status].some((r) => r.id === id)) return status;
  }
  return null;
}

function findRow(
  columns: Record<LeadStatus, LeadListRow[]>,
  id: string,
): LeadListRow | null {
  for (const status of LEAD_STATUSES) {
    const found = columns[status].find((r) => r.id === id);
    if (found) return found;
  }
  return null;
}

function KanbanColumn({
  status,
  items,
  readOnly,
}: {
  status: LeadStatus;
  items: LeadListRow[];
  readOnly: boolean;
}) {
  const t = useDashT();
  const { setNodeRef, isOver } = useDroppable({
    id: columnDropId(status),
    data: { status },
  });

  return (
    <section
      className={cn(
        dashCard,
        "flex w-[17.5rem] shrink-0 snap-start flex-col",
        isOver && "ring-2 ring-primary/30",
      )}
    >
      <header className="sticky top-0 z-[1] flex items-center justify-between gap-2 border-b border-black/[0.06] bg-white/95 px-3 py-2.5 backdrop-blur">
        <DashStatusBadge kind="lead" value={status} />
        <span className="rounded-lg bg-black/[0.04] px-2 py-0.5 text-xs font-semibold text-black/45">
          {items.length}
        </span>
      </header>
      <div
        ref={setNodeRef}
        className="flex min-h-[12rem] flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        <SortableContext
          items={items.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 ? (
            <p className="m-0 px-1 py-6 text-center text-xs text-black/35">
              {t.leads.kanbanEmpty}
            </p>
          ) : (
            items.map((row) => (
              <LeadsKanbanCard
                key={row.id}
                row={row}
                dragDisabled={readOnly}
              />
            ))
          )}
        </SortableContext>
      </div>
    </section>
  );
}

export function LeadsKanbanBoard({
  rows,
  readOnly,
}: {
  rows: LeadListRow[];
  readOnly: boolean;
}) {
  const t = useDashT();
  const rowsSignature = useMemo(
    () => rows.map((r) => `${r.id}:${r.status}`).join("|"),
    [rows],
  );
  const [signature, setSignature] = useState(rowsSignature);
  const [columns, setColumns] = useState(() => groupByStatus(rows));
  const [activeId, setActiveId] = useState<string | null>(null);
  const columnsRef = useRef(columns);

  if (signature !== rowsSignature) {
    const next = groupByStatus(rows);
    setSignature(rowsSignature);
    setColumns(next);
  }

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  const setColumnsBoth = (
    next:
      | Record<LeadStatus, LeadListRow[]>
      | ((
          prev: Record<LeadStatus, LeadListRow[]>,
        ) => Record<LeadStatus, LeadListRow[]>),
  ) => {
    setColumns((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      columnsRef.current = resolved;
      return resolved;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const activeRow = useMemo(() => {
    if (!activeId) return null;
    return findRow(columns, activeId);
  }, [activeId, columns]);

  const persistColumn = async (
    status: LeadStatus,
    ordered: LeadListRow[],
    snapshot: Record<LeadStatus, LeadListRow[]>,
  ) => {
    try {
      await updateLeadBoardAction({
        status,
        orderedIds: ordered.map((r) => r.id),
      });
      toast.success(t.leads.moved);
    } catch {
      setColumnsBoth(snapshot);
      toast.error(t.errors.saveFailed);
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeLeadId = String(active.id);
    const overId = String(over.id);

    setColumnsBoth((prev) => {
      const fromStatus = findStatusForId(prev, activeLeadId);
      if (!fromStatus) return prev;

      const overColumn = parseColumnId(overId);
      const toStatus =
        overColumn ?? findStatusForId(prev, overId) ?? fromStatus;

      if (fromStatus === toStatus) {
        const fromItems = [...prev[fromStatus]];
        const oldIndex = fromItems.findIndex((r) => r.id === activeLeadId);
        if (oldIndex < 0) return prev;

        let newIndex = fromItems.findIndex((r) => r.id === overId);
        if (parseColumnId(overId)) newIndex = fromItems.length - 1;
        if (newIndex < 0) newIndex = fromItems.length - 1;
        if (oldIndex === newIndex) return prev;

        const [moved] = fromItems.splice(oldIndex, 1);
        if (!moved) return prev;
        fromItems.splice(newIndex, 0, moved);
        return { ...prev, [fromStatus]: fromItems };
      }

      const fromItems = [...prev[fromStatus]];
      const toItems = [...prev[toStatus]];
      const oldIndex = fromItems.findIndex((r) => r.id === activeLeadId);
      if (oldIndex < 0) return prev;
      const [moved] = fromItems.splice(oldIndex, 1);
      if (!moved) return prev;

      const updated = { ...moved, status: toStatus };
      let newIndex = toItems.findIndex((r) => r.id === overId);
      if (parseColumnId(overId) || newIndex < 0) newIndex = toItems.length;
      toItems.splice(newIndex, 0, updated);

      return {
        ...prev,
        [fromStatus]: fromItems,
        [toStatus]: toItems,
      };
    });
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active } = event;
    const activeLeadId = String(active.id);
    const snapshot = groupByStatus(rows);
    const latest = columnsRef.current;

    const status = findStatusForId(latest, activeLeadId);
    if (!status) {
      setColumnsBoth(snapshot);
      return;
    }

    const base = Math.floor(Date.now() / 1000);
    const ordered = latest[status].map((item, index) => ({
      ...item,
      status,
      kanban_sort: base - index,
    }));

    setColumnsBoth((prev) => ({ ...prev, [status]: ordered }));
    await persistColumn(status, ordered, snapshot);
  };

  const onDragCancel = () => {
    setActiveId(null);
    setColumnsBoth(groupByStatus(rows));
  };

  const board = (
    <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
      {/* scroll cue for narrow viewports */}
      <span className="sr-only">Scroll horizontally for more columns</span>
      {LEAD_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          items={columns[status]}
          readOnly={readOnly}
        />
      ))}
    </div>
  );

  if (readOnly) return board;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {board}
      <DragOverlay>
        {activeRow ? (
          <div className="w-[16.5rem]">
            <LeadsKanbanCardPreview row={activeRow} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
