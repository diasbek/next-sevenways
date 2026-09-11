import { redirect } from "next/navigation";
import { getDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseSessionConfig } from "@/lib/supabase/env";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";

export default async function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseSessionConfig()) {
    return (
      <DashboardChrome email="local@dev (no supabase)">
        {children}
      </DashboardChrome>
    );
  }

  const user = await getDashboardUser();
  if (!user) redirect("/dashboard/login/");
  return <DashboardChrome email={user.email}>{children}</DashboardChrome>;
}
