"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { OFFICES, type LocalizedOffice } from "@/data/offices";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";

type CityKey = "tashkent" | "samarkand";

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

function IconPhone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 3.5 8 3l2 5-2.3 1.8a14 14 0 0 0 6.5 6.5L16 14l5 2 .5 3c.2 1.2-.8 2-2 2C10.5 21 3 13.5 3 4.5c0-1.2.8-1.2 2-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconNav({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3 4.5 19.5 12 15.5l7.5 4L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 19c.6-3 2.8-4.8 5.5-4.8S14.4 16 15 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16.2 14.4c2 .3 3.6 1.7 4.3 4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function mapsDirectionsUrl(office: LocalizedOffice) {
  return `https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`;
}

export function OfficesSection({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const [city, setCity] = useState<CityKey>("tashkent");
  const [openId, setOpenId] = useState<string>("central");

  const offices = useMemo(() => {
    const filtered = OFFICES.filter((o) => o.cityKey === city);
    return filtered.length ? filtered : OFFICES;
  }, [city]);

  const samarkand = OFFICES.find((o) => o.cityKey === "samarkand");

  return (
    <section className="relative overflow-hidden bg-cloud">
      <div className="relative min-h-[200px] sm:min-h-[240px]">
        <Image
          src="/images/offices/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-deep-blue/65 via-royal/40 to-transparent"
          aria-hidden
        />
        <PageContainer className="relative z-10 flex min-h-[200px] items-end py-10 sm:min-h-[240px] sm:py-12">
          <div className="max-w-2xl">
            <h1 className="m-0 font-display text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-white">
              {content.offices.title}
            </h1>
            <p className="mt-3 text-base text-white/90 sm:text-lg">
              {content.offices.lead}
            </p>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="relative z-10 -mt-6 pb-12 sm:-mt-8 sm:pb-16">
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_20px_50px_rgb(7_29_69/0.1)]">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="relative min-h-[280px] border-b border-black/5 bg-sky-tint/40 p-3 sm:min-h-[360px] sm:p-4 lg:border-b-0 lg:border-r">
              <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2 sm:left-5 sm:top-5">
                {(
                  [
                    ["tashkent", content.offices.cityTashkent],
                    ["samarkand", content.offices.citySamarkand],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setCity(key);
                      const first = OFFICES.find((o) => o.cityKey === key);
                      if (first) setOpenId(first.id);
                    }}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                      city === key
                        ? "bg-deep-blue text-white shadow-[0_8px_18px_rgb(6_46_115/0.28)]"
                        : "border border-black/10 bg-white text-midnight hover:border-royal/30",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl sm:min-h-[340px]">
                <Image
                  src="/images/offices/tashkent-map.png"
                  alt={content.offices.mapTitle}
                  fill
                  className={cn(
                    "object-cover object-center transition duration-500",
                    city === "samarkand" && "scale-110 opacity-80 blur-[1px]",
                  )}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                {city === "samarkand" && samarkand ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-deep-blue/25 p-6">
                    <div className="rounded-2xl bg-white px-5 py-4 text-center shadow-lg">
                      <span className="mx-auto grid size-9 place-items-center rounded-full bg-royal text-sm font-bold text-white">
                        {OFFICES.findIndex((o) => o.id === samarkand.id) + 1}
                      </span>
                      <p className="mt-2 text-sm font-bold text-midnight">
                        {content.offices.citySamarkand}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {samarkand.address[locale]}
                      </p>
                    </div>
                  </div>
                ) : null}
                {city === "tashkent" && samarkand ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCity("samarkand");
                      setOpenId(samarkand.id);
                    }}
                    className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-left text-xs font-semibold text-midnight shadow-md backdrop-blur sm:bottom-4 sm:left-4"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-royal text-[11px] font-bold text-white">
                      {OFFICES.findIndex((o) => o.id === samarkand.id) + 1}
                    </span>
                    {content.offices.citySamarkand}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col">
              <ul className="divide-y divide-black/6 p-2 sm:p-3">
                {offices.map((office) => {
                  const index = OFFICES.findIndex((o) => o.id === office.id) + 1;
                  const open = openId === office.id;
                  return (
                    <li key={office.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(office.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl px-3 py-3.5 text-left transition sm:gap-4 sm:px-4",
                          open ? "bg-sky-tint/60" : "hover:bg-cloud",
                        )}
                        aria-expanded={open}
                      >
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-royal text-sm font-bold text-white">
                          {index}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                            {office.city[locale]}
                          </span>
                          <span className="mt-0.5 block text-base font-bold text-midnight">
                            {office.name[locale]}
                          </span>
                          {!open ? (
                            <span className="mt-1.5 flex flex-col gap-1 text-sm text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-4">
                              <span className="inline-flex items-center gap-1.5">
                                <IconPin className="size-3.5 text-sky" />
                                {office.address[locale]}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <IconPhone className="size-3.5 text-sky" />
                                {office.phoneDisplay}
                              </span>
                            </span>
                          ) : null}
                        </span>
                        {!open ? (
                          <span
                            className="mt-2 text-lg text-ink-muted"
                            aria-hidden
                          >
                            ›
                          </span>
                        ) : null}
                      </button>

                      {open ? (
                        <div className="px-3 pb-4 sm:px-4 sm:pb-5">
                          <div className="flex flex-col gap-4 pl-12 sm:flex-row sm:items-start">
                            <div className="min-w-0 flex-1 space-y-2 text-sm text-ink-muted">
                              <p className="inline-flex items-center gap-2">
                                <IconPin className="size-4 text-sky" />
                                {office.address[locale]}
                              </p>
                              <p className="inline-flex items-center gap-2">
                                <IconPhone className="size-4 text-sky" />
                                <a
                                  href={`tel:${office.phones[0]}`}
                                  className="text-midnight hover:text-royal"
                                >
                                  {office.phoneDisplay}
                                </a>
                              </p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Button
                                  href={mapsDirectionsUrl(office)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  className="!rounded-xl"
                                >
                                  <IconNav className="size-4" />
                                  {content.offices.buildRoute}
                                </Button>
                                <Button
                                  href={`tel:${office.phones[0]}`}
                                  size="sm"
                                  variant="outline"
                                  className="!rounded-xl !border-royal !text-royal"
                                >
                                  <IconPhone className="size-4" />
                                  {content.offices.call}
                                </Button>
                              </div>
                            </div>
                            {office.image ? (
                              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-40">
                                <Image
                                  src={office.image}
                                  alt={office.name[locale]}
                                  fill
                                  className="object-cover"
                                  sizes="160px"
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-col gap-2 border-t border-black/5 bg-sky-tint/50 px-4 py-3.5 text-sm text-midnight sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5">
                <p className="inline-flex min-w-0 items-start gap-2.5 font-medium sm:items-center">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-royal/10 text-royal">
                    <IconUsers className="size-4" />
                  </span>
                  <span className="min-w-0">
                    {content.offices.officesCountLabel.replace(
                      "{count}",
                      String(OFFICES.length),
                    )}
                    <span className="text-ink-muted">
                      {" "}
                      • {content.offices.helpInPerson}
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
