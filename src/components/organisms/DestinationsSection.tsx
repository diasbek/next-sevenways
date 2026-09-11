"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import {
  DESTINATIONS,
  type DestinationCategory,
} from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import { DestinationCard } from "@/components/molecules/DestinationCard";
import { cn } from "@/lib/cn";

type FilterId = "all" | DestinationCategory;

export function DestinationsSection({
  locale,
  variant = "home",
}: {
  locale: Locale;
  /** home = cloud band + filters; page = listing chrome */
  variant?: "home" | "page";
}) {
  const content = getContent(locale);
  const [filter, setFilter] = useState<FilterId>("all");

  const filters: Array<{ id: FilterId; label: string }> = [
    { id: "all", label: content.home.destinationsFilterAll },
    { id: "beach", label: content.home.destinationsFilterBeach },
    { id: "excursion", label: content.home.destinationsFilterExcursion },
  ];

  const list = useMemo(() => {
    if (filter === "all") return DESTINATIONS;
    return DESTINATIONS.filter((d) => d.categories.includes(filter));
  }, [filter]);

  const TitleTag = variant === "page" ? "h1" : "h2";

  return (
    <section
      className={cn(
        variant === "home"
          ? "bg-[linear-gradient(180deg,#f5fbff_0%,#e4f3fc_100%)] py-[var(--section-y)]"
          : "bg-[linear-gradient(180deg,#f5fbff_0%,#ffffff_100%)] py-[var(--section-y)]",
      )}
    >
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="max-w-xl">
            <TitleTag className="m-0 font-display text-[clamp(1.65rem,3.5vw,2.35rem)] font-bold tracking-[-0.03em] text-deep-blue">
              {content.home.destinationsTitle}
            </TitleTag>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
              {content.home.destinationsLead}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-1 lg:justify-end lg:gap-6">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label={content.home.destinationsTitle}
            >
              {filters.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-semibold transition",
                      active
                        ? "bg-royal text-white shadow-[0_8px_20px_rgb(7_93_183/0.28)]"
                        : "bg-sky-tint text-royal hover:bg-primary-soft-hover",
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {variant === "home" ? (
              <Link
                href={localePath(locale, "/tours/")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
              >
                {content.ui.allDestinations}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero/icons/arrow-right.svg"
                  alt=""
                  aria-hidden
                  className="size-3.5"
                />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {list.map((d) => (
            <DestinationCard key={d.slug} locale={locale} destination={d} />
          ))}
        </div>
        {!list.length ? (
          <p className="mt-8 text-sm text-ink-muted">{content.ui.noResults}</p>
        ) : null}
      </PageContainer>
    </section>
  );
}
