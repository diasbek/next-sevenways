import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SITE_CONFIG } from "@/utils/consts";
import { saveSettingsAction } from "./actions";

export default async function SettingsPage() {
  await requireDashboardUser("settings");

  let settings = {
    phone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    telegram_url: SITE_CONFIG.telegramUrl,
    instagram_url: SITE_CONFIG.instagramUrl,
    facebook_url: SITE_CONFIG.facebookUrl,
    hours: SITE_CONFIG.hours,
    address_uz: SITE_CONFIG.address.lineUz,
    address_ru: SITE_CONFIG.address.line,
    address_en: SITE_CONFIG.address.lineEn,
  };

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (data) {
      settings = {
        phone: data.phone || settings.phone,
        email: data.email || settings.email,
        telegram_url: data.telegram_url || settings.telegram_url,
        instagram_url: data.instagram_url || settings.instagram_url,
        facebook_url: data.facebook_url || settings.facebook_url,
        hours: data.hours || settings.hours,
        address_uz: data.address_uz || settings.address_uz,
        address_ru: data.address_ru || settings.address_ru,
        address_en: data.address_en || settings.address_en,
      };
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <form action={saveSettingsAction} className="max-w-xl space-y-4 rounded-2xl border border-black/8 bg-white p-5">
        {(
          [
            ["phone", "Phone"],
            ["email", "Email"],
            ["telegram_url", "Telegram URL"],
            ["instagram_url", "Instagram URL"],
            ["facebook_url", "Facebook URL"],
            ["hours", "Hours"],
            ["address_uz", "Address (UZ)"],
            ["address_ru", "Address (RU)"],
            ["address_en", "Address (EN)"],
          ] as const
        ).map(([name, label]) => (
          <label key={name} className="block text-sm">
            <span className="mb-1 block font-medium">{label}</span>
            <input
              name={name}
              defaultValue={settings[name]}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={!hasSupabaseAdminConfig()}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save
        </button>
      </form>
    </div>
  );
}
