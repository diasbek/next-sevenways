"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "./nav";
import { cn } from "@/lib/cn";

export function DashboardChrome({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/dashboard/";

  return (
    <div className="min-h-dvh bg-surface-muted">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard/" className="font-semibold text-primary">
            Seven Ways CMS
          </Link>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="hidden sm:inline">{email}</span>
            <Link href="/dashboard/profile/" className="hover:text-ink">
              Profile
            </Link>
            <Link href="/" className="hover:text-ink">
              Site
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[14rem_1fr]">
        <nav className="flex flex-wrap gap-1 lg:flex-col">
          {DASHBOARD_NAV.map((item) => {
            const active =
              item.href === "/dashboard/"
                ? pathname === "/dashboard/" || pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-ink-muted hover:bg-white hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
