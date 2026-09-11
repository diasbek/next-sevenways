import { unstable_cache } from "next/cache";
import {
  DESTINATIONS,
  RESORTS,
  TOUR_OFFERS,
  type Destination,
  type DestinationCategory,
  type Resort,
  type TourOffer,
} from "@/data/tours/catalog";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  CMS_TAGS,
  cmsReady,
  localizedFromColumns,
  mergeByKey,
} from "@/lib/cms/overlay";

type DestRow = {
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  blurb_uz: string;
  blurb_ru: string;
  blurb_en: string;
  from_price_usd: number | null;
  from_price: number | null;
  from_currency: string | null;
  country_code: string | null;
  cover_url: string | null;
  categories: string[] | null;
  is_published: boolean;
  sort_order: number;
};

type ResortRow = {
  slug: string;
  destination_slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  blurb_uz: string;
  blurb_ru: string;
  blurb_en: string;
  cover_url: string | null;
  is_published: boolean;
};

type OfferRow = {
  id: string;
  destination_slug: string;
  resort_slug: string | null;
  hotel: string;
  rating: number | null;
  nights: number;
  board_uz: string;
  board_ru: string;
  board_en: string;
  room_uz: string;
  room_ru: string;
  room_en: string;
  date_from: string | null;
  date_to: string | null;
  price_per_person_usd: number;
  price_two_usd: number;
  currency: string | null;
  badges: string[] | null;
  featured: boolean;
  is_published: boolean;
};

function mapDestination(row: DestRow, seed?: Destination): Destination {
  const categories = (row.categories ?? seed?.categories ?? ["beach"]).filter(
    (c): c is DestinationCategory => c === "beach" || c === "excursion",
  );
  return {
    slug: row.slug,
    name: localizedFromColumns(row.name_uz, row.name_ru, row.name_en),
    countryCode: row.country_code || seed?.countryCode || "",
    fromPriceUsd: Number(row.from_price ?? row.from_price_usd ?? seed?.fromPriceUsd ?? 0),
    fromCurrency:
      row.from_currency === "UZS" || row.from_currency === "USD"
        ? row.from_currency
        : seed?.fromCurrency ?? "USD",
    blurb: localizedFromColumns(row.blurb_uz, row.blurb_ru, row.blurb_en),
    resorts: seed?.resorts ?? [],
    image: row.cover_url || seed?.image || `/images/destinations/${row.slug}.jpg`,
    categories: categories.length ? categories : ["beach"],
  };
}

function mapResort(row: ResortRow): Resort {
  return {
    slug: row.slug,
    destinationSlug: row.destination_slug,
    name: localizedFromColumns(row.name_uz, row.name_ru, row.name_en),
    blurb: localizedFromColumns(row.blurb_uz, row.blurb_ru, row.blurb_en),
  };
}

function mapOffer(row: OfferRow): TourOffer {
  const badges = (row.badges ?? []).filter(
    (b): b is NonNullable<TourOffer["badges"]>[number] =>
      b === "on_request" || b === "seats" || b === "save",
  );
  return {
    id: row.id,
    destinationSlug: row.destination_slug,
    resortSlug: row.resort_slug || undefined,
    hotel: row.hotel,
    rating: row.rating ?? undefined,
    nights: row.nights,
    board: localizedFromColumns(row.board_uz, row.board_ru, row.board_en),
    room: localizedFromColumns(row.room_uz, row.room_ru, row.room_en),
    dateFrom: row.date_from || "",
    dateTo: row.date_to || "",
    pricePerPersonUsd: Number(row.price_per_person_usd),
    priceTwoUsd: Number(row.price_two_usd),
    currency: row.currency === "UZS" ? "UZS" : "USD",
    badges: badges.length ? badges : undefined,
    featured: Boolean(row.featured),
  };
}

async function fetchCmsDestinations(): Promise<Destination[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_destinations")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return [];
    const seedBySlug = new Map(DESTINATIONS.map((d) => [d.slug, d]));
    return (data as DestRow[]).map((row) =>
      mapDestination(row, seedBySlug.get(row.slug)),
    );
  } catch {
    return [];
  }
}

async function fetchCmsResorts(): Promise<Resort[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_resorts")
      .select("*")
      .eq("is_published", true);
    if (error || !data?.length) return [];
    return (data as ResortRow[]).map(mapResort);
  } catch {
    return [];
  }
}

async function fetchCmsOffers(): Promise<TourOffer[]> {
  if (!cmsReady()) return [];
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("sw_tour_offers")
      .select("*")
      .eq("is_published", true);
    if (error || !data?.length) return [];
    return (data as OfferRow[]).map(mapOffer);
  } catch {
    return [];
  }
}

const cachedResorts = unstable_cache(
  async () => mergeByKey(RESORTS, await fetchCmsResorts(), (r) => r.slug),
  ["cms-resorts"],
  { tags: [CMS_TAGS.tours], revalidate: 60 },
);

const cachedOffers = unstable_cache(
  async () => mergeByKey(TOUR_OFFERS, await fetchCmsOffers(), (o) => o.id),
  ["cms-offers"],
  { tags: [CMS_TAGS.tours], revalidate: 60 },
);

const cachedDestinations = unstable_cache(
  async () => {
    const cms = await fetchCmsDestinations();
    const merged = mergeByKey(DESTINATIONS, cms, (d) => d.slug);
    const resorts = await cachedResorts();
    return merged.map((d) => ({
      ...d,
      resorts: resorts
        .filter((r) => r.destinationSlug === d.slug)
        .map((r) => r.slug),
    }));
  },
  ["cms-destinations"],
  { tags: [CMS_TAGS.tours], revalidate: 60 },
);

export async function listDestinations(): Promise<Destination[]> {
  return cachedDestinations();
}

export async function listResorts(): Promise<Resort[]> {
  return cachedResorts();
}

export async function listOffers(): Promise<TourOffer[]> {
  return cachedOffers();
}

export async function getDestinationBySlug(
  slug: string,
): Promise<Destination | undefined> {
  return (await listDestinations()).find((d) => d.slug === slug);
}

export async function getResortBySlug(
  slug: string,
): Promise<Resort | undefined> {
  return (await listResorts()).find((r) => r.slug === slug);
}

export async function offersForDestinationSlug(slug: string) {
  return (await listOffers()).filter((o) => o.destinationSlug === slug);
}

export async function offersForResortSlug(slug: string) {
  return (await listOffers()).filter((o) => o.resortSlug === slug);
}

export async function listFeaturedOffers() {
  return (await listOffers()).filter((o) => o.featured);
}
