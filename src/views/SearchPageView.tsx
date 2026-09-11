"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { DESTINATIONS, TOUR_OFFERS } from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import { TourCard } from "@/components/molecules/TourCard";
import { Button } from "@/components/atoms/Button";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function SearchPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const params = useSearchParams();
  const [destination, setDestination] = useState(
    () => params.get("destination") ?? "",
  );
  const [budget, setBudget] = useState("");

  const results = useMemo(() => {
    return TOUR_OFFERS.filter((o) => {
      if (destination && o.destinationSlug !== destination) return false;
      if (budget && o.pricePerPersonUsd > Number(budget)) return false;
      return true;
    }).sort((a, b) => a.pricePerPersonUsd - b.pricePerPersonUsd);
  }, [destination, budget]);

  return (
    <section className={section}>
      <PageContainer>
        <h1 className={pageIntroTitle}>{content.search.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.search.lead}</p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-black/8 bg-white p-5 sm:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">{content.search.destination}</span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
            >
              <option value="">{content.ui.allDestinations}</option>
              {DESTINATIONS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block font-medium">{content.search.budget}</span>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5"
              placeholder="800"
            />
          </label>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setDestination("");
                setBudget("");
              }}
            >
              {content.ui.reset}
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {results.map((offer) => (
            <TourCard key={offer.id} locale={locale} offer={offer} />
          ))}
        </div>
        {!results.length ? (
          <p className="mt-8 text-sm text-ink-muted">{content.ui.noResults}</p>
        ) : null}
        <p className="mt-6 text-xs text-ink-muted">{content.ui.priceDisclaimer}</p>
      </PageContainer>
    </section>
  );
}
