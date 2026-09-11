"use client";

import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import type { SiteCopy } from "@/data/types";
import { DESTINATIONS, type Destination } from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import {
  RequestTourForm,
  type CheckoutProviderOption,
} from "@/components/organisms/RequestTourForm";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";
import type { BookingMode, MoneyCurrency } from "@/lib/payments/types";

export function RequestPageView({
  locale,
  bookingMode = "lead_only",
  paymentsEnabled = false,
  providerOptions = [],
  destinations = DESTINATIONS,
  content: contentProp,
}: {
  locale: Locale;
  bookingMode?: BookingMode;
  paymentsEnabled?: boolean;
  providerOptions?: CheckoutProviderOption[];
  destinations?: Destination[];
  content?: SiteCopy;
}) {
  const content = contentProp ?? getContent(locale);
  const params = useSearchParams();
  const destination = params.get("destination") ?? "";
  const hotel = params.get("hotel") ?? "";
  const offerId = params.get("offerId") ?? "";
  const currency = (params.get("currency") === "UZS" ? "UZS" : "USD") as MoneyCurrency;
  const amountRaw = params.get("amount");
  const amount = amountRaw ? Number(amountRaw) : undefined;

  return (
    <section className={section}>
      <PageContainer className="max-w-xl">
        <h1 className={pageIntroTitle}>{content.request.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.request.lead}</p>
        {params.get("paid") === "1" ? (
          <p className="mt-4 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm text-ink">
            Payment return received. We will confirm your booking shortly.
          </p>
        ) : null}
        <div className="mt-8">
          <RequestTourForm
            locale={locale}
            initialDestination={destination}
            initialHotel={hotel}
            initialOfferId={offerId}
            initialAmount={amount}
            initialCurrency={currency}
            bookingMode={bookingMode}
            paymentsEnabled={paymentsEnabled}
            providerOptions={providerOptions}
            destinations={destinations}
            content={content}
          />
        </div>
      </PageContainer>
    </section>
  );
}
