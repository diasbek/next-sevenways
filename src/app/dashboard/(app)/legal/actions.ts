"use server";

import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function saveLegalPageAction(formData: FormData) {
  const actor = await requireMutation("legal");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const slug = String(formData.get("slug") ?? "").trim();
  if (slug !== "privacy" && slug !== "terms") throw new Error("invalid_slug");

  const row = {
    slug,
    title_uz: String(formData.get("title_uz") ?? "").trim(),
    title_ru: String(formData.get("title_ru") ?? "").trim(),
    title_en: String(formData.get("title_en") ?? "").trim(),
    body_uz: String(formData.get("body_uz") ?? "").trim(),
    body_ru: String(formData.get("body_ru") ?? "").trim(),
    body_en: String(formData.get("body_en") ?? "").trim(),
  };

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_legal_pages").upsert(row);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.legal);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "legal.save",
    entityType: "legal",
    entityId: slug,
  });
}
