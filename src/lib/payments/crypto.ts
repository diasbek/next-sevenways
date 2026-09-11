import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getEnv } from "@/utils/env";

const PREFIX = "enc:v1:";

/** Prefer dedicated key; fall back to shared secrets master. */
export function getPaymentsSecretsKey(): string {
  return getEnv(
    "PAYMENTS_SECRETS_KEY",
    "SECRETS_MASTER_KEY",
    "MESSAGING_SECRETS_KEY",
  );
}

export function hasPaymentsSecretsKey(): boolean {
  return Boolean(getPaymentsSecretsKey());
}

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret, "utf8").digest();
}

export function encryptSecret(plain: string): string {
  const master = getPaymentsSecretsKey();
  if (!master) {
    throw new Error(
      "Set PAYMENTS_SECRETS_KEY (or SECRETS_MASTER_KEY) to store payment secrets",
    );
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(master), iv);
  const enc = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(value: string): string {
  if (!value.startsWith(PREFIX)) return value;
  const master = getPaymentsSecretsKey();
  if (!master) {
    throw new Error("Missing PAYMENTS_SECRETS_KEY to decrypt payment secrets");
  }
  const payload = value.slice(PREFIX.length);
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid encrypted secret format");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    deriveKey(master),
    Buffer.from(ivB64, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function isEncryptedSecret(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(PREFIX);
}
