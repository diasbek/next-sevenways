import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import type { SiteCopy } from "@/data/types";
import { SITE_CONFIG } from "@/utils/consts";
import { PageContainer } from "@/components/atoms/PageContainer";
import { PaymentMethodsStrip } from "@/components/organisms/PaymentMethodsStrip";

function ContactIcon({
  kind,
}: {
  kind: "phone" | "mail" | "pin";
}) {
  const src =
    kind === "phone"
      ? "/images/footer/icons/phone.svg"
      : kind === "mail"
        ? "/images/footer/icons/mail.svg"
        : "/images/footer/icons/pin.svg";
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sky text-white shadow-[0_4px_12px_rgb(20_152_229/0.35)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-4 brightness-0 invert" />
    </span>
  );
}

function footerHref(locale: Locale, href: string) {
  if (href.includes("#")) {
    const [path, hash] = href.split("#");
    const base = localePath(locale, path || "/");
    return `${base}#${hash}`;
  }
  return localePath(locale, href);
}

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

  const supportLinks = [
    { label: "FAQ", href: "/faq/" },
    { label: content.meta.privacyTitle, href: "/privacy/" },
    { label: content.meta.termsTitle, href: "/terms/" },
  ];

  const socials = [
    {
      label: "Telegram",
      href: SITE_CONFIG.telegramUrl,
      icon: "/images/footer/social/telegram.svg",
      className: "bg-[#229ED9]",
    },
    {
      label: "Instagram",
      href: SITE_CONFIG.instagramUrl,
      icon: "/images/footer/social/instagram.svg",
      className:
        "bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_45%,#8134af_75%,#515bd4_100%)]",
    },
    {
      label: "Facebook",
      href: SITE_CONFIG.facebookUrl,
      icon: "/images/footer/social/facebook.svg",
      className: "bg-[#1877F2]",
    },
  ] as const;

  return (
    <footer className="mt-auto bg-[radial-gradient(120%_90%_at_50%_-10%,#0a3d8f_0%,#062e73_48%,#041f52_100%)] text-white">
      <PageContainer className="grid gap-10 py-12 sm:py-14 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        <div className="max-w-sm">
          <Link href={localePath(locale, "/")} className="inline-block">
            <Image
              src="/images/footer/logo.png"
              alt={SITE_CONFIG.name}
              width={148}
              height={126}
              className="h-16 w-auto brightness-0 invert sm:h-[4.5rem]"
              unoptimized
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {content.footer.blurb}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            {socials.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/85 transition hover:text-white"
                >
                  <span
                    className={`grid size-8 place-items-center rounded-full ${item.className}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.icon}
                      alt=""
                      className="size-3.5 brightness-0 invert"
                    />
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold tracking-wide text-white">
            {content.footer.navigation}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {content.footer.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={footerHref(locale, item.href)}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold tracking-wide text-white">
            {content.footer.support}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {supportLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold tracking-wide text-white">
            {content.contacts.title}
          </p>
          <ul className="mt-4 space-y-3.5 text-sm text-white/85">
            <li>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="inline-flex items-center gap-3 transition hover:text-white"
              >
                <ContactIcon kind="phone" />
                {SITE_CONFIG.phoneDisplay}
              </a>
            </li>
            {SITE_CONFIG.email ? (
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-3 transition hover:text-white"
                >
                  <ContactIcon kind="mail" />
                  {SITE_CONFIG.email}
                </a>
              </li>
            ) : null}
            <li className="inline-flex items-start gap-3">
              <ContactIcon kind="pin" />
              <span className="pt-1.5 leading-snug">{address}</span>
            </li>
          </ul>
        </div>
      </PageContainer>

      <PageContainer className="border-t border-white/15 py-7">
        <PaymentMethodsStrip locale={locale} inverted showNote={false} />
      </PageContainer>

      <div className="border-t border-white/15 py-5 text-center text-xs text-white/55 sm:text-sm">
        © {year} Seven Ways. {content.footer.rights}
      </div>
    </footer>
  );
}
