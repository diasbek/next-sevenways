import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { legalDocuments } from "@/data/legal/documents";
import {
  LegalAdminClient,
  type LegalAdminRow,
} from "@/components/dashboard/LegalAdminClient";

function seedRow(slug: "privacy" | "terms"): LegalAdminRow {
  const uz = legalDocuments[slug].uz;
  const ru = legalDocuments[slug].ru;
  const en = legalDocuments[slug].en;
  return {
    slug,
    title_uz: uz.title,
    title_ru: ru.title,
    title_en: en.title,
    body_uz: uz.paragraphs.join("\n\n"),
    body_ru: ru.paragraphs.join("\n\n"),
    body_en: en.paragraphs.join("\n\n"),
  };
}

export default async function LegalAdminPage() {
  const user = await requireDashboardUser("legal");
  const cmsReady = hasSupabaseAdminConfig();
  let pages: LegalAdminRow[] = [];

  if (cmsReady) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_legal_pages")
      .select("slug, title_uz, title_ru, title_en, body_uz, body_ru, body_en");
    pages = ((data as LegalAdminRow[]) ?? []).filter(
      (p): p is LegalAdminRow => p.slug === "privacy" || p.slug === "terms",
    );
  }

  return (
    <LegalAdminClient
      pages={pages}
      seedPages={[seedRow("privacy"), seedRow("terms")]}
      canWrite={canMutate(user.role, "legal")}
      cmsReady={cmsReady}
    />
  );
}
