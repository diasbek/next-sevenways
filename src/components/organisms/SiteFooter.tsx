import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { SiteCopy } from "@/data/types";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";

export function SiteFooter({
  locale,
  content,
}: {
  locale: Locale;
  content: SiteCopy;
}) {
  const year = new Date().getFullYear();
  const address =
    locale === "ru"
      ? SITE_CONFIG.address.line
      : locale === "en"
        ? SITE_CONFIG.address.lineEn
        : SITE_CONFIG.address.lineUz;

  return (
    <footer className="mt-auto border-t border-black/5 bg-surface-muted">
      <PageContainer className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-primary">Seven Ways</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
            {content.footer.blurb}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href={SITE_CONFIG.telegramUrl} className="text-primary hover:underline">
              Telegram
            </a>
            <a href={SITE_CONFIG.instagramUrl} className="text-primary hover:underline">
              Instagram
            </a>
            <a href={SITE_CONFIG.facebookUrl} className="text-primary hover:underline">
              Facebook
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">{content.footer.support}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {content.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  className="hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localePath(locale, "/faq/")} className="hover:text-ink">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">{content.contacts.title}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-ink">
                {SITE_CONFIG.phoneDisplay}
              </a>
            </li>
            {SITE_CONFIG.email ? (
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-ink">
                  {SITE_CONFIG.email}
                </a>
              </li>
            ) : null}
            <li>{address}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-4 text-xs text-ink-muted">
            <li>
              <Link href={localePath(locale, "/privacy/")} className="hover:text-ink">
                {content.meta.privacyTitle}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, "/terms/")} className="hover:text-ink">
                {content.meta.termsTitle}
              </Link>
            </li>
          </ul>
        </div>
      </PageContainer>
      <div className="border-t border-black/5 py-4 text-center text-xs text-ink-muted">
        © {year} Seven Ways. {content.footer.rights}
      </div>
    </footer>
  );
}
