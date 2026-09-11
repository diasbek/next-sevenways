"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  hasSupabaseAdminConfig,
  hasSupabaseSessionConfig,
} from "@/lib/supabase/env";
import { getEnv } from "@/utils/env";
import { countAdmins } from "@/lib/cms/auth";

export async function getBootstrapStatus(): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  if (!hasSupabaseSessionConfig() || !hasSupabaseAdminConfig()) {
    return { ok: false, reason: "setup-locked" };
  }
  if (!getEnv("CMS_BOOTSTRAP_SECRET", "SETUP_SECRET")) {
    return { ok: false, reason: "setup-locked" };
  }
  const count = await countAdmins();
  if (count > 0) return { ok: false, reason: "already_bootstrapped" };
  return { ok: true };
}

export async function bootstrapOwnerAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const status = await getBootstrapStatus();
  if (!status.ok) return { error: "Setup locked" };

  const secret = String(formData.get("secret") ?? "");
  const expected = getEnv("CMS_BOOTSTRAP_SECRET", "SETUP_SECRET");
  if (!expected || secret !== expected) {
    return { error: "Invalid bootstrap secret" };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!email || password.length < 8) {
    return { error: "Email and password (8+) required" };
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    return { error: error?.message ?? "Could not create user" };
  }

  const { error: rowError } = await admin.from("sw_admin_users").insert({
    user_id: data.user.id,
    email,
    display_name: displayName || email,
    role: "owner",
    is_active: true,
  });
  if (rowError) {
    return { error: rowError.message };
  }

  redirect("/dashboard/login/");
}
