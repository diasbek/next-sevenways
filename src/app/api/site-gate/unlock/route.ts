import { NextResponse } from "next/server";
import {
  getSiteGateCode,
  isSiteGateEnabled,
  SITE_GATE_COOKIE,
  SITE_GATE_COOKIE_VALUE,
} from "@/lib/site-gate";

export async function POST(request: Request) {
  if (!isSiteGateEnabled()) {
    return NextResponse.json({ ok: true, unlocked: true });
  }

  let code = "";
  try {
    const body = (await request.json()) as { code?: unknown };
    code = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (code !== getSiteGateCode()) {
    return NextResponse.json({ ok: false, error: "wrong_code" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, unlocked: true });
  response.cookies.set(SITE_GATE_COOKIE, SITE_GATE_COOKIE_VALUE, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
