import Link from "next/link";
import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { NewsEditorForm } from "@/components/dashboard/NewsEditorForm";
import { DashPageHeader } from "@/components/dashboard/ui";
import { dashBtnSecondary, dashCardPad } from "@/styles/dashboard";

export default async function NewNewsPage() {
  await requireDashboardUser("news");

  return (
    <div className="space-y-5">
      <DashPageHeader
        title="New article"
        lead="uz / ru / en fields, cover, and status."
        actions={
          <Link href="/dashboard/news/" className={dashBtnSecondary}>
            Back
          </Link>
        }
      />
      {!hasSupabaseAdminConfig() ? (
        <p className={`${dashCardPad} text-sm text-black/55`}>
          Connect Supabase to create news.
        </p>
      ) : (
        <NewsEditorForm
          values={{
            slug: "",
            status: "draft",
            cover_url: "",
            title_uz: "",
            title_ru: "",
            title_en: "",
            excerpt_uz: "",
            excerpt_ru: "",
            excerpt_en: "",
            body_uz: "<p></p>",
            body_ru: "<p></p>",
            body_en: "<p></p>",
          }}
        />
      )}
    </div>
  );
}
