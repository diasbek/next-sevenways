import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { PageContainer } from "@/components/atoms/PageContainer";
import { FaqList } from "@/components/molecules/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/utils/seo/json-ld";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function FaqPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <>
      <JsonLd data={getFaqSchema(content.faq.items)} />
      <section className={section}>
        <PageContainer>
          <h1 className={pageIntroTitle}>{content.faq.title}</h1>
          <p className={`mt-2 ${pageIntroLead}`}>{content.faq.lead}</p>
          <div className="mt-8">
            <FaqList items={content.faq.items} />
          </div>
        </PageContainer>
      </section>
    </>
  );
}
