import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import type { SiteCopy } from "@/data/types";
import { localePath } from "@/i18n/paths";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";
import { FaqList } from "@/components/molecules/FaqList";

function IconChat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 18.5 3.8 21.2a.6.6 0 0 0 .9.7L8.5 19H17a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v7.5A4 4 0 0 0 5 18.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 9.5h8M8 13h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M13 2 5.5 13.5h5L9.5 22 18.5 9.5h-5L13 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqSection({
  locale,
  headingLevel = "h2",
  content: contentProp,
}: {
  locale: Locale;
  headingLevel?: "h1" | "h2";
  content?: SiteCopy;
}) {
  const content = contentProp ?? getContent(locale);
  const TitleTag = headingLevel;

  return (
    <section id="faq" className="bg-white py-[var(--section-y)]">
      <PageContainer>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <aside className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(165deg,#062e73_0%,#075db7_48%,#1498e5_100%)] px-5 py-7 text-white shadow-[0_24px_50px_rgb(7_46_115/0.28)] sm:px-8 sm:py-10 lg:sticky lg:top-24">
            <div
              className="pointer-events-none absolute -bottom-10 -right-8 size-48 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-6 right-4 size-36 rounded-full border border-white/15 bg-white/5"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-16 right-20 size-24 rounded-full border border-white/10 bg-white/5"
              aria-hidden
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <Image
                src="/images/footer/logo.png"
                alt={SITE_CONFIG.name}
                width={120}
                height={102}
                className="h-14 w-auto brightness-0 invert sm:h-16"
                unoptimized
              />
              <p className="mt-6 m-0 font-display text-[clamp(1.55rem,3vw,2rem)] font-bold tracking-[-0.03em]">
                {content.home.faqCardTitle}
              </p>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/85">
                {content.home.faqCardLead}
              </p>

              <Link
                href={localePath(locale, "/request/")}
                className="mt-7 inline-flex min-h-12 w-full max-w-none items-center justify-center gap-2 rounded-2xl border border-white/80 bg-transparent px-5 text-sm font-semibold text-white transition hover:bg-white/10 sm:max-w-[16rem]"
              >
                <IconChat className="size-5" />
                {content.home.faqAskCta}
              </Link>
            </div>

            <ul className="relative z-10 mt-10 space-y-3 text-left text-sm font-medium text-white/90">
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-white/15">
                  <IconBolt className="size-4" />
                </span>
                {content.home.faqBenefitFast}
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-white/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero/icons/headset.svg"
                    alt=""
                    className="size-4 brightness-0 invert"
                  />
                </span>
                {content.home.faqBenefitSupport}
              </li>
            </ul>
          </aside>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-royal">
              {content.home.faqEyebrow}
            </p>
            <TitleTag className="mt-2 m-0 font-display text-[clamp(1.65rem,3.5vw,2.35rem)] font-bold tracking-[-0.03em] text-midnight">
              {content.home.faqTitle}
            </TitleTag>
            <div className="mt-6 sm:mt-8">
              <FaqList items={content.faq.items} />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
