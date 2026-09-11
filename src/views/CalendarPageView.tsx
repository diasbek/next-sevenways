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

        {/* SE / narrow: stacked cards */}
        <ul className="mt-8 space-y-3 md:hidden">
          {DESTINATIONS.map((d) => (
            <li
              key={d.slug}
              className="rounded-2xl border border-black/8 bg-white p-4"
            >
              <Link
                href={localePath(locale, destinationPath(d.slug))}
                className="text-base font-semibold text-primary hover:underline"
              >
                {d.name[locale]}
              </Link>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {months.map((m, i) => (
                  <div
                    key={m}
                    className="rounded-xl bg-surface-muted px-1.5 py-2"
                  >
                    <dt className="font-medium text-ink-muted">{m}</dt>
                    <dd className="mt-1 font-semibold text-ink">
                      {content.ui.fromPrice} ${d.fromPriceUsd + i * 12}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>

        {/* md+: table with sticky first column */}
        <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-black/8 bg-white md:block">
          <p className="border-b border-black/5 px-4 py-2 text-xs text-ink-muted lg:hidden">
            ← →
          </p>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/8 bg-surface-muted text-ink-muted">
              <tr>
                <th className="sticky left-0 z-10 bg-surface-muted px-4 py-3 font-medium">
                  {content.search.destination}
                </th>
                {months.map((m) => (
                  <th key={m} className="px-4 py-3 font-medium">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DESTINATIONS.map((d) => (
                <tr
                  key={d.slug}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium">
                    <Link
                      href={localePath(locale, destinationPath(d.slug))}
                      className="text-primary hover:underline"
                    >
                      {d.name[locale]}
                    </Link>
                  </td>
                  {months.map((m, i) => (
                    <td key={m} className="px-4 py-3 text-ink-muted">
                      {content.ui.fromPrice} ${d.fromPriceUsd + i * 12}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          {content.ui.priceDisclaimer}
        </p>
      </PageContainer>
    </section>
  );
}
