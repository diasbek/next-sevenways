"use server";

import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import {
  SITE_COPY_KEYS,
  type SiteCopyKey,
} from "@/lib/site-copy/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

function isSiteCopyKey(value: string): value is SiteCopyKey {
  return (SITE_COPY_KEYS as readonly string[]).includes(value);
}

/** Upsert one locale bucket under sw_site_copy.payload[locale]. */
export async function saveSiteCopySectionAction(formData: FormData) {
  const actor = await requireMutation("content");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const key = String(formData.get("key") ?? "").trim();
  const locale = String(formData.get("locale") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim() || key;
  if (!isSiteCopyKey(key)) throw new Error("invalid_key");
  if (locale !== "uz" && locale !== "ru" && locale !== "en") {
    throw new Error("invalid_locale");
  }

  let localePayload: unknown;
  try {
    localePayload = JSON.parse(String(formData.get("payload_json") ?? "null"));
  } catch {
    throw new Error("invalid_json");
  }

  if (
    localePayload == null ||
    (typeof localePayload !== "object")
  ) {
    throw new Error("payload_must_be_object_or_array");
  }

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("sw_site_copy")
    .select("payload")
    .eq("key", key)
    .maybeSingle();

  const prev =
    existing?.payload &&
    typeof existing.payload === "object" &&
    !Array.isArray(existing.payload)
      ? (existing.payload as Record<string, unknown>)
      : {};

  let nextLocaleValue: unknown;
  if (Array.isArray(localePayload)) {
    nextLocaleValue = localePayload;
  } else {
    const prevLocale = prev[locale];
    const prevObj =
      prevLocale && typeof prevLocale === "object" && !Array.isArray(prevLocale)
        ? (prevLocale as Record<string, unknown>)
        : {};
    nextLocaleValue = {
      ...prevObj,
      ...(localePayload as Record<string, unknown>),
    };
  }

  const payload = {
    ...prev,
    [locale]: nextLocaleValue,
  };

  const { error } = await admin.from("sw_site_copy").upsert({
    key,
    label,
    payload,
    updated_by: actor.id === "local" ? null : actor.id,
  });
  if (error) throw new Error(error.message);

  revalidateCms(CMS_TAGS.siteCopy);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "site_copy.save",
    entityType: "site_copy",
    entityId: key,
    detail: { locale },
  });
}
