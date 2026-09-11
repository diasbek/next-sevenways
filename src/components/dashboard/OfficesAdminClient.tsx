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
  deleteOfficeAction,
  saveOfficeAction,
} from "@/app/dashboard/(app)/offices/actions";
import {
  dashBtnPrimary,
  dashCardPad,
  dashInput,
  dashLabel,
  dashSelect,
} from "@/styles/dashboard";
import { cn } from "@/lib/cn";

export type OfficeAdminRow = {
  id: string;
  city_uz: string;
  city_ru: string;
  city_en: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  address_uz: string;
  address_ru: string;
  address_en: string;
  phones: string[];
  lat: number | null;
  lng: number | null;
  image_url?: string | null;
  city_key?: string | null;
  is_published: boolean;
  sort_order: number;
};

export type SeedOffice = {
  id: string;
  nameEn: string;
  cityEn: string;
  addressEn: string;
  phones: string[];
};

type LocaleTab = "uz" | "ru" | "en";

export function OfficesAdminClient({
  offices,
  seedOffices,
  canWrite,
  cmsReady,
}: {
  offices: OfficeAdminRow[];
  seedOffices: SeedOffice[];
  canWrite: boolean;
  cmsReady: boolean;
}) {
  const t = useDashT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OfficeAdminRow | null>(null);
  const [localeTab, setLocaleTab] = useState<LocaleTab>("uz");
  const showSeed = !cmsReady || offices.length === 0;
  const rows = showSeed ? null : offices;

  return (
    <DashCrudPage
      title="Offices"
      lead={
        cmsReady
          ? "Manage office locations in sw_offices."
          : "Seed offices below. Connect Supabase to persist edits."
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
            Showing seed offices (read-only)
            {cmsReady ? " — CMS table is empty." : "."}
          </p>
          <DashListView
            storageKey="offices-seed"
            rows={seedOffices}
            rowKey={(r) => r.id}
            emptyTitle="No offices"
            columns={[
              {
                id: "name",
                header: t.list.name,
                searchText: (r) =>
                  `${r.nameEn} ${r.cityEn} ${r.addressEn} ${r.phones.join(" ")}`,
                sortValue: (r) => r.nameEn,
                cell: (r) => (
                  <div>
                    <p className="m-0 font-medium text-ink">
                      {r.nameEn} · {r.cityEn}
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-black/45">
                      {r.addressEn}
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-black/40">
                      {r.phones.join(", ")}
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </>
      ) : (
        <DashListView
          storageKey="offices"
          rows={rows!}
          rowKey={(r) => r.id}
          emptyTitle="No offices"
          columns={[
            {
              id: "name",
              header: t.list.name,
              searchText: (r) =>
                `${r.name_en} ${r.city_en} ${r.address_en} ${r.phones.join(" ")}`,
              sortValue: (r) => r.name_en,
              cell: (r) => (
                <div>
                  <p className="m-0 font-medium text-ink">
                    {r.name_en} · {r.city_en}
                  </p>
                  <p className="m-0 mt-0.5 text-xs text-black/45">
                    {r.address_en}
                  </p>
                  <p className="m-0 mt-0.5 text-xs text-black/40">
                    {r.phones.join(", ")}
                  </p>
                </div>
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
                      await deleteOfficeAction(fd);
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
        title={editing ? "Edit office" : "Add office"}
        size="lg"
      >
        <form
          className="grid gap-3"
          action={async (fd) => {
            try {
              await saveOfficeAction(fd);
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
          <label className="grid gap-1.5">
            <span className={dashLabel}>City key</span>
            <select
              name="city_key"
              defaultValue={editing?.city_key ?? "tashkent"}
              className={dashSelect}
            >
              <option value="tashkent">tashkent</option>
              <option value="samarkand">samarkand</option>
            </select>
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
                <span className={dashLabel}>City {loc}</span>
                <input
                  name={`city_${loc}`}
                  required={localeTab === loc}
                  defaultValue={editing?.[`city_${loc}`] ?? ""}
                  className={dashInput}
                />
              </label>
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
                <span className={dashLabel}>Address {loc}</span>
                <input
                  name={`address_${loc}`}
                  required={localeTab === loc}
                  defaultValue={editing?.[`address_${loc}`] ?? ""}
                  className={dashInput}
                />
              </label>
            </div>
          ))}
          <label className="grid gap-1.5">
            <span className={dashLabel}>Phones (comma-separated)</span>
            <input
              name="phones"
              defaultValue={editing?.phones?.join(", ") ?? ""}
              className={dashInput}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className={dashLabel}>Lat</span>
              <input
                name="lat"
                type="number"
                step="any"
                defaultValue={editing?.lat ?? ""}
                className={dashInput}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={dashLabel}>Lng</span>
              <input
                name="lng"
                type="number"
                step="any"
                defaultValue={editing?.lng ?? ""}
                className={dashInput}
              />
            </label>
          </div>
          <DashImageField
            name="image_url"
            label="Office image"
            defaultUrl={editing?.image_url ?? ""}
            folder="offices"
          />
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
