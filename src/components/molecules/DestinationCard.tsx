import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { getContent } from "@/i18n/get-content";
import { type Destination, destinationPath } from "@/data/tours/catalog";
import { formatMoney } from "@/lib/payments/amount";
import { cn } from "@/lib/cn";

export function DestinationCard({
  locale,
  destination,
  className,
}: {
  locale: Locale;
  destination: Destination;
  className?: string;
}) {
  const content = getContent(locale);
  const currency = destination.fromCurrency ?? "USD";
  const price = formatMoney(destination.fromPriceUsd, currency, locale);

  return (
    <Link
      href={localePath(locale, destinationPath(destination.slug))}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-[0_8px_28px_rgb(7_29_69/0.06)] transition duration-300",
        "hover:-translate-y-0.5 hover:border-royal/40 hover:shadow-[0_14px_36px_rgb(7_93_183/0.14)]",
        className,
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name[locale]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-midnight/15 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:p-4">
          <p className="text-lg font-bold tracking-tight text-white drop-shadow-sm sm:text-xl">
            {destination.name[locale]}
          </p>
          <span className="shrink-0 rounded-full bg-royal px-2.5 py-1 text-[0.7rem] font-semibold text-white sm:text-xs">
            {content.ui.fromPrice} {price}
          </span>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-between gap-3 px-4 py-3.5">
        <p className="line-clamp-2 text-sm leading-snug text-ink-muted">
          {destination.blurb[locale]}
        </p>
        <span
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-sky-tint text-royal transition group-hover:bg-royal group-hover:text-white"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/icons/arrow-right.svg"
            alt=""
            className="size-3.5"
          />
        </span>
      </div>
    </Link>
  );
}
