import { NextResponse } from "next/server";
import { getUzumStatus } from "@/lib/payments/providers/uzum";
import {
  findPaymentOrder,
  findPaymentOrderByExternal,
  updatePaymentOrderStatus,
} from "@/lib/payments/orders";

/**
 * Uzum Checkout often relies on client redirect + status poll.
 * This endpoint lets the return page / cron confirm payment.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId?: string;
      externalId?: string;
    };
    let order = body.orderId
      ? await findPaymentOrder(body.orderId)
      : null;
    if (!order && body.externalId) {
      order = await findPaymentOrderByExternal(body.externalId);
    }
    if (!order) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const externalId = order.external_id || body.externalId || order.id;
    const status = await getUzumStatus(externalId);
    await updatePaymentOrderStatus(order.id, status, externalId);

    return NextResponse.json({ ok: true, orderId: order.id, status });
  } catch (err) {
    console.error("[payments:uzum]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
