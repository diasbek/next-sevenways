/** Extract nested payload object (lead row or nested `{ data }`). */
export function leadPayloadData(
  payload: unknown,
): Record<string, unknown> {
  if (!payload || typeof payload !== "object") return {};
  if ("data" in payload) {
    const nested = (payload as { data?: unknown }).data;
    if (nested && typeof nested === "object") {
      return nested as Record<string, unknown>;
    }
  }
  return payload as Record<string, unknown>;
}

export function leadClientLabel(
  name: string | null | undefined,
  phone: string | null | undefined,
  payload?: unknown,
): string {
  if (name?.trim()) return name.trim();
  if (phone?.trim()) return phone.trim();
  const data = leadPayloadData(payload);
  const fromPayload =
    (typeof data.name === "string" && data.name) ||
    (typeof data.fullName === "string" && data.fullName) ||
    (typeof data.phone === "string" && data.phone) ||
    "";
  return fromPayload || "—";
}

export function leadTypeLabel(type: string): string {
  if (type === "tour") return "Tour";
  if (type === "price") return "Price";
  if (type === "business") return "Business";
  if (type === "contact") return "Contact";
  return type;
}

export function formatDashDate(iso: string, locale: string = "ru") {
  const intl =
    locale === "uz" || locale === "uz-UZ"
      ? "uz-UZ"
      : locale === "en" || locale === "en-US"
        ? "en-GB"
        : locale.includes("-")
          ? locale
          : "ru-RU";
  return new Intl.DateTimeFormat(intl, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(new Date(iso));
}
