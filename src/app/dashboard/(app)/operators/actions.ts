"use server";

import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function saveOperatorAction(formData: FormData) {
  const actor = await requireMutation("operators");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("id_required");

  const sortRaw = String(formData.get("sort_order") ?? "0").trim();
  const sort_order = Number.isFinite(Number(sortRaw)) ? Number(sortRaw) : 0;

  const row = {
    id,
    name_uz: String(formData.get("name_uz") ?? "").trim(),
    name_ru: String(formData.get("name_ru") ?? "").trim(),
    name_en: String(formData.get("name_en") ?? "").trim(),
    role_uz: String(formData.get("role_uz") ?? "").trim(),
    role_ru: String(formData.get("role_ru") ?? "").trim(),
    role_en: String(formData.get("role_en") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    telegram: String(formData.get("telegram") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    is_online: formData.get("is_online") === "1",
    is_published: formData.get("is_published") === "1",
    sort_order,
  };

  if (!row.name_uz || !row.name_ru || !row.name_en) {
    throw new Error("names_required");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_operators").upsert(row);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.operators);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "operator.save",
    entityType: "operator",
    entityId: id,
  });
}

export async function deleteOperatorAction(formData: FormData) {
  const actor = await requireMutation("operators");
  if (!hasSupabaseAdminConfig()) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("id_required");
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_operators").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.operators);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "operator.delete",
    entityType: "operator",
    entityId: id,
  });
}
