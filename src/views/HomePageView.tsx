import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { DESTINATIONS, featuredOffers } from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { DestinationCard } from "@/components/molecules/DestinationCard";
import { TourCard } from "@/components/molecules/TourCard";
import { FaqList } from "@/components/molecules/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/utils/seo/json-ld";
import { section, sectionMuted, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function HomePageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const hot = featuredOffers();

  return (
    <>
      <JsonLd data={getFaqSchema(content.faq.items)} />
      <section className="border-b border-black/5 bg-gradient-to-b from-primary-soft/60 to-white">
        <PageContainer className="py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Seven Ways
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {content.home.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {content.home.heroLead}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{content.home.heroNote}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={localePath(locale, "/search/")}>
              {content.ui.searchTours}
            </Button>
            <Button href={localePath(locale, "/request/")} variant="outline">
              {content.ui.leaveRequest}
            </Button>
          </div>
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <dt className="text-2xl font-semibold text-ink">4+</dt>
              <dd className="text-xs text-ink-muted">{content.home.trustOffices}</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-ink">10k+</dt>
              <dd className="text-xs text-ink-muted">{content.home.trustTourists}</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-ink">2024</dt>
              <dd className="text-xs text-ink-muted">{content.home.trustYears}</dd>
            </div>
          </dl>
        </PageContainer>
      </section>

      <section className={section}>
        <PageContainer>
          <h2 className={pageIntroTitle}>{content.home.destinationsTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <DestinationCard key={d.slug} locale={locale} destination={d} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className={sectionMuted}>
        <PageContainer>
          <h2 className={pageIntroTitle}>{content.home.hotTitle}</h2>
          <p className={`mt-2 ${pageIntroLead}`}>{content.home.hotLead}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hot.map((offer) => (
              <TourCard key={offer.id} locale={locale} offer={offer} />
            ))}
          </div>
          <p className="mt-6 text-xs text-ink-muted">{content.ui.priceDisclaimer}</p>
        </PageContainer>
      </section>

      <section className={section}>
        <PageContainer className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className={pageIntroTitle}>{content.home.giftsTitle}</h2>
            <p className={`mt-2 ${pageIntroLead}`}>{content.home.giftsLead}</p>
            <Button href={localePath(locale, "/gifts/")} className="mt-6" variant="outline">
              {content.ui.learnMore}
            </Button>
          </div>
          <div>
            <h2 className={pageIntroTitle}>{content.home.trustTitle}</h2>
            <p className={`mt-2 ${pageIntroLead}`}>{content.home.trustLead}</p>
          </div>
        </PageContainer>
      </section>

      <section className={sectionMuted} id="faq">
        <PageContainer>
          <h2 className={pageIntroTitle}>{content.home.faqTitle}</h2>
          <p className={`mt-2 ${pageIntroLead}`}>{content.home.faqLead}</p>
          <div className="mt-8">
            <FaqList items={content.faq.items} />
          </div>
        </PageContainer>
      </section>

      <section className={section}>
        <PageContainer className="rounded-3xl bg-primary px-6 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-semibold">{content.home.ctaTitle}</h2>
          <p className="mt-2 max-w-xl text-white/85">{content.home.ctaLead}</p>
          <Button
            href={localePath(locale, "/request/")}
            variant="secondary"
            className="mt-6"
          >
            {content.ui.leaveRequest}
          </Button>
        </PageContainer>
      </section>
    </>
  );
}
