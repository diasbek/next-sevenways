import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/env";
import { canAccess, type AdminUser } from "@/lib/cms/auth-shared";

export type DashNotificationItem = {
  id: string;
  kind: "lead" | "message_failed";
  title: string;
  subtitle: string;
  href: string;
  createdAt: string;
};

export type DashNotificationsSnapshot = {
  items: DashNotificationItem[];
  badge: number;
  showLeadsLink: boolean;
  showLogLink: boolean;
};

function leadTitle(payload: unknown, type: string): string {
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    const name =
      (typeof p.name === "string" && p.name) ||
      (typeof p.full_name === "string" && p.full_name) ||
      "";
    const phone = typeof p.phone === "string" ? p.phone : "";
    if (name || phone) return [name, phone].filter(Boolean).join(" · ");
  }
  return type || "lead";
}

export async function getDashNotifications(
  admin: AdminUser,
): Promise<DashNotificationsSnapshot> {
  if (!hasSupabaseAdminConfig()) {
    return {
      items: [],
      badge: 0,
      showLeadsLink: false,
      showLogLink: false,
    };
  }

  const wantLeads = canAccess(admin.role, "leads");
  const wantMessaging = canAccess(admin.role, "messaging");
  if (!wantLeads && !wantMessaging) {
    return {
      items: [],
      badge: 0,
      showLeadsLink: false,
      showLogLink: false,
    };
  }

  const client = createSupabaseAdminClient();

  const [leadsRes, logRes] = await Promise.all([
    wantLeads
      ? client
          .from("sw_leads")
          .select("id, type, status, name, phone, payload, created_at")
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as never[] }),
    wantMessaging
      ? client
          .from("sw_messaging_log")
          .select("id, created_at, event, channel, ok, detail")
          .eq("ok", false)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const leadItems: DashNotificationItem[] = wantLeads
    ? (leadsRes.data ?? []).map((row) => ({
        id: `lead:${row.id}`,
        kind: "lead" as const,
        title:
          [row.name, row.phone].filter(Boolean).join(" · ") ||
          leadTitle(row.payload, String(row.type ?? "")),
        subtitle: String(row.type ?? "lead"),
        href: `/dashboard/leads/${row.id}/`,
        createdAt: String(row.created_at),
      }))
    : [];

  const failItems: DashNotificationItem[] = wantMessaging
    ? (logRes.data ?? []).map((row) => ({
        id: `msg:${row.id}`,
        kind: "message_failed" as const,
        title: String(row.detail || row.event || "failed"),
        subtitle: String(row.channel ?? ""),
        href: "/dashboard/messaging/",
        createdAt: String(row.created_at),
      }))
    : [];

  const items = [...leadItems, ...failItems].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    items: items.slice(0, 16),
    badge: items.length,
    showLeadsLink: wantLeads,
    showLogLink: wantMessaging,
  };
}
