import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";

function mapEmbedUrl(locale: Locale) {
  const hl = locale === "ru" ? "ru" : locale === "uz" ? "uz" : "en";
  const { lat, lng } = SITE_CONFIG.address;
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=${hl}&z=16&output=embed`;
}

function mapsDirectionsUrl() {
  const { lat, lng } = SITE_CONFIG.address;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-black/8 pt-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-2 text-base text-midnight">{children}</dd>
    </div>
  );
}

export function ContactsPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const address =
    locale === "ru"
      ? SITE_CONFIG.address.line
      : locale === "en"
        ? SITE_CONFIG.address.lineEn
        : SITE_CONFIG.address.lineUz;
  const hours =
    locale === "ru"
      ? SITE_CONFIG.hoursDisplayRu
      : locale === "en"
        ? SITE_CONFIG.hoursDisplayEn
        : SITE_CONFIG.hoursDisplayUz;

  return (
    <section className="bg-cloud py-[var(--section-y)]">
      <PageContainer>
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_20px_50px_rgb(7_29_69/0.1)]">
          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <h1 className="m-0 font-display text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-[-0.03em] text-deep-blue">
                {content.contacts.title}
              </h1>
              <p className="mt-3 max-w-md text-base text-ink-muted sm:text-lg">
                {content.contacts.lead}
              </p>

              <dl className="mt-8 space-y-0">
                <ContactRow label={content.contacts.callCentre}>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="font-semibold transition hover:text-royal"
                  >
                    {SITE_CONFIG.phoneDisplay}
                  </a>
                </ContactRow>
                <ContactRow label={content.contacts.visitOffice}>
                  <span className="block leading-snug">{address}</span>
                  <a
                    href={mapsDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-royal transition hover:text-deep-blue"
                  >
                    {content.offices.buildRoute} →
                  </a>
                </ContactRow>
                {SITE_CONFIG.email ? (
                  <ContactRow label="Email">
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="font-semibold transition hover:text-royal"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </ContactRow>
                ) : null}
                <ContactRow
                  label={
                    locale === "ru"
                      ? "Часы работы"
                      : locale === "uz"
                        ? "Ish vaqti"
                        : "Hours"
                  }
                >
                  {hours}
                </ContactRow>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={localePath(locale, "/request/")}>
                  {content.ui.leaveRequest}
                </Button>
                <Button href={localePath(locale, "/offices/")} variant="outline">
                  {content.offices.title}
                </Button>
              </div>

              <aside className="mt-8 rounded-2xl border border-warning/25 bg-warning/5 p-5">
                <h2 className="m-0 text-sm font-bold text-midnight">
                  {content.contacts.scamTitle}
                </h2>
                <p className="mt-2 m-0 text-sm leading-relaxed text-ink-muted">
                  {content.contacts.scamText}
                </p>
              </aside>
            </div>

            <div className="relative min-h-[280px] border-t border-black/5 bg-sky-tint/30 sm:min-h-[360px] lg:min-h-full lg:border-l lg:border-t-0">
              <iframe
                title={content.contacts.visitOffice}
                src={mapEmbedUrl(locale)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
