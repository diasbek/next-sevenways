import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import {
  getResort,
  getDestination,
  offersForResort,
  destinationPath,
} from "@/data/tours/catalog";
import { localePath } from "@/i18n/paths";
import Link from "next/link";
import { PageContainer } from "@/components/atoms/PageContainer";
import { TourCard } from "@/components/molecules/TourCard";
import { Button } from "@/components/atoms/Button";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function ResortPageView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const content = getContent(locale);
  const resort = getResort(slug)!;
  const dest = getDestination(resort.destinationSlug);
  const offers = offersForResort(slug);

  return (
    <section className={section}>
      <PageContainer>
        <p className="text-sm text-ink-muted">
          {dest ? (
            <Link
              href={localePath(locale, destinationPath(dest.slug))}
              className="hover:text-primary"
            >
              {dest.name[locale]}
            </Link>
          ) : null}
        </p>
        <h1 className={`mt-2 ${pageIntroTitle}`}>{resort.name[locale]}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{resort.blurb[locale]}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <TourCard key={offer.id} locale={locale} offer={offer} />
          ))}
        </div>
        {!offers.length ? (
          <p className="mt-8 text-sm text-ink-muted">{content.ui.noResults}</p>
        ) : null}
        <Button
          href={`${localePath(locale, "/request/")}?destination=${resort.destinationSlug}`}
          className="mt-8"
        >
          {content.ui.leaveRequest}
        </Button>
      </PageContainer>
    </section>
  );
}
