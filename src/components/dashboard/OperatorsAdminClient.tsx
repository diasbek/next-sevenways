"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import {
  DashCrudPage,
  DashListView,
  DashModal,
  DashRowActions,
} from "@/components/dashboard/ds";
import { DashImageField } from "@/components/dashboard/news/DashImageField";
import {
  deleteOperatorAction,
  saveOperatorAction,
} from "@/app/dashboard/(app)/operators/actions";
import {
  dashBtnPrimary,
  dashCardPad,
  dashInput,
  dashLabel,
} from "@/styles/dashboard";
import { cn } from "@/lib/cn";

export type OperatorAdminRow = {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  role_uz: string;
  role_ru: string;
  role_en: string;
  phone: string;
  telegram: string;
  image_url: string | null;
  is_online: boolean;
  is_published: boolean;
  sort_order: number;
};

export type SeedOperator = {
  id: string;
  nameEn: string;
  roleEn: string;
  phone: string;
};

type LocaleTab = "uz" | "ru" | "en";

export function OperatorsAdminClient({
  operators,
  seedOperators,
  canWrite,
  cmsReady,
}: {
  operators: OperatorAdminRow[];
  seedOperators: SeedOperator[];
  canWrite: boolean;
  cmsReady: boolean;
}) {
  const t = useDashT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OperatorAdminRow | null>(null);
  const [localeTab, setLocaleTab] = useState<LocaleTab>("uz");
  const showSeed = !cmsReady || operators.length === 0;

  return (
    <DashCrudPage
      title="Operators"
      lead={
        cmsReady
          ? "Manage operators shown on the offices page (sw_operators)."
          : "Seed operators below. Connect Supabase to persist edits."
      }
      primaryAction={
        canWrite && cmsReady ? (
          <button
            type="button"
            className={dashBtnPrimary}
            onClick={() => {
              setEditing(null);
              setLocaleTab("uz");
              setOpen(true);
            }}
          >
            {t.common.add}
          </button>
        ) : undefined
      }
    >
      {showSeed ? (
        <>
          <p className={`${dashCardPad} text-sm text-black/55`}>
            Showing seed operators (read-only)
            {cmsReady ? " — CMS table is empty." : "."}
          </p>
          <DashListView
            storageKey="operators-seed"
            rows={seedOperators}
            rowKey={(r) => r.id}
            emptyTitle="No operators"
            columns={[
              {
                id: "name",
                header: t.list.name,
                searchText: (r) => `${r.nameEn} ${r.roleEn} ${r.phone}`,
                sortValue: (r) => r.nameEn,
                cell: (r) => (
                  <div>
                    <p className="m-0 font-medium text-ink">{r.nameEn}</p>
                    <p className="m-0 mt-0.5 text-xs text-black/45">
                      {r.roleEn}
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </>
      ) : (
        <DashListView
          storageKey="operators"
          rows={operators}
          rowKey={(r) => r.id}
          emptyTitle="No operators"
          columns={[
            {
              id: "name",
              header: t.list.name,
              searchText: (r) =>
                `${r.name_en} ${r.role_en} ${r.phone} ${r.telegram}`,
              sortValue: (r) => r.sort_order,
              cell: (r) => (
                <div>
                  <p className="m-0 font-medium text-ink">{r.name_en}</p>
                  <p className="m-0 mt-0.5 text-xs text-black/45">
                    {r.role_en}
                  </p>
                </div>
              ),
            },
            {
              id: "online",
              header: "Online",
              sortValue: (r) => (r.is_online ? 1 : 0),
              cell: (r) => (
                <span className="text-xs font-medium text-black/55">
                  {r.is_online ? "Yes" : "No"}
                </span>
              ),
            },
            {
              id: "pub",
              header: t.list.status,
              sortValue: (r) => (r.is_published ? 1 : 0),
              cell: (r) => (
                <span className="text-xs font-medium text-black/55">
                  {r.is_published ? t.list.active : t.list.inactive}
                </span>
              ),
            },
          ]}
          actions={
            canWrite
              ? (row) => (
                  <DashRowActions
                    onEdit={() => {
                      setEditing(row);
                      setLocaleTab("uz");
                      setOpen(true);
                    }}
                    onDelete={async () => {
                      const fd = new FormData();
                      fd.set("id", row.id);
                      await deleteOperatorAction(fd);
                      router.refresh();
                    }}
                  />
                )
              : undefined
          }
        />
      )}

      <DashModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit operator" : "Add operator"}
        size="lg"
      >
        <form
          className="grid gap-3"
          action={async (fd) => {
            try {
              await saveOperatorAction(fd);
              toast.success(t.form.successDefault);
              setOpen(false);
              router.refresh();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : t.errors.saveFailed,
              );
            }
          }}
        >
          <label className="grid gap-1.5">
            <span className={dashLabel}>ID</span>
            <input
              name="id"
              required
              defaultValue={editing?.id ?? ""}
              readOnly={Boolean(editing)}
              className={dashInput}
            />
          </label>
          <div className="flex gap-2">
            {(["uz", "ru", "en"] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocaleTab(loc)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold",
                  localeTab === loc
                    ? "bg-primary text-white"
                    : "border border-black/10 bg-white text-black/55",
                )}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
          {(["uz", "ru", "en"] as const).map((loc) => (
            <div
              key={loc}
              className={cn("grid gap-3", localeTab !== loc && "hidden")}
            >
              <label className="grid gap-1.5">
                <span className={dashLabel}>Name {loc}</span>
                <input
                  name={`name_${loc}`}
                  required={localeTab === loc}
                  defaultValue={editing?.[`name_${loc}`] ?? ""}
                  className={dashInput}
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Role {loc}</span>
                <input
                  name={`role_${loc}`}
                  defaultValue={editing?.[`role_${loc}`] ?? ""}
                  className={dashInput}
                />
              </label>
            </div>
          ))}
          <label className="grid gap-1.5">
            <span className={dashLabel}>Phone</span>
            <input
              name="phone"
              defaultValue={editing?.phone ?? ""}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Telegram</span>
            <input
              name="telegram"
              defaultValue={editing?.telegram ?? ""}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Sort order</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={editing?.sort_order ?? 0}
              className={dashInput}
            />
          </label>
          <DashImageField
            name="image_url"
            label="Photo"
            defaultUrl={editing?.image_url ?? ""}
            folder="operators"
          />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="is_online"
              value="1"
              defaultChecked={editing?.is_online ?? true}
              className="size-4 rounded border-black/20"
            />
            Online
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="is_published"
              value="1"
              defaultChecked={editing?.is_published ?? true}
              className="size-4 rounded border-black/20"
            />
            Published
          </label>
          <button type="submit" className={`${dashBtnPrimary} w-fit`}>
            {t.common.save}
          </button>
        </form>
      </DashModal>
    </DashCrudPage>
  );
}
