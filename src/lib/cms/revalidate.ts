import { revalidatePath, updateTag } from "next/cache";
import { CMS_TAGS, type CmsTag } from "@/lib/cms/overlay";

const PUBLIC_LOCALES = ["", "/ru", "/en"] as const;

function revalidatePublicRoots(paths: string[]) {
  for (const path of paths) {
    for (const prefix of PUBLIC_LOCALES) {
      const full =
        path === "/"
          ? prefix || "/"
          : `${prefix}${path.endsWith("/") ? path : `${path}/`}`;
      revalidatePath(full === "" ? "/" : full);
    }
  }
}

/** Call from Server Actions after CMS mutations. */
export function revalidateCms(tag: CmsTag, extraPaths: string[] = []) {
  updateTag(tag);
  switch (tag) {
    case CMS_TAGS.tours:
      revalidatePath("/dashboard/tours/");
      revalidatePublicRoots(["/", "/tours/", "/search/", "/calendar/"]);
      break;
    case CMS_TAGS.offices:
      revalidatePath("/dashboard/offices/");
      revalidatePublicRoots(["/offices/", "/contacts/"]);
      break;
    case CMS_TAGS.news:
      revalidatePath("/dashboard/news/");
      revalidatePublicRoots(["/news/"]);
      break;
    case CMS_TAGS.settings:
      revalidatePath("/dashboard/settings/");
      revalidatePublicRoots(["/", "/contacts/", "/request/", "/about/"]);
      break;
    case CMS_TAGS.siteCopy:
      revalidatePath("/dashboard/content/");
      revalidatePublicRoots(["/", "/about/", "/faq/", "/gifts/", "/contacts/"]);
      break;
    case CMS_TAGS.operators:
      revalidatePath("/dashboard/operators/");
      revalidatePublicRoots(["/offices/"]);
      break;
    case CMS_TAGS.legal:
      revalidatePath("/dashboard/legal/");
      revalidatePublicRoots(["/privacy/", "/terms/"]);
      break;
    default:
      break;
  }
  for (const p of extraPaths) revalidatePath(p);
}

export async function writeAuditLog(input: {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  detail?: Record<string, unknown>;
}) {
  try {
    const { hasSupabaseAdminConfig } = await import("@/lib/supabase/env");
    if (!hasSupabaseAdminConfig()) return;
    const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
    const admin = createSupabaseAdminClient();
    await admin.from("sw_admin_audit").insert({
      actor_id: input.actorId ?? null,
      actor_email: input.actorEmail ?? null,
      action: input.action,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      detail: input.detail ?? {},
    });
  } catch {
    // audit is best-effort
  }
}
