import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import type { SiteCopy } from "@/data/types";
import { uzCopy } from "@/data/uz";
import { ruCopy } from "@/data/ru";
import { enCopy } from "@/data/en";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  CMS_TAGS,
  cmsReady,
  deepMergeCopy,
} from "@/lib/cms/overlay";

export const SITE_COPY_KEYS = [
  "meta",
  "ui",
  "nav",
  "brand",
  "home",
  "about",
  "faq",
  "contacts",
  "offices",
  "search",
  "calendar",
  "gifts",
  "request",
  "tours",
  "news",
  "footer",
  "notFound",
] as const;

export type SiteCopyKey = (typeof SITE_COPY_KEYS)[number];

type CopyRow = {
  key: string;
  label: string;
  payload: Record<string, unknown>;
};

function seedFor(locale: Locale): SiteCopy {
  if (locale === "ru") return ruCopy;
  if (locale === "en") return enCopy;
  return uzCopy;
}

async function fetchAllCopyRows(): Promise<CopyRow[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.from("sw_site_copy").select("key, label, payload");
    if (error || !data) return [];
    return data as CopyRow[];
  } catch {
    return [];
  }
}

const cachedRows = unstable_cache(fetchAllCopyRows, ["cms-site-copy-rows"], {
  tags: [CMS_TAGS.siteCopy],
  revalidate: 60,
});

export async function getContentMerged(locale: Locale): Promise<SiteCopy> {
  const seed = seedFor(locale);
  const rows = await cachedRows();
  if (!rows.length) return seed;

  let merged: SiteCopy = seed;
  for (const row of rows) {
    const localePayload = row.payload?.[locale];
    if (localePayload && typeof localePayload === "object") {
      const section = row.key as keyof SiteCopy;
      merged = {
        ...merged,
        [section]: deepMergeCopy(
          merged[section] as unknown as Record<string, unknown>,
          localePayload as Record<string, unknown>,
        ),
      };
    }
  }
  return merged;
}

export async function listSiteCopyRows(): Promise<CopyRow[]> {
  return cachedRows();
}

export async function getSiteCopyRow(key: string): Promise<CopyRow | null> {
  const rows = await cachedRows();
  return rows.find((r) => r.key === key) ?? null;
}
