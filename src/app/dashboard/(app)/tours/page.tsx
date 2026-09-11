import { requireDashboardUser } from "@/lib/cms/auth";
import { DESTINATIONS, TOUR_OFFERS } from "@/data/tours/catalog";

export default async function ToursAdminPage() {
  await requireDashboardUser("tours");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Tours catalogue</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Seed data ships in code. CMS tables{" "}
          <code className="rounded bg-black/5 px-1">sw_destinations</code>,{" "}
          <code className="rounded bg-black/5 px-1">sw_resorts</code>,{" "}
          <code className="rounded bg-black/5 px-1">sw_tour_offers</code> overlay
          when populated.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Destinations</h2>
        <ul className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
          {DESTINATIONS.map((d) => (
            <li key={d.slug} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium">{d.name.en}</span>
              <span className="text-ink-muted">
                /tours/{d.slug}/ · from ${d.fromPriceUsd}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Offers</h2>
        <ul className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
          {TOUR_OFFERS.map((o) => (
            <li key={o.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium">{o.hotel}</span>
              <span className="text-ink-muted">
                {o.destinationSlug} · ${o.pricePerPersonUsd}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
