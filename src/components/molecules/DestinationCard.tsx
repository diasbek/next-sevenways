import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getContent } from "@/i18n/get-content";
import { type Destination, destinationPath } from "@/data/tours/catalog";
import { formatMoney } from "@/lib/payments/amount";

export function DestinationCard({
  locale,
  destination,
}: {
  locale: Locale;
  destination: Destination;
}) {
  const content = getContent(locale);
  const currency = destination.fromCurrency ?? "USD";
  return (
    <Link
      href={localePath(locale, destinationPath(destination.slug))}
      className="group rounded-2xl border border-black/8 bg-white p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
    >
      <p className="text-lg font-semibold text-ink group-hover:text-primary">
        {destination.name[locale]}
      </p>
      <p className="mt-2 text-sm text-ink-muted line-clamp-2">
        {destination.blurb[locale]}
      </p>
      <p className="mt-4 text-sm font-semibold text-primary">
        {content.ui.fromPrice}{" "}
        {formatMoney(destination.fromPriceUsd, currency, locale)}
      </p>
    </Link>
  );
}
