import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { updateNewsAction } from "../actions";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser("news");
  const { id } = await params;
  if (!hasSupabaseAdminConfig()) notFound();

  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("sw_news").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit article</h1>
      <form action={updateNewsAction} className="max-w-xl space-y-4 rounded-2xl border border-black/8 bg-white p-5">
        <input type="hidden" name="id" value={data.id} />
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Title</span>
          <input
            name="title"
            required
            defaultValue={data.title_en}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Excerpt</span>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={data.excerpt_en}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Body</span>
          <textarea
            name="body"
            rows={10}
            defaultValue={data.body_en}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select
            name="status"
            defaultValue={data.status}
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
}
