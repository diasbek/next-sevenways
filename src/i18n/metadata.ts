import type { Locale, PageKey } from "@/i18n/config";
import { ogLocale, pagePaths } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import type { SiteCopy } from "@/data/types";
import { getLocalizedAlternates, localePath } from "@/i18n/paths";
import { createPageMetadata } from "@/utils/seo/metadata";

const metaTitleKey: Record<PageKey, keyof SiteCopy["meta"]> = {
  home: "homeTitle",
  tours: "toursTitle",
  search: "searchTitle",
  calendar: "calendarTitle",
  gifts: "giftsTitle",
  offices: "officesTitle",
  request: "requestTitle",
  faq: "faqTitle",
  about: "aboutTitle",
  news: "newsTitle",
  contacts: "contactsTitle",
  privacy: "privacyTitle",
  terms: "termsTitle",
  notFound: "notFoundTitle",
};

const metaDescKey: Partial<Record<PageKey, keyof SiteCopy["meta"]>> = {
  home: "homeDescription",
  tours: "toursDescription",
  search: "searchDescription",
  calendar: "calendarDescription",
  gifts: "giftsDescription",
  offices: "officesDescription",
  request: "requestDescription",
  faq: "faqDescription",
  about: "aboutDescription",
  news: "newsDescription",
  contacts: "contactsDescription",
  privacy: "privacyDescription",
  terms: "termsDescription",
};

export async function getLocalizedPageMetadata(
  locale: Locale,
  page: PageKey,
) {
  const content = await getContentAsync(locale);
  const path = localePath(locale, pagePaths[page]);
  const title = content.meta[metaTitleKey[page]];
  const descKey = metaDescKey[page];
  const description = descKey
    ? String(content.meta[descKey])
    : content.meta.homeDescription;
  const alternates = getLocalizedAlternates(pagePaths[page]);

  return createPageMetadata(title, description, path, {
    locale,
    ogLocale: ogLocale[locale],
    alternates,
    noIndex: page === "request" || page === "notFound",
  });
}
