import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { ogLocale } from "@/i18n/config";
import { getLocalizedPageMetadata } from "@/i18n/metadata";
import { getLocalizedAlternates, localePath } from "@/i18n/paths";
import { createPageMetadata } from "@/utils/seo/metadata";
import { SiteLayout } from "@/components/templates/SiteLayout";
import { HomePageView } from "@/views/HomePageView";
import { ToursPageView } from "@/views/ToursPageView";
import { TourDestinationPageView } from "@/views/TourDestinationPageView";
import { ResortPageView } from "@/views/ResortPageView";
import { SearchPageView } from "@/views/SearchPageView";
import { CalendarPageView } from "@/views/CalendarPageView";
import { GiftsPageView } from "@/views/GiftsPageView";
import { OfficesPageView } from "@/views/OfficesPageView";
import { AboutPageView } from "@/views/AboutPageView";
import { FaqPageView } from "@/views/FaqPageView";
import { ContactsPageView } from "@/views/ContactsPageView";
import { RequestPageView } from "@/views/RequestPageView";
import { NewsListPageView } from "@/views/NewsListPageView";
import { NewsArticlePageView } from "@/views/NewsArticlePageView";
import { PrivacyPageView, TermsPageView } from "@/views/LegalPageViews";
import {
  DESTINATIONS,
  RESORTS,
  destinationPath,
  getDestination,
  getResort,
  resortPath,
} from "@/data/tours/catalog";
import { getContent } from "@/i18n/get-content";
import { notFound } from "next/navigation";
import {
  SEED_NEWS,
  getNewsBySlug,
  listPublishedSlugs,
} from "@/lib/news/repository";

export function createHomePage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "home"),
    Page: async function HomePage() {
      return (
        <SiteLayout locale={locale}>
          <HomePageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createToursPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "tours"),
    Page: async function ToursPage() {
      return (
        <SiteLayout locale={locale}>
          <ToursPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createTourDestinationPage(locale: Locale) {
  return {
    generateStaticParams: async () =>
      DESTINATIONS.map((d) => ({ slug: d.slug })),
    generateMetadata: async ({
      params,
    }: {
      params: Promise<{ slug: string }>;
    }) => {
      const { slug } = await params;
      const dest = getDestination(slug);
      if (!dest) return {};
      const content = getContent(locale);
      const name = dest.name[locale];
      const path = localePath(locale, destinationPath(slug));
      return createPageMetadata(
        `${name} — ${content.meta.toursTitle}`,
        dest.blurb[locale],
        path,
        {
          ogLocale: ogLocale[locale],
          alternates: getLocalizedAlternates(destinationPath(slug)),
        },
      );
    },
    Page: async function TourDestinationPage({
      params,
    }: {
      params: Promise<{ slug: string }>;
    }) {
      const { slug } = await params;
      if (!getDestination(slug)) notFound();
      return (
        <SiteLayout locale={locale}>
          <TourDestinationPageView locale={locale} slug={slug} />
        </SiteLayout>
      );
    },
  };
}

export function createResortPage(locale: Locale) {
  return {
    generateStaticParams: async () => RESORTS.map((r) => ({ slug: r.slug })),
    generateMetadata: async ({
      params,
    }: {
      params: Promise<{ slug: string }>;
    }) => {
      const { slug } = await params;
      const resort = getResort(slug);
      if (!resort) return {};
      const path = localePath(locale, resortPath(slug));
      return createPageMetadata(
        resort.name[locale],
        resort.blurb[locale],
        path,
        {
          ogLocale: ogLocale[locale],
          alternates: getLocalizedAlternates(resortPath(slug)),
        },
      );
    },
    Page: async function ResortPage({
      params,
    }: {
      params: Promise<{ slug: string }>;
    }) {
      const { slug } = await params;
      if (!getResort(slug)) notFound();
      return (
        <SiteLayout locale={locale}>
          <ResortPageView locale={locale} slug={slug} />
        </SiteLayout>
      );
    },
  };
}

export function createSearchPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "search"),
    Page: async function SearchPage() {
      return (
        <SiteLayout locale={locale}>
          <Suspense
            fallback={<div className="p-8 text-sm text-ink-muted">…</div>}
          >
            <SearchPageView locale={locale} />
          </Suspense>
        </SiteLayout>
      );
    },
  };
}

