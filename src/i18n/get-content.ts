import type { Locale } from "@/i18n/config";
import type { SiteCopy } from "@/data/types";
import { uzCopy } from "@/data/uz";
import { ruCopy } from "@/data/ru";
import { enCopy } from "@/data/en";
import { getContentMerged } from "@/lib/site-copy/repository";

/** Sync seed-only — safe for client components. Prefer getContentAsync on the server. */
export function getContent(locale: Locale): SiteCopy {
  if (locale === "ru") return ruCopy;
  if (locale === "en") return enCopy;
  return uzCopy;
}

/** Server: seed + CMS `sw_site_copy` overlay. */
export async function getContentAsync(locale: Locale): Promise<SiteCopy> {
  return getContentMerged(locale);
}
