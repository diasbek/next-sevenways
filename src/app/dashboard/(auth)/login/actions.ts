"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  hasSupabaseAdminConfig,
  hasSupabaseSessionConfig,
} from "@/lib/supabase/env";

function safeNextPath(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value.startsWith("/dashboard/")) return "/dashboard/";
  if (value.startsWith("//") || value.includes("://")) return "/dashboard/";
  if (
    value.startsWith("/dashboard/login") ||
    value.startsWith("/dashboard/setup")
  ) {
    return "/dashboard/";
  }
  return value;
}

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!hasSupabaseSessionConfig()) {
    return { error: "Missing SUPABASE_URL / SUPABASE_ANON_KEY" };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !data.user) {
    return { error: authError?.message ?? "Invalid credentials" };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("sw_admin_users")
    .select("user_id, is_active")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError || !adminRow || adminRow.is_active === false) {
    await supabase.auth.signOut();
    return { error: "No staff access" };
  }

  if (hasSupabaseAdminConfig()) {
    try {
      const admin = createSupabaseAdminClient();
      await admin
        .from("sw_admin_users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("user_id", data.user.id);
    } catch {
      // non-fatal
    }
  }

  redirect(next);
}
