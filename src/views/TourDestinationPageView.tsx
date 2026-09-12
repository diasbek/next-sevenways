import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { PageContainer } from "@/components/atoms/PageContainer";
import { TourCard } from "@/components/molecules/TourCard";
import { Button } from "@/components/atoms/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTouristTripSchema } from "@/utils/seo/json-ld";
import { destinationPath, resortPath } from "@/data/tours/catalog";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";
import { formatMoney } from "@/lib/payments/amount";
import {
  getDestinationBySlug,
  listDestinations,
  listResorts,
  offersForDestinationSlug,
} from "@/lib/tours/repository";
import { notFound } from "next/navigation";

export async function TourDestinationPageView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const [content, dest, offers, destinations, resortsAll] = await Promise.all([
    getContentAsync(locale),
    getDestinationBySlug(slug),
    offersForDestinationSlug(slug),
    listDestinations(),
    listResorts(),
  ]);
  if (!dest) notFound();
  const resorts = resortsAll.filter((r) => r.destinationSlug === slug);

  return (
    <>
      <JsonLd
        id={`tour-${slug}`}
        data={getTouristTripSchema({
          name: dest.name[locale],
          description: dest.blurb[locale],
          path: localePath(locale, destinationPath(slug)),
        })}
      />
      <section className={section}>
        <PageContainer>
          <h1 className={pageIntroTitle}>{dest.name[locale]}</h1>
          <p className={`mt-2 ${pageIntroLead}`}>{dest.blurb[locale]}</p>
          <p className="mt-4 text-sm font-semibold text-primary">
            {content.ui.fromPrice}{" "}
            {formatMoney(
              dest.fromPriceUsd,
              dest.fromCurrency ?? "USD",
              locale,
            )}{" "}
            {content.ui.perPerson}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {content.tours.included.map((item) => (
              <li
                key={item}
                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
          {resorts.length ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-ink">Resorts</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {resorts.map((r) => (
                  <Link
                    key={r.slug}
                    href={localePath(locale, resortPath(r.slug))}
                    className="rounded-lg border border-black/10 px-3 py-1.5 text-sm hover:border-primary/40"
                  >
                    {r.name[locale]}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <TourCard
                key={offer.id}
                locale={locale}
                offer={offer}
                destinations={destinations}
                resorts={resortsAll}
              />
            ))}
          </div>
          {!offers.length ? (
            <p className="mt-8 text-sm text-ink-muted">{content.ui.noResults}</p>
          ) : null}
          <Button
            href={`${localePath(locale, "/request/")}?destination=${slug}`}
            className="mt-8"
          >
            {content.ui.leaveRequest}
          </Button>
          <p className="mt-3 text-xs text-ink-muted">{content.ui.priceDisclaimer}</p>
        </PageContainer>
      </section>
    </>
  );
}
