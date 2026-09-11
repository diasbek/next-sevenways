import type { Locale } from "@/i18n/config";
import { DestinationsSection } from "@/components/organisms/DestinationsSection";

export function ToursPageView({ locale }: { locale: Locale }) {
  return <DestinationsSection locale={locale} variant="page" />;
}
