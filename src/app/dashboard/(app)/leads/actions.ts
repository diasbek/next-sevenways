"use server";

import { revalidatePath } from "next/cache";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

const LEAD_STATUSES = [
  "new",
  "in_progress",
  "won",
  "lost",
  "spam",
] as const;

function revalidateLeads(id?: string) {
  revalidatePath("/dashboard/leads/");
  revalidatePath("/dashboard/");
  if (id) revalidatePath(`/dashboard/leads/${id}/`);
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireMutation("leads");
  if (!hasSupabaseAdminConfig()) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(LEAD_STATUSES as readonly string[]).includes(status)) {
    throw new Error("Invalid");
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("sw_leads")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateLeads(id);
}

/**
 * Persist kanban drop. `orderedIds` is top→bottom (index 0 = highest kanban_sort).
 */
export async function updateLeadBoardAction(input: {
  status: string;
  orderedIds: string[];
}) {
  await requireMutation("leads");
  if (!hasSupabaseAdminConfig()) return;

  const status = input.status;
  const orderedIds = input.orderedIds.filter(Boolean);
  if (
    !(LEAD_STATUSES as readonly string[]).includes(status) ||
    orderedIds.length === 0
  ) {
    throw new Error("Invalid");
  }

  const admin = createSupabaseAdminClient();
  const base = Math.floor(Date.now() / 1000);

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      admin
        .from("sw_leads")
        .update({
          status,
          kanban_sort: base - index,
        })
        .eq("id", id),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  revalidateLeads(orderedIds[0]);
}
