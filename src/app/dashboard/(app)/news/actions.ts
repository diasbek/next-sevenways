"use server";

import { redirect } from "next/navigation";
import { requireMutation } from "@/lib/cms/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function createNewsAction(formData: FormData) {
  await requireMutation("news");
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase not configured");
  }
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(title) || `news-${Date.now()}`;

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("sw_news")
    .insert({
      slug,
      title_uz: title,
      title_ru: title,
      title_en: title,
      excerpt_uz: excerpt,
      excerpt_ru: excerpt,
      excerpt_en: excerpt,
      body_uz: body,
      body_ru: body,
      body_en: body,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/news/");
  redirect(`/dashboard/news/${data.id}/`);
}

export async function updateNewsAction(formData: FormData) {
  await requireMutation("news");
  if (!hasSupabaseAdminConfig()) return;
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  if (!id) return;

  const admin = createSupabaseAdminClient();
  await admin
    .from("sw_news")
    .update({
      title_uz: title,
      title_ru: title,
      title_en: title,
      excerpt_uz: excerpt,
      excerpt_ru: excerpt,
      excerpt_en: excerpt,
      body_uz: body,
      body_ru: body,
      body_en: body,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/dashboard/news/");
  revalidatePath(`/dashboard/news/${id}/`);
}
