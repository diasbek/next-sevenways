/** Preview lock until launch. Disable with SW_SITE_GATE=0. */

export const SITE_GATE_COOKIE = "sw_site_unlock";
export const SITE_GATE_COOKIE_VALUE = "1";
export const SITE_GATE_PATH = "/coming-soon/";

export function isSiteGateEnabled(): boolean {
  const raw = (process.env.SW_SITE_GATE ?? "1").trim().toLowerCase();
  return raw !== "0" && raw !== "false" && raw !== "off";
}

export function getSiteGateCode(): string {
  return (process.env.SW_SITE_GATE_CODE ?? "7777").trim();
}

export function isSiteGateUnlocked(
  cookieValue: string | undefined | null,
): boolean {
  return cookieValue === SITE_GATE_COOKIE_VALUE;
}

export function isSiteGateExemptPath(pathname: string): boolean {
  if (
    pathname === "/coming-soon" ||
    pathname === "/coming-soon/" ||
    pathname.startsWith("/coming-soon/")
  ) {
    return true;
  }
  if (
    pathname === "/api/site-gate/unlock" ||
    pathname === "/api/site-gate/unlock/"
  ) {
    return true;
  }
  if (
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/manifest.json" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/apple-touch-icon") ||
    pathname.startsWith("/_next/")
  ) {
    return true;
  }
  return false;
}
