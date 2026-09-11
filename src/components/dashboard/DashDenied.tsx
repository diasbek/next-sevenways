import { getDashT } from "@/i18n/dashboard/server";
import { DashAccessDenied } from "@/components/dashboard/DashAccessDenied";

type Section =
  | "leads"
  | "news"
  | "categories"
  | "media"
  | "users"
  | "settings";

export async function DashDenied({ section }: { section: Section }) {
  const { t } = await getDashT();
  const map: Record<Section, { title: string; lead: string }> = {
    leads: { title: t.leads.title, lead: t.leads.denied },
    news: { title: t.news.title, lead: t.common.accessDenied },
    categories: { title: t.categories.title, lead: t.common.accessDenied },
    media: { title: t.media.title, lead: t.common.accessDenied },
    users: { title: t.users.title, lead: t.users.denied },
    settings: { title: t.settings.title, lead: t.common.accessDenied },
  };
  const props = map[section];
  return <DashAccessDenied title={props.title} lead={props.lead} />;
}
