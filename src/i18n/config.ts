export const locales = ["uz", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

export const localeLabels: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

export const htmlLang: Record<Locale, string> = {
  uz: "uz",
  ru: "ru",
  en: "en",
};

export const ogLocale: Record<Locale, string> = {
  uz: "uz_UZ",
  ru: "ru_UZ",
  en: "en_US",
};

export type PageKey =
  | "home"
  | "tours"
  | "search"
  | "calendar"
  | "gifts"
  | "offices"
  | "request"
  | "faq"
  | "about"
  | "news"
  | "contacts"
  | "privacy"
  | "terms"
  | "notFound";

export const pagePaths: Record<PageKey, string> = {
  home: "/",
  tours: "/tours/",
  search: "/search/",
  calendar: "/calendar/",
  gifts: "/gifts/",
  offices: "/offices/",
  request: "/request/",
  faq: "/faq/",
  about: "/about/",
  news: "/news/",
  contacts: "/contacts/",
  privacy: "/privacy/",
  terms: "/terms/",
  notFound: "/404/",
};
