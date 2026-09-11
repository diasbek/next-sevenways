import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { OFFICES } from "@/data/offices";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function OfficesPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <section className={section}>
      <PageContainer>
        <h1 className={pageIntroTitle}>{content.offices.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.offices.lead}</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/8 bg-surface-muted">
          <div className="flex min-h-56 items-center justify-center p-6 text-sm text-ink-muted">
            {content.offices.mapTitle} · {SITE_CONFIG.address.lat},{" "}
            {SITE_CONFIG.address.lng}
          </div>
        </div>

        <h2 className="mt-10 text-lg font-semibold">{content.offices.listTitle}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {OFFICES.map((office) => (
            <article
              key={office.id}
              className="rounded-2xl border border-black/8 bg-white p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {office.city[locale]}
              </p>
              <h3 className="mt-1 text-base font-semibold text-ink">
                {office.name[locale]}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {office.address[locale]}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {office.phones.map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone}`} className="text-primary hover:underline">
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
