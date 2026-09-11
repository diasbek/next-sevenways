import type { Locale } from "@/i18n/config";
import type { SiteCopy } from "@/data/types";
import { uzCopy } from "@/data/uz";
import { ruCopy } from "@/data/ru";
import { enCopy } from "@/data/en";

export function getContent(locale: Locale): SiteCopy {
  if (locale === "ru") return ruCopy;
  if (locale === "en") return enCopy;
  return uzCopy;
}
