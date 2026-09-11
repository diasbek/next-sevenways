import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createNewsAction } from "../actions";

export default async function NewNewsPage() {
  await requireDashboardUser("news");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New article</h1>
      {!hasSupabaseAdminConfig() ? (
        <p className="text-sm text-ink-muted">Connect Supabase to create news.</p>
      ) : (
        <form action={createNewsAction} className="max-w-xl space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Title</span>
            <input name="title" required className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input name="slug" className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Excerpt</span>
            <textarea name="excerpt" rows={2} className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Body</span>
            <textarea name="body" rows={8} className="w-full rounded-xl border border-black/10 px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Status</span>
            <select name="status" className="w-full rounded-xl border border-black/10 px-3 py-2.5">
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
            Create
          </button>
        </form>
      )}
    </div>
  );
}
