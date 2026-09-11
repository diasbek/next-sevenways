"use server";

import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import {
  assertProviderId,
  saveProviderCredentials,
} from "@/lib/payments";

export async function saveSettingsAction(formData: FormData) {
  const actor = await requireMutation("settings");
  if (!hasSupabaseAdminConfig()) return;

  const bookingModeRaw = String(formData.get("booking_mode") ?? "lead_only");
  const booking_mode =
    bookingModeRaw === "checkout" ? "checkout" : "lead_only";
  const payments_enabled = formData.get("payments_enabled") === "1";
  const default_currency =
    String(formData.get("default_currency") ?? "USD") === "UZS"
      ? "UZS"
      : "USD";
  const enabled_providers = formData
    .getAll("enabled_providers")
    .map(String)
    .filter((p) => p === "click" || p === "payme" || p === "uzum");

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
    booking_mode,
    payments_enabled,
    enabled_providers,
    default_currency,
  });
  revalidateCms(CMS_TAGS.settings);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "settings.save",
    entityType: "settings",
    entityId: "1",
  });
}

export async function savePaymentCredentialsAction(formData: FormData) {
  const actor = await requireMutation("settings");
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase not configured");
  }

  const provider = assertProviderId(String(formData.get("provider") ?? ""));
  if (!provider) throw new Error("Invalid provider");

  if (provider === "click") {
    await saveProviderCredentials("click", {
      merchantId: String(formData.get("merchantId") ?? ""),
      serviceId: String(formData.get("serviceId") ?? ""),
      merchantUserId: String(formData.get("merchantUserId") ?? ""),
      secretKey: String(formData.get("secretKey") ?? ""),
    });
  } else if (provider === "payme") {
    await saveProviderCredentials("payme", {
      merchantId: String(formData.get("merchantId") ?? ""),
      secretKey: String(formData.get("secretKey") ?? ""),
      testKey: String(formData.get("testKey") ?? ""),
      isTest: formData.get("isTest") === "1",
    });
  } else {
    await saveProviderCredentials("uzum", {
      terminalId: String(formData.get("terminalId") ?? ""),
      apiKey: String(formData.get("apiKey") ?? ""),
      checkoutBaseUrl: String(formData.get("checkoutBaseUrl") ?? ""),
    });
  }

  revalidateCms(CMS_TAGS.settings, ["/dashboard/settings/", "/request/"]);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "payment_credentials.save",
    entityType: "payment_credentials",
    entityId: provider,
  });
}
