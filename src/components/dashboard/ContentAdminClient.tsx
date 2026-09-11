"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { DashCrudPage } from "@/components/dashboard/ds";
import { saveSiteCopySectionAction } from "@/app/dashboard/(app)/content/actions";
import {
  dashBtnPrimary,
  dashCardPad,
  dashInput,
  dashLabel,
} from "@/styles/dashboard";
import { cn } from "@/lib/cn";
import type { SiteCopy } from "@/data/types";
import type { SiteCopyKey } from "@/lib/site-copy/repository";

type LocaleTab = "uz" | "ru" | "en";

type CopyRow = {
  key: string;
  label: string;
  payload: Record<string, unknown>;
};

type EditorSection = {
  id: string;
  title: string;
  description: string;
  key: SiteCopyKey;
  /** Shape stored in payload[locale] for this CMS key. */
  pick: (section: unknown, overlay: unknown) => Record<string, unknown> | unknown[];
  /** Build payload_json body from form field map. */
  toPayload: (fields: Record<string, string>) => unknown;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function mergeOverlay(
  base: Record<string, unknown>,
  overlay: Record<string, unknown>,
): Record<string, unknown> {
  return { ...base, ...overlay };
}

const SECTIONS: EditorSection[] = [
  {
    id: "home-hero",
    title: "Home hero",
    description: "Hero title, lead, note, search tabs and CTA.",
    key: "home",
    pick: (section, overlay) => {
      const h = (section ?? {}) as SiteCopy["home"];
      const o = asRecord(overlay);
      return mergeOverlay(
        {
          heroTitle: h.heroTitle ?? "",
          heroLead: h.heroLead ?? "",
          heroNote: h.heroNote ?? "",
          heroScript: h.heroScript ?? "",
          heroTabTours: h.heroTabTours ?? "",
          heroTabHotels: h.heroTabHotels ?? "",
          heroTabTransfers: h.heroTabTransfers ?? "",
          heroWhere: h.heroWhere ?? "",
          heroDates: h.heroDates ?? "",
          heroPeople: h.heroPeople ?? "",
          heroSearchCta: h.heroSearchCta ?? "",
        },
        o,
      );
    },
    toPayload: (fields) => fields,
  },
  {
    id: "destinations-lead",
    title: "Destinations lead",
    description: "Home destinations block title, lead and filters.",
    key: "home",
    pick: (section, overlay) => {
      const h = (section ?? {}) as SiteCopy["home"];
      const o = asRecord(overlay);
      return mergeOverlay(
        {
          destinationsTitle: h.destinationsTitle ?? "",
          destinationsLead: h.destinationsLead ?? "",
          destinationsFilterAll: h.destinationsFilterAll ?? "",
          destinationsFilterBeach: h.destinationsFilterBeach ?? "",
          destinationsFilterExcursion: h.destinationsFilterExcursion ?? "",
        },
        o,
      );
    },
    toPayload: (fields) => fields,
  },
  {
    id: "faq",
    title: "FAQ items",
    description: "FAQ page title, lead and Q&A items (JSON array).",
    key: "faq",
    pick: (section, overlay) => {
      const f = (section ?? {}) as SiteCopy["faq"];
      const o = asRecord(overlay);
      return mergeOverlay(
        {
          title: f.title ?? "",
          lead: f.lead ?? "",
          items: f.items ?? [],
        },
        o,
      );
    },
    toPayload: (fields) => ({
      title: fields.title,
      lead: fields.lead,
      items: JSON.parse(fields.items || "[]"),
    }),
  },
  {
    id: "about",
    title: "About",
    description: "About hero, who-we-are, trust cards and process steps.",
    key: "about",
    pick: (section, overlay) => {
      const a = (section ?? {}) as SiteCopy["about"];
      const o = asRecord(overlay);
      return mergeOverlay(
        {
          eyebrow: a.eyebrow ?? "",
          title: a.title ?? "",
          titleAccent: a.titleAccent ?? "",
          lead: a.lead ?? "",
          cta: a.cta ?? "",
          whoEyebrow: a.whoEyebrow ?? "",
          whoTitle: a.whoTitle ?? "",
          whoLead: a.whoLead ?? "",
          stats: a.stats ?? [],
          principlesTitle: a.principlesTitle ?? "",
          principlesLead: a.principlesLead ?? "",
          principles: a.principles ?? [],
          stepsEyebrow: a.stepsEyebrow ?? "",
          stepsTitle: a.stepsTitle ?? "",
          steps: a.steps ?? [],
        },
        o,
      );
    },
    toPayload: (fields) => ({
      eyebrow: fields.eyebrow,
      title: fields.title,
      titleAccent: fields.titleAccent,
      lead: fields.lead,
      cta: fields.cta,
      whoEyebrow: fields.whoEyebrow,
      whoTitle: fields.whoTitle,
      whoLead: fields.whoLead,
      stats: JSON.parse(fields.stats || "[]"),
      principlesTitle: fields.principlesTitle,
      principlesLead: fields.principlesLead,
      principles: JSON.parse(fields.principles || "[]"),
      stepsEyebrow: fields.stepsEyebrow,
      stepsTitle: fields.stepsTitle,
      steps: JSON.parse(fields.steps || "[]"),
    }),
  },
  {
    id: "gifts",
    title: "Gifts",
    description: "Gifts page title, lead and items.",
    key: "gifts",
    pick: (section, overlay) => {
      const g = (section ?? {}) as SiteCopy["gifts"];
      const o = asRecord(overlay);
      return mergeOverlay(
        {
          title: g.title ?? "",
          lead: g.lead ?? "",
          items: g.items ?? [],
        },
        o,
      );
    },
    toPayload: (fields) => ({
      title: fields.title,
      lead: fields.lead,
      items: JSON.parse(fields.items || "[]"),
    }),
  },
  {
    id: "nav",
    title: "Nav labels",
    description: "Primary site navigation ({label, href} JSON array).",
    key: "nav",
    pick: (section, overlay) => {
      const items = Array.isArray(overlay)
        ? overlay
        : Array.isArray(section)
          ? section
          : [];
      return { items };
    },
    toPayload: (fields) => JSON.parse(fields.items || "[]"),
  },
  {
    id: "footer",
    title: "Footer",
    description: "Footer blurb, section titles and legal nav.",
    key: "footer",
    pick: (section, overlay) => {
      const f = (section ?? {}) as SiteCopy["footer"];
      const o = asRecord(overlay);
      return mergeOverlay(
        {
          blurb: f.blurb ?? "",
          navigation: f.navigation ?? "",
          support: f.support ?? "",
          legal: f.legal ?? "",
          rights: f.rights ?? "",
          nav: f.nav ?? [],
        },
        o,
      );
    },
    toPayload: (fields) => ({
      blurb: fields.blurb,
      navigation: fields.navigation,
      support: fields.support,
      legal: fields.legal,
      rights: fields.rights,
      nav: JSON.parse(fields.nav || "[]"),
    }),
  },
  {
    id: "meta",
    title: "Meta SEO",
    description: "Page titles and descriptions for SEO.",
    key: "meta",
    pick: (section, overlay) =>
      mergeOverlay(asRecord(section), asRecord(overlay)),
    toPayload: (fields) => fields,
  },
  {
    id: "brand",
    title: "Brand",
    description: "Brand descriptor under the logo.",
    key: "brand",
    pick: (section, overlay) => {
      const b = (section ?? {}) as SiteCopy["brand"];
      return mergeOverlay(
        { descriptor: b.descriptor ?? "" },
        asRecord(overlay),
      );
    },
    toPayload: (fields) => fields,
  },
];

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function isComplex(value: unknown): boolean {
  return (
    typeof value !== "string" &&
    typeof value !== "number" &&
    typeof value !== "boolean"
  );
}

function localeOverlay(row: CopyRow | undefined, locale: LocaleTab): unknown {
  return row?.payload?.[locale];
}

export function ContentAdminClient({
  rows,
  seedByLocale,
  canWrite,
  cmsReady,
}: {
  rows: CopyRow[];
  seedByLocale: Record<LocaleTab, SiteCopy>;
  canWrite: boolean;
  cmsReady: boolean;
}) {
  const t = useDashT();
  const router = useRouter();
  const [sectionId, setSectionId] = useState(SECTIONS[0].id);
  const [locale, setLocale] = useState<LocaleTab>("uz");
  const [draft, setDraft] = useState<Record<string, string> | null>(null);

  const section = SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0];
  const row = rows.find((r) => r.key === section.key);

  const editorValues = useMemo(() => {
    const seedSection = seedByLocale[locale][section.key];
    const picked = section.pick(seedSection, localeOverlay(row, locale));
    if (Array.isArray(picked)) return { items: picked };
    return picked;
  }, [seedByLocale, locale, row, section]);

  const fields =
    draft ??
    Object.fromEntries(
      Object.entries(editorValues).map(([k, v]) => [k, stringifyValue(v)]),
    );

  const syncDraft = (nextSectionId: string, nextLocale: LocaleTab) => {
    const next = SECTIONS.find((s) => s.id === nextSectionId) ?? SECTIONS[0];
    const seedSection = seedByLocale[nextLocale][next.key];
    const nextRow = rows.find((r) => r.key === next.key);
    const picked = next.pick(seedSection, localeOverlay(nextRow, nextLocale));
    const values = Array.isArray(picked) ? { items: picked } : picked;
    setDraft(
      Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, stringifyValue(v)]),
      ),
    );
  };

  return (
    <DashCrudPage
      title="Site copy"
      lead={
        cmsReady
          ? "Edit public copy overlays in sw_site_copy (merged over seed per locale)."
          : "Connect Supabase to edit site copy."
      }
    >
      {!cmsReady ? (
        <p className={`${dashCardPad} text-sm text-black/55`}>
          Supabase admin env is required to save content.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSectionId(s.id);
              syncDraft(s.id, locale);
            }}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold",
              sectionId === s.id
                ? "bg-primary text-white"
                : "border border-black/10 bg-white text-black/55",
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(["uz", "ru", "en"] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => {
              setLocale(loc);
              syncDraft(sectionId, loc);
            }}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold",
              locale === loc
                ? "bg-primary text-white"
                : "border border-black/10 bg-white text-black/55",
            )}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      <p className="m-0 text-sm text-black/55">{section.description}</p>
      <p className="m-0 text-xs text-black/40">
        CMS key: <code>{section.key}</code>
        {row ? " · overlay present" : " · using seed until saved"}
      </p>

      <form
        className="grid gap-3"
        action={async () => {
          try {
            const fd = new FormData();
            fd.set("key", section.key);
            fd.set("label", section.title);
            fd.set("locale", locale);
            fd.set("payload_json", JSON.stringify(section.toPayload(fields)));
            await saveSiteCopySectionAction(fd);
            toast.success(t.form.successDefault);
            setDraft(null);
            router.refresh();
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : t.errors.saveFailed,
            );
          }
        }}
      >
        {Object.keys(editorValues).map((fieldKey) => {
          const complex = isComplex(editorValues[fieldKey]);
          return (
            <label key={fieldKey} className="grid gap-1.5">
              <span className={dashLabel}>{fieldKey}</span>
              {complex ? (
                <textarea
                  rows={8}
                  className={cn(dashInput, "font-mono text-xs")}
                  value={fields[fieldKey] ?? ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...(prev ?? fields),
                      [fieldKey]: e.target.value,
                    }))
                  }
                />
              ) : (
                <input
                  className={dashInput}
                  value={fields[fieldKey] ?? ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...(prev ?? fields),
                      [fieldKey]: e.target.value,
                    }))
                  }
                />
              )}
            </label>
          );
        })}

        {canWrite && cmsReady ? (
          <button type="submit" className={`${dashBtnPrimary} w-fit`}>
            {t.common.save} ({locale.toUpperCase()})
          </button>
        ) : null}
      </form>
    </DashCrudPage>
  );
}
