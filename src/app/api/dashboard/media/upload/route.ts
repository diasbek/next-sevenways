import { NextResponse } from "next/server";
import { getDashboardUser, canMutate } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  hasSupabaseAdminConfig,
  publicMediaPath,
} from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    const user = await getDashboardUser();
    if (!user || !canMutate(user.role, "media")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!hasSupabaseAdminConfig()) {
      return NextResponse.json({ error: "supabase_missing" }, { status: 503 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file_required" }, { status: 400 });
    }

    const folderRaw = String(form.get("folder") ?? "uploads").trim();
    const folder = folderRaw
      .replace(/^\/+|\/+$/g, "")
      .replace(/[^a-zA-Z0-9/_-]/g, "")
      .slice(0, 80) || "uploads";

    const admin = createSupabaseAdminClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from("sevenways-media")
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data, error } = await admin
      .from("sw_media")
      .insert({
        path,
        filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select("id, path")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const url = publicMediaPath(data.path);
    return NextResponse.json({ ok: true, id: data.id, path: data.path, url });
  } catch (err) {
    console.error("[media:upload]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
