"use client";

import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { PageContainer } from "@/components/atoms/PageContainer";
import { RequestTourForm } from "@/components/organisms/RequestTourForm";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function RequestPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const params = useSearchParams();
  const destination = params.get("destination") ?? "";
  const hotel = params.get("hotel") ?? "";

  return (
    <section className={section}>
      <PageContainer className="max-w-xl">
        <h1 className={pageIntroTitle}>{content.request.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.request.lead}</p>
        <div className="mt-8">
          <RequestTourForm
            locale={locale}
            initialDestination={destination}
            initialHotel={hotel}
          />
        </div>
      </PageContainer>
    </section>
  );
}
