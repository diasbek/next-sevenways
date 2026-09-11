import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl, isIndexableDeployment } from "@/utils/seo/indexing";
import { locales, defaultLocale, pagePaths, type Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { DESTINATIONS, RESORTS, destinationPath, resortPath } from "@/data/tours/catalog";
import { listPublishedSlugs } from "@/lib/news/repository";

function abs(path: string) {
  return `${getCanonicalSiteUrl().replace(/\/$/, "")}${path}`;
}

function entry(path: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] = "weekly") {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = abs(localePath(locale, path));
  }
  languages["x-default"] = abs(localePath(defaultLocale, path));
  return {
    url: abs(localePath(defaultLocale, path)),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexableDeployment()) return [];

  const staticPaths = [
    pagePaths.home,
    pagePaths.tours,
    pagePaths.search,
    pagePaths.calendar,
    pagePaths.gifts,
    pagePaths.offices,
    pagePaths.faq,
    pagePaths.about,
    pagePaths.news,
    pagePaths.contacts,
    pagePaths.privacy,
    pagePaths.terms,
  ];

  const items: MetadataRoute.Sitemap = [
    ...staticPaths.map((p) =>
      entry(p, p === "/" ? 1 : 0.8, p === "/" ? "daily" : "weekly"),
    ),
    ...DESTINATIONS.map((d) => entry(destinationPath(d.slug), 0.85, "daily")),
    ...RESORTS.map((r) => entry(resortPath(r.slug), 0.75, "weekly")),
    ...listPublishedSlugs().map((slug) => entry(`/news/${slug}/`, 0.6, "monthly")),
  ];

  return items;
}
