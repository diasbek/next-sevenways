import { getPublicEnv } from "./env";
import { getCanonicalSiteUrl } from "./seo/indexing";

export const SITE_CONFIG = {
  name: "Seven Ways",
  legalName: "Seven Ways",
  title: "Seven Ways — paket turlar Toshkentdan",
  description:
    "Seven Ways — ishonchli turizm agentligi: parvoz, mehmonxona, transfer va sugʻurta bitta narxda. UZ · RU · EN.",
  url: getCanonicalSiteUrl(),
  phone: getPublicEnv("NEXT_PUBLIC_CONTACT_PHONE", "+998901234567"),
  phoneDisplay: "+998 90 123 45 67",
  email: getPublicEnv("NEXT_PUBLIC_CONTACT_EMAIL", "info@sevenways.uz"),
  telegramUrl: getPublicEnv(
    "NEXT_PUBLIC_TELEGRAM_URL",
    "https://t.me/sevenways_uz",
  ),
  instagramUrl: getPublicEnv(
    "NEXT_PUBLIC_INSTAGRAM_URL",
    "https://www.instagram.com/sevenways.uz/",
  ),
  facebookUrl: getPublicEnv(
    "NEXT_PUBLIC_FACEBOOK_URL",
    "https://www.facebook.com/sevenways.uz",
  ),
  hours: getPublicEnv("NEXT_PUBLIC_BUSINESS_HOURS", "Mo-Su 09:00-21:00"),
  hoursDisplayRu: "Пн–Вс 09:00–21:00",
  hoursDisplayUz: "Du–Ya 09:00–21:00",
  hoursDisplayEn: "Mon–Sun 09:00–21:00",
  address: {
    line: "г. Ташкент, ул. Амира Темура, 1",
    lineUz: "Toshkent sh., Amir Temur koʻchasi, 1",
    lineEn: "1 Amir Temur Street, Tashkent",
    lat: Number(getPublicEnv("NEXT_PUBLIC_MAP_LAT", "41.3111")) || 41.3111,
    lng: Number(getPublicEnv("NEXT_PUBLIC_MAP_LNG", "69.2797")) || 69.2797,
  },
  locales: ["uz", "ru", "en"] as const,
  defaultLocale: "uz" as const,
  themeColor: "#0d7377",
  analytics: {
    yandexMetrikaId: getPublicEnv("NEXT_PUBLIC_YM_ID"),
    googleAnalyticsId: getPublicEnv("NEXT_PUBLIC_GA_ID"),
    googleTagManagerId: getPublicEnv("NEXT_PUBLIC_GTM_ID"),
  },
  seo: {
    googleSiteVerification: getPublicEnv(
      "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
    ),
    yandexSiteVerification: getPublicEnv(
      "NEXT_PUBLIC_YANDEX_SITE_VERIFICATION",
    ),
  },
} as const;
