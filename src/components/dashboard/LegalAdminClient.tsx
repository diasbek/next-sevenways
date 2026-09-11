"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { DashCrudPage } from "@/components/dashboard/ds";
import { saveLegalPageAction } from "@/app/dashboard/(app)/legal/actions";
import {
  dashBtnPrimary,
  dashCardPad,
  dashInput,
  dashLabel,
} from "@/styles/dashboard";
import { cn } from "@/lib/cn";

export type LegalAdminRow = {
  slug: "privacy" | "terms";
  title_uz: string;
  title_ru: string;
  title_en: string;
  body_uz: string;
  body_ru: string;
  body_en: string;
};

type LocaleTab = "uz" | "ru" | "en";

export function LegalAdminClient({
  pages,
  seedPages,
  canWrite,
  cmsReady,
}: {
  pages: LegalAdminRow[];
  seedPages: LegalAdminRow[];
  canWrite: boolean;
  cmsReady: boolean;
}) {
  const t = useDashT();
  const router = useRouter();
  const [slug, setSlug] = useState<"privacy" | "terms">("privacy");
  const [localeTab, setLocaleTab] = useState<LocaleTab>("uz");

  const cmsPage = pages.find((p) => p.slug === slug);
  const seedPage = seedPages.find((p) => p.slug === slug)!;
  const page = cmsPage ?? seedPage;
  const usingSeed = !cmsPage;

  return (
    <DashCrudPage
      title="Legal pages"
      lead={
        cmsReady
          ? "Privacy and terms overlays in sw_legal_pages (blank lines separate paragraphs)."
          : "Seed legal copy shown until Supabase is connected."
      }
    >
      <div className="flex flex-wrap gap-2">
        {(["privacy", "terms"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlug(s)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold capitalize",
              slug === s
                ? "bg-primary text-white"
                : "border border-black/10 bg-white text-black/55",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {usingSeed ? (
        <p className={`${dashCardPad} text-sm text-black/55`}>
          Editing from seed
          {cmsReady ? " — save to create CMS overlay." : " (read-only without Supabase)."}
        </p>
      ) : null}

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

      <form
        key={`${slug}-${cmsPage ? "cms" : "seed"}`}
        className="grid gap-3"
        action={async (fd) => {
          try {
            await saveLegalPageAction(fd);
            toast.success(t.form.successDefault);
            router.refresh();
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : t.errors.saveFailed,
            );
          }
        }}
      >
        <input type="hidden" name="slug" value={slug} />
        {(["uz", "ru", "en"] as const).map((loc) => (
          <div
            key={loc}
            className={cn("grid gap-3", localeTab !== loc && "hidden")}
          >
            <label className="grid gap-1.5">
              <span className={dashLabel}>Title {loc.toUpperCase()}</span>
              <input
                name={`title_${loc}`}
                defaultValue={page[`title_${loc}`]}
                className={dashInput}
                disabled={!cmsReady || !canWrite}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={dashLabel}>
                Body {loc.toUpperCase()} (paragraphs separated by blank line)
              </span>
              <textarea
                name={`body_${loc}`}
                rows={14}
                defaultValue={page[`body_${loc}`]}
                className={dashInput}
                disabled={!cmsReady || !canWrite}
              />
            </label>
          </div>
        ))}
        {canWrite && cmsReady ? (
          <button type="submit" className={`${dashBtnPrimary} w-fit`}>
            {t.common.save}
          </button>
        ) : null}
      </form>
    </DashCrudPage>
  );
}
