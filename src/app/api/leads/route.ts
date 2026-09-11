import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { notifyLeadChannels } from "@/lib/messaging/notify";

type LeadType = "price" | "business" | "contact" | "tour";

interface LeadPayload {
  type: LeadType;
  locale?: string;
  pageUrl?: string;
  utm?: Record<string, string>;
  requestId?: string;
  website?: string;
  data: Record<string, unknown>;
}

const rateMap = new Map<string, { count: number; resetAt: number }>();
const idempotencyMap = new Map<string, { id: string; createdAt: number }>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(key: string, limit = 8) {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function createLeadId() {
  const n = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SW-${n}-${r}`;
}

function pickString(data: Record<string, unknown>, key: string) {
  const v = data[key];
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request) {
  try {
    if (!checkRateLimit(clientKey(request))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const body = (await request.json()) as LeadPayload;
    if (!body?.type || !body?.data || typeof body.data !== "object") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    // Honeypot
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ id: createLeadId() });
    }

    const requestId =
      typeof body.requestId === "string" && body.requestId.trim()
        ? body.requestId.trim()
        : createLeadId();

    const cached = idempotencyMap.get(requestId);
    if (cached) {
      return NextResponse.json({ id: cached.id });
    }

    const locale =
      body.locale === "ru" || body.locale === "en" || body.locale === "uz"
        ? body.locale
        : "uz";

    const name = pickString(body.data, "name") || pickString(body.data, "fullName");
    const phone = pickString(body.data, "phone") || pickString(body.data, "tel");
    if (!phone) {
      return NextResponse.json({ error: "phone_required" }, { status: 400 });
    }

    const id = createLeadId();
    const row = {
      id,
      type: body.type,
      status: "new",
      locale,
      name: name || null,
      phone,
      email: pickString(body.data, "email") || null,
      page_url: typeof body.pageUrl === "string" ? body.pageUrl : null,
      request_id: requestId,
      payload: {
        ...body.data,
        utm: body.utm ?? {},
      },
      kanban_sort: Date.now(),
    };

    if (hasSupabaseAdminConfig()) {
      const admin = createSupabaseAdminClient();
      const { error } = await admin.from("sw_leads").insert(row);
      if (error) {
        console.error("[leads:insert]", error);
        return NextResponse.json({ error: "db_error" }, { status: 500 });
      }
    }

    void notifyLeadChannels({
      id,
      type: body.type,
      locale,
      name: name || "—",
      phone,
      data: body.data,
    });

    idempotencyMap.set(requestId, { id, createdAt: Date.now() });
    return NextResponse.json({ id });
  } catch (err) {
    console.error("[leads]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
