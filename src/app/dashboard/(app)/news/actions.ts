"use server";

import { redirect } from "next/navigation";
import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function pickLocaleField(formData: FormData, base: string, loc: string) {
  return String(formData.get(`${base}_${loc}`) ?? "").trim();
}

function newsFieldsFromForm(formData: FormData) {
  const title_uz = pickLocaleField(formData, "title", "uz");
  const title_ru = pickLocaleField(formData, "title", "ru");
  const title_en = pickLocaleField(formData, "title", "en");
  const excerpt_uz = pickLocaleField(formData, "excerpt", "uz");
  const excerpt_ru = pickLocaleField(formData, "excerpt", "ru");
  const excerpt_en = pickLocaleField(formData, "excerpt", "en");
  const body_uz = String(formData.get("body_uz") ?? "").trim();
  const body_ru = String(formData.get("body_ru") ?? "").trim();
  const body_en = String(formData.get("body_en") ?? "").trim();
  const cover_url = String(formData.get("cover_url") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft");
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug =
    slugRaw ||
    slugify(title_uz || title_ru || title_en) ||
    `news-${Date.now()}`;

  const publishedAtRaw = String(formData.get("published_at") ?? "").trim();
  let published_at: string | null = null;
  if (status === "published") {
    if (publishedAtRaw) {
      const d = new Date(publishedAtRaw);
      published_at = Number.isNaN(d.getTime())
        ? new Date().toISOString()
        : d.toISOString();
    } else {
      published_at = new Date().toISOString();
    }
  } else if (publishedAtRaw) {
    const d = new Date(publishedAtRaw);
    published_at = Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  return {
    slug,
    title_uz: title_uz || title_ru || title_en || "Untitled",
    title_ru: title_ru || title_uz || title_en || "Untitled",
    title_en: title_en || title_uz || title_ru || "Untitled",
    excerpt_uz,
    excerpt_ru,
    excerpt_en,
    body_uz,
    body_ru,
    body_en,
    cover_url,
    status,
    published_at,
  };
}

export async function createNewsAction(formData: FormData) {
  const actor = await requireMutation("news");
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase not configured");
  }

  const fields = newsFieldsFromForm(formData);
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("sw_news")
    .insert(fields)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.news);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "news.create",
    entityType: "news",
    entityId: data.id,
  });
  redirect(`/dashboard/news/${data.id}/`);
}

export async function updateNewsAction(formData: FormData) {
  const actor = await requireMutation("news");
  if (!hasSupabaseAdminConfig()) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const fields = newsFieldsFromForm(formData);
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_news").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateCms(CMS_TAGS.news, [`/dashboard/news/${id}/`]);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "news.update",
    entityType: "news",
    entityId: id,
    detail: { status: fields.status },
  });
}
