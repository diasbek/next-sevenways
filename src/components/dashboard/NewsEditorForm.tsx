"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  createNewsAction,
  updateNewsAction,
} from "@/app/dashboard/(app)/news/actions";
import { DashImageField } from "@/components/dashboard/news/DashImageField";
import { NewsRichEditor } from "@/components/dashboard/news/NewsRichEditor";
import {
  DashFormField,
  dashBtnPrimary,
  dashBtnSecondary,
  dashCard,
  dashInput,
  dashSelect,
} from "@/components/dashboard/ui";
import { DashStatusBadge } from "@/components/dashboard/DashStatusBadge";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { dashMobileActionBar } from "@/styles/dashboard";
import { cn } from "@/lib/cn";

export type NewsFormValues = {
  id?: string;
  slug: string;
  status: string;
  cover_url: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  excerpt_uz: string;
  excerpt_ru: string;
  excerpt_en: string;
  body_uz: string;
  body_ru: string;
  body_en: string;
};

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function slugify(raw: string) {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9а-яёʻʼ''`]+/gi, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

type LocaleTab = "uz" | "ru" | "en";

function NewsFormActions({ isEdit }: { isEdit: boolean }) {
  const t = useDashT();
  const isClient = useIsClient();
  const label = isEdit ? t.common.save : t.common.create;

  const desktopBar = (
    <div className="sticky bottom-4 z-[1] hidden max-w-3xl flex-wrap gap-3 rounded-2xl border border-black/[0.08] bg-white/95 p-3 shadow-[0_8px_24px_rgb(15_18_24/0.08)] backdrop-blur lg:flex">
      <button type="submit" className={dashBtnPrimary} form="news-editor-form">
        {label}
      </button>
      <Link href="/dashboard/news/" className={dashBtnSecondary}>
        {t.common.back}
      </Link>
    </div>
  );

  const mobileBar = (
    <div className={cn(dashMobileActionBar, "lg:hidden")}>
      <button type="submit" className={dashBtnPrimary} form="news-editor-form">
        {label}
      </button>
      <Link href="/dashboard/news/" className={dashBtnSecondary}>
        {t.common.back}
      </Link>
    </div>
  );

  return (
    <>
      {desktopBar}
      {isClient ? createPortal(mobileBar, document.body) : null}
    </>
  );
}

export function NewsEditorForm({ values }: { values: NewsFormValues }) {
  const t = useDashT();
  const [localeTab, setLocaleTab] = useState<LocaleTab>("uz");
  const [slug, setSlug] = useState(values.slug);
  const [titles, setTitles] = useState({
    uz: values.title_uz,
    ru: values.title_ru,
    en: values.title_en,
  });
  const [excerpts, setExcerpts] = useState({
    uz: values.excerpt_uz,
    ru: values.excerpt_ru,
    en: values.excerpt_en,
  });

  const previewHref = useMemo(() => {
    if (!slug) return "/news/";
    if (localeTab === "ru") return `/ru/news/${slug}/`;
    if (localeTab === "en") return `/en/news/${slug}/`;
    return `/news/${slug}/`;
  }, [slug, localeTab]);

  const action = values.id ? updateNewsAction : createNewsAction;

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DashStatusBadge kind="news" value={values.status} />
          {values.id && slug ? (
            <Link
              href={previewHref}
              target="_blank"
              className={dashBtnSecondary}
            >
              Preview {localeTab.toUpperCase()}
            </Link>
          ) : null}
        </div>
      </div>

      <form
        id="news-editor-form"
        action={action}
        className="relative grid w-full min-w-0 max-w-full gap-5 pb-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-start lg:pb-24 xl:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]"
      >
        {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

        <div className="min-w-0 max-w-full space-y-4">
          <div className="flex gap-2">
            {(["uz", "ru", "en"] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocaleTab(loc)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold",
                  localeTab === loc
                    ? "bg-primary text-white"
                    : "border border-black/10 bg-white text-black/55",
                )}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {(["uz", "ru", "en"] as const).map((loc) => (
            <div
              key={loc}
              className={cn("grid gap-4", localeTab !== loc && "hidden")}
            >
              <DashFormField label={`Title ${loc.toUpperCase()}`}>
                <input
                  name={`title_${loc}`}
                  required={localeTab === loc}
                  value={titles[loc]}
                  onChange={(e) =>
                    setTitles((prev) => ({ ...prev, [loc]: e.target.value }))
                  }
                  className={dashInput}
                />
              </DashFormField>
              <DashFormField label={`Excerpt ${loc.toUpperCase()}`}>
                <textarea
                  name={`excerpt_${loc}`}
                  rows={2}
                  value={excerpts[loc]}
                  onChange={(e) =>
                    setExcerpts((prev) => ({ ...prev, [loc]: e.target.value }))
                  }
                  className={dashInput}
                />
              </DashFormField>
              <div>
                <p className="m-0 mb-1.5 text-xs font-semibold uppercase tracking-wide text-black/40">
                  Body {loc.toUpperCase()}
                </p>
                <NewsRichEditor
                  name={`body_${loc}`}
                  defaultHtml={
                    loc === "uz"
                      ? values.body_uz
                      : loc === "ru"
                        ? values.body_ru
                        : values.body_en
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <aside
          className={`${dashCard} min-w-0 max-w-full space-y-4 overflow-x-hidden p-4 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain`}
        >
          <DashFormField label={t.list.status}>
            <select
              name="status"
              defaultValue={values.status}
              className={dashSelect}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </DashFormField>

          <div className="grid gap-2">
            <DashFormField label="Slug">
              <input
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={dashInput}
              />
            </DashFormField>
            <button
              type="button"
              className={cn(dashBtnSecondary, "w-full")}
              onClick={() => setSlug(slugify(titles[localeTab]) || slug)}
            >
              From title
            </button>
          </div>

          <DashImageField
            name="cover_url"
            label={t.list.cover}
            defaultUrl={values.cover_url}
            folder="news/covers"
          />
        </aside>

        <div className="lg:col-span-2">
          <NewsFormActions isEdit={Boolean(values.id)} />
        </div>
      </form>
    </div>
  );
}
