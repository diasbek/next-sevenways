import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getContent } from "@/i18n/get-content";
import {
  DESTINATIONS,
  type TourOffer,
  destinationPath,
} from "@/data/tours/catalog";
import { Button } from "@/components/atoms/Button";
import { formatMoney } from "@/lib/payments/amount";

export function TourCard({
  locale,
  offer,
}: {
  locale: Locale;
  offer: TourOffer;
}) {
  const content = getContent(locale);
  const dest = DESTINATIONS.find((d) => d.slug === offer.destinationSlug);
  const currency = offer.currency ?? "USD";
  const requestHref = `${localePath(locale, "/request/")}?destination=${offer.destinationSlug}&hotel=${encodeURIComponent(offer.hotel)}&amount=${offer.pricePerPersonUsd}&currency=${currency}&offerId=${offer.id}`;

  return (
    <article className="flex flex-col rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          {offer.rating ? (
            <p className="text-xs font-semibold text-primary">{offer.rating} ★</p>
          ) : null}
          <h3 className="mt-1 text-lg font-semibold text-ink">{offer.hotel}</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {dest?.name[locale]}
            {` · ${offer.nights} ${content.ui.nights}`}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {offer.badges?.includes("on_request") ? (
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-ink-muted">
              {content.ui.onRequest}
            </span>
          ) : null}
          {offer.badges?.includes("seats") ? (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
              {content.ui.seatsAvailable}
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-3 text-sm text-ink-muted">
        {offer.board[locale]} · {offer.room[locale]}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        {offer.dateFrom} → {offer.dateTo}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-ink">
            {formatMoney(offer.pricePerPersonUsd, currency, locale)}
          </p>
          <p className="text-xs text-ink-muted">
            {content.ui.perPerson} ·{" "}
            {formatMoney(offer.priceTwoUsd, currency, locale)} —{" "}
            {content.ui.forTwo}
          </p>
        </div>
        <Button href={requestHref} size="sm">
          {content.ui.leaveRequest}
        </Button>
      </div>

      {dest ? (
        <Link
          href={localePath(locale, destinationPath(dest.slug))}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          {content.ui.learnMore}
        </Link>
      ) : null}
    </article>
  );
}
