import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { listOffices } from "@/lib/offices/repository";
import { listOperators } from "@/lib/operators/repository";
import { OfficesSection } from "@/components/organisms/OfficesSection";
import { OperatorsSection } from "@/components/organisms/OperatorsSection";

export async function OfficesPageView({ locale }: { locale: Locale }) {
  const [content, offices, operators] = await Promise.all([
    getContentAsync(locale),
    listOffices(),
    listOperators(),
  ]);
  return (
    <>
      <OfficesSection locale={locale} offices={offices} content={content} />
      <OperatorsSection
        locale={locale}
        operators={operators}
        content={content}
      />
    </>
  );
}
