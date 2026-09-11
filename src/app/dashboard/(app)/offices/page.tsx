import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { OFFICES } from "@/data/offices";
import {
  OfficesAdminClient,
  type OfficeAdminRow,
} from "@/components/dashboard/OfficesAdminClient";

export default async function OfficesAdminPage() {
  const user = await requireDashboardUser("offices");
  const cmsReady = hasSupabaseAdminConfig();
  let offices: OfficeAdminRow[] = [];

  if (cmsReady) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_offices")
      .select(
        "id, city_uz, city_ru, city_en, name_uz, name_ru, name_en, address_uz, address_ru, address_en, phones, lat, lng, is_published, sort_order",
      )
      .order("sort_order");
    offices = (data as OfficeAdminRow[]) ?? [];
  }

  return (
    <OfficesAdminClient
      offices={offices}
      seedOffices={OFFICES.map((o) => ({
        id: o.id,
        nameEn: o.name.en,
        cityEn: o.city.en,
        addressEn: o.address.en,
        phones: o.phones,
      }))}
      canWrite={canMutate(user.role, "offices")}
      cmsReady={cmsReady}
    />
  );
}
