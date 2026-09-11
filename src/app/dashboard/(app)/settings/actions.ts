"use server";

import { revalidatePath } from "next/cache";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function saveSettingsAction(formData: FormData) {
  await requireMutation("settings");
  if (!hasSupabaseAdminConfig()) return;

  const admin = createSupabaseAdminClient();
  await admin.from("sw_site_settings").upsert({
    id: 1,
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    telegram_url: String(formData.get("telegram_url") ?? ""),
    instagram_url: String(formData.get("instagram_url") ?? ""),
    facebook_url: String(formData.get("facebook_url") ?? ""),
    hours: String(formData.get("hours") ?? ""),
    address_uz: String(formData.get("address_uz") ?? ""),
    address_ru: String(formData.get("address_ru") ?? ""),
    address_en: String(formData.get("address_en") ?? ""),
  });
  revalidatePath("/dashboard/settings/");
}
