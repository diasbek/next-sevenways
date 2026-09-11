import { NextResponse } from "next/server";
import { handleClickShopWebhook, type ClickShopBody } from "@/lib/payments/providers/click";
import {
  findPaymentOrder,
  updatePaymentOrderStatus,
} from "@/lib/payments/orders";

async function parseBody(request: Request): Promise<ClickShopBody> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await request.json()) as ClickShopBody;
  }
  const form = await request.formData();
  const body: ClickShopBody = {};
  form.forEach((value, key) => {
    (body as Record<string, string>)[key] = String(value);
  });
  return body;
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const { event, response } = await handleClickShopWebhook(body);

    if (event) {
      const order = await findPaymentOrder(event.orderId);
      if (order) {
        await updatePaymentOrderStatus(
          event.orderId,
          event.status,
          event.externalId,
        );
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("[payments:click]", err);
    return NextResponse.json(
      { error: -1, error_note: "Internal error" },
      { status: 500 },
    );
  }
}
