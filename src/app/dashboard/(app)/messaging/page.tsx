import {
  canMutate,
  requireDashboardUser,
} from "@/lib/cms/auth";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getEnv } from "@/utils/env";
import {
  MessagingAdminClient,
  type MessagingProviderRow,
} from "@/components/dashboard/MessagingAdminClient";

export default async function MessagingPage() {
  const user = await requireDashboardUser("messaging");

  const envChannels = [
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

  let providers: MessagingProviderRow[] = [];
  if (hasSupabaseAdminConfig()) {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("sw_messaging_providers")
      .select("id, channel, label, is_active, config")
      .order("id");
    providers =
      data?.map((row) => ({
        id: row.id as string,
        channel: row.channel as string,
        label: row.label as string,
        is_active: Boolean(row.is_active),
        config:
          row.config && typeof row.config === "object"
            ? (row.config as Record<string, unknown>)
            : {},
      })) ?? [];
  }

  return (
    <MessagingAdminClient
      envChannels={envChannels}
      providers={providers}
      canWrite={canMutate(user.role, "messaging")}
    />
  );
}
