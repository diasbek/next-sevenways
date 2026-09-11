import type { Locale } from "@/i18n/config";
import { getContentAsync } from "@/i18n/get-content";
import { getPublicSiteContacts } from "@/lib/site-settings/repository";
import { Header } from "@/components/organisms/Header";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { HashScroll } from "@/components/organisms/HashScroll";

export async function SiteLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [content, contacts] = await Promise.all([
    getContentAsync(locale),
    getPublicSiteContacts(),
  ]);
  return (
    <>
      <HashScroll />
      <Header locale={locale} content={content} contacts={contacts} />
      <div id="site-content" className="flex-1">
        <main id="main-content">{children}</main>
      </div>
      <SiteFooter locale={locale} content={content} contacts={contacts} />
    </>
  );
}
