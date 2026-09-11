import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { SITE_CONFIG } from "@/utils/consts";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CMS_TAGS, cmsReady } from "@/lib/cms/overlay";

export type PublicSiteContacts = {
  phone: string;
  phoneDisplay: string;
  email: string;
  telegramUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  hours: string;
  hoursDisplayRu: string;
  hoursDisplayUz: string;
  hoursDisplayEn: string;
  address: {
    line: string;
    lineUz: string;
    lineEn: string;
    lat: number;
    lng: number;
  };
};

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone || SITE_CONFIG.phoneDisplay;
}

const seedContacts = (): PublicSiteContacts => ({
  phone: SITE_CONFIG.phone,
  phoneDisplay: SITE_CONFIG.phoneDisplay,
  email: SITE_CONFIG.email,
  telegramUrl: SITE_CONFIG.telegramUrl,
  instagramUrl: SITE_CONFIG.instagramUrl,
  facebookUrl: SITE_CONFIG.facebookUrl,
  hours: SITE_CONFIG.hours,
  hoursDisplayRu: SITE_CONFIG.hoursDisplayRu,
  hoursDisplayUz: SITE_CONFIG.hoursDisplayUz,
  hoursDisplayEn: SITE_CONFIG.hoursDisplayEn,
  address: { ...SITE_CONFIG.address },
});

async function fetchContacts(): Promise<PublicSiteContacts> {
  const seed = seedContacts();
  if (!cmsReady()) return seed;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_site_settings")
      .select(
        "phone, email, telegram_url, instagram_url, facebook_url, hours, address_uz, address_ru, address_en, map_lat, map_lng",
      )
      .eq("id", 1)
      .maybeSingle();
    if (!data) return seed;
    const phone = data.phone?.trim() || seed.phone;
    return {
      phone,
      phoneDisplay: formatPhoneDisplay(phone),
      email: data.email?.trim() || seed.email,
      telegramUrl: data.telegram_url?.trim() || seed.telegramUrl,
      instagramUrl: data.instagram_url?.trim() || seed.instagramUrl,
      facebookUrl: data.facebook_url?.trim() || seed.facebookUrl,
      hours: data.hours?.trim() || seed.hours,
      hoursDisplayRu: data.hours?.trim() || seed.hoursDisplayRu,
      hoursDisplayUz: data.hours?.trim() || seed.hoursDisplayUz,
      hoursDisplayEn: data.hours?.trim() || seed.hoursDisplayEn,
      address: {
        line: data.address_ru?.trim() || seed.address.line,
        lineUz: data.address_uz?.trim() || seed.address.lineUz,
        lineEn: data.address_en?.trim() || seed.address.lineEn,
        lat: Number(data.map_lat) || seed.address.lat,
        lng: Number(data.map_lng) || seed.address.lng,
      },
    };
  } catch {
    return seed;
  }
}

const cachedContacts = unstable_cache(fetchContacts, ["cms-site-contacts"], {
  tags: [CMS_TAGS.settings],
  revalidate: 60,
});

export async function getPublicSiteContacts(): Promise<PublicSiteContacts> {
  return cachedContacts();
}

export function addressForLocale(
  contacts: PublicSiteContacts,
  locale: Locale,
): string {
  if (locale === "ru") return contacts.address.line;
  if (locale === "en") return contacts.address.lineEn;
  return contacts.address.lineUz;
}

export function hoursForLocale(
  contacts: PublicSiteContacts,
  locale: Locale,
): string {
  if (locale === "ru") return contacts.hoursDisplayRu;
  if (locale === "en") return contacts.hoursDisplayEn;
  return contacts.hoursDisplayUz;
}
