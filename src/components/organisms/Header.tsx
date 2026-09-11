"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { localePath, stripLocalePrefix } from "@/i18n/paths";
import type { SiteCopy } from "@/data/types";
import { SITE_CONFIG } from "@/utils/consts";
import { Button } from "@/components/atoms/Button";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { cn } from "@/lib/cn";
import { headerControlQuiet, pageContainer } from "@/styles/ui";

interface HeaderProps {
  locale: Locale;
  content: SiteCopy;
}

function normalizeNavPath(path: string) {
  if (!path || path === "/") return "/";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

function isActivePath(currentPath: string, href: string) {
  const current = normalizeNavPath(currentPath);
  const target = normalizeNavPath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(target);
}

export function Header({ locale, content }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const { path: currentPath } = stripLocalePrefix(pathname);
  const requestHref = localePath(locale, "/request/");
  const menuLabel = open ? content.ui.close : content.ui.menu;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-md">
        <div
          className={cn(
            pageContainer,
            "flex h-[var(--header-height)] items-center justify-between gap-3",
          )}
        >
          <Link
            href={localePath(locale, "/")}
            className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/footer/logo.png"
              alt=""
              width={48}
              height={41}
              className="h-9 w-auto sm:h-10"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold tracking-tight text-deep-blue sm:text-base">
                {SITE_CONFIG.name}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-medium text-ink-muted sm:text-xs">
                {content.brand.descriptor}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {content.nav.map((item) => {
              const href = localePath(locale, item.href);
              const active = isActivePath(currentPath, item.href);
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-ink-muted hover:bg-black/[0.03] hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="hidden text-sm font-medium text-ink-muted hover:text-ink md:inline"
            >
              {SITE_CONFIG.phoneDisplay}
            </a>
            <LanguageSwitcher locale={locale} size="compact" />
            <Button href={requestHref} size="xs" className="hidden sm:inline-flex">
              {content.ui.leaveRequest}
            </Button>
            <button
              type="button"
              className={cn(headerControlQuiet, "lg:hidden")}
              aria-label={menuLabel}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-30 bg-white pt-[var(--header-height)] lg:hidden">
          <nav className={cn(pageContainer, "flex flex-col gap-1 py-4")}>
            {content.nav.map((item) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                className="rounded-xl px-4 py-3 text-base font-medium text-ink hover:bg-black/[0.03]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button href={requestHref} className="mt-4 w-full">
              {content.ui.leaveRequest}
            </Button>
          </nav>
        </div>
      ) : null}
    </>
  );
}
