import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { PageContainer } from "@/components/atoms/PageContainer";
import { Button } from "@/components/atoms/Button";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function AboutPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <section className={section}>
      <PageContainer className="max-w-3xl">
        <h1 className={pageIntroTitle}>{content.about.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.about.lead}</p>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
          {content.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 className="mt-12 text-xl font-semibold">{content.about.stepsTitle}</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {content.about.steps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-black/8 p-5">
              <p className="text-xs font-semibold text-primary">{i + 1}</p>
              <p className="mt-1 font-semibold text-ink">{step.title}</p>
              <p className="mt-2 text-sm text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 text-xl font-semibold">
          {content.about.principlesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          {content.about.principles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <Button href={localePath(locale, "/offices/")} className="mt-10" variant="outline">
          {content.offices.title}
        </Button>
      </PageContainer>
    </section>
  );
}
