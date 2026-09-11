import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { DESTINATIONS, RESORTS, TOUR_OFFERS } from "@/data/tours/catalog";
import {
  ToursAdminClient,
  type DestinationAdminRow,
  type OfferAdminRow,
  type ResortAdminRow,
} from "@/components/dashboard/ToursAdminClient";

export default async function ToursAdminPage() {
  const user = await requireDashboardUser("tours");
  const cmsReady = hasSupabaseAdminConfig();

  let destinations: DestinationAdminRow[] = [];
  let resorts: ResortAdminRow[] = [];
  let offers: OfferAdminRow[] = [];

  if (cmsReady) {
    const admin = createSupabaseAdminClient();
    const [destRes, resortRes, offerRes] = await Promise.all([
      admin
        .from("sw_destinations")
        .select(
          "slug, name_uz, name_ru, name_en, blurb_uz, blurb_ru, blurb_en, from_price_usd, from_currency, country_code, cover_url, categories, is_published, sort_order",
        )
        .order("sort_order"),
      admin
        .from("sw_resorts")
        .select(
          "slug, destination_slug, name_uz, name_ru, name_en, blurb_uz, blurb_ru, blurb_en, cover_url, is_published",
        )
        .order("slug"),
      admin
        .from("sw_tour_offers")
        .select(
          "id, destination_slug, hotel, nights, currency, price_per_person_usd, price_two_usd, is_published, featured",
        )
        .order("id"),
    ]);
    destinations = (destRes.data as DestinationAdminRow[]) ?? [];
    resorts = (resortRes.data as ResortAdminRow[]) ?? [];
    offers = (offerRes.data as OfferAdminRow[]) ?? [];
  }

  return (
    <ToursAdminClient
      destinations={destinations}
      resorts={resorts}
      offers={offers}
      seedDestinations={DESTINATIONS.map((d) => ({
        slug: d.slug,
        nameEn: d.name.en,
        fromPriceUsd: d.fromPriceUsd,
        fromCurrency: d.fromCurrency ?? "USD",
      }))}
      seedResorts={RESORTS.map((r) => ({
        slug: r.slug,
        nameEn: r.name.en,
        destinationSlug: r.destinationSlug,
      }))}
      seedOffers={TOUR_OFFERS.map((o) => ({
        id: o.id,
        hotel: o.hotel,
        destinationSlug: o.destinationSlug,
        pricePerPersonUsd: o.pricePerPersonUsd,
        currency: o.currency ?? "USD",
      }))}
      canWrite={canMutate(user.role, "tours")}
      cmsReady={cmsReady}
    />
  );
}
