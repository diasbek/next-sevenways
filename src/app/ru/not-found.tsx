import { SiteLayout } from "@/components/templates/SiteLayout";
import { NotFoundPageView } from "@/views/NotFoundPageView";

export default function NotFound() {
  return (
    <SiteLayout locale="ru">
      <NotFoundPageView locale="ru" />
    </SiteLayout>
  );
}
