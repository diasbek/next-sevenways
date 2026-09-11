import { getEnv } from "@/utils/env";

/** Simple Telegram + Resend notify without full messaging hub. */
export async function notifyLeadChannels(opts: {
  id: string;
  type: string;
  locale: string;
  name: string;
  phone: string;
  data: Record<string, unknown>;
}) {
  const text = [
    `Seven Ways · new lead ${opts.id}`,
    `Type: ${opts.type} · ${opts.locale}`,
    `Name: ${opts.name}`,
    `Phone: ${opts.phone}`,
    `Data: ${JSON.stringify(opts.data)}`,
  ].join("\n");

  const token = getEnv("TELEGRAM_BOT_TOKEN");
  const chatId = getEnv("TELEGRAM_CHAT_ID");
  if (token && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      });
    } catch (err) {
      console.error("[notify:telegram]", err);
    }
  }

  const resendKey = getEnv("RESEND_API_KEY");
  const from = getEnv("RESEND_FROM");
  const to = getEnv("RESEND_NOTIFY_TO");
  if (resendKey && from && to) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from,
        to: [to],
        subject: `Seven Ways lead ${opts.id}`,
        text,
      });
    } catch (err) {
      console.error("[notify:resend]", err);
    }
  }
}
