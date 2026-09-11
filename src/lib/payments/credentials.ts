import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { getEnv } from "@/utils/env";
import {
  decryptSecret,
  encryptSecret,
  hasPaymentsSecretsKey,
  isEncryptedSecret,
} from "./crypto";
import type { PaymentProviderId } from "./types";

export type ClickCredentials = {
  merchantId: string;
  serviceId: string;
  merchantUserId: string;
  secretKey: string;
};

export type PaymeCredentials = {
  merchantId: string;
  secretKey: string;
  testKey: string;
  isTest: boolean;
};

export type UzumCredentials = {
  terminalId: string;
  apiKey: string;
  checkoutBaseUrl: string;
};

export type ProviderCredentialsMap = {
  click: ClickCredentials;
  payme: PaymeCredentials;
  uzum: UzumCredentials;
};

const SECRET_FIELDS: Record<PaymentProviderId, string[]> = {
  click: ["secretKey"],
  payme: ["secretKey", "testKey"],
  uzum: ["apiKey"],
};

type CacheEntry = {
  at: number;
  raw: Record<string, unknown>;
};

const CACHE_TTL_MS = 15_000;
const cache = new Map<PaymentProviderId, CacheEntry>();

export function invalidatePaymentCredentialsCache(
  provider?: PaymentProviderId,
) {
  if (provider) cache.delete(provider);
  else cache.clear();
}

function envClick(): ClickCredentials {
  return {
    merchantId: getEnv("CLICK_MERCHANT_ID"),
    serviceId: getEnv("CLICK_SERVICE_ID"),
    merchantUserId: getEnv("CLICK_MERCHANT_USER_ID"),
    secretKey: getEnv("CLICK_SECRET_KEY"),
  };
}

function envPayme(): PaymeCredentials {
  return {
    merchantId: getEnv("PAYME_MERCHANT_ID"),
    secretKey: getEnv("PAYME_SECRET_KEY", "PAYME_KEY"),
    testKey: getEnv("PAYME_TEST_KEY"),
    isTest: (getEnv("PAYME_TEST") || "0").toLowerCase() === "1",
  };
}

function envUzum(): UzumCredentials {
  return {
    terminalId: getEnv("UZUM_TERMINAL_ID"),
    apiKey: getEnv("UZUM_API_KEY"),
    checkoutBaseUrl:
      getEnv("UZUM_CHECKOUT_BASE_URL") || "https://checkout.uzumbank.uz",
  };
}

function pickStr(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  return typeof v === "string" ? v.trim() : "";
}

function decryptField(value: string): string {
  if (!value) return "";
  try {
    return decryptSecret(value);
  } catch {
    return "";
  }
}

async function loadRawFromDb(
  provider: PaymentProviderId,
): Promise<Record<string, unknown>> {
  const hit = cache.get(provider);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.raw;

  if (!hasSupabaseAdminConfig()) return {};
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_payment_credentials")
      .select("credentials")
      .eq("provider", provider)
      .maybeSingle();
    const raw =
      data?.credentials &&
      typeof data.credentials === "object" &&
      !Array.isArray(data.credentials)
        ? (data.credentials as Record<string, unknown>)
        : {};
    cache.set(provider, { at: Date.now(), raw });
    return raw;
  } catch {
    return {};
  }
}

function mergeClick(
  db: Record<string, unknown>,
  env: ClickCredentials,
): ClickCredentials {
  const secretRaw = pickStr(db, "secretKey");
  return {
    merchantId: pickStr(db, "merchantId") || env.merchantId,
    serviceId: pickStr(db, "serviceId") || env.serviceId,
    merchantUserId: pickStr(db, "merchantUserId") || env.merchantUserId,
    secretKey: secretRaw
      ? decryptField(secretRaw)
      : env.secretKey,
  };
}

function mergePayme(
  db: Record<string, unknown>,
  env: PaymeCredentials,
): PaymeCredentials {
  const secretRaw = pickStr(db, "secretKey");
  const testRaw = pickStr(db, "testKey");
  const isTestDb = db.isTest;
  return {
    merchantId: pickStr(db, "merchantId") || env.merchantId,
    secretKey: secretRaw ? decryptField(secretRaw) : env.secretKey,
    testKey: testRaw ? decryptField(testRaw) : env.testKey,
    isTest:
      typeof isTestDb === "boolean"
        ? isTestDb
        : typeof isTestDb === "string"
          ? isTestDb === "1" || isTestDb.toLowerCase() === "true"
          : env.isTest,
  };
}

function mergeUzum(
  db: Record<string, unknown>,
  env: UzumCredentials,
): UzumCredentials {
  const apiRaw = pickStr(db, "apiKey");
  return {
    terminalId: pickStr(db, "terminalId") || env.terminalId,
    apiKey: apiRaw ? decryptField(apiRaw) : env.apiKey,
    checkoutBaseUrl:
      pickStr(db, "checkoutBaseUrl") ||
      env.checkoutBaseUrl ||
      "https://checkout.uzumbank.uz",
  };
}

export async function getClickCredentials(): Promise<ClickCredentials> {
  return mergeClick(await loadRawFromDb("click"), envClick());
}

export async function getPaymeCredentials(): Promise<PaymeCredentials> {
  return mergePayme(await loadRawFromDb("payme"), envPayme());
}

export async function getUzumCredentials(): Promise<UzumCredentials> {
  return mergeUzum(await loadRawFromDb("uzum"), envUzum());
}

