import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ComingSoonGate } from "@/components/coming-soon/ComingSoonGate";
import { SITE_CONFIG } from "@/utils/consts";
import { locales, type Locale, localeLabels } from "@/i18n/config";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Coming soon — Seven Ways",
  description: "Seven Ways website is under construction.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string; lang?: string }>;
};

const COPY: Record<
  Locale,
  { title: string; lead: string; enter: string; error: string }
> = {
  uz: {
    title: "Sayt tez orada ochiladi",
    lead: "Toshkentdan yangi yoʻnalishlar va qulay sayohatlar tayyorlanmoqda.",
    enter: "Kirish",
    error: "Notoʻgʻri kod. Qayta urinib koʻring.",
  },
  ru: {
    title: "Сайт скоро откроется",
    lead: "Мы готовим новые маршруты и удобные путешествия из Ташкента.",
    enter: "Войти",
    error: "Неверный код. Попробуйте ещё раз.",
  },
  en: {
    title: "The site opens soon",
    lead: "We’re preparing new routes and easy trips from Tashkent.",
    enter: "Enter",
    error: "Wrong code. Please try again.",
  },
};

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  if (raw.startsWith("/coming-soon")) return "/";
  return raw;
}

function resolveLang(raw: string | undefined): Locale {
  if (raw === "ru" || raw === "en" || raw === "uz") return raw;
  return "uz";
}

function langHref(lang: Locale, nextPath: string) {
  const params = new URLSearchParams();
  params.set("lang", lang);
  if (nextPath && nextPath !== "/") params.set("next", nextPath);
  return `/coming-soon/?${params.toString()}`;
}

export default async function ComingSoonPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const lang = resolveLang(params.lang);
  const copy = COPY[lang];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-deep-blue text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_20%,rgba(20,152,229,0.28),transparent_55%),radial-gradient(70%_60%_at_90%_80%,rgba(7,93,183,0.4),transparent_50%),linear-gradient(165deg,#041f52_0%,#062e73_48%,#075db7_100%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[90rem] flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div className="flex justify-end">
          <nav
            aria-label="Language"
            className="flex items-center gap-4 text-sm font-semibold tracking-wide text-white/70"
          >
            {locales.map((locale) => {
              const active = locale === lang;
              return (
                <Link
                  key={locale}
                  href={langHref(locale, nextPath)}
                  className={cn(
                    "transition hover:text-white",
                    active && "text-white underline decoration-2 underline-offset-8",
                  )}
                  hrefLang={locale}
                >
                  {localeLabels[locale]}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-xl">
            <div className="inline-flex rounded-2xl bg-white p-3 shadow-[0_16px_40px_rgb(0_0_0/0.2)] sm:p-3.5">
              <Image
                src="/images/coming-soon/logo.png"
                alt={SITE_CONFIG.name}
                width={120}
                height={102}
                priority
                className="h-14 w-auto sm:h-16"
                unoptimized
              />
            </div>

            <h1 className="mt-8 m-0 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.03em] text-white">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              {copy.lead}
            </p>

            <ComingSoonGate
              nextPath={nextPath}
              enterLabel={copy.enter}
              errorLabel={copy.error}
            />

            <p className="mt-10 text-sm text-white/70 sm:mt-12">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="transition hover:text-white"
              >
                {SITE_CONFIG.phoneDisplay}
              </a>
              {SITE_CONFIG.email ? (
                <>
                  {" · "}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="transition hover:text-white"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </>
              ) : null}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <div className="grid gap-3 sm:gap-4">
              <div className="relative aspect-[755/395] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_18px_40px_rgb(0_0_0/0.25)] sm:rounded-3xl">
                <Image
                  src="/images/coming-soon/travel-landmark.png"
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative aspect-[6/5] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_14px_32px_rgb(0_0_0/0.22)] sm:rounded-3xl">
                  <Image
                    src="/images/coming-soon/travel-tropical.png"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[6/5] overflow-hidden rounded-2xl border-[3px] border-white shadow-[0_14px_32px_rgb(0_0_0/0.22)] sm:rounded-3xl">
                  <Image
                    src="/images/coming-soon/travel-airplane.png"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
