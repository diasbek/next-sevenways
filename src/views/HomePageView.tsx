import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { featuredOffers } from "@/data/tours/catalog";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { TourCard } from "@/components/molecules/TourCard";
import { FaqList } from "@/components/molecules/FaqList";
import { HomeHero } from "@/components/organisms/HomeHero";
import { DestinationsSection } from "@/components/organisms/DestinationsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/utils/seo/json-ld";
import { section, sectionMuted, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function HomePageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const hot = featuredOffers();

  return (
    <>
      <JsonLd data={getFaqSchema(content.faq.items)} />
      <HomeHero locale={locale} />
      <DestinationsSection locale={locale} variant="home" />

      <section className={section}>
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

      <section className={sectionMuted}>
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

      <section className={section} id="faq">
        <PageContainer>
          <h2 className={pageIntroTitle}>{content.home.faqTitle}</h2>
          <p className={`mt-2 ${pageIntroLead}`}>{content.home.faqLead}</p>
          <div className="mt-8">
            <FaqList items={content.faq.items} />
          </div>
        </PageContainer>
      </section>

      <section className={sectionMuted}>
        <PageContainer className="rounded-3xl bg-deep-blue px-6 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-semibold">{content.home.ctaTitle}</h2>
          <p className="mt-2 max-w-xl text-white/85">{content.home.ctaLead}</p>
          <Button
            href={localePath(locale, "/request/")}
            className="mt-6 !bg-sky hover:!bg-royal"
          >
            {content.ui.leaveRequest}
          </Button>
        </PageContainer>
      </section>
    </>
  );
}
