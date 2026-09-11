"use server";

import { revalidatePath } from "next/cache";
import {
  isAdminRole,
  requireMutation,
  type AdminRole,
} from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

function parseRole(raw: string): AdminRole | null {
  if (isAdminRole(raw)) return raw;
  return null;
}

async function countActiveOwners() {
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("sw_admin_users")
    .select("*", { count: "exact", head: true })
    .eq("role", "owner")
    .eq("is_active", true);
  return count ?? 0;
}

export async function inviteStaffAction(formData: FormData) {
  await requireMutation("users");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = parseRole(String(formData.get("role") ?? "editor"));
  const displayName = String(
    formData.get("displayName") ?? formData.get("display_name") ?? "",
  ).trim();

  if (!email || password.length < 8) throw new Error("Invalid credentials");
  if (!role) throw new Error("Invalid role");

  const client = createSupabaseAdminClient();
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(error?.message ?? "Create failed");

  const { error: insertError } = await client.from("sw_admin_users").insert({
    user_id: data.user.id,
    email,
    display_name: displayName || email.split("@")[0],
    role,
    is_active: true,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/dashboard/users/");
}

export async function setStaffActiveAction(formData: FormData) {
  await requireMutation("users");
  if (!hasSupabaseAdminConfig()) return;

  const userId = String(formData.get("user_id") ?? "");
  const isActive = String(formData.get("is_active") ?? "") === "true";
  if (!userId) throw new Error("Missing user");

  const client = createSupabaseAdminClient();
  const { data: target } = await client
    .from("sw_admin_users")
    .select("role, is_active")
    .eq("user_id", userId)
    .maybeSingle();

  if (
    target?.role === "owner" &&
    target.is_active &&
    !isActive &&
    (await countActiveOwners()) <= 1
  ) {
    throw new Error("Cannot deactivate the last owner");
  }

  const { error } = await client
    .from("sw_admin_users")
    .update({ is_active: isActive })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/users/");
}

export async function setStaffRoleAction(formData: FormData) {
  await requireMutation("users");
  if (!hasSupabaseAdminConfig()) return;

  const userId = String(formData.get("user_id") ?? "");
  const role = parseRole(String(formData.get("role") ?? ""));
  if (!userId || !role) throw new Error("Invalid input");

  const client = createSupabaseAdminClient();
  const { data: target } = await client
    .from("sw_admin_users")
    .select("role, is_active")
    .eq("user_id", userId)
    .maybeSingle();

  if (!target) throw new Error("User not found");

  if (
    target.role === "owner" &&
    role !== "owner" &&
    target.is_active &&
    (await countActiveOwners()) <= 1
  ) {
    throw new Error("Cannot demote the last owner");
  }

  const { error } = await client
    .from("sw_admin_users")
    .update({ role })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/users/");
}
