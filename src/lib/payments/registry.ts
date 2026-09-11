import { getEnv } from "@/utils/env";
import type { PaymentProvider, PaymentProviderId } from "./types";
import { clickProvider } from "./providers/click";
import { paymeProvider } from "./providers/payme";
import { uzumProvider } from "./providers/uzum";

const ALL: PaymentProvider[] = [clickProvider, paymeProvider, uzumProvider];

export function listPaymentProviders(): PaymentProvider[] {
  return ALL;
}

export function getPaymentProvider(
  id: PaymentProviderId,
): PaymentProvider | undefined {
  return ALL.find((p) => p.id === id);
}

/** Master kill-switch from env (CMS payments_enabled is additional). */
export function isPaymentsEnvEnabled(): boolean {
  const raw = (getEnv("PAYMENTS_ENABLED") ?? "0").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "on";
}
