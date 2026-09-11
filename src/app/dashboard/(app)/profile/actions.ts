"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

function revalidateProfile() {
  revalidatePath("/dashboard/profile/");
  revalidatePath("/dashboard/", "layout");
}

export async function updateProfileAction(formData: FormData) {
  const admin = await requireAdmin();
  const displayName = String(
    formData.get("displayName") ?? formData.get("display_name") ?? "",
  ).trim();
  if (!displayName) throw new Error("display_name_required");

  if (!hasSupabaseAdminConfig()) {
    revalidateProfile();
    return;
  }

  const client = createSupabaseAdminClient();
  const { error } = await client
    .from("sw_admin_users")
    .update({ display_name: displayName })
    .eq("user_id", admin.id);
  if (error) throw new Error(error.message);
  revalidateProfile();
}

export async function changePasswordAction(formData: FormData) {
  const admin = await requireAdmin();
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (newPassword.length < 8) throw new Error("password_too_short");
  if (newPassword !== confirm) throw new Error("password_mismatch");
  if (newPassword === currentPassword) throw new Error("password_unchanged");

  const supabase = await createSupabaseServerClient();
  const { error: signError } = await supabase.auth.signInWithPassword({
    email: admin.email,
    password: currentPassword,
  });
  if (signError) throw new Error("wrong_password");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);

  revalidateProfile();
}
