import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
} from "../../types";
import { uzsToPaymeTiyin } from "../../amount";
import { getPaymeCredentials } from "../../credentials";

export async function isPaymeConfigured(): Promise<boolean> {
  const c = await getPaymeCredentials();
  return Boolean(
    c.merchantId && (c.isTest ? c.testKey || c.secretKey : c.secretKey),
  );
}

export async function paymeCheckoutBase(): Promise<string> {
  const { isTest } = await getPaymeCredentials();
  return isTest ? "https://test.paycom.uz" : "https://checkout.paycom.uz";
}

/**
 * Build Payme checkout redirect (base64 cheque).
 * Docs: https://developer.help.paycom.uz/initsializatsiya-platezhey/
 */
export async function createPaymePayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  if (input.currency !== "UZS") {
    throw new Error("Payme accepts UZS only");
  }
  const { merchantId } = await getPaymeCredentials();
  if (!merchantId) throw new Error("Payme is not configured");

  const amount = uzsToPaymeTiyin(input.amount);
  const params = [
    `m=${merchantId}`,
    `ac.order_id=${input.orderId}`,
    `a=${amount}`,
    `c=${encodeURIComponent(input.returnUrl)}`,
  ].join(";");

  const encoded = Buffer.from(params, "utf8").toString("base64");
  const base = await paymeCheckoutBase();
  return {
    redirectUrl: `${base}/${encoded}`,
    externalId: input.orderId,
  };
}

export async function paymeAuthHeaderExpected(): Promise<string> {
  const c = await getPaymeCredentials();
  const key = c.isTest ? c.testKey || c.secretKey : c.secretKey;
  return `Basic ${Buffer.from(`Paycom:${key}`, "utf8").toString("base64")}`;
}

export const paymeProvider: PaymentProvider = {
  id: "payme",
  label: "Payme",
  supportedCurrencies: ["UZS"],
  isConfigured: isPaymeConfigured,
  createPayment: createPaymePayment,
};
