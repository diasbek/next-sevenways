"use server";

import { revalidatePath } from "next/cache";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export async function updateLeadStatusAction(formData: FormData) {
  await requireMutation("leads");
  if (!hasSupabaseAdminConfig()) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;
  const admin = createSupabaseAdminClient();
  await admin.from("sw_leads").update({ status }).eq("id", id);
  revalidatePath("/dashboard/leads/");
  revalidatePath(`/dashboard/leads/${id}/`);
}
