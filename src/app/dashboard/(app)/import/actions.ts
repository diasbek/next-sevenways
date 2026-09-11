"use server";

import { requireMutation } from "@/lib/cms/auth";
import { CMS_TAGS } from "@/lib/cms/overlay";
import { revalidateCms, writeAuditLog } from "@/lib/cms/revalidate";
import { DESTINATIONS, RESORTS, TOUR_OFFERS } from "@/data/tours/catalog";
import { OFFICES } from "@/data/offices";
import { OPERATORS } from "@/data/operators";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";

async function requireImport() {
  const actor = await requireMutation("tours");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");
  return actor;
}

export async function importToursSeedAction() {
  const actor = await requireImport();
  const admin = createSupabaseAdminClient();

  const destinations = DESTINATIONS.map((d, i) => ({
    slug: d.slug,
    name_uz: d.name.uz,
    name_ru: d.name.ru,
    name_en: d.name.en,
    blurb_uz: d.blurb.uz,
    blurb_ru: d.blurb.ru,
    blurb_en: d.blurb.en,
    from_price_usd: d.fromPriceUsd,
    from_price: d.fromPriceUsd,
    from_currency: d.fromCurrency ?? "USD",
    country_code: d.countryCode || null,
    cover_url: d.image || null,
    categories: d.categories ?? ["beach"],
    is_published: true,
    sort_order: i,
  }));

  const { error: destError } = await admin
    .from("sw_destinations")
    .upsert(destinations);
  if (destError) throw new Error(destError.message);

  const resorts = RESORTS.map((r) => ({
    slug: r.slug,
    destination_slug: r.destinationSlug,
    name_uz: r.name.uz,
    name_ru: r.name.ru,
    name_en: r.name.en,
    blurb_uz: r.blurb.uz,
    blurb_ru: r.blurb.ru,
    blurb_en: r.blurb.en,
    cover_url: null,
    is_published: true,
  }));

  const { error: resortError } = await admin.from("sw_resorts").upsert(resorts);
  if (resortError) throw new Error(resortError.message);

  const offers = TOUR_OFFERS.map((o) => ({
    id: o.id,
    destination_slug: o.destinationSlug,
    resort_slug: o.resortSlug ?? null,
    hotel: o.hotel,
    rating: o.rating ?? null,
    nights: o.nights,
    board_uz: o.board.uz,
    board_ru: o.board.ru,
    board_en: o.board.en,
    room_uz: o.room.uz,
    room_ru: o.room.ru,
    room_en: o.room.en,
    date_from: o.dateFrom || null,
    date_to: o.dateTo || null,
    price_per_person_usd: o.pricePerPersonUsd,
    price_two_usd: o.priceTwoUsd,
    currency: o.currency ?? "USD",
    badges: o.badges ?? [],
    featured: Boolean(o.featured),
    is_published: true,
  }));

  const { error: offerError } = await admin
    .from("sw_tour_offers")
    .upsert(offers);
  if (offerError) throw new Error(offerError.message);

  revalidateCms(CMS_TAGS.tours);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "import.tours",
    entityType: "tours",
    detail: {
      destinations: destinations.length,
      resorts: resorts.length,
      offers: offers.length,
    },
  });

  return {
    destinations: destinations.length,
    resorts: resorts.length,
    offers: offers.length,
  };
}

export async function importOfficesSeedAction() {
  const actor = await requireMutation("offices");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");
  const admin = createSupabaseAdminClient();

  const rows = OFFICES.map((o, i) => ({
    id: o.id,
    city_uz: o.city.uz,
    city_ru: o.city.ru,
    city_en: o.city.en,
    name_uz: o.name.uz,
    name_ru: o.name.ru,
    name_en: o.name.en,
    address_uz: o.address.uz,
    address_ru: o.address.ru,
    address_en: o.address.en,
    phones: o.phones,
    lat: o.lat,
    lng: o.lng,
    image_url: o.image ?? null,
    city_key: o.cityKey,
    is_published: true,
    sort_order: i,
  }));

  const { error } = await admin.from("sw_offices").upsert(rows);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.offices);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "import.offices",
    entityType: "offices",
    detail: { count: rows.length },
  });
  return { count: rows.length };
}

export async function importNewsSeedAction() {
  const actor = await requireMutation("news");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");

  const { SEED_NEWS } = await import("@/lib/news/repository");
  // Rebuild multilang from repository private seed via known slug
  const admin = createSupabaseAdminClient();
  const slug = "welcome-seven-ways";
  const row = {
    slug,
    title_uz: "Seven Ways sayti ochildi",
    title_ru: "Сайт Seven Ways открыт",
    title_en: "Seven Ways site is live",
    excerpt_uz: "Toshkentdan paket turlar — yangi saytda.",
    excerpt_ru: "Пакетные туры из Ташкента — на новом сайте.",
    excerpt_en: "Package tours from Tashkent — on the new site.",
    body_uz:
      "Seven Ways endi online: yoʻnalishlar, ofislar va ariza shakli. Narxlar orientir — yakuniy summani menejer tasdiqlaydi.",
    body_ru:
      "Seven Ways теперь онлайн: направления, офисы и форма заявки. Цены ориентировочные — итоговую сумму подтверждает менеджер.",
    body_en:
      "Seven Ways is online: destinations, offices and a request form. Prices are indicative — a manager confirms the final amount.",
    status: "published",
    published_at: "2026-09-01T00:00:00.000Z",
  };

  const { error } = await admin.from("sw_news").upsert(row, {
    onConflict: "slug",
  });
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.news);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "import.news",
    entityType: "news",
    entityId: slug,
    detail: { seedCount: SEED_NEWS.length },
  });
  return { count: 1 };
}

export async function importOperatorsSeedAction() {
  const actor = await requireMutation("operators");
  if (!hasSupabaseAdminConfig()) throw new Error("Supabase not configured");
  const admin = createSupabaseAdminClient();

  const rows = OPERATORS.map((o, i) => ({
    id: o.id,
    name_uz: o.name.uz,
    name_ru: o.name.ru,
    name_en: o.name.en,
    role_uz: o.role.uz,
    role_ru: o.role.ru,
    role_en: o.role.en,
    phone: o.phone,
    telegram: o.telegram,
    image_url: o.image,
    is_online: o.online ?? true,
    is_published: true,
    sort_order: i,
  }));

  const { error } = await admin.from("sw_operators").upsert(rows);
  if (error) throw new Error(error.message);
  revalidateCms(CMS_TAGS.operators);
  await writeAuditLog({
    actorId: actor.id,
    actorEmail: actor.email,
    action: "import.operators",
    entityType: "operators",
    detail: { count: rows.length },
  });
  return { count: rows.length };
}
