import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";

const PRINCIPLE_ICONS = [
  "/images/about/icons/price.svg",
  "/images/about/icons/directions.svg",
  "/images/about/icons/travel.svg",
  "/images/about/icons/support.svg",
] as const;

const STEP_ICONS = [
  "/images/about/icons/request.svg",
  "/images/about/icons/selection.svg",
  "/images/about/icons/booking.svg",
  "/images/about/icons/travel.svg",
] as const;

function TitleWithAccent({
  title,
  accent,
  className,
}: {
  title: string;
  accent: string;
  className?: string;
}) {
  const index = accent ? title.indexOf(accent) : -1;
  if (index < 0) {
    return <h1 className={className}>{title}</h1>;
  }
  return (
    <h1 className={className}>
      {title.slice(0, index)}
      <span className="text-sky">{accent}</span>
      {title.slice(index + accent.length)}
    </h1>
  );
}

function AboutIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block bg-current", className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

export async function AboutPageView({ locale }: { locale: Locale }) {
  const content = await getContentAsync(locale);
  const about = content.about;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_80%_10%,#e4f3fc_0%,#f5fbff_42%,#ffffff_100%)]">
        <PageContainer className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-20 xl:gap-16">
          <div className="relative z-10 max-w-xl animate-hero-rise">
            <p className="m-0 flex items-center gap-3 text-sm font-medium text-ink-muted">
              <span
                className="inline-block h-px w-8 shrink-0 bg-sky/70"
                aria-hidden
              />
              {about.eyebrow}
            </p>
            <TitleWithAccent
              title={about.title}
              accent={about.titleAccent}
              className="mt-4 m-0 font-display text-[clamp(1.85rem,4.4vw,3.15rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-deep-blue"
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
              {about.lead}
            </p>
            <Button
              href={localePath(locale, "/request/")}
              size="lg"
              className="mt-8 !rounded-2xl"
            >
              {about.cta}
              <span aria-hidden className="ml-1">
                →
              </span>
            </Button>
          </div>

          <div
            className="relative mx-auto aspect-[5/4] w-full max-w-xl animate-hero-rise [animation-delay:80ms] sm:max-w-none lg:aspect-[6/5]"
            aria-hidden
          >
            <div className="absolute left-[2%] top-[6%] z-[1] w-[48%] overflow-hidden rounded-[1.35rem] border-[5px] border-white shadow-[0_18px_40px_rgb(7_29_69/0.14)] sm:rounded-[1.6rem] sm:border-[6px] -rotate-[4deg]">
              <Image
                src="/images/about/hero-landmarks.png"
                alt=""
                width={640}
                height={640}
                priority
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
            <div className="absolute right-[0%] top-[0%] z-[2] w-[46%] overflow-hidden rounded-[1.35rem] border-[5px] border-white shadow-[0_20px_44px_rgb(7_29_69/0.16)] sm:rounded-[1.6rem] sm:border-[6px] rotate-[7deg]">
              <Image
                src="/images/about/hero-resort.png"
                alt=""
                width={640}
                height={640}
                priority
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
            <div className="absolute bottom-[2%] right-[8%] z-[3] w-[52%] overflow-hidden rounded-[1.35rem] border-[5px] border-white shadow-[0_22px_48px_rgb(7_29_69/0.18)] sm:rounded-[1.6rem] sm:border-[6px] -rotate-[3deg]">
              <Image
                src="/images/about/hero-airplane.png"
                alt=""
                width={720}
                height={520}
                className="aspect-[5/4] h-auto w-full object-cover"
              />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Who we are */}
      <section className="bg-white py-[var(--section-y)]">
        <PageContainer>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-16">
            <div className="max-w-md">
              <span
                className="mb-4 block h-1 w-10 rounded-full bg-sky"
                aria-hidden
              />
              <p className="m-0 text-base font-semibold text-royal sm:text-lg">
                {about.whoEyebrow}
              </p>
              <h2 className="mt-3 m-0 font-display text-[clamp(1.75rem,3.6vw,2.65rem)] font-bold leading-[1.12] tracking-[-0.03em] text-deep-blue">
                {about.whoTitle}
              </h2>
              <p className="mt-4 m-0 text-base leading-relaxed text-ink-muted sm:text-lg">
                {about.whoLead}
              </p>
            </div>

            <div>
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_rgb(7_29_69/0.12)] sm:rounded-[1.75rem]">
                <Image
                  src="/images/about/company-banner.png"
                  alt=""
                  width={1200}
                  height={720}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              <ul className="mt-4 grid grid-cols-3 divide-x divide-black/8 overflow-hidden rounded-[1.25rem] border border-black/5 bg-white shadow-[0_12px_32px_rgb(7_29_69/0.08)] sm:rounded-[1.5rem]">
                {about.stats.map((stat) => (
                  <li
                    key={`${stat.value}-${stat.label}`}
                    className="px-3 py-4 text-center sm:px-5 sm:py-5"
                  >
                    <p className="m-0 font-display text-xl font-bold tracking-tight text-royal sm:text-2xl lg:text-[1.75rem]">
                      {stat.value}
                    </p>
                    {stat.label ? (
                      <p className="mt-1 m-0 text-[0.7rem] leading-snug text-ink-muted sm:text-sm">
                        {stat.label}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Trust / principles */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f5fbff_100%)] py-[var(--section-y)]">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="m-0 font-display text-[clamp(1.65rem,3.5vw,2.45rem)] font-bold tracking-[-0.03em] text-deep-blue">
              {about.principlesTitle}
            </h2>
            <p className="mt-3 m-0 text-base text-ink-muted sm:text-lg">
              {about.principlesLead}
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {about.principles.map((item, i) => (
              <li
                key={item.title}
                className="flex h-full flex-col items-center rounded-[1.35rem] border border-sky/25 bg-white px-5 py-7 text-center shadow-[0_10px_28px_rgb(7_29_69/0.05)]"
              >
                <span className="grid size-14 place-items-center rounded-full bg-sky-tint text-royal">
                  <AboutIcon
                    src={PRINCIPLE_ICONS[i] ?? PRINCIPLE_ICONS[0]}
                    className="size-7 text-royal"
                  />
                </span>
                <h3 className="mt-5 m-0 text-base font-bold text-deep-blue sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 m-0 text-sm leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      {/* Process */}
      <section className="bg-white py-[var(--section-y)]">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <p className="m-0 flex items-center justify-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sky sm:text-xs">
              <span className="h-px w-8 bg-sky/50 sm:w-12" aria-hidden />
              {about.stepsEyebrow}
              <span className="h-px w-8 bg-sky/50 sm:w-12" aria-hidden />
            </p>
            <h2 className="mt-3 m-0 font-display text-[clamp(1.65rem,3.5vw,2.45rem)] font-bold tracking-[-0.03em] text-deep-blue">
              {about.stepsTitle}
            </h2>
          </div>

          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <span
              className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-sky/25 lg:block"
              aria-hidden
            />
            {about.steps.map((step, i) => (
              <li key={step.title} className="relative text-center">
                <div className="relative mx-auto grid size-[4.75rem] place-items-center rounded-full bg-sky-tint text-royal sm:size-20">
                  <AboutIcon
                    src={STEP_ICONS[i] ?? STEP_ICONS[0]}
                    className="size-8 text-royal"
                  />
                  <span className="absolute -left-0.5 -top-0.5 grid size-7 place-items-center rounded-full bg-royal text-xs font-bold text-white shadow-[0_6px_14px_rgb(7_93_183/0.35)]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 m-0 text-base font-bold text-deep-blue sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 m-0 text-sm leading-relaxed text-ink-muted">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>
    </>
  );
}
