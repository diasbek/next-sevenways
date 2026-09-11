"use server";

import { revalidatePath } from "next/cache";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

function revalidateOffices() {
  revalidatePath("/dashboard/offices/");
}

function parsePhones(raw: string) {
  return raw
    .split(/[,;\n]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function saveOfficeAction(formData: FormData) {
  await requireMutation("offices");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("id_required");

  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const lat = latRaw ? Number(latRaw) : null;
  const lng = lngRaw ? Number(lngRaw) : null;

  const row = {
    id,
    city_uz: String(formData.get("city_uz") ?? "").trim(),
    city_ru: String(formData.get("city_ru") ?? "").trim(),
    city_en: String(formData.get("city_en") ?? "").trim(),
    name_uz: String(formData.get("name_uz") ?? "").trim(),
    name_ru: String(formData.get("name_ru") ?? "").trim(),
    name_en: String(formData.get("name_en") ?? "").trim(),
    address_uz: String(formData.get("address_uz") ?? "").trim(),
    address_ru: String(formData.get("address_ru") ?? "").trim(),
    address_en: String(formData.get("address_en") ?? "").trim(),
    phones: parsePhones(String(formData.get("phones") ?? "")),
    lat: lat != null && Number.isFinite(lat) ? lat : null,
    lng: lng != null && Number.isFinite(lng) ? lng : null,
    is_published: formData.get("is_published") === "1",
  };

  if (!row.name_uz || !row.name_ru || !row.name_en) {
    throw new Error("names_required");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_offices").upsert(row);
  if (error) throw new Error(error.message);
  revalidateOffices();
}

export async function deleteOfficeAction(formData: FormData) {
  await requireMutation("offices");
  if (!hasSupabaseAdminConfig()) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("id_required");
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_offices").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateOffices();
}
