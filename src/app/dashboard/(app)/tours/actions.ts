"use server";

import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

function parseCategories(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((c) => c.trim().toLowerCase())
    .filter((c) => c === "beach" || c === "excursion");
}

export async function saveDestinationAction(formData: FormData) {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("slug_required");

  const categories = parseCategories(String(formData.get("categories") ?? ""));
  const cover_url = String(formData.get("cover_url") ?? "").trim() || null;

  const row = {
    slug,
    name_uz: String(formData.get("name_uz") ?? "").trim(),
    name_ru: String(formData.get("name_ru") ?? "").trim(),
    name_en: String(formData.get("name_en") ?? "").trim(),
    blurb_uz: String(formData.get("blurb_uz") ?? "").trim(),
    blurb_ru: String(formData.get("blurb_ru") ?? "").trim(),
    blurb_en: String(formData.get("blurb_en") ?? "").trim(),
    from_price_usd: (() => {
      const raw = String(formData.get("from_price_usd") ?? "").trim();
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    })(),
    from_price: (() => {
      const raw = String(formData.get("from_price_usd") ?? "").trim();
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    })(),
    from_currency:
      String(formData.get("from_currency") ?? "USD") === "UZS" ? "UZS" : "USD",
    country_code: String(formData.get("country_code") ?? "").trim() || null,
    cover_url,
    categories,
    is_published: formData.get("is_published") === "1",
  };

  if (!row.name_uz || !row.name_ru || !row.name_en) {
    throw new Error("names_required");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_destinations").upsert(row);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "destination.save",
    entityType: "destination",
    entityId: slug,
  });
}

export async function deleteDestinationAction(formData: FormData) {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("slug_required");
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_destinations").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "destination.delete",
    entityType: "destination",
    entityId: slug,
  });
}

export async function saveResortAction(formData: FormData) {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const slug = String(formData.get("slug") ?? "").trim();
  const destination_slug = String(formData.get("destination_slug") ?? "").trim();
  if (!slug || !destination_slug) throw new Error("slug_required");

  const row = {
    slug,
    destination_slug,
    name_uz: String(formData.get("name_uz") ?? "").trim(),
    name_ru: String(formData.get("name_ru") ?? "").trim(),
    name_en: String(formData.get("name_en") ?? "").trim(),
    blurb_uz: String(formData.get("blurb_uz") ?? "").trim(),
    blurb_ru: String(formData.get("blurb_ru") ?? "").trim(),
    blurb_en: String(formData.get("blurb_en") ?? "").trim(),
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    is_published: formData.get("is_published") === "1",
  };

  if (!row.name_uz || !row.name_ru || !row.name_en) {
    throw new Error("names_required");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_resorts").upsert(row);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "resort.save",
    entityType: "resort",
    entityId: slug,
  });
}

export async function deleteResortAction(formData: FormData) {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) throw new Error("slug_required");
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_resorts").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "resort.delete",
    entityType: "resort",
    entityId: slug,
  });
}

export async function saveOfferAction(formData: FormData) {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const id = String(formData.get("id") ?? "").trim();
  const destination_slug = String(formData.get("destination_slug") ?? "").trim();
  const hotel = String(formData.get("hotel") ?? "").trim();
  const nights = Number(formData.get("nights") ?? 0);
  const price_per_person_usd = Number(formData.get("price_per_person_usd") ?? 0);
  const price_two_usd = Number(formData.get("price_two_usd") ?? 0);
  const currency =
    String(formData.get("currency") ?? "USD") === "UZS" ? "UZS" : "USD";

  if (!id || !destination_slug || !hotel) throw new Error("Invalid offer");
  if (!Number.isFinite(nights) || nights < 1) throw new Error("Invalid nights");
  if (!Number.isFinite(price_per_person_usd) || !Number.isFinite(price_two_usd)) {
    throw new Error("Invalid price");
  }

  const row = {
    id,
    destination_slug,
    hotel,
    nights,
    currency,
    price_per_person_usd,
    price_two_usd,
    price_per_person: price_per_person_usd,
    price_two: price_two_usd,
    featured: formData.get("featured") === "1",
    is_published: formData.get("is_published") === "1",
  };

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_tour_offers").upsert(row);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "offer.save",
    entityType: "offer",
    entityId: id,
    detail: { featured: row.featured },
  });
}

export async function deleteOfferAction(formData: FormData) {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("id_required");
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_tour_offers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "offer.delete",
    entityType: "offer",
    entityId: id,
  });
}
