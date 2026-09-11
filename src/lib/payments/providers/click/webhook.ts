import { createHash } from "node:crypto";
import { getClickCredentials } from "../../credentials";
import { isClickConfigured } from "./client";
import type { PaymentEvent } from "../../types";

export type ClickShopBody = {
  click_trans_id?: string | number;
  service_id?: string | number;
  click_paydoc_id?: string | number;
  merchant_trans_id?: string;
  merchant_prepare_id?: string | number;
  amount?: string | number;
  action?: string | number;
  error?: string | number;
  error_note?: string;
  sign_time?: string;
  sign_string?: string;
};

/**
 * Verify & handle Click SHOP Prepare (action=0) / Complete (action=1).
 * Docs: https://docs.click.uz/en/shop-api/requests
 */
export async function handleClickShopWebhook(body: ClickShopBody): Promise<{
  event: PaymentEvent | null;
  response: Record<string, unknown>;
}> {
  if (!(await isClickConfigured())) {
    return {
      event: null,
      response: { error: -1, error_note: "Click not configured" },
    };
  }

  const action = Number(body.action);
  const clickTransId = String(body.click_trans_id ?? "");
  const serviceId = String(body.service_id ?? "");
  const merchantTransId = String(body.merchant_trans_id ?? "");
  const amount = Number(body.amount ?? 0);
  const signTime = String(body.sign_time ?? "");
  const signString = String(body.sign_string ?? "");
  const merchantPrepareId = String(body.merchant_prepare_id ?? "");
  const { secretKey: secret } = await getClickCredentials();

  const raw =
    action === 1
      ? `${clickTransId}${serviceId}${secret}${merchantTransId}${merchantPrepareId}${amount}${action}${signTime}`
      : `${clickTransId}${serviceId}${secret}${merchantTransId}${amount}${action}${signTime}`;
  const computed = createHash("md5").update(raw).digest("hex");

  if (computed !== signString) {
    return {
      event: null,
      response: { error: -1, error_note: "Invalid sign" },
    };
  }

  if (!merchantTransId) {
    return {
      event: null,
      response: { error: -5, error_note: "User does not exist" },
    };
  }

  if (action === 0) {
    return {
      event: {
        orderId: merchantTransId,
        externalId: clickTransId,
        status: "waiting",
        amount,
        currency: "UZS",
        raw: body,
      },
      response: {
        click_trans_id: body.click_trans_id,
        merchant_trans_id: merchantTransId,
        merchant_prepare_id: merchantTransId,
        error: 0,
        error_note: "Success",
      },
    };
  }

  if (action === 1) {
    const err = Number(body.error ?? 0);
    const status = err === 0 ? "paid" : "failed";
    return {
      event: {
        orderId: merchantTransId,
        externalId: clickTransId,
        status,
        amount,
        currency: "UZS",
        raw: body,
      },
      response: {
        click_trans_id: body.click_trans_id,
        merchant_trans_id: merchantTransId,
        merchant_confirm_id: merchantTransId,
        error: 0,
        error_note: "Success",
      },
    };
  }

  return {
    event: null,
    response: { error: -3, error_note: "Action not found" },
  };
}
