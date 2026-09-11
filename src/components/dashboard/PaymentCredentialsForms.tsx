"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  dashBtnPrimary,
  dashCardPad,
  dashHint,
  dashInput,
  dashLabel,
} from "@/styles/dashboard";
import type { CredentialsAdminView } from "@/lib/payments";
import { savePaymentCredentialsAction } from "@/app/dashboard/(app)/settings/actions";

function SecretHint({ set }: { set: boolean }) {
  return (
    <span className="text-xs text-black/40">
      {set ? "Saved — leave blank to keep" : "Not set"}
    </span>
  );
}

export function PaymentCredentialsForms({
  views,
  canWrite,
  secretsKeyReady,
}: {
  views: CredentialsAdminView[];
  canWrite: boolean;
  secretsKeyReady: boolean;
}) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div>
        <p className="m-0 text-sm font-semibold text-ink">
          Payment credentials
        </p>
        <p className={dashHint}>
          Stored in Supabase (`sw_payment_credentials`). Secrets are encrypted
          when `PAYMENTS_SECRETS_KEY` (or `SECRETS_MASTER_KEY`) is set. Env vars
          remain a fallback.
        </p>
        {!secretsKeyReady ? (
          <p className="mt-2 text-xs text-warning">
            No master key in env — secrets will be stored in jsonb without
            encryption (still RLS-protected). Prefer setting
            PAYMENTS_SECRETS_KEY.
          </p>
        ) : null}
      </div>

      {views.map((view) => (
        <form
          key={view.provider}
          className={`${dashCardPad} space-y-3`}
          action={async (fd) => {
            try {
              await savePaymentCredentialsAction(fd);
              toast.success(`${view.provider} credentials saved`);
              router.refresh();
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Save failed",
              );
            }
          }}
        >
          <input type="hidden" name="provider" value={view.provider} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-sm font-semibold capitalize text-ink">
              {view.provider}
            </p>
            <span className="text-xs text-black/45">
              {view.configured ? "configured" : "incomplete"} · source:{" "}
              {view.source}
            </span>
          </div>

          {view.provider === "click" ? (
            <>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Merchant ID</span>
                <input
                  name="merchantId"
                  defaultValue={String(view.fields.merchantId ?? "")}
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="off"
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Service ID</span>
                <input
                  name="serviceId"
                  defaultValue={String(view.fields.serviceId ?? "")}
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="off"
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Merchant user ID</span>
                <input
                  name="merchantUserId"
                  defaultValue={String(view.fields.merchantUserId ?? "")}
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="off"
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>
                  Secret key <SecretHint set={Boolean(view.secretSet.secretKey)} />
                </span>
                <input
                  name="secretKey"
                  type="password"
                  placeholder="••••••••"
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="new-password"
                />
              </label>
            </>
          ) : null}

          {view.provider === "payme" ? (
            <>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Merchant ID</span>
                <input
                  name="merchantId"
                  defaultValue={String(view.fields.merchantId ?? "")}
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="off"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isTest"
                  value="1"
                  defaultChecked={Boolean(view.fields.isTest)}
                  disabled={!canWrite}
                />
                Test mode
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>
                  Secret key <SecretHint set={Boolean(view.secretSet.secretKey)} />
                </span>
                <input
                  name="secretKey"
                  type="password"
                  placeholder="••••••••"
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="new-password"
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>
                  Test key <SecretHint set={Boolean(view.secretSet.testKey)} />
                </span>
                <input
                  name="testKey"
                  type="password"
                  placeholder="••••••••"
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="new-password"
                />
              </label>
            </>
          ) : null}

          {view.provider === "uzum" ? (
            <>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Terminal ID</span>
                <input
                  name="terminalId"
                  defaultValue={String(view.fields.terminalId ?? "")}
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="off"
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>Checkout base URL</span>
                <input
                  name="checkoutBaseUrl"
                  defaultValue={String(view.fields.checkoutBaseUrl ?? "")}
                  placeholder="https://checkout.uzumbank.uz"
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="off"
                />
              </label>
              <label className="grid gap-1.5">
                <span className={dashLabel}>
                  API key <SecretHint set={Boolean(view.secretSet.apiKey)} />
                </span>
                <input
                  name="apiKey"
                  type="password"
                  placeholder="••••••••"
                  disabled={!canWrite}
                  className={dashInput}
                  autoComplete="new-password"
                />
              </label>
            </>
          ) : null}

          <button
            type="submit"
            disabled={!canWrite}
            className={dashBtnPrimary}
          >
            Save {view.provider}
          </button>
        </form>
      ))}
    </div>
  );
}
