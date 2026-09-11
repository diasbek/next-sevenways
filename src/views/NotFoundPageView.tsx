import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function NotFoundPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <section className={section}>
      <PageContainer className="max-w-lg text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className={`mt-2 ${pageIntroTitle}`}>{content.notFound.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.notFound.lead}</p>
        <Button href={localePath(locale, "/")} className="mt-8">
          {content.notFound.home}
        </Button>
      </PageContainer>
    </section>
  );
}
