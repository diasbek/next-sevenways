import type { Locale } from "@/i18n/config";
import type { NewsArticle } from "@/lib/news/repository";
import { localePath } from "@/i18n/paths";
import { PageContainer } from "@/components/atoms/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNewsArticleSchema } from "@/utils/seo/json-ld";
import { section, pageIntroTitle } from "@/styles/ui";

export function NewsArticlePageView({
  locale,
  article,
}: {
  locale: Locale;
  article: NewsArticle;
}) {
  return (
    <>
      <JsonLd
        data={getNewsArticleSchema({
          title: article.title,
          description: article.excerpt,
          path: localePath(locale, `/news/${article.slug}/`),
          datePublished: article.publishedAt,
        })}
      />
      <section className={section}>
        <PageContainer className="max-w-3xl">
          <p className="text-sm text-ink-muted">{article.publishedAt}</p>
          <h1 className={`mt-2 ${pageIntroTitle}`}>{article.title}</h1>
          <p className="mt-6 text-base leading-relaxed text-ink-muted whitespace-pre-wrap">
            {article.body}
          </p>
        </PageContainer>
      </section>
    </>
  );
}
