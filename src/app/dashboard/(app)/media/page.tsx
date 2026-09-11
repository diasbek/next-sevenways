import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig, publicMediaPath } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  MediaListClient,
  type MediaListItem,
} from "@/components/dashboard/MediaListClient";
import { deleteMediaAction } from "./actions";

export default async function MediaPage() {
  const user = await requireDashboardUser("media");
  let items: MediaListItem[] = [];

  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_media")
      .select("id, filename, path, mime_type, size_bytes, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    items =
      data?.map((row) => ({
        id: row.id as string,
        filename: row.filename as string,
        path: row.path as string,
        url: publicMediaPath(row.path as string),
        mime_type: (row.mime_type as string | null) ?? null,
        size_bytes: (row.size_bytes as number | null) ?? null,
        created_at: (row.created_at as string | null) ?? null,
      })) ?? [];
  }

  return (
    <MediaListClient
      files={items}
      canWrite={canMutate(user.role, "media")}
      deleteAction={deleteMediaAction}
    />
  );
}