export async function getProviderCredentials<T extends PaymentProviderId>(
  provider: T,
): Promise<ProviderCredentialsMap[T]> {
  if (provider === "click") {
    return (await getClickCredentials()) as ProviderCredentialsMap[T];
  }
  if (provider === "payme") {
    return (await getPaymeCredentials()) as ProviderCredentialsMap[T];
  }
  return (await getUzumCredentials()) as ProviderCredentialsMap[T];
}

/** Safe preview for admin UI — never returns secret values. */
export type CredentialsAdminView = {
  provider: PaymentProviderId;
  fields: Record<string, string | boolean>;
  secretSet: Record<string, boolean>;
  source: "db" | "env" | "mixed" | "none";
  configured: boolean;
};

function hasAnyDbValue(db: Record<string, unknown>): boolean {
  return Object.values(db).some((v) => {
    if (typeof v === "boolean") return true;
    if (typeof v === "string") return v.trim().length > 0;
    return false;
  });
}

export async function listCredentialsAdminViews(): Promise<
  CredentialsAdminView[]
> {
  const providers: PaymentProviderId[] = ["click", "payme", "uzum"];
  const out: CredentialsAdminView[] = [];

  for (const provider of providers) {
    const db = await loadRawFromDb(provider);
    const secretSet: Record<string, boolean> = {};
    for (const key of SECRET_FIELDS[provider]) {
      const raw = pickStr(db, key);
      secretSet[key] = Boolean(raw) || Boolean(
        provider === "click"
          ? envClick().secretKey
          : provider === "payme"
            ? key === "testKey"
              ? envPayme().testKey
              : envPayme().secretKey
            : envUzum().apiKey,
      );
    }

    if (provider === "click") {
      const merged = mergeClick(db, envClick());
      const env = envClick();
      const configured = Boolean(
        merged.merchantId && merged.serviceId && merged.secretKey,
      );
      out.push({
        provider,
        fields: {
          merchantId: pickStr(db, "merchantId") || "",
          serviceId: pickStr(db, "serviceId") || "",
          merchantUserId: pickStr(db, "merchantUserId") || "",
        },
        secretSet,
        source: hasAnyDbValue(db)
          ? env.merchantId || env.secretKey
            ? "mixed"
            : "db"
          : configured
            ? "env"
            : "none",
        configured,
      });
    } else if (provider === "payme") {
      const merged = mergePayme(db, envPayme());
      const env = envPayme();
      const configured = Boolean(
        merged.merchantId &&
          (merged.isTest ? merged.testKey || merged.secretKey : merged.secretKey),
      );
      out.push({
        provider,
        fields: {
          merchantId: pickStr(db, "merchantId") || "",
          isTest: merged.isTest,
        },
        secretSet,
        source: hasAnyDbValue(db)
          ? env.merchantId || env.secretKey
            ? "mixed"
            : "db"
          : configured
            ? "env"
            : "none",
        configured,
      });
    } else {
      const merged = mergeUzum(db, envUzum());
      const env = envUzum();
      const configured = Boolean(merged.terminalId && merged.apiKey);
      out.push({
        provider,
        fields: {
          terminalId: pickStr(db, "terminalId") || "",
          checkoutBaseUrl: pickStr(db, "checkoutBaseUrl") || "",
        },
        secretSet,
        source: hasAnyDbValue(db)
          ? env.terminalId || env.apiKey
            ? "mixed"
            : "db"
          : configured
            ? "env"
            : "none",
        configured,
      });
    }
  }

  return out;
}

function encryptIfNeeded(value: string): string {
  if (!value) return "";
  if (isEncryptedSecret(value)) return value;
  if (!hasPaymentsSecretsKey()) {
    // Store plaintext only when no master key — still behind RLS + service role.
    return value;
  }
  return encryptSecret(value);
}

export async function saveProviderCredentials(
  provider: PaymentProviderId,
  patch: Record<string, string | boolean | undefined>,
): Promise<void> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase not configured");
  }

  const existing = await loadRawFromDb(provider);
  const next: Record<string, unknown> = { ...existing };

  const applyPlain = (key: string, value: string | undefined) => {
    if (value === undefined) return;
    const trimmed = value.trim();
    if (trimmed) next[key] = trimmed;
  };

  const applySecret = (key: string, value: string | undefined) => {
    if (value === undefined) return;
    const trimmed = value.trim();
    // Empty = keep existing secret
    if (!trimmed) return;
    next[key] = encryptIfNeeded(trimmed);
  };

  if (provider === "click") {
    applyPlain("merchantId", patch.merchantId as string | undefined);
    applyPlain("serviceId", patch.serviceId as string | undefined);
    applyPlain("merchantUserId", patch.merchantUserId as string | undefined);
    applySecret("secretKey", patch.secretKey as string | undefined);
  } else if (provider === "payme") {
    applyPlain("merchantId", patch.merchantId as string | undefined);
    if (typeof patch.isTest === "boolean") next.isTest = patch.isTest;
    applySecret("secretKey", patch.secretKey as string | undefined);
    applySecret("testKey", patch.testKey as string | undefined);
  } else {
    applyPlain("terminalId", patch.terminalId as string | undefined);
    applyPlain("checkoutBaseUrl", patch.checkoutBaseUrl as string | undefined);
    applySecret("apiKey", patch.apiKey as string | undefined);
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("sw_payment_credentials").upsert({
    provider,
    credentials: next,
  });
  if (error) throw new Error(error.message);

  invalidatePaymentCredentialsCache(provider);
}
