import { requireDashboardUser } from "@/lib/cms/auth";

export default async function ProfilePage() {
  const user = await requireDashboardUser();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded-2xl border border-black/8 bg-white p-5 text-sm">
        <p>
          <span className="text-ink-muted">Email:</span> {user.email}
        </p>
        <p className="mt-2">
          <span className="text-ink-muted">Role:</span> {user.role}
        </p>
        <p className="mt-2">
          <span className="text-ink-muted">Name:</span>{" "}
          {user.displayName || "—"}
        </p>
      </div>
    </div>
  );
}
