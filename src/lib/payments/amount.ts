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

export function formatMoney(
  amount: number,
  currency: MoneyCurrency,
  locale: string = "uz",
): string {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-US" : "uz-UZ";
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "UZS" ? 0 : 2,
    }).format(amount);
  } catch {
    if (currency === "USD") return `$${amount}`;
    return `${Math.round(amount).toLocaleString("uz-UZ")} soʻm`;
  }
}
