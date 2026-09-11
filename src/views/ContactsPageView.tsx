import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { PaymentMethodsStrip } from "@/components/organisms/PaymentMethodsStrip";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function ContactsPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const address =
    locale === "ru"
      ? SITE_CONFIG.address.line
      : locale === "en"
        ? SITE_CONFIG.address.lineEn
        : SITE_CONFIG.address.lineUz;

  return (
    <section className={section}>
      <PageContainer className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className={pageIntroTitle}>{content.contacts.title}</h1>
          <p className={`mt-2 ${pageIntroLead}`}>{content.contacts.lead}</p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">{content.contacts.callCentre}</dt>
              <dd className="mt-1">
                <a href={`tel:${SITE_CONFIG.phone}`} className="text-primary hover:underline">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">{content.contacts.visitOffice}</dt>
              <dd className="mt-1 text-ink-muted">{address}</dd>
            </div>
            {SITE_CONFIG.email ? (
              <div>
                <dt className="font-semibold text-ink">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary hover:underline">
                    {SITE_CONFIG.email}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          <Button href={localePath(locale, "/request/")} className="mt-8">
            {content.ui.leaveRequest}
          </Button>
          <div className="mt-10">
            <PaymentMethodsStrip locale={locale} />
          </div>
        </div>
        <aside className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
          <h2 className="font-semibold text-ink">{content.contacts.scamTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {content.contacts.scamText}
          </p>
        </aside>
      </PageContainer>
    </section>
  );
}
