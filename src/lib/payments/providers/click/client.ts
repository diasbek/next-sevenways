import { createHash } from "node:crypto";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentProvider,
} from "../../types";
import { getClickCredentials } from "../../credentials";

export async function isClickConfigured(): Promise<boolean> {
  const c = await getClickCredentials();
  return Boolean(c.merchantId && c.serviceId && c.secretKey);
}

/** MD5 sign for Click SHOP Prepare/Complete. */
export async function clickShopSign(
  parts: Array<string | number>,
): Promise<string> {
  const { secretKey } = await getClickCredentials();
  return createHash("md5")
    .update(parts.map(String).join("") + secretKey)
    .digest("hex");
}

/**
 * Create payment via Click invoice redirect.
 * Docs: https://docs.click.uz/en/shop-api/
 */
export async function createClickPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  if (input.currency !== "UZS") {
    throw new Error("Click accepts UZS only");
  }
  const { merchantId, serviceId } = await getClickCredentials();
  if (!merchantId || !serviceId) {
    throw new Error("Click is not configured");
  }

  const amount = Math.round(input.amount);
  const params = new URLSearchParams({
    service_id: serviceId,
    merchant_id: merchantId,
    amount: String(amount),
    transaction_param: input.orderId,
    return_url: input.returnUrl,
  });

  return {
    redirectUrl: `https://my.click.uz/services/pay?${params.toString()}`,
    externalId: input.orderId,
  };
}

export const clickProvider: PaymentProvider = {
  id: "click",
  label: "Click",
  supportedCurrencies: ["UZS"],
  isConfigured: isClickConfigured,
  createPayment: createClickPayment,
};
