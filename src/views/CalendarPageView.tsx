import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import { DESTINATIONS, destinationPath } from "@/data/tours/catalog";
import Link from "next/link";
import { PageContainer } from "@/components/atoms/PageContainer";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function CalendarPageView({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

  return (
    <section className={section}>
      <PageContainer>
        <h1 className={pageIntroTitle}>{content.calendar.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.calendar.lead}</p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-black/8 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/8 bg-surface-muted text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">{content.search.destination}</th>
                {months.map((m) => (
                  <th key={m} className="px-4 py-3 font-medium">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DESTINATIONS.map((d) => (
                <tr key={d.slug} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={localePath(locale, destinationPath(d.slug))}
                      className="text-primary hover:underline"
                    >
                      {d.name[locale]}
                    </Link>
                  </td>
                  {months.map((m, i) => (
                    <td key={m} className="px-4 py-3 text-ink-muted">
                      {content.ui.fromPrice} $
                      {d.fromPriceUsd + i * 12}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-muted">{content.ui.priceDisclaimer}</p>
      </PageContainer>
    </section>
  );
}
