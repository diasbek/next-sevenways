import type { AdminPermissionArea } from "@/lib/cms/auth-shared";

export type DashboardNavArea = AdminPermissionArea;

export type DashboardNavLabelKey =
  | "overview"
  | "leads"
  | "tours"
  | "offices"
  | "news"
  | "content"
  | "operators"
  | "legal"
  | "media"
  | "settings"
  | "messaging"
  | "users";

export type DashboardNavItem = {
  href: string;
  labelKey: DashboardNavLabelKey;
  shortLabelKey?:
    | "overviewShort"
    | "newsShort"
    | "messagingShort"
    | "toursShort"
    | "officesShort"
    | "contentShort"
    | "operatorsShort"
    | "legalShort";
  area: DashboardNavArea;
  group: "ops" | "content" | "system";
};

export const NAV_GROUP_IDS = ["ops", "content", "system"] as const;

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    href: "/dashboard/",
    labelKey: "overview",
    shortLabelKey: "overviewShort",
    area: "overview",
    group: "ops",
  },
  {
    href: "/dashboard/leads/",
    labelKey: "leads",
    area: "leads",
    group: "ops",
  },
  {
    href: "/dashboard/tours/",
    labelKey: "tours",
    shortLabelKey: "toursShort",
    area: "tours",
    group: "content",
  },
  {
    href: "/dashboard/offices/",
    labelKey: "offices",
    shortLabelKey: "officesShort",
    area: "offices",
    group: "content",
  },
  {
    href: "/dashboard/news/",
    labelKey: "news",
    shortLabelKey: "newsShort",
    area: "news",
    group: "content",
  },
  {
    href: "/dashboard/content/",
    labelKey: "content",
    shortLabelKey: "contentShort",
    area: "content",
    group: "content",
  },
  {
    href: "/dashboard/operators/",
    labelKey: "operators",
    shortLabelKey: "operatorsShort",
    area: "operators",
    group: "content",
  },
  {
    href: "/dashboard/legal/",
    labelKey: "legal",
    shortLabelKey: "legalShort",
    area: "legal",
    group: "content",
  },
  {
    href: "/dashboard/media/",
    labelKey: "media",
    area: "media",
    group: "content",
  },
  {
    href: "/dashboard/messaging/",
    labelKey: "messaging",
    shortLabelKey: "messagingShort",
    area: "messaging",
    group: "system",
  },
  {
    href: "/dashboard/settings/",
    labelKey: "settings",
    area: "settings",
    group: "system",
  },
  {
    href: "/dashboard/users/",
    labelKey: "users",
    area: "users",
    group: "system",
  },
];
