import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import type { SiteCopy } from "@/data/types";
import {
  DESTINATIONS,
  RESORTS,
  featuredOffers,
  type Destination,
  type Resort,
  type TourOffer,
} from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import { TourCard } from "@/components/molecules/TourCard";

function BenefitIcon({
  kind,
}: {
  kind: "price" | "hotels" | "support";
}) {
  if (kind === "price") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden>
        <path
          d="M4 8.5h13a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H7.5L4 21.5V8.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 12.5h6M9 15.5h4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "hotels") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden>
        <path
          d="M12 3l7 3v5.5c0 4.2-2.7 7.8-7 9.5-4.3-1.7-7-5.3-7-9.5V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.2 11 13.7l3.5-3.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 12h18M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9S9.5 5.8 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function HotOffersSection({
  locale,
  offers: offersProp,
  destinations = DESTINATIONS,
  resorts = RESORTS,
  content: contentProp,
}: {
  locale: Locale;
  offers?: TourOffer[];
  destinations?: Destination[];
  resorts?: Resort[];
  content?: SiteCopy;
}) {
  const content = contentProp ?? getContent(locale);
  const offers = offersProp ?? featuredOffers();
  const benefits = [
    { kind: "price" as const, label: content.home.hotBenefitPrice },
    { kind: "hotels" as const, label: content.home.hotBenefitHotels },
    { kind: "support" as const, label: content.home.hotBenefitSupport },
  ];

  return (
    <section className="bg-cloud">
      <div className="relative min-h-[220px] overflow-hidden sm:min-h-[260px]">
        <Image
          src="/images/hot/sky-banner.jpg"
          alt=""
          fill
          priority={false}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-deep-blue/55 via-royal/35 to-sky/25"
          aria-hidden
        />
        <PageContainer className="relative z-10 flex min-h-[220px] items-end py-12 sm:min-h-[260px] sm:py-14 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="m-0 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-white">
                {content.home.hotTitle}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-base text-white/90 sm:text-lg">
                {content.home.hotLead}
                <span
                  className="ml-1 hidden items-center gap-1 sm:inline-flex"
                  aria-hidden
                >
                  <span className="h-px w-10 border-t border-dashed border-white/70" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero/icons/plane.svg"
                    alt=""
                    className="size-4 invert opacity-90"
                  />
                </span>
              </p>
            </div>

            <ul className="flex w-full flex-wrap justify-start gap-4 sm:w-auto sm:justify-end sm:gap-8">
              {benefits.map((b) => (
                <li
                  key={b.kind}
                  className="flex min-w-0 flex-1 basis-[30%] flex-col items-center gap-2 text-center text-white sm:min-w-[6.5rem] sm:flex-none sm:basis-auto"
                >
                  <span className="grid size-11 place-items-center rounded-2xl border border-white/35 bg-white/10 backdrop-blur-sm sm:size-12">
                    <BenefitIcon kind={b.kind} />
                  </span>
                  <span className="max-w-[7.5rem] text-[0.7rem] font-semibold leading-snug sm:max-w-[8rem] sm:text-sm">
                    {b.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-10 sm:py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <TourCard
              key={offer.id}
              locale={locale}
              offer={offer}
              destinations={destinations}
              resorts={resorts}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink-muted sm:text-sm">
          {content.ui.priceDisclaimer}
        </p>
      </PageContainer>
    </section>
  );
}
