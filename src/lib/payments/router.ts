import type { MoneyCurrency, PaymentProvider, PaymentProviderId } from "./types";
import { getPaymentProvider, listPaymentProviders } from "./registry";

async function providerReady(p: PaymentProvider): Promise<boolean> {
  return Boolean(await p.isConfigured());
}

export async function providersForCurrency(
  currency: MoneyCurrency,
  enabledIds: PaymentProviderId[],
): Promise<PaymentProvider[]> {
  const enabled = new Set(enabledIds);
  const out: PaymentProvider[] = [];
  for (const p of listPaymentProviders()) {
    if (
      enabled.has(p.id) &&
      p.supportedCurrencies.includes(currency) &&
      (await providerReady(p))
    ) {
      out.push(p);
    }
  }
  return out;
}

export async function pickProvider(
  currency: MoneyCurrency,
  enabledIds: PaymentProviderId[],
  preferred?: PaymentProviderId,
): Promise<PaymentProvider | null> {
  const list = await providersForCurrency(currency, enabledIds);
  if (!list.length) return null;
  if (preferred) {
    const match = list.find((p) => p.id === preferred);
    if (match) return match;
  }
  return list[0] ?? null;
}

export function assertProviderId(value: string): PaymentProviderId | null {
  if (value === "click" || value === "payme" || value === "uzum") return value;
  return null;
}

export async function resolveProviderOrThrow(
  id: PaymentProviderId,
): Promise<PaymentProvider> {
  const p = getPaymentProvider(id);
  if (!p) throw new Error(`Unknown provider: ${id}`);
  if (!(await providerReady(p))) {
    throw new Error(`Provider ${id} is not configured`);
  }
  return p;
}
