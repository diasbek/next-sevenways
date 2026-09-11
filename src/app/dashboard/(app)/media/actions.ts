"use server";

import { revalidatePath } from "next/cache";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function deleteMediaAction(formData: FormData) {
  await requireMutation("media");
  if (!hasSupabaseAdminConfig()) return;

  const id = String(formData.get("id") ?? "").trim();
  const path = String(formData.get("path") ?? "").trim();
  if (!id && !path) throw new Error("Missing media");

  const admin = createSupabaseAdminClient();

  if (path) {
    const { error: storageError } = await admin.storage
      .from("sevenways-media")
      .remove([path]);
    if (storageError) {
      console.error("[media:delete:storage]", storageError);
    }
  }

  if (id) {
    const { error } = await admin.from("sw_media").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else if (path) {
    const { error } = await admin.from("sw_media").delete().eq("path", path);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard/media/");
}
