import { NextResponse } from "next/server";
import {
  assertProviderId,
  createPaymentOrder,
  getSitePaymentSettings,
  isPaymentsEnvEnabled,
  pickProvider,
  type MoneyCurrency,
} from "@/lib/payments";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig()) {
      return NextResponse.json({ error: "supabase_missing" }, { status: 503 });
    }
    if (!isPaymentsEnvEnabled()) {
      return NextResponse.json({ error: "payments_disabled_env" }, { status: 503 });
    }

    const settings = await getSitePaymentSettings();
    if (settings.bookingMode !== "checkout" || !settings.paymentsEnabled) {
      return NextResponse.json({ error: "checkout_disabled" }, { status: 403 });
    }

    const body = (await request.json()) as {
      amount?: number;
      currency?: string;
      provider?: string;
      offerId?: string;
      description?: string;
      name?: string;
      phone?: string;
      email?: string;
      returnUrl?: string;
    };

    const amount = Number(body.amount);
    const currency = (body.currency === "UZS" ? "UZS" : "USD") as MoneyCurrency;
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }

    const preferred = body.provider ? assertProviderId(body.provider) : null;
    const provider = await pickProvider(
      currency,
      settings.enabledProviders,
      preferred ?? undefined,
    );
    if (!provider) {
      return NextResponse.json(
        { error: "no_provider_for_currency", currency },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;
    const returnUrl =
      body.returnUrl?.startsWith("http")
        ? body.returnUrl
        : `${origin}/request/?paid=1`;

    const order = await createPaymentOrder({
      amount,
      currency,
      provider: provider.id,
      offerId: body.offerId,
      description: body.description || "Seven Ways tour",
      customerName: body.name,
      customerPhone: body.phone,
      customerEmail: body.email,
      returnUrl,
    });

    const result = await provider.createPayment({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description: order.description || "Seven Ways",
      returnUrl,
      customer: {
        name: body.name,
        phone: body.phone,
        email: body.email,
      },
    });

    if (result.externalId) {
      const { updatePaymentOrderStatus } = await import("@/lib/payments/orders");
      await updatePaymentOrderStatus(order.id, "waiting", result.externalId);
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      provider: provider.id,
      redirectUrl: result.redirectUrl,
    });
  } catch (err) {
    console.error("[payments:create]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "server_error" },
      { status: 500 },
    );
  }
}
