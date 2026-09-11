import { unstable_cache } from "next/cache";
import { OFFICES, type LocalizedOffice } from "@/data/offices";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  CMS_TAGS,
  cmsReady,
  localizedFromColumns,
  mergeByKey,
} from "@/lib/cms/overlay";

type OfficeRow = {
  id: string;
  city_uz: string;
  city_ru: string;
  city_en: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  address_uz: string;
  address_ru: string;
  address_en: string;
  phones: string[] | null;
  lat: number | null;
  lng: number | null;
  image_url: string | null;
  city_key: string | null;
  is_published: boolean;
  sort_order: number;
};

function inferCityKey(
  id: string,
  cityKey: string | null,
  cityUz: string,
): LocalizedOffice["cityKey"] {
  if (cityKey === "tashkent" || cityKey === "samarkand") return cityKey;
  if (id.includes("samarkand") || /samarqand|самарканд/i.test(cityUz)) {
    return "samarkand";
  }
  return "tashkent";
}

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
}

function mapOffice(row: OfficeRow, seed?: LocalizedOffice): LocalizedOffice {
  const phones = row.phones?.length ? row.phones : seed?.phones ?? [];
  return {
    id: row.id,
    cityKey: inferCityKey(row.id, row.city_key, row.city_uz),
    city: localizedFromColumns(row.city_uz, row.city_ru, row.city_en),
    name: localizedFromColumns(row.name_uz, row.name_ru, row.name_en),
    address: localizedFromColumns(
      row.address_uz,
      row.address_ru,
      row.address_en,
    ),
    phones,
    phoneDisplay: phones[0]
      ? formatPhoneDisplay(phones[0])
      : seed?.phoneDisplay ?? "",
    lat: row.lat ?? seed?.lat ?? 41.3111,
    lng: row.lng ?? seed?.lng ?? 69.2797,
    image: row.image_url || seed?.image,
  };
}

async function fetchCmsOffices(): Promise<LocalizedOffice[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_offices")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return [];
    const seedById = new Map(OFFICES.map((o) => [o.id, o]));
    return (data as OfficeRow[]).map((row) =>
      mapOffice(row, seedById.get(row.id)),
    );
  } catch {
    return [];
  }
}

const cachedOffices = unstable_cache(
  async () => mergeByKey(OFFICES, await fetchCmsOffices(), (o) => o.id),
  ["cms-offices"],
  { tags: [CMS_TAGS.offices], revalidate: 60 },
);

export async function listOffices(): Promise<LocalizedOffice[]> {
  return cachedOffices();
}
