import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  getCanonicalRedirectFromHeaders,
  toCanonicalPublicUrl,
} from "@/utils/seo/canonical-request";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

function isPublicDashboardPath(pathname: string) {
  return (
    pathname === "/dashboard/login" ||
    pathname === "/dashboard/login/" ||
    pathname === "/dashboard/setup" ||
    pathname === "/dashboard/setup/"
  );
}

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function detectHtmlLang(pathname: string): string {
  if (pathname === "/ru" || pathname === "/ru/" || pathname.startsWith("/ru/")) {
    return "ru";
  }
  if (pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/")) {
    return "en";
  }
  return "uz";
}

/**
 * 1. Canonical URL 308
 * 2. Legacy /uz → unprefixed
 * 3. Locale cookie + x-html-lang
 * 4. Dashboard session refresh + auth gate
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/uz" ||
    pathname === "/uz/" ||
    pathname.startsWith("/uz/")
  ) {
    let path =
      pathname === "/uz" || pathname === "/uz/"
        ? "/"
        : pathname.replace(/^\/uz/, "") || "/";
    if (path !== "/" && !path.endsWith("/") && !path.includes(".")) {
      path = `${path}/`;
    }
    return NextResponse.redirect(
      toCanonicalPublicUrl(path, request.nextUrl.search),
      308,
    );
  }

  if (!pathname.startsWith("/_next")) {
    const canonical = getCanonicalRedirectFromHeaders(
      request.headers,
      request.nextUrl,
    );
    if (canonical) {
      return NextResponse.redirect(canonical, 308);
    }
  }

  const requestHeaders = new Headers(request.headers);
  const lang = detectHtmlLang(pathname);
  requestHeaders.set("x-html-lang", lang);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (isDashboardPath(pathname)) {
    const url = getSupabaseUrl();
    const key = getSupabasePublishableKey();
    if (url && key) {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request: { headers: requestHeaders },
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user && !isPublicDashboardPath(pathname)) {
        const login = request.nextUrl.clone();
        login.pathname = "/dashboard/login/";
        login.searchParams.set("next", pathname);
        return NextResponse.redirect(login);
      }
    }
  }

  response.cookies.set("sw_locale", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/", "/((?!_next/|favicon.ico).*)"],
};
