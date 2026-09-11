import { NextResponse } from "next/server";
import { handlePaymeMerchantRpc } from "@/lib/payments/providers/payme";
import { paymeOrderStore } from "@/lib/payments/orders";

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization");
    const body = (await request.json()) as {
      id?: string | number | null;
      method?: string;
      params?: Record<string, unknown>;
    };
    const { json } = await handlePaymeMerchantRpc(auth, body, paymeOrderStore);
    return NextResponse.json(json);
  } catch (err) {
    console.error("[payments:payme]", err);
    return NextResponse.json({
      error: { code: -32400, message: { ru: "Error" }, data: "server" },
      id: null,
    });
  }
}
