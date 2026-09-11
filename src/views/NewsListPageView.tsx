import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { localePath } from "@/i18n/paths";
import type { NewsArticle } from "@/lib/news/repository";
import { listNews } from "@/lib/news/repository";
import { PageContainer } from "@/components/atoms/PageContainer";
import { section, pageIntroTitle, pageIntroLead } from "@/styles/ui";

export function NewsListPageView({
  locale,
  articles,
}: {
  locale: Locale;
  articles?: NewsArticle[];
}) {
  const content = getContent(locale);
  const items = articles ?? listNews(locale);

  return (
    <section className={section}>
      <PageContainer>
        <h1 className={pageIntroTitle}>{content.news.title}</h1>
        <p className={`mt-2 ${pageIntroLead}`}>{content.news.lead}</p>
        {items.length ? (
          <ul className="mt-8 space-y-4">
            {items.map((article) => (
              <li key={article.slug}>
                <Link
                  href={localePath(locale, `/news/${article.slug}/`)}
                  className="block rounded-2xl border border-black/8 bg-white p-5 hover:border-primary/30"
                >
                  <p className="text-xs text-ink-muted">{article.publishedAt}</p>
                  <h2 className="mt-1 text-lg font-semibold text-ink">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted">{article.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-ink-muted">{content.news.empty}</p>
        )}
      </PageContainer>
    </section>
  );
}
