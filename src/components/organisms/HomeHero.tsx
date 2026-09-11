"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { DESTINATIONS } from "@/data/tours/catalog";
import { Button } from "@/components/atoms/Button";
import { PageContainer } from "@/components/atoms/PageContainer";
import { cn } from "@/lib/cn";

type SearchTab = "tours" | "hotels" | "transfers";

function HeroIcon({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" aria-hidden className={cn("size-5", className)} />
  );
}

function HeroSearchForm({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const content = getContent(locale);
  const router = useRouter();
  const [tab, setTab] = useState<SearchTab>("tours");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [travellers, setTravellers] = useState("2");

  const tabs: Array<{ id: SearchTab; label: string; icon: string }> = [
    {
      id: "tours",
      label: content.home.heroTabTours,
      icon: "/images/hero/icons/plane.svg",
    },
    {
      id: "hotels",
      label: content.home.heroTabHotels,
      icon: "/images/hero/icons/hotel.svg",
    },
    {
      id: "transfers",
      label: content.home.heroTabTransfers,
      icon: "/images/hero/icons/transfer.svg",
    },
  ];

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "tours") {
      const params = new URLSearchParams();
      if (destination) params.set("destination", destination);
      if (dates) params.set("dates", dates);
      if (travellers) params.set("travellers", travellers);
      const q = params.toString();
      router.push(
        `${localePath(locale, "/search/")}${q ? `?${q}` : ""}`,
      );
      return;
    }
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (dates) params.set("dates", dates);
    params.set(
      "comment",
      tab === "hotels" ? "Hotels inquiry" : "Transfer inquiry",
    );
    router.push(
      `${localePath(locale, "/request/")}${params.toString() ? `?${params}` : ""}`,
    );
  }

  return (
    <form
      onSubmit={onSearch}
      className={cn(
        "rounded-2xl border border-black/5 bg-white/95 p-3.5 shadow-[0_18px_50px_rgb(16_32_43/0.16)] backdrop-blur-sm sm:rounded-3xl sm:p-4",
        className,
      )}
    >
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted/80 p-1">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[0.7rem] font-semibold leading-tight transition sm:text-xs",
                active
                  ? "bg-white text-primary shadow-sm"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              <HeroIcon
                src={t.icon}
                className={cn(
                  "size-4 shrink-0",
                  active ? "opacity-100" : "opacity-60",
                )}
              />
              <span className="line-clamp-2 text-center">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 divide-y divide-black/8 rounded-xl border border-black/8 bg-white">
        <label className="flex items-center gap-2.5 px-3 py-2.5">
          <HeroIcon
            src="/images/hero/icons/pin.svg"
            className="size-4 shrink-0 text-primary opacity-80"
          />
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="min-w-0 w-full appearance-none bg-transparent text-sm text-ink outline-none"
            aria-label={content.home.heroWhere}
          >
            <option value="">{content.home.heroWhere}</option>
            {DESTINATIONS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name[locale]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2.5 px-3 py-2.5">
          <HeroIcon
            src="/images/hero/icons/calendar.svg"
            className="size-4 shrink-0 opacity-70"
          />
          <input
            type="text"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder={content.home.heroDates}
            className="min-w-0 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </label>
        <label className="flex items-center gap-2.5 px-3 py-2.5">
          <HeroIcon
            src="/images/hero/icons/users.svg"
            className="size-4 shrink-0 opacity-70"
          />
          <select
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
            className="min-w-0 w-full appearance-none bg-transparent text-sm text-ink outline-none"
            aria-label={content.search.travellers}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={String(n)}>
                {n} {content.home.heroPeople}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Button
        type="submit"
        width="full"
        size="md"
        className="mt-3 !rounded-xl gap-2 shadow-[0_8px_22px_rgb(7_93_183/0.28)]"
      >
        <HeroIcon
          src="/images/hero/icons/search.svg"
          className="size-4 invert"
        />
        {content.home.heroSearchCta}
      </Button>
    </form>
  );
}

