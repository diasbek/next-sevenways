import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { DESTINATIONS } from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import { DestinationCard } from "@/components/molecules/DestinationCard";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function ToursPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <section className={section}>
      <PageContainer>
        <h1 className={pageIntroTitle}>{content.tours.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.tours.lead}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <DestinationCard key={d.slug} locale={locale} destination={d} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
