import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { OPERATORS } from "@/data/operators";
import {
  OperatorsAdminClient,
  type OperatorAdminRow,
} from "@/components/dashboard/OperatorsAdminClient";

export default async function OperatorsAdminPage() {
  const user = await requireDashboardUser("operators");
  const cmsReady = hasSupabaseAdminConfig();
  let operators: OperatorAdminRow[] = [];

  if (cmsReady) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_operators")
      .select(
        "id, name_uz, name_ru, name_en, role_uz, role_ru, role_en, phone, telegram, image_url, is_online, is_published, sort_order",
      )
      .order("sort_order");
    operators = (data as OperatorAdminRow[]) ?? [];
  }

  return (
    <OperatorsAdminClient
      operators={operators}
      seedOperators={OPERATORS.map((o) => ({
        id: o.id,
        nameEn: o.name.en,
        roleEn: o.role.en,
        phone: o.phone,
      }))}
      canWrite={canMutate(user.role, "operators")}
      cmsReady={cmsReady}
    />
  );
}
