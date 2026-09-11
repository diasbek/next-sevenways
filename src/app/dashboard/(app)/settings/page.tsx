import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SITE_CONFIG } from "@/utils/consts";
import { saveSettingsAction } from "./actions";
import { DashCrudPage } from "@/components/dashboard/ds";
import { PaymentCredentialsForms } from "@/components/dashboard/PaymentCredentialsForms";
import {
  dashBtnPrimary,
  dashCardPad,
  dashHint,
  dashInput,
  dashLabel,
  dashSelect,
} from "@/styles/dashboard";
import {
  hasPaymentsSecretsKey,
  listCredentialsAdminViews,
  type BookingMode,
  type MoneyCurrency,
  type PaymentProviderId,
} from "@/lib/payments";

export default async function SettingsPage() {
  const user = await requireDashboardUser("settings");
  const canWrite = canMutate(user.role, "settings");

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
    booking_mode: "lead_only" as BookingMode,
    payments_enabled: false,
    enabled_providers: [] as PaymentProviderId[],
    default_currency: "USD" as MoneyCurrency,
  };

  let credentialViews = await listCredentialsAdminViews();

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
        booking_mode:
          data.booking_mode === "checkout" ? "checkout" : "lead_only",
        payments_enabled: Boolean(data.payments_enabled),
        enabled_providers: Array.isArray(data.enabled_providers)
          ? (data.enabled_providers as PaymentProviderId[])
          : [],
        default_currency:
          data.default_currency === "UZS" ? "UZS" : "USD",
      };
    }
    credentialViews = await listCredentialsAdminViews();
  }

  const fields = [
    ["phone", "Phone"],
    ["email", "Email"],
    ["telegram_url", "Telegram URL"],
    ["instagram_url", "Instagram URL"],
    ["facebook_url", "Facebook URL"],
    ["hours", "Hours"],
    ["address_uz", "Address (UZ)"],
    ["address_ru", "Address (RU)"],
    ["address_en", "Address (EN)"],
  ] as const;

  const providers: PaymentProviderId[] = ["click", "payme", "uzum"];

  return (
    <DashCrudPage
      title="Settings"
      lead="Site contacts, booking mode and payment providers."
    >
      <div className="mx-auto max-w-xl space-y-6">
        <form action={saveSettingsAction} className="space-y-6">
          <div className={`${dashCardPad} space-y-4`}>
            <p className="m-0 text-sm font-semibold text-ink">Contacts</p>
            {fields.map(([name, label]) => (
              <label key={name} className="grid gap-1.5">
                <span className={dashLabel}>{label}</span>
                <input
                  name={name}
                  defaultValue={settings[name]}
                  disabled={!canWrite}
                  className={dashInput}
                />
              </label>
            ))}
          </div>

          <div className={`${dashCardPad} space-y-4`}>
            <p className="m-0 text-sm font-semibold text-ink">
              Booking & payments
            </p>
            <p className={dashHint}>
              Lead only = заявка менеджеру. Checkout = онлайн-оплата через
              Click / Payme / Uzum (credentials ниже + PAYMENTS_ENABLED=1).
              Humo / Uzcard / Visa / Mastercard принимаются через эти PSP.
            </p>

            <fieldset className="space-y-2">
              <legend className={dashLabel}>Booking mode</legend>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="booking_mode"
                  value="lead_only"
                  defaultChecked={settings.booking_mode === "lead_only"}
                  disabled={!canWrite}
                />
                Lead only (заявка)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="booking_mode"
                  value="checkout"
                  defaultChecked={settings.booking_mode === "checkout"}
                  disabled={!canWrite}
                />
                Checkout (сразу оплата)
              </label>
            </fieldset>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="payments_enabled"
                value="1"
                defaultChecked={settings.payments_enabled}
                disabled={!canWrite}
              />
              Enable online payments (CMS)
            </label>

            <label className="grid gap-1.5">
              <span className={dashLabel}>Default currency</span>
              <select
                name="default_currency"
                defaultValue={settings.default_currency}
                disabled={!canWrite}
                className={dashSelect}
              >
                <option value="USD">USD</option>
                <option value="UZS">UZS</option>
              </select>
            </label>

            <fieldset className="space-y-2">
              <legend className={dashLabel}>Enabled providers</legend>
              {providers.map((id) => (
                <label
                  key={id}
                  className="flex items-center gap-2 text-sm capitalize"
                >
                  <input
                    type="checkbox"
                    name="enabled_providers"
                    value={id}
                    defaultChecked={settings.enabled_providers.includes(id)}
                    disabled={!canWrite}
                  />
                  {id}
                  <span className="text-black/40">
                    {id === "uzum" ? "(UZS + USD)" : "(UZS)"}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>

          <button
            type="submit"
            disabled={!canWrite || !hasSupabaseAdminConfig()}
            className={dashBtnPrimary}
          >
            Save settings
          </button>
        </form>

        <PaymentCredentialsForms
          views={credentialViews}
          canWrite={canWrite && hasSupabaseAdminConfig()}
          secretsKeyReady={hasPaymentsSecretsKey()}
        />
      </div>
    </DashCrudPage>
  );
}
