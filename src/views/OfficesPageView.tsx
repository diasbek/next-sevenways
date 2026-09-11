import type { Locale } from "@/i18n/config";
import { OfficesSection } from "@/components/organisms/OfficesSection";
import { OperatorsSection } from "@/components/organisms/OperatorsSection";

export function OfficesPageView({ locale }: { locale: Locale }) {
  return (
    <>
      <OfficesSection locale={locale} />
      <OperatorsSection locale={locale} />
    </>
  );
}
