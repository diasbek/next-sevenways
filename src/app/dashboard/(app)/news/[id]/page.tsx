import Link from "next/link";
import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { NewsEditorForm } from "@/components/dashboard/NewsEditorForm";
import { DashPageHeader } from "@/components/dashboard/ui";
import { dashBtnSecondary } from "@/styles/dashboard";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser("news");
  const { id } = await params;
  if (!hasSupabaseAdminConfig()) notFound();

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("sw_news")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="space-y-5">
      <DashPageHeader
        title="Edit article"
        lead={data.slug as string}
        actions={
          <Link href="/dashboard/news/" className={dashBtnSecondary}>
            Back
          </Link>
        }
      />
      <NewsEditorForm
        values={{
          id: data.id as string,
          slug: (data.slug as string) ?? "",
          status: (data.status as string) ?? "draft",
          cover_url: (data.cover_url as string) ?? "",
          title_uz: (data.title_uz as string) ?? "",
          title_ru: (data.title_ru as string) ?? "",
          title_en: (data.title_en as string) ?? "",
          excerpt_uz: (data.excerpt_uz as string) ?? "",
          excerpt_ru: (data.excerpt_ru as string) ?? "",
          excerpt_en: (data.excerpt_en as string) ?? "",
          body_uz: (data.body_uz as string) || "<p></p>",
          body_ru: (data.body_ru as string) || "<p></p>",
          body_en: (data.body_en as string) || "<p></p>",
        }}
      />
    </div>
  );
}
