export type DashboardNavItem = {
  href: string;
  label: string;
  area: string;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: "/dashboard/", label: "Overview", area: "overview" },
  { href: "/dashboard/leads/", label: "Leads", area: "leads" },
  { href: "/dashboard/tours/", label: "Tours", area: "tours" },
  { href: "/dashboard/offices/", label: "Offices", area: "offices" },
  { href: "/dashboard/news/", label: "News", area: "news" },
  { href: "/dashboard/media/", label: "Media", area: "media" },
  { href: "/dashboard/messaging/", label: "Messaging", area: "messaging" },
  { href: "/dashboard/settings/", label: "Settings", area: "settings" },
  { href: "/dashboard/users/", label: "Users", area: "users" },
];
