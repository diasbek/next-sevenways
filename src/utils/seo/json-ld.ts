import { SITE_CONFIG } from "@/utils/consts";
import { getCanonicalSiteUrl } from "@/utils/seo/indexing";

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address.lineUz,
    addressLocality: "Tashkent",
    addressCountry: "UZ",
  };
}

function geo() {
  return {
    "@type": "GeoCoordinates",
    latitude: SITE_CONFIG.address.lat,
    longitude: SITE_CONFIG.address.lng,
  };
}

export function getTravelAgencySchema() {
  const id = `${getCanonicalSiteUrl()}/#organization`;
  return {
    "@type": ["Organization", "TravelAgency", "LocalBusiness"],
    "@id": id,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: getCanonicalSiteUrl(),
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email || undefined,
    address: postalAddress(),
    geo: geo(),
    openingHours: SITE_CONFIG.hours,
    priceRange: "$$",
    image: `${getCanonicalSiteUrl()}/images/og/default.png`,
    sameAs: [
      SITE_CONFIG.telegramUrl,
      SITE_CONFIG.instagramUrl,
      SITE_CONFIG.facebookUrl,
    ].filter(Boolean),
  };
}

export function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${getCanonicalSiteUrl()}/#website`,
    url: getCanonicalSiteUrl(),
    name: SITE_CONFIG.name,
    inLanguage: ["uz", "ru", "en"],
    publisher: { "@id": `${getCanonicalSiteUrl()}/#organization` },
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  const base = getCanonicalSiteUrl().replace(/\/$/, "");
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function getFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getTouristTripSchema(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  const base = getCanonicalSiteUrl().replace(/\/$/, "");
  return {
    "@type": "TouristTrip",
    name: input.name,
    description: input.description,
    url: `${base}${input.path}`,
    image: input.image ?? `${base}/images/og/default.png`,
    provider: { "@id": `${base}/#organization` },
  };
}

export function getNewsArticleSchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  const base = getCanonicalSiteUrl().replace(/\/$/, "");
  return {
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${base}${input.path}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@id": `${base}/#organization` },
    publisher: { "@id": `${base}/#organization` },
  };
}

export function getGlobalJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [getTravelAgencySchema(), getWebSiteSchema()],
  };
}
