import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";

export function AboutPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);

  return (
    <>
      <section className="relative overflow-hidden bg-cloud">
        <div className="relative min-h-[min(72dvh,34rem)] sm:min-h-[min(68dvh,38rem)]">
          <Image
            src="/images/operators/hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(115deg,rgb(7_29_69/0.82)_0%,rgb(6_46_115/0.55)_42%,rgb(20_152_229/0.18)_100%)]"
            aria-hidden
          />
          <PageContainer className="relative z-10 flex min-h-[min(72dvh,34rem)] flex-col justify-end pb-12 pt-28 sm:min-h-[min(68dvh,38rem)] sm:pb-16 sm:pt-32">
            <div className="max-w-2xl">
              <Image
                src="/images/footer/logo.png"
                alt={SITE_CONFIG.name}
                width={120}
                height={102}
                className="h-12 w-auto brightness-0 invert sm:h-14"
                unoptimized
                priority
              />
              <h1 className="mt-6 m-0 font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
                {content.about.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                {content.about.lead}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={localePath(locale, "/request/")}>
                  {content.ui.leaveRequest}
                </Button>
                <Button
                  href={localePath(locale, "/offices/")}
                  variant="outline"
                  className="!border-white/45 !bg-white/10 !text-white backdrop-blur-sm hover:!bg-white/20"
                >
                  {content.offices.title}
                </Button>
              </div>
            </div>
          </PageContainer>
        </div>
      </section>

      <section className="bg-white py-[var(--section-y)]">
        <PageContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
            <div>
              <p className="m-0 text-sm font-semibold uppercase tracking-[0.16em] text-royal">
                Seven Ways
              </p>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                {content.about.body.map((p) => (
                  <p key={p} className="m-0">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_rgb(7_29_69/0.14)] sm:aspect-[4/3]">
              <Image
                src="/images/offices/central.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="bg-cloud py-[var(--section-y)]">
        <PageContainer>
          <div className="max-w-2xl">
            <h2 className="m-0 font-display text-[clamp(1.65rem,3.5vw,2.35rem)] font-bold tracking-[-0.03em] text-deep-blue">
              {content.about.stepsTitle}
            </h2>
            <p className="mt-3 text-base text-ink-muted sm:text-lg">
              {content.about.lead}
            </p>
          </div>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {content.about.steps.map((step, i) => (
              <li key={step.title} className="relative min-w-0">
                {i < content.about.steps.length - 1 ? (
                  <span
                    className="pointer-events-none absolute left-[2.25rem] top-5 hidden h-px w-[calc(100%-1rem)] bg-royal/20 lg:block"
                    aria-hidden
                  />
                ) : null}
                <p className="relative z-[1] m-0 inline-flex size-10 items-center justify-center rounded-full bg-royal text-sm font-bold text-white shadow-[0_10px_22px_rgb(7_93_183/0.28)]">
                  {i + 1}
                </p>
                <h3 className="mt-4 m-0 text-lg font-bold text-midnight">
                  {step.title}
                </h3>
                <p className="mt-2 m-0 text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="bg-white py-[var(--section-y)]">
        <PageContainer>
          <h2 className="m-0 max-w-xl font-display text-[clamp(1.65rem,3.5vw,2.35rem)] font-bold tracking-[-0.03em] text-deep-blue">
            {content.about.principlesTitle}
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {content.about.principles.map((principle, i) => {
              const [label, ...rest] = principle.split(":");
              const detail = rest.join(":").trim();
              return (
                <li key={principle} className="min-w-0 border-t border-royal/20 pt-5">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-sky">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 m-0 text-base font-bold text-midnight">
                    {detail ? label : principle}
                  </p>
                  {detail ? (
                    <p className="mt-2 m-0 text-sm leading-relaxed text-ink-muted">
                      {detail}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </PageContainer>
      </section>

      <section className="pb-[var(--section-y)]">
        <PageContainer>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(145deg,#041f52_0%,#062e73_42%,#075db7_100%)] px-6 py-10 text-white shadow-[0_24px_50px_rgb(7_46_115/0.28)] sm:px-10 sm:py-12 lg:px-14">
            <div
              className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-sky/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-10 size-56 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-xl">
                <h2 className="m-0 font-display text-[clamp(1.55rem,3.2vw,2.15rem)] font-bold tracking-[-0.03em]">
                  {content.home.ctaTitle}
                </h2>
                <p className="mt-3 m-0 text-base text-white/80 sm:text-lg">
                  {content.home.ctaLead}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  href={localePath(locale, "/request/")}
                  className="!bg-white !text-deep-blue hover:!bg-cloud"
                >
                  {content.ui.leaveRequest}
                </Button>
                <Button
                  href={localePath(locale, "/offices/")}
                  variant="outline"
                  className="!border-white/40 !bg-transparent !text-white hover:!bg-white/10"
                >
                  {content.offices.title}
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
