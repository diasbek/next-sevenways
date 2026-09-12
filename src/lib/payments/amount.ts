import type { MoneyCurrency } from "./types";

/** Payme expects amounts in tiyin (1 UZS = 100 tiyin). */
export function uzsToPaymeTiyin(amountUzs: number): number {
  return Math.round(amountUzs * 100);
}

export function paymeTiyinToUzs(tiyin: number): number {
  return tiyin / 100;
}

/** Click / Uzum Checkout typically use whole soʻm (UZS). */
export function toProviderMinorUnits(
  amount: number,
  currency: MoneyCurrency,
  provider: "click" | "payme" | "uzum",
): number {
  if (currency !== "UZS" && provider !== "uzum") {
    throw new Error(`${provider} does not accept ${currency}`);
  }
  if (provider === "payme") {
    if (currency !== "UZS") throw new Error("Payme accepts UZS only");
    return uzsToPaymeTiyin(amount);
  }
  return Math.round(amount);
}

/**
 * Deterministic money formatting (same on Node and browsers).
 * Avoids `uz-UZ` Intl currency mismatches that break hydration.
 */
export function formatMoney(
  amount: number,
  currency: MoneyCurrency,
  locale: string = "uz",
): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (currency === "USD") {
    const n = safe.toFixed(2);
    const [whole, frac] = n.split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (locale === "ru") return `${grouped.replace(/,/g, "\u00a0")},${frac}\u00a0$`;
    return `$ ${grouped}.${frac}`;
  }

  const whole = Math.round(safe)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, locale === "ru" ? "\u00a0" : ",");
  if (locale === "ru") return `${whole}\u00a0сум`;
  if (locale === "en") return `${whole} UZS`;
  return `${whole} soʻm`;
}
