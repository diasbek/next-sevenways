"use client";

import Link from "next/link";
import { ErrorMessage, Field } from "formik";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/paths";
import { checkRow, fieldError } from "@/styles/ui";

const labels: Record<Locale, { prefix: string; privacy: string; and: string; terms: string }> = {
  uz: {
    prefix: "Men ",
    privacy: "maxfiylik siyosati",
    and: " va ",
    terms: "foydalanish shartlari",
  },
  ru: {
    prefix: "Я согласен с ",
    privacy: "политикой конфиденциальности",
    and: " и ",
    terms: "условиями использования",
  },
  en: {
    prefix: "I agree to the ",
    privacy: "privacy policy",
    and: " and ",
    terms: "terms of use",
  },
};

export function ConsentLabel({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return (
    <span className="text-sm leading-snug text-black/70">
      {t.prefix}
      <Link
        href={localePath(locale, "/privacy/")}
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        {t.privacy}
      </Link>
      {t.and}
      <Link
        href={localePath(locale, "/terms/")}
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        {t.terms}
      </Link>
    </span>
  );
}

export function ConsentField({ locale }: { locale: Locale }) {
  return (
    <>
      <label className={checkRow}>
        <Field
          type="checkbox"
          name="consent"
          className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 accent-[var(--color-primary)]"
        />
        <ConsentLabel locale={locale} />
      </label>
      <ErrorMessage name="consent" component="div" className={fieldError} />
    </>
  );
}
