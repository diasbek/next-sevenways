import { requireDashboardUser } from "@/lib/cms/auth";
import { getEnv } from "@/utils/env";

export default async function MessagingPage() {
  await requireDashboardUser("messaging");

  const channels = [
    {
      name: "Telegram",
      ok: Boolean(getEnv("TELEGRAM_BOT_TOKEN") && getEnv("TELEGRAM_CHAT_ID")),
    },
    {
      name: "Resend email",
      ok: Boolean(
        getEnv("RESEND_API_KEY") &&
          getEnv("RESEND_FROM") &&
          getEnv("RESEND_NOTIFY_TO"),
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Messaging</h1>
      <p className="text-sm text-ink-muted">
        Lead notifications use env-based Telegram and Resend. Configure secrets
        in Hostinger / `.env.local`.
      </p>
      <ul className="divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
        {channels.map((c) => (
          <li key={c.name} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="font-medium">{c.name}</span>
            <span className={c.ok ? "text-success" : "text-ink-muted"}>
              {c.ok ? "configured" : "missing env"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
