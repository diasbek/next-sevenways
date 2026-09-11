import type { Locale } from "@/i18n/config";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

export const CMS_TAGS = {
  tours: "cms:tours",
  offices: "cms:offices",
  news: "cms:news",
  settings: "cms:settings",
  siteCopy: "cms:site-copy",
  operators: "cms:operators",
  legal: "cms:legal",
} as const;

export type CmsTag = (typeof CMS_TAGS)[keyof typeof CMS_TAGS];

export function cmsReady(): boolean {
  return hasSupabaseAdminConfig();
}

export type LocalizedTriple = { uz: string; ru: string; en: string };

export function pickLocale(
  triple: LocalizedTriple | null | undefined,
  locale: Locale,
  fallback = "",
): string {
  if (!triple) return fallback;
  return triple[locale] || triple.uz || triple.ru || triple.en || fallback;
}

export function localizedFromColumns(
  uz: string | null | undefined,
  ru: string | null | undefined,
  en: string | null | undefined,
): LocalizedTriple {
  return {
    uz: uz ?? "",
    ru: ru ?? "",
    en: en ?? "",
  };
}

/** CMS rows win by key; seed fills gaps. */
export function mergeByKey<T>(
  seed: T[],
  cms: T[],
  keyOf: (item: T) => string,
): T[] {
  if (!cms.length) return seed;
  const map = new Map<string, T>();
  for (const item of seed) map.set(keyOf(item), item);
  for (const item of cms) map.set(keyOf(item), item);
  return Array.from(map.values());
}

export function deepMergeCopy<T extends Record<string, unknown>>(
  seed: T,
  overlay: Partial<T> | null | undefined,
): T {
  if (!overlay) return seed;
  return mergeDeep(seed, overlay) as T;
}

function mergeDeep(
  base: unknown,
  overlay: unknown,
): unknown {
  if (overlay == null) return base;
  if (Array.isArray(overlay)) return overlay;
  if (typeof overlay !== "object" || typeof base !== "object" || base == null) {
    return overlay;
  }
  const out: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };
  for (const [k, v] of Object.entries(overlay as Record<string, unknown>)) {
    if (v === undefined) continue;
    out[k] = mergeDeep(out[k], v);
  }
  return out;
}
