import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
  PaymentStatus,
} from "../../types";
import { getUzumCredentials } from "../../credentials";

export async function isUzumConfigured(): Promise<boolean> {
  const c = await getUzumCredentials();
  return Boolean(c.terminalId && c.apiKey);
}

/**
 * Uzum Checkout — register payment session.
 * Docs: https://developer.uzumbank.uz/en/checkout
 * Supports UZS (and USD when contract allows — declared in supportedCurrencies).
 */
export async function createUzumPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  const { checkoutBaseUrl, terminalId, apiKey } = await getUzumCredentials();
  if (!terminalId || !apiKey) throw new Error("Uzum is not configured");

  const baseUrl = checkoutBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/api/v1/payment/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Terminal-Id": terminalId,
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      amount: Math.round(input.amount * (input.currency === "UZS" ? 1 : 100)),
      currency: input.currency === "USD" ? 840 : 860,
      orderId: input.orderId,
      description: input.description,
      paymentSuccessUrl: input.returnUrl,
      paymentFailUrl: input.returnUrl,
      viewType: "REDIRECT",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Uzum register failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    orderId?: string;
    paymentRedirectUrl?: string;
    redirectUrl?: string;
    id?: string;
  };

  const redirectUrl = data.paymentRedirectUrl || data.redirectUrl;
  if (!redirectUrl) throw new Error("Uzum did not return redirect URL");

  return {
    redirectUrl,
    externalId: data.orderId || data.id || input.orderId,
  };
}

export async function getUzumStatus(externalId: string): Promise<PaymentStatus> {
  const { checkoutBaseUrl, terminalId, apiKey } = await getUzumCredentials();
  if (!terminalId || !apiKey) return "pending";

  const baseUrl = checkoutBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${baseUrl}/api/v1/payment/getOrderStatus?orderId=${encodeURIComponent(externalId)}`,
    {
      headers: {
        "X-Terminal-Id": terminalId,
        "X-API-Key": apiKey,
      },
    },
  );
  if (!res.ok) return "pending";
  const data = (await res.json()) as { status?: string; orderStatus?: string };
  const s = (data.status || data.orderStatus || "").toUpperCase();
  if (s.includes("SUCCESS") || s.includes("PAID") || s === "COMPLETED") {
    return "paid";
  }
  if (s.includes("FAIL") || s.includes("DECLIN")) return "failed";
  if (s.includes("CANCEL")) return "cancelled";
  return "waiting";
}

export const uzumProvider: PaymentProvider = {
  id: "uzum",
  label: "Uzum Bank",
  supportedCurrencies: ["UZS", "USD"],
  isConfigured: isUzumConfigured,
  createPayment: createUzumPayment,
  getStatus: getUzumStatus,
};
