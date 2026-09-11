import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { listDestinations } from "@/lib/tours/repository";
import { DestinationsSection } from "@/components/organisms/DestinationsSection";

export async function ToursPageView({ locale }: { locale: Locale }) {
  const [content, destinations] = await Promise.all([
    getContentAsync(locale),
    listDestinations(),
  ]);
  return (
    <DestinationsSection
      locale={locale}
      variant="page"
      destinations={destinations}
      content={content}
    />
  );
}
