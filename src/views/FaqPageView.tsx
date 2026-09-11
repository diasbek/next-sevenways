import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { FaqSection } from "@/components/organisms/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqSchema } from "@/utils/seo/json-ld";

export async function FaqPageView({ locale }: { locale: Locale }) {
  const content = await getContentAsync(locale);
  return (
    <>
      <JsonLd data={getFaqSchema(content.faq.items)} />
      <FaqSection locale={locale} headingLevel="h1" content={content} />
    </>
  );
}
