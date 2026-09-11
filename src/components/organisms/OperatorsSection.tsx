import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { OPERATORS } from "@/data/operators";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";

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

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 4.2 18.4 19c-.2 1-.8 1.2-1.6.8l-4.6-3.4-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.7 8.5-7.7c.4-.3-.1-.5-.6-.2L7 12.9l-4.6-1.5c-1-.3-1-.9.2-1.3L20.5 3c.8-.3 1.5.2 1.1 1.2Z" />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 18.5 3.8 21.2a.6.6 0 0 0 .9.7L8.5 19H17a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v7.5A4 4 0 0 0 5 18.5Z"
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

export function OperatorsSection({ locale }: { locale: Locale }) {
  const content = getContent(locale);

  return (
    <section className="bg-white">
      <div className="relative min-h-[200px] overflow-hidden sm:min-h-[240px]">
        <Image
          src="/images/operators/hero.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-deep-blue/65 via-royal/40 to-transparent"
          aria-hidden
        />
        <PageContainer className="relative z-10 flex min-h-[200px] items-end py-10 sm:min-h-[240px] sm:py-12">
          <div className="max-w-2xl">
            <h2 className="m-0 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.03em] text-white">
              {content.offices.operatorsTitle}
            </h2>
            <p className="mt-3 text-base text-white/90 sm:text-lg">
              {content.offices.operatorsLead}
            </p>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-10 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {OPERATORS.map((op) => (
            <article
              key={op.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_12px_32px_rgb(7_29_69/0.08)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-sky-tint">
                <Image
                  src={op.image}
                  alt={op.name[locale]}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                {op.online ? (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-midnight shadow-sm">
                    <span className="size-2 rounded-full bg-green" aria-hidden />
                    {content.offices.online}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="text-lg font-bold text-midnight">
                  {op.name[locale]}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{op.role[locale]}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  <li>
                    <a
                      href={`tel:${op.phone}`}
                      className="inline-flex items-center gap-2 hover:text-royal"
                    >
                      <IconPhone className="size-4 text-royal" />
                      {op.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://t.me/${op.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-royal"
                    >
                      <IconTelegram className="size-4 text-royal" />@{op.telegram}
                    </a>
                  </li>
                </ul>
                <Button
                  href={`https://t.me/${op.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto !mt-5 w-full !rounded-xl"
                  size="sm"
                >
                  <IconChat className="size-4" />
                  {content.offices.contactOperator}
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-sky-tint px-5 py-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
          <div className="flex items-start gap-3 sm:items-center">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-royal text-white">
              <IconUsers className="size-5" />
            </span>
            <div>
              <p className="font-bold text-midnight">
                {content.offices.consultTitle}
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">
                {content.offices.consultLead}
              </p>
            </div>
          </div>
          <Button
            href={localePath(locale, "/request/")}
            className="!rounded-xl shrink-0"
          >
            {content.offices.getConsult}
            <span aria-hidden>›</span>
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
