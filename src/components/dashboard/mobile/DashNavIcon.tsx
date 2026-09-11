"use client";

import { cn } from "@/lib/cn";
import {
  IconLeads,
  IconMap,
  IconMedia,
  IconNews,
  IconOverview,
  IconSettings,
  IconStaff,
  IconMessaging,
  IconPackage,
  type DashIconProps,
} from "@/components/dashboard/icons";

export function DashNavIcon({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const props: DashIconProps = {
    className: cn("size-[1.125rem] shrink-0", className),
  };
  if (href === "/dashboard/") return <IconOverview {...props} />;
  if (href.startsWith("/dashboard/leads")) return <IconLeads {...props} />;
  if (href.startsWith("/dashboard/tours")) return <IconPackage {...props} />;
  if (href.startsWith("/dashboard/offices")) return <IconMap {...props} />;
  if (href.startsWith("/dashboard/news")) return <IconNews {...props} />;
  if (href.startsWith("/dashboard/content")) return <IconNews {...props} />;
  if (href.startsWith("/dashboard/operators")) return <IconStaff {...props} />;
  if (href.startsWith("/dashboard/legal")) return <IconSettings {...props} />;
  if (href.startsWith("/dashboard/messaging")) return <IconMessaging {...props} />;
  if (href.startsWith("/dashboard/settings")) return <IconSettings {...props} />;
  if (href.startsWith("/dashboard/media")) return <IconMedia {...props} />;
  if (href.startsWith("/dashboard/users")) return <IconStaff {...props} />;
  if (href.startsWith("/dashboard/export")) return <IconMedia {...props} />;
  return <IconOverview {...props} />;
}
