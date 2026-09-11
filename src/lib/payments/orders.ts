import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import type {
  BookingMode,
  MoneyCurrency,
  PaymentProviderId,
  PaymentStatus,
} from "./types";

export type PaymentOrderRow = {
  id: string;
  lead_id: string | null;
  offer_id: string | null;
  amount: number;
  currency: MoneyCurrency;
  provider: PaymentProviderId;
  status: PaymentStatus;
  external_id: string | null;
  description: string | null;
  payload: Record<string, unknown>;
};

export type SitePaymentSettings = {
  bookingMode: BookingMode;
  paymentsEnabled: boolean;
  enabledProviders: PaymentProviderId[];
  defaultCurrency: MoneyCurrency;
};

export async function getSitePaymentSettings(): Promise<SitePaymentSettings> {
  const defaults: SitePaymentSettings = {
    bookingMode: "lead_only",
    paymentsEnabled: false,
    enabledProviders: [],
    defaultCurrency: "USD",
  };
  if (!hasSupabaseAdminConfig()) return defaults;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_site_settings")
      .select(
        "booking_mode, payments_enabled, enabled_providers, default_currency",
      )
      .eq("id", 1)
      .maybeSingle();
    if (!data) return defaults;
    const providers = Array.isArray(data.enabled_providers)
      ? (data.enabled_providers as string[]).filter(
          (p): p is PaymentProviderId =>
            p === "click" || p === "payme" || p === "uzum",
        )
      : [];
    return {
      bookingMode:
        data.booking_mode === "checkout" ? "checkout" : "lead_only",
      paymentsEnabled: Boolean(data.payments_enabled),
      enabledProviders: providers,
      defaultCurrency: data.default_currency === "UZS" ? "UZS" : "USD",
    };
  } catch {
    return defaults;
  }
}

function newOrderId() {
  return `pay_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPaymentOrder(input: {
  amount: number;
  currency: MoneyCurrency;
  provider: PaymentProviderId;
  offerId?: string;
  leadId?: string;
  description?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  returnUrl?: string;
  payload?: Record<string, unknown>;
}): Promise<PaymentOrderRow> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin not configured");
  }
  const admin = createSupabaseAdminClient();
  const id = newOrderId();
  const row = {
    id,
    lead_id: input.leadId ?? null,
    offer_id: input.offerId ?? null,
    amount: input.amount,
    currency: input.currency,
    provider: input.provider,
    status: "pending" as const,
    description: input.description ?? null,
    customer_name: input.customerName ?? null,
    customer_phone: input.customerPhone ?? null,
    customer_email: input.customerEmail ?? null,
    return_url: input.returnUrl ?? null,
    payload: input.payload ?? {},
  };
  const { data, error } = await admin
    .from("sw_payment_orders")
    .insert(row)
    .select(
      "id, lead_id, offer_id, amount, currency, provider, status, external_id, description, payload",
    )
    .single();
  if (error || !data) throw new Error(error?.message ?? "insert failed");
  return {
    id: data.id,
    lead_id: data.lead_id,
    offer_id: data.offer_id,
    amount: Number(data.amount),
    currency: data.currency,
    provider: data.provider,
    status: data.status,
    external_id: data.external_id,
    description: data.description,
    payload: (data.payload ?? {}) as Record<string, unknown>,
  };
}

export async function findPaymentOrder(
  orderId: string,
): Promise<PaymentOrderRow | null> {
  if (!hasSupabaseAdminConfig()) return null;
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("sw_payment_orders")
    .select(
      "id, lead_id, offer_id, amount, currency, provider, status, external_id, description, payload",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    lead_id: data.lead_id,
    offer_id: data.offer_id,
    amount: Number(data.amount),
    currency: data.currency,
    provider: data.provider,
    status: data.status,
    external_id: data.external_id,
    description: data.description,
    payload: (data.payload ?? {}) as Record<string, unknown>,
  };
}

export async function findPaymentOrderByExternal(
  externalId: string,
): Promise<PaymentOrderRow | null> {
  if (!hasSupabaseAdminConfig()) return null;
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("sw_payment_orders")
    .select(
      "id, lead_id, offer_id, amount, currency, provider, status, external_id, description, payload",
    )
    .eq("external_id", externalId)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    lead_id: data.lead_id,
    offer_id: data.offer_id,
    amount: Number(data.amount),
    currency: data.currency,
    provider: data.provider,
    status: data.status,
    external_id: data.external_id,
    description: data.description,
    payload: (data.payload ?? {}) as Record<string, unknown>,
  };
}

export async function updatePaymentOrderStatus(
  orderId: string,
  status: PaymentStatus,
  externalId?: string,
) {
  if (!hasSupabaseAdminConfig()) return;
  const admin = createSupabaseAdminClient();
  const patch: Record<string, unknown> = { status };
  if (externalId) patch.external_id = externalId;
  if (status === "paid") patch.paid_at = new Date().toISOString();
  await admin.from("sw_payment_orders").update(patch).eq("id", orderId);
}

export const paymeOrderStore = {
  async findById(orderId: string) {
    const row = await findPaymentOrder(orderId);
    if (!row) return null;
    return {
      id: row.id,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
    };
  },
  async markWaiting(orderId: string, externalId: string) {
    await updatePaymentOrderStatus(orderId, "waiting", externalId);
  },
  async markPaid(orderId: string, externalId: string) {
    await updatePaymentOrderStatus(orderId, "paid", externalId);
  },
  async markCancelled(orderId: string, externalId?: string) {
    await updatePaymentOrderStatus(orderId, "cancelled", externalId);
  },
};
