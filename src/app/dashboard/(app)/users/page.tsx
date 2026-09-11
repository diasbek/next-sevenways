import {
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  UsersInviteClient,
  type StaffRow,
} from "@/components/dashboard/UsersInviteClient";
import {
  inviteStaffAction,
  setStaffActiveAction,
  setStaffRoleAction,
} from "./actions";
import { DashAccessDenied } from "@/components/dashboard/DashAccessDenied";

export default async function UsersPage() {
  const user = await requireDashboardUser("users");
  let rows: StaffRow[] = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_admin_users")
      .select("user_id, email, role, display_name, is_active")
      .order("created_at");
    rows =
      data?.map((r) => ({
        user_id: r.user_id as string,
        email: r.email as string,
        display_name: (r.display_name as string) || "",
        role: r.role as string,
        is_active: r.is_active !== false,
      })) ?? [];
  }

  if (user.role !== "owner" && user.id !== "local") {
    return <DashAccessDenied />;
  }

  return (
    <UsersInviteClient
      meId={user.id}
      rows={rows}
      inviteAction={inviteStaffAction}
      setRoleAction={setStaffRoleAction}
      setActiveAction={setStaffActiveAction}
    />
  );
}
