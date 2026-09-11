import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  hasSupabaseAdminConfig,
  hasSupabaseSessionConfig,
} from "@/lib/supabase/env";
import {
  canAccess,
  canMutate,
  isAdminRole,
  type AdminMutation,
  type AdminPermissionArea,
  type AdminUser,
} from "@/lib/cms/auth-shared";

export type {
  AdminRole,
  AdminUser,
  AdminPermissionArea,
  AdminMutation,
} from "@/lib/cms/auth-shared";
export { canAccess, canMutate, isAdminRole } from "@/lib/cms/auth-shared";

type AdminRow = {
  user_id: string;
  email: string;
  role: string;
  display_name?: string | null;
  is_active?: boolean;
};

function mapAdmin(row: AdminRow): AdminUser | null {
  if (row.is_active === false) return null;
  if (!isAdminRole(row.role)) return null;
  return {
    id: row.user_id,
    email: row.email,
    role: row.role,
    displayName: row.display_name ?? "",
  };
}

export async function countAdmins(): Promise<number> {
  if (!hasSupabaseAdminConfig()) return 0;
  const admin = createSupabaseAdminClient();
  const { count } = await admin
    .from("sw_admin_users")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);
  return count ?? 0;
}

export async function getAdminByUserId(
  userId: string,
): Promise<AdminUser | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("sw_admin_users")
      .select("user_id, email, role, display_name, is_active")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) return mapAdmin(data as AdminRow);
  } catch {
    // fall through
  }

  if (!hasSupabaseAdminConfig()) return null;
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_admin_users")
      .select("user_id, email, role, display_name, is_active")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return mapAdmin(data as AdminRow);
  } catch {
    return null;
  }
}

export const getDashboardUser = cache(async (): Promise<AdminUser | null> => {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    return getAdminByUserId(user.id);
  } catch {
    return null;
  }
});

export async function requireDashboardUser(
  area?: AdminPermissionArea,
): Promise<AdminUser> {
  if (!hasSupabaseAdminConfig() && !hasSupabaseSessionConfig()) {
    return {
      id: "local",
      email: "local@dev",
      role: "owner",
      displayName: "Local",
    };
  }
  const user = await getDashboardUser();
  if (!user) redirect("/dashboard/login/");
  if (area && !canAccess(user.role, area)) redirect("/dashboard/");
  return user;
}

export async function requireAdmin(): Promise<AdminUser> {
  return requireDashboardUser();
}

/** Page gate: returns admin or null when area denied. */
export async function requireAccess(
  area: AdminPermissionArea,
): Promise<AdminUser | null> {
  const admin = await requireAdmin();
  if (!canAccess(admin.role, area)) return null;
  return admin;
}

export async function requireMutation(
  action: AdminMutation,
): Promise<AdminUser> {
  const user = await requireDashboardUser();
  if (!canMutate(user.role, action)) {
    throw new Error("forbidden");
  }
  return user;
}