export function HomeHero({ locale }: { locale: Locale }) {
  const content = getContent(locale);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#f5fbff_0%,#ffffff_52%,#e4f3fc_100%)]">
      <PageContainer className="py-5 sm:py-8 lg:py-10">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-[radial-gradient(120%_90%_at_12%_88%,#d4ebf9_0%,transparent_42%),linear-gradient(145deg,#f8fcff_0%,#eaf5fc_48%,#ffffff_100%)] px-4 py-6 shadow-[0_24px_60px_rgb(7_29_69/0.08)] sm:rounded-[2.25rem] sm:px-8 sm:py-10 lg:min-h-[34rem] lg:px-10 lg:py-12 xl:min-h-[36rem]">
          <div
            className="pointer-events-none absolute bottom-[8%] left-[4%] hidden h-40 w-56 opacity-[0.18] lg:block"
            aria-hidden
          >
            <HeroIcon
              src="/images/hero/icons/world-route.svg"
              className="size-full text-primary"
            />
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-12">
            <div className="relative z-10 max-w-xl xl:max-w-2xl">
              <Image
                src="/images/hero/logo/seven-ways-tour-logo.png"
                alt="Seven Ways Tour"
                width={220}
                height={186}
                priority
                className="h-auto w-[8.5rem] animate-hero-rise sm:w-[11rem]"
              />

              <h1 className="mt-5 animate-hero-rise font-display text-[clamp(1.65rem,4.2vw,2.85rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-deep-blue [animation-delay:60ms]">
                {content.home.heroTitle}
              </h1>
              <p className="mt-3 max-w-[34ch] animate-hero-rise text-[0.95rem] leading-relaxed text-ink-muted [animation-delay:120ms] sm:text-base">
                {content.home.heroLead}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 animate-hero-rise [animation-delay:180ms] sm:mt-7">
                <Button
                  href={localePath(locale, "/tours/")}
                  size="lg"
                  className="!rounded-2xl gap-2 shadow-[0_10px_28px_rgb(7_93_183/0.28)]"
                >
                  {content.ui.viewTours}
                  <HeroIcon
                    src="/images/hero/icons/arrow-right.svg"
                    className="size-4 invert"
                  />
                </Button>
                <Button
                  href={localePath(locale, "/request/")}
                  variant="outline"
                  size="lg"
                  className="!rounded-2xl border-primary/25 bg-white/80 text-ink"
                >
                  {content.ui.leaveRequest}
                </Button>
              </div>

              <dl className="mt-7 grid max-w-md grid-cols-2 gap-3 animate-hero-rise [animation-delay:240ms] sm:mt-8 sm:grid-cols-3">
                <div className="min-w-0">
                  <dt className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                    10K+
                  </dt>
                  <dd className="mt-0.5 text-xs leading-snug text-ink-muted">
                    {content.home.trustTourists}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                    4+
                  </dt>
                  <dd className="mt-0.5 text-xs leading-snug text-ink-muted">
                    {content.home.trustOffices}
                  </dd>
                </div>
                <div className="min-w-0 col-span-2 sm:col-span-1">
                  <dt className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                    24/7
                  </dt>
                  <dd className="mt-0.5 text-xs leading-snug text-ink-muted">
                    {content.home.trustSupport}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 animate-hero-rise font-[family-name:var(--font-script)] text-2xl text-sky [animation-delay:300ms] sm:mt-8 sm:text-[1.75rem]">
                {content.home.heroScript}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
              <div className="relative mx-auto aspect-[5/4] w-full overflow-hidden sm:aspect-[6/5] lg:aspect-[5/4] lg:min-h-[28rem] lg:overflow-visible">
                <div className="absolute left-[2%] top-[2%] z-[1] w-[48%] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_14px_36px_rgb(16_32_43/0.14)] sm:rounded-3xl -rotate-2">
                  <Image
                    src="/images/hero/destination-resort.jpg"
                    alt=""
                    width={640}
                    height={420}
                    className="aspect-[4/3] h-auto w-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute right-[4%] top-0 z-[1] w-[42%] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_14px_36px_rgb(16_32_43/0.14)] sm:rounded-3xl rotate-3">
                  <Image
                    src="/images/hero/destination-lagoon.jpg"
                    alt=""
                    width={480}
                    height={640}
                    className="aspect-[3/4] h-auto w-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute bottom-[8%] left-[0%] z-[1] w-[40%] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_14px_36px_rgb(16_32_43/0.14)] sm:rounded-3xl -rotate-3">
                  <Image
                    src="/images/hero/flight-window.jpg"
                    alt=""
                    width={520}
                    height={360}
                    className="aspect-[5/3] h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute bottom-[2%] left-[28%] z-[1] w-[38%] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_14px_36px_rgb(16_32_43/0.14)] sm:rounded-3xl rotate-1">
                  <Image
                    src="/images/hero/tropical-beach.jpg"
                    alt=""
                    width={520}
                    height={360}
                    className="aspect-[5/3] h-auto w-full object-cover"
                  />
                </div>

                <div className="pointer-events-none absolute -right-[2%] bottom-[-4%] z-[2] w-[38%] sm:-right-[6%] sm:bottom-[-6%] sm:w-[46%] lg:w-[48%]">
                  <Image
                    src="/images/hero/suitcase-accent.jpg"
                    alt=""
                    width={720}
                    height={989}
                    className="h-auto w-full object-contain mix-blend-multiply drop-shadow-[0_28px_40px_rgb(16_32_43/0.18)]"
                  />
                </div>

                <HeroSearchForm
                  locale={locale}
                  className="absolute left-1/2 top-[38%] z-[3] hidden w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 lg:left-[42%] lg:top-[42%] lg:block"
                />
              </div>

              <HeroSearchForm
                locale={locale}
                className="relative z-[3] mt-4 w-full lg:hidden"
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
