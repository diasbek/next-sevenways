import { requireAdmin } from "@/lib/cms/auth";
import { getDashNotifications } from "@/lib/cms/notifications";
import { hasSupabaseSessionConfig } from "@/lib/supabase/env";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";

export default async function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseSessionConfig()) {
    const local = {
      id: "local",
      email: "local@dev",
      role: "owner" as const,
      displayName: "Local",
    };
    return (
      <DashboardChrome
        admin={local}
        notifications={{
          items: [],
          badge: 0,
          showLeadsLink: true,
          showLogLink: true,
        }}
      >
        {children}
      </DashboardChrome>
    );
  }

  const admin = await requireAdmin();
  const notifications = await getDashNotifications(admin);
  return (
    <DashboardChrome admin={admin} notifications={notifications}>
      {children}
    </DashboardChrome>
  );
}
