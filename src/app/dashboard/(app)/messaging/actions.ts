"use server";

import { revalidatePath } from "next/cache";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function saveMessagingProviderAction(formData: FormData) {
  await requireMutation("messaging");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("id_required");

  const channel = String(formData.get("channel") ?? "").trim();
  if (!["telegram", "email", "sms"].includes(channel)) {
    throw new Error("invalid_channel");
  }

  const label = String(formData.get("label") ?? "").trim() || id;
  const is_active = formData.get("is_active") === "1";
  const configRaw = String(formData.get("config") ?? "{}").trim() || "{}";

  let config: Record<string, unknown>;
  try {
    const parsed = JSON.parse(configRaw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("invalid");
    }
    config = parsed as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON config");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_messaging_providers").upsert({
    id,
    channel,
    label,
    is_active,
    config,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/messaging/");
}
