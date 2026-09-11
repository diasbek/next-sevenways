import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getContent } from "@/i18n/get-content";
import {
  DESTINATIONS,
  RESORTS,
  type Destination,
  type Resort,
  type TourOffer,
  destinationPath,
} from "@/data/tours/catalog";
import { Button } from "@/components/atoms/Button";
import { formatMoney } from "@/lib/payments/amount";
import { cn } from "@/lib/cn";

function IconPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 12h18M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9S9.5 5.8 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconMeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 3v8a2 2 0 0 0 2 2h1V3M7 13v8M14 3v18M18 3v6a2 2 0 0 1-2 2h0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 3v4M16 3v4M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TourCard({
  locale,
  offer,
  destinations = DESTINATIONS,
  resorts = RESORTS,
}: {
  locale: Locale;
  offer: TourOffer;
  destinations?: Destination[];
  resorts?: Resort[];
}) {
  const content = getContent(locale);
  const dest = destinations.find((d) => d.slug === offer.destinationSlug);
  const resort = offer.resortSlug
    ? resorts.find((r) => r.slug === offer.resortSlug)
    : undefined;
  const currency = offer.currency ?? "USD";
  const image = dest?.image ?? "/images/hot/sky-banner.jpg";
  const locationLabel = [
    dest?.name[locale],
    resort?.name[locale],
  ]
    .filter(Boolean)
    .join(", ");

  const requestHref = `${localePath(locale, "/request/")}?destination=${offer.destinationSlug}&hotel=${encodeURIComponent(offer.hotel)}&amount=${offer.pricePerPersonUsd}&currency=${currency}&offerId=${offer.id}`;
  const detailsHref = dest
    ? localePath(locale, destinationPath(dest.slug))
    : requestHref;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_10px_30px_rgb(7_29_69/0.07)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgb(7_93_183/0.14)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={offer.hotel}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight/75 via-midnight/10 to-transparent"
          aria-hidden
        />

        {offer.rating != null ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-royal shadow-sm">
            {offer.rating.toFixed(1)} ★
          </span>
        ) : null}

        <div className="absolute right-3 top-3 flex max-w-[55%] flex-wrap justify-end gap-1.5">
          {offer.badges?.includes("on_request") ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink-muted shadow-sm">
              {content.ui.onRequest}
            </span>
          ) : null}
          {offer.badges?.includes("seats") ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-royal shadow-sm">
              {content.ui.seatsAvailable}
            </span>
          ) : null}
          {offer.badges?.includes("save") ? (
            <span className="rounded-full bg-yellow px-2.5 py-1 text-[11px] font-semibold text-midnight shadow-sm">
              Sale
            </span>
          ) : null}
        </div>

        {locationLabel ? (
          <p className="absolute bottom-3 left-3 right-3 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-white drop-shadow">
            <IconPin className="size-4 shrink-0 opacity-90" />
            <span className="truncate">{locationLabel}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-midnight">
          {offer.hotel}
        </h3>

        <div className="mt-3 flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <ul className="min-w-0 space-y-2 text-sm text-ink-muted">
            <li className="flex items-start gap-2">
              <IconGlobe className="mt-0.5 size-4 shrink-0 text-sky" />
              <span>
                {dest?.name[locale]}
                {` · ${offer.nights} ${content.ui.nights}`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <IconMeal className="mt-0.5 size-4 shrink-0 text-sky" />
              <span>
                {offer.board[locale]} · {offer.room[locale]}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <IconCalendar className="mt-0.5 size-4 shrink-0 text-sky" />
              <span>
                {offer.dateFrom} → {offer.dateTo}
              </span>
            </li>
          </ul>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-xl font-bold tracking-tight text-royal sm:text-2xl">
              {formatMoney(offer.pricePerPersonUsd, currency, locale)}
            </p>
            <p className="mt-0.5 max-w-[11rem] text-xs text-ink-muted sm:ml-auto">
              {content.ui.perPerson} ·{" "}
              {formatMoney(offer.priceTwoUsd, currency, locale)} —{" "}
              {content.ui.forTwo}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4">
          <Link
            href={detailsHref}
            className={cn(
              "inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline",
            )}
          >
            {content.ui.learnMore}
            <span aria-hidden>→</span>
          </Link>
          <Button href={requestHref} size="sm" className="!rounded-xl">
            {content.ui.leaveRequest}
          </Button>
        </div>
      </div>
    </article>
  );
}
