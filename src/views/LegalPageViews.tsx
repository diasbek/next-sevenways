import type { Locale } from "@/i18n/config";
import { getLegalDocument } from "@/lib/legal/repository";
import { PageContainer } from "@/components/atoms/PageContainer";
import { section, pageIntroTitle } from "@/styles/ui";

async function LegalView({
  locale,
  kind,
}: {
  locale: Locale;
  kind: "privacy" | "terms";
}) {
  const doc = await getLegalDocument(kind, locale);
  return (
    <section className={section}>
      <PageContainer className="max-w-3xl">
        <h1 className={pageIntroTitle}>{doc.title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
          {doc.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

export async function PrivacyPageView({ locale }: { locale: Locale }) {
  return <LegalView locale={locale} kind="privacy" />;
}

export async function TermsPageView({ locale }: { locale: Locale }) {
  return <LegalView locale={locale} kind="terms" />;
}
