import { requireDashboardUser } from "@/lib/cms/auth";
import { ProfileClient } from "@/components/dashboard/ProfileClient";

export default async function ProfilePage() {
  const user = await requireDashboardUser();
  return (
    <ProfileClient
      email={user.email}
      displayName={user.displayName}
      role={user.role}
    />
  );
}
