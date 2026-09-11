import { paymeAuthHeaderExpected, isPaymeConfigured } from "./client";
import { paymeTiyinToUzs } from "../../amount";
import type { PaymentEvent, PaymentStatus } from "../../types";

type JsonRpcRequest = {
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

type OrderLookup = {
  findById: (orderId: string) => Promise<{
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
  } | null>;
  markWaiting: (orderId: string, externalId: string) => Promise<void>;
  markPaid: (orderId: string, externalId: string) => Promise<void>;
  markCancelled: (orderId: string, externalId?: string) => Promise<void>;
};

/**
 * Payme Merchant API JSON-RPC handler.
 * Docs: https://developer.help.paycom.uz/metody-merchant-api/
 */
export async function handlePaymeMerchantRpc(
  authHeader: string | null,
  body: JsonRpcRequest,
  store: OrderLookup,
): Promise<{ json: Record<string, unknown>; event: PaymentEvent | null }> {
  const id = body.id ?? null;

  if (!(await isPaymeConfigured())) {
    return {
      json: {
        error: { code: -32400, message: { ru: "Not configured" }, data: "config" },
        id,
      },
      event: null,
    };
  }

  if (authHeader !== (await paymeAuthHeaderExpected())) {
    return {
      json: {
        error: {
          code: -32504,
          message: { ru: "Недостаточно привилегий" },
          data: "auth",
        },
        id,
      },
      event: null,
    };
  }

  const method = body.method ?? "";
  const params = body.params ?? {};

  try {
    if (method === "CheckPerformTransaction") {
      const account = (params.account ?? {}) as { order_id?: string };
      const orderId = String(account.order_id ?? "");
      const amount = Number(params.amount ?? 0);
      const order = await store.findById(orderId);
      if (!order || order.currency !== "UZS") {
        return {
          json: {
            error: {
              code: -31050,
              message: { ru: "Заказ не найден" },
              data: "order_id",
            },
            id,
          },
          event: null,
        };
      }
      const expected = Math.round(order.amount * 100);
      if (expected !== amount) {
        return {
          json: {
            error: {
              code: -31001,
              message: { ru: "Неверная сумма" },
              data: "amount",
            },
            id,
          },
          event: null,
        };
      }
      return { json: { result: { allow: true }, id }, event: null };
    }

    if (method === "CreateTransaction") {
      const account = (params.account ?? {}) as { order_id?: string };
      const orderId = String(account.order_id ?? "");
      const transId = String(params.id ?? "");
      const order = await store.findById(orderId);
      if (!order) {
        return {
          json: {
            error: {
              code: -31050,
              message: { ru: "Заказ не найден" },
              data: "order_id",
            },
            id,
          },
          event: null,
        };
      }
      await store.markWaiting(orderId, transId);
      const event: PaymentEvent = {
        orderId,
        externalId: transId,
        status: "waiting",
        amount: order.amount,
        currency: "UZS",
      };
      return {
        json: {
          result: {
            create_time: Date.now(),
            transaction: transId,
            state: 1,
          },
          id,
        },
        event,
      };
    }

    if (method === "PerformTransaction") {
      const transId = String(params.id ?? "");
      const account = (params.account ?? {}) as { order_id?: string };
      let orderId = String(account.order_id ?? "");
      if (!orderId) {
        // Resolve via external_id stored at CreateTransaction
        const { findPaymentOrderByExternal } = await import("../../orders");
        const byExt = await findPaymentOrderByExternal(transId);
        orderId = byExt?.id ?? "";
      }
      if (orderId) await store.markPaid(orderId, transId);
      const event: PaymentEvent | null = orderId
        ? { orderId, externalId: transId, status: "paid" }
        : null;
      return {
        json: {
          result: {
            transaction: transId,
            perform_time: Date.now(),
            state: 2,
          },
          id,
        },
        event,
      };
    }

    if (method === "CancelTransaction") {
      const transId = String(params.id ?? "");
      const account = (params.account ?? {}) as { order_id?: string };
      const orderId = String(account.order_id ?? "");
      if (orderId) await store.markCancelled(orderId, transId);
      return {
        json: {
          result: {
            transaction: transId,
            cancel_time: Date.now(),
            state: -1,
          },
          id,
        },
        event: orderId
          ? { orderId, externalId: transId, status: "cancelled" }
          : null,
      };
    }

    if (method === "CheckTransaction") {
      const transId = String(params.id ?? "");
      return {
        json: {
          result: {
            create_time: Date.now(),
            perform_time: 0,
            cancel_time: 0,
            transaction: transId,
            state: 1,
            reason: null,
          },
          id,
        },
        event: null,
      };
    }

    if (method === "GetStatement") {
      return { json: { result: { transactions: [] }, id }, event: null };
    }

    return {
      json: {
        error: {
          code: -32601,
          message: { ru: "Метод не найден" },
          data: method,
        },
        id,
      },
      event: null,
    };
  } catch (err) {
    return {
      json: {
        error: {
          code: -32400,
          message: { ru: "Системная ошибка" },
          data: String(err),
        },
        id,
      },
      event: null,
    };
  }
}

void paymeTiyinToUzs;
