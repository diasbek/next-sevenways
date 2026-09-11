import { unstable_cache } from "next/cache";
import { OPERATORS, type Operator } from "@/data/operators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  CMS_TAGS,
  cmsReady,
  localizedFromColumns,
  mergeByKey,
} from "@/lib/cms/overlay";

type OperatorRow = {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  role_uz: string;
  role_ru: string;
  role_en: string;
  phone: string;
  telegram: string;
  image_url: string | null;
  is_online: boolean;
  is_published: boolean;
  sort_order: number;
};

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
}

function mapOperator(row: OperatorRow, seed?: Operator): Operator {
  return {
    id: row.id,
    name: localizedFromColumns(row.name_uz, row.name_ru, row.name_en),
    role: localizedFromColumns(row.role_uz, row.role_ru, row.role_en),
    phone: row.phone || seed?.phone || "",
    phoneDisplay: row.phone
      ? formatPhoneDisplay(row.phone)
      : seed?.phoneDisplay || "",
    telegram: row.telegram || seed?.telegram || "",
    image: row.image_url || seed?.image || "/images/operators/dilnoza.jpg",
    online: row.is_online,
  };
}

async function fetchCmsOperators(): Promise<Operator[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_operators")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return [];
    const seedById = new Map(OPERATORS.map((o) => [o.id, o]));
    return (data as OperatorRow[]).map((row) =>
      mapOperator(row, seedById.get(row.id)),
    );
  } catch {
    return [];
  }
}

const cached = unstable_cache(
  async () => mergeByKey(OPERATORS, await fetchCmsOperators(), (o) => o.id),
  ["cms-operators"],
  { tags: [CMS_TAGS.operators], revalidate: 60 },
);

export async function listOperators(): Promise<Operator[]> {
  return cached();
}
