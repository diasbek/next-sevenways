import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { PageContainer } from "@/components/atoms/PageContainer";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function GiftsPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  return (
    <section className={section}>
      <PageContainer>
        <h1 className={pageIntroTitle}>{content.gifts.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.gifts.lead}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.gifts.items.map((gift) => (
            <article
              key={gift.id}
              className="rounded-2xl border border-black/8 bg-white p-5"
            >
              <h2 className="font-semibold text-ink">{gift.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{gift.note}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
