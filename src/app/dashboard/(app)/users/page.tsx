import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function UsersPage() {
  await requireDashboardUser("users");
  let users: Array<{ email: string; role: string; display_name: string }> = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_admin_users")
      .select("email, role, display_name")
      .eq("is_active", true)
      .order("created_at");
    users = (data as typeof users) ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <ul className="divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
        {users.map((u) => (
          <li
            key={u.email}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">{u.display_name || u.email}</p>
              <p className="text-ink-muted">{u.email}</p>
            </div>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
              {u.role}
            </span>
          </li>
        ))}
        {!users.length ? (
          <li className="px-4 py-8 text-center text-sm text-ink-muted">
            No admin users yet — use /dashboard/setup/
          </li>
        ) : null}
      </ul>
    </div>
  );
}
