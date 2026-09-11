import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function MediaPage() {
  await requireDashboardUser("media");
  let items: Array<{ id: string; filename: string; path: string }> = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_media")
      .select("id, filename, path")
      .order("created_at", { ascending: false })
      .limit(50);
    items = (data as typeof items) ?? [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Media</h1>
      <p className="text-sm text-ink-muted">
        Storage bucket: <code className="rounded bg-black/5 px-1">sevenways-media</code>.
        Upload via API <code className="rounded bg-black/5 px-1">/api/dashboard/media/upload/</code>.
      </p>
      <ul className="divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-3 text-sm">
            <p className="font-medium">{item.filename}</p>
            <p className="text-ink-muted">{item.path}</p>
          </li>
        ))}
        {!items.length ? (
          <li className="px-4 py-8 text-center text-sm text-ink-muted">
            No media files yet
          </li>
        ) : null}
      </ul>
    </div>
  );
}
