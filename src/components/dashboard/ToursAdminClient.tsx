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
import {
  deleteDestinationAction,
  deleteOfferAction,
  saveDestinationAction,
  saveOfferAction,
} from "@/app/dashboard/(app)/tours/actions";
import {
  dashBtnPrimary,
  dashBtnSecondary,
  dashCardPad,
  dashInput,
  dashLabel,
  dashSelect,
} from "@/styles/dashboard";
import { formatMoney } from "@/lib/payments/amount";

export type DestinationAdminRow = {
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  blurb_uz: string;
  blurb_ru: string;
  blurb_en: string;
  from_price_usd: number | null;
  from_currency?: string | null;
  country_code: string | null;
  is_published: boolean;
  sort_order: number;
};

export type OfferAdminRow = {
  id: string;
  destination_slug: string;
  hotel: string;
  nights: number;
  currency?: string;
  price_per_person_usd: number;
  price_two_usd: number;
  is_published: boolean;
  featured: boolean;
};

export type SeedDestination = {
  slug: string;
  nameEn: string;
  fromPriceUsd: number;
  fromCurrency?: string;
};

export type SeedOffer = {
  id: string;
  hotel: string;
  destinationSlug: string;
  pricePerPersonUsd: number;
  currency?: string;
};

export function ToursAdminClient({
  destinations,
  offers,
  seedDestinations,
  seedOffers,
  canWrite,
  cmsReady,
}: {
  destinations: DestinationAdminRow[];
  offers: OfferAdminRow[];
  seedDestinations: SeedDestination[];
  seedOffers: SeedOffer[];
  canWrite: boolean;
  cmsReady: boolean;
}) {
  const t = useDashT();
  const router = useRouter();
  const [destOpen, setDestOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<DestinationAdminRow | null>(
    null,
  );
  const [editingOffer, setEditingOffer] = useState<OfferAdminRow | null>(null);

  const showSeed = !cmsReady || (destinations.length === 0 && offers.length === 0);

  return (
    <DashCrudPage
      title="Tours catalogue"
      lead={
        cmsReady
          ? "CMS overlay for destinations and offers (sw_destinations / sw_tour_offers)."
          : "Seed data ships in code. Connect Supabase to edit CMS tables."
      }
      primaryAction={
        canWrite && cmsReady ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={dashBtnSecondary}
              onClick={() => {
                setEditingDest(null);
                setDestOpen(true);
              }}
            >
              Add destination
            </button>
            <button
              type="button"
              className={dashBtnPrimary}
              onClick={() => {
                setEditingOffer(null);
                setOfferOpen(true);
              }}
            >
              Add offer
            </button>
          </div>
        ) : undefined
      }
    >
      {showSeed ? (
        <p className={`${dashCardPad} text-sm text-black/55`}>
          Showing seed catalogue (read-only)
          {cmsReady ? " — CMS tables are empty." : "."}
        </p>
      ) : null}

      {showSeed ? (
        <>
          <DashListView
            storageKey="tours-seed-dest"
            title="Destinations (seed)"
            rows={seedDestinations}
            rowKey={(r) => r.slug}
            emptyTitle="No destinations"
            columns={[
              {
                id: "name",
                header: t.list.name,
                searchText: (r) => `${r.nameEn} ${r.slug}`,
                sortValue: (r) => r.nameEn,
                cell: (r) => (
                  <span className="font-medium text-ink">{r.nameEn}</span>
                ),
              },
              {
                id: "slug",
                header: "Slug",
                sortValue: (r) => r.slug,
                cell: (r) => (
                  <span className="font-mono text-xs text-black/45">
                    /tours/{r.slug}/
                  </span>
                ),
              },
              {
                id: "price",
                header: "From USD",
                sortValue: (r) => r.fromPriceUsd,
                cell: (r) => (
                  <span>
                    {formatMoney(
                      r.fromPriceUsd,
                      (r.fromCurrency as "UZS" | "USD") || "USD",
                    )}
                  </span>
                ),
              },
            ]}
          />
          <DashListView
            storageKey="tours-seed-offers"
            title="Offers (seed)"
            rows={seedOffers}
            rowKey={(r) => r.id}
            emptyTitle="No offers"
            columns={[
              {
                id: "hotel",
                header: "Hotel",
                searchText: (r) => `${r.hotel} ${r.destinationSlug}`,
                sortValue: (r) => r.hotel,
                cell: (r) => (
                  <span className="font-medium text-ink">{r.hotel}</span>
                ),
              },
              {
                id: "dest",
                header: "Destination",
                sortValue: (r) => r.destinationSlug,
                cell: (r) => (
                  <span className="text-xs text-black/55">
                    {r.destinationSlug}
                  </span>
                ),
              },
              {
                id: "price",
                header: "USD / person",
                sortValue: (r) => r.pricePerPersonUsd,
                cell: (r) => (
                  <span>
                    {formatMoney(
                      r.pricePerPersonUsd,
                      (r.currency as "UZS" | "USD") || "USD",
                    )}
                  </span>
                ),
              },
            ]}
          />
        </>
      ) : (
        <>
          <DashListView
            storageKey="tours-dest"
            title="Destinations"
            rows={destinations}
            rowKey={(r) => r.slug}
            emptyTitle="No destinations"
            columns={[
              {
                id: "name",
                header: t.list.name,
                searchText: (r) =>
                  `${r.name_en} ${r.name_ru} ${r.name_uz} ${r.slug}`,
                sortValue: (r) => r.name_en,
                cell: (r) => (
                  <div>
                    <p className="m-0 font-medium text-ink">{r.name_en}</p>
                    <p className="m-0 mt-0.5 font-mono text-xs text-black/40">
                      {r.slug}
                    </p>
                  </div>
                ),
              },
              {
                id: "price",
                header: "From USD",
                sortValue: (r) => r.from_price_usd ?? -1,
                cell: (r) => (
                  <span>
                    {r.from_price_usd != null
                      ? formatMoney(
                          r.from_price_usd,
                          (r.from_currency as "UZS" | "USD") || "USD",
                        )
                      : "—"}
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
                        setEditingDest(row);
                        setDestOpen(true);
                      }}
                      onDelete={async () => {
                        const fd = new FormData();
                        fd.set("slug", row.slug);
                        await deleteDestinationAction(fd);
                        router.refresh();
                      }}
                    />
                  )
                : undefined
            }
          />

          <DashListView
            storageKey="tours-offers"
            title="Offers"
            rows={offers}
            rowKey={(r) => r.id}
            emptyTitle="No offers"
            columns={[
              {
                id: "hotel",
                header: "Hotel",
                searchText: (r) => `${r.hotel} ${r.destination_slug} ${r.id}`,
                sortValue: (r) => r.hotel,
                cell: (r) => (
                  <div>
                    <p className="m-0 font-medium text-ink">{r.hotel}</p>
                    <p className="m-0 mt-0.5 text-xs text-black/40">
                      {r.destination_slug}
                    </p>
                  </div>
                ),
              },
              {
                id: "nights",
                header: "Nights",
                sortValue: (r) => r.nights,
                cell: (r) => <span>{r.nights}</span>,
              },
              {
                id: "price",
                header: "USD / person",
                sortValue: (r) => r.price_per_person_usd,
                cell: (r) => (
                  <span>
                    {formatMoney(
                      r.price_per_person_usd,
                      (r.currency as "UZS" | "USD") || "USD",
                    )}
                  </span>
                ),
              },
            ]}
            actions={
              canWrite
                ? (row) => (
                    <DashRowActions
                      onEdit={() => {
                        setEditingOffer(row);
                        setOfferOpen(true);
                      }}
                      onDelete={async () => {
                        const fd = new FormData();
                        fd.set("id", row.id);
                        await deleteOfferAction(fd);
                        router.refresh();
                      }}
                    />
                  )
                : undefined
            }
          />
        </>
      )}

      <DashModal
        open={destOpen}
        onOpenChange={setDestOpen}
        title={editingDest ? "Edit destination" : "Add destination"}
        size="lg"
      >
        <form
          className="grid gap-3"
          action={async (fd) => {
            try {
              await saveDestinationAction(fd);
              toast.success(t.form.successDefault);
              setDestOpen(false);
              router.refresh();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : t.errors.saveFailed,
              );
            }
          }}
        >
          <label className="grid gap-1.5">
            <span className={dashLabel}>Slug</span>
            <input
              name="slug"
              required
              defaultValue={editingDest?.slug ?? ""}
              readOnly={Boolean(editingDest)}
              className={dashInput}
            />
          </label>
          {(["uz", "ru", "en"] as const).map((loc) => (
            <label key={loc} className="grid gap-1.5">
              <span className={dashLabel}>Name {loc.toUpperCase()}</span>
              <input
                name={`name_${loc}`}
                required
                defaultValue={editingDest?.[`name_${loc}`] ?? ""}
                className={dashInput}
              />
            </label>
          ))}
          {(["uz", "ru", "en"] as const).map((loc) => (
            <label key={`b-${loc}`} className="grid gap-1.5">
              <span className={dashLabel}>Blurb {loc.toUpperCase()}</span>
              <textarea
                name={`blurb_${loc}`}
                rows={2}
                defaultValue={editingDest?.[`blurb_${loc}`] ?? ""}
                className={dashInput}
              />
            </label>
          ))}
          <label className="grid gap-1.5">
            <span className={dashLabel}>From price</span>
            <input
              name="from_price_usd"
              type="number"
              step="0.01"
              defaultValue={editingDest?.from_price_usd ?? ""}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>From currency</span>
            <select
              name="from_currency"
              defaultValue={editingDest?.from_currency ?? "USD"}
              className={dashSelect}
            >
              <option value="USD">USD</option>
              <option value="UZS">UZS</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Country code</span>
            <input
              name="country_code"
              defaultValue={editingDest?.country_code ?? ""}
              className={dashInput}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="is_published"
              value="1"
              defaultChecked={editingDest?.is_published ?? true}
              className="size-4 rounded border-black/20"
            />
            Published
          </label>
          <button type="submit" className={`${dashBtnPrimary} w-fit`}>
            {t.common.save}
          </button>
        </form>
      </DashModal>

      <DashModal
        open={offerOpen}
        onOpenChange={setOfferOpen}
        title={editingOffer ? "Edit offer" : "Add offer"}
        size="lg"
      >
        <form
          className="grid gap-3"
          action={async (fd) => {
            try {
              await saveOfferAction(fd);
              toast.success(t.form.successDefault);
              setOfferOpen(false);
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
              defaultValue={editingOffer?.id ?? ""}
              readOnly={Boolean(editingOffer)}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Destination slug</span>
            <input
              name="destination_slug"
              required
              defaultValue={editingOffer?.destination_slug ?? ""}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Hotel</span>
            <input
              name="hotel"
              required
              defaultValue={editingOffer?.hotel ?? ""}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Nights</span>
            <input
              name="nights"
              type="number"
              required
              defaultValue={editingOffer?.nights ?? 7}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Currency</span>
            <select
              name="currency"
              defaultValue={editingOffer?.currency ?? "USD"}
              className={dashSelect}
            >
              <option value="USD">USD</option>
              <option value="UZS">UZS</option>
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Price / person</span>
            <input
              name="price_per_person_usd"
              type="number"
              step="0.01"
              required
              defaultValue={editingOffer?.price_per_person_usd ?? ""}
              className={dashInput}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={dashLabel}>Price two</span>
            <input
              name="price_two_usd"
              type="number"
              step="0.01"
              required
              defaultValue={editingOffer?.price_two_usd ?? ""}
              className={dashInput}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="featured"
              value="1"
              defaultChecked={editingOffer?.featured ?? false}
              className="size-4 rounded border-black/20"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="is_published"
              value="1"
              defaultChecked={editingOffer?.is_published ?? true}
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
