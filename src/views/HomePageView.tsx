import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import {
  listDestinations,
  listFeaturedOffers,
  listResorts,
} from "@/lib/tours/repository";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { HomeHero } from "@/components/organisms/HomeHero";
import { DestinationsSection } from "@/components/organisms/DestinationsSection";
import { HotOffersSection } from "@/components/organisms/HotOffersSection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/utils/seo/json-ld";
import { sectionMuted, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export async function HomePageView({ locale }: { locale: Locale }) {
  const [content, destinations, offers, resorts] = await Promise.all([
    getContentAsync(locale),
    listDestinations(),
    listFeaturedOffers(),
    listResorts(),
  ]);

  return (
    <>
      <JsonLd id="home-faq" data={getFaqSchema(content.faq.items)} />
      <HomeHero locale={locale} destinations={destinations} content={content} />
      <DestinationsSection
        locale={locale}
        variant="home"
        destinations={destinations}
        content={content}
      />
      <HotOffersSection
        locale={locale}
        offers={offers}
        destinations={destinations}
        resorts={resorts}
        content={content}
      />

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

      <FaqSection locale={locale} content={content} />

      <section className={sectionMuted}>
        <PageContainer className="rounded-3xl bg-deep-blue px-5 py-8 text-white sm:px-8 sm:py-10">
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
