"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { DashCrudPage } from "@/components/dashboard/ds";
import { saveMessagingProviderAction } from "@/app/dashboard/(app)/messaging/actions";
import {
  dashBtnPrimary,
  dashCardPad,
  dashInput,
  dashLabel,
} from "@/styles/dashboard";

export type EnvChannelStatus = {
  name: string;
  ok: boolean;
};

export type MessagingProviderRow = {
  id: string;
  channel: string;
  label: string;
  is_active: boolean;
  config: Record<string, unknown>;
};

export function MessagingAdminClient({
  envChannels,
  providers,
  canWrite,
}: {
  envChannels: EnvChannelStatus[];
  providers: MessagingProviderRow[];
  canWrite: boolean;
}) {
  const t = useDashT();
  const router = useRouter();

  return (
    <DashCrudPage title={t.messaging.title} lead={t.messaging.lead}>
      <section className="space-y-3">
        <h2 className="m-0 text-sm font-semibold text-ink">Env status</h2>
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
          {envChannels.map((c) => (
            <li
              key={c.name}
              className={`${dashCardPad} flex items-center justify-between gap-3`}
            >
              <span className="font-medium text-ink">{c.name}</span>
              <span
                className={
                  c.ok
                    ? "text-xs font-semibold text-emerald-700"
                    : "text-xs font-semibold text-black/40"
                }
              >
                {c.ok ? "configured" : "missing env"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="m-0 text-sm font-semibold text-ink">
            {t.messaging.providersTitle}
          </h2>
          <p className="m-0 mt-1 text-xs text-black/45">
            {t.messaging.providersLead}
          </p>
        </div>

        {providers.length === 0 ? (
          <p className={`${dashCardPad} text-sm text-black/45`}>
            No rows in sw_messaging_providers yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {providers.map((p) => (
              <form
                key={p.id}
                className={`${dashCardPad} space-y-3`}
                action={async (fd) => {
                  try {
                    await saveMessagingProviderAction(fd);
                    toast.success(t.messaging.saved);
                    router.refresh();
                  } catch (err) {
                    toast.error(
                      err instanceof Error
                        ? err.message
                        : t.errors.saveFailed,
                    );
                  }
                }}
              >
                <input type="hidden" name="id" value={p.id} />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="m-0 text-base font-semibold text-ink">
                    {p.label || p.id}
                  </p>
                  <span className="text-xs font-medium uppercase tracking-wide text-black/40">
                    {p.channel}
                  </span>
                </div>

                <label className="grid gap-1.5">
                  <span className={dashLabel}>Label</span>
                  <input
                    name="label"
                    defaultValue={p.label}
                    disabled={!canWrite}
                    className={dashInput}
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className={dashLabel}>Channel</span>
                  <select
                    name="channel"
                    defaultValue={p.channel}
                    disabled={!canWrite}
                    className={dashInput}
                  >
                    <option value="telegram">telegram</option>
                    <option value="email">email</option>
                    <option value="sms">sms</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    name="is_active"
                    value="1"
                    defaultChecked={p.is_active}
                    disabled={!canWrite}
                    className="size-4 rounded border-black/20"
                  />
                  {t.messaging.enabled}
                </label>

                <label className="grid gap-1.5">
                  <span className={dashLabel}>Config (JSON)</span>
                  <textarea
                    name="config"
                    rows={5}
                    disabled={!canWrite}
                    defaultValue={JSON.stringify(p.config ?? {}, null, 2)}
                    className={`${dashInput} font-mono text-xs`}
                  />
                </label>

                {canWrite ? (
                  <button type="submit" className={`${dashBtnPrimary} w-fit`}>
                    {t.common.save}
                  </button>
                ) : null}
              </form>
            ))}
          </div>
        )}
      </section>
    </DashCrudPage>
  );
}