export function createCalendarPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "calendar"),
    Page: async function CalendarPage() {
      return (
        <SiteLayout locale={locale}>
          <CalendarPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createGiftsPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "gifts"),
    Page: async function GiftsPage() {
      return (
        <SiteLayout locale={locale}>
          <GiftsPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createOfficesPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "offices"),
    Page: async function OfficesPage() {
      return (
        <SiteLayout locale={locale}>
          <OfficesPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createAboutPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "about"),
    Page: async function AboutPage() {
      return (
        <SiteLayout locale={locale}>
          <AboutPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createFaqPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "faq"),
    Page: async function FaqPage() {
      return (
        <SiteLayout locale={locale}>
          <FaqPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createContactsPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "contacts"),
    Page: async function ContactsPage() {
      return (
        <SiteLayout locale={locale}>
          <ContactsPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createRequestPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "request"),
    Page: async function RequestPage() {
      const {
        getSitePaymentSettings,
        isPaymentsEnvEnabled,
        listPaymentProviders,
      } = await import("@/lib/payments");
      const settings = await getSitePaymentSettings();
      const envOn = isPaymentsEnvEnabled();
      const all = listPaymentProviders();
      const providerOptions: Array<{
        id: (typeof all)[number]["id"];
        label: string;
        currencies: ("UZS" | "USD")[];
      }> = [];
      for (const p of all) {
        if (
          settings.enabledProviders.includes(p.id) &&
          (await p.isConfigured())
        ) {
          providerOptions.push({
            id: p.id,
            label: p.label,
            currencies: [...p.supportedCurrencies] as ("UZS" | "USD")[],
          });
        }
      }

      return (
        <SiteLayout locale={locale}>
          <Suspense
            fallback={<div className="p-8 text-sm text-ink-muted">…</div>}
          >
            <RequestPageView
              locale={locale}
              bookingMode={settings.bookingMode}
              paymentsEnabled={settings.paymentsEnabled && envOn}
              providerOptions={providerOptions}
            />
          </Suspense>
        </SiteLayout>
      );
    },
  };
}

export function createNewsListPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "news"),
    Page: async function NewsListPage() {
      return (
        <SiteLayout locale={locale}>
          <NewsListPageView locale={locale} articles={SEED_NEWS} />
        </SiteLayout>
      );
    },
  };
}

export function createNewsArticlePage(locale: Locale) {
  return {
    generateStaticParams: async () =>
      listPublishedSlugs().map((slug) => ({ slug })),
    generateMetadata: async ({
      params,
    }: {
      params: Promise<{ slug: string }>;
    }) => {
      const { slug } = await params;
      const article = getNewsBySlug(slug, locale);
      if (!article) return {};
      const path = localePath(locale, `/news/${slug}/`);
      return createPageMetadata(article.title, article.excerpt, path, {
        ogLocale: ogLocale[locale],
        ogType: "article",
        alternates: getLocalizedAlternates(`/news/${slug}/`),
      });
    },
    Page: async function NewsArticlePage({
      params,
    }: {
      params: Promise<{ slug: string }>;
    }) {
      const { slug } = await params;
      const article = getNewsBySlug(slug, locale);
      if (!article) notFound();
      return (
        <SiteLayout locale={locale}>
          <NewsArticlePageView locale={locale} article={article} />
        </SiteLayout>
      );
    },
  };
}

export function createPrivacyPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "privacy"),
    Page: async function PrivacyPage() {
      return (
        <SiteLayout locale={locale}>
          <PrivacyPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}

export function createTermsPage(locale: Locale) {
  return {
    generateMetadata: () => getLocalizedPageMetadata(locale, "terms"),
    Page: async function TermsPage() {
      return (
        <SiteLayout locale={locale}>
          <TermsPageView locale={locale} />
        </SiteLayout>
      );
    },
  };
}
