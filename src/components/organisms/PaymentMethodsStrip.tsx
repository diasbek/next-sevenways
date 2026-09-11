import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { PAYMENT_BRANDS } from "@/lib/payments/brands";

const LABELS: Record<Locale, { title: string; note: string }> = {
  uz: {
    title: "Qabul qilinadigan toʻlovlar",
    note: "Click, Payme, Uzum orqali Humo, Uzcard, Visa, Mastercard.",
  },
  ru: {
    title: "Принимаем к оплате",
    note: "Через Click, Payme, Uzum — Humo, Uzcard, Visa, Mastercard.",
  },
  en: {
    title: "Accepted payments",
    note: "Via Click, Payme, Uzum — Humo, Uzcard, Visa, Mastercard.",
  },
};

export function PaymentMethodsStrip({
  locale,
  className = "",
  inverted = false,
  showNote = true,
}: {
  locale: Locale;
  className?: string;
  inverted?: boolean;
  /** Hide helper note under the title (footer mock). */
  showNote?: boolean;
}) {
  const copy = LABELS[locale] ?? LABELS.uz;
  return (
    <div className={className}>
      <p
        className={
          inverted
            ? "text-sm font-semibold text-white"
            : "text-sm font-semibold text-ink"
        }
      >
        {copy.title}
      </p>
      {showNote ? (
        <p
          className={
            inverted
              ? "mt-1 text-xs text-white/60"
              : "mt-1 text-xs text-ink-muted"
          }
        >
          {copy.note}
        </p>
      ) : null}
      <ul className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
        {PAYMENT_BRANDS.map((brand) => (
          <li key={brand.id} title={brand.name}>
            <Image
              src={brand.logoSrc}
              alt={brand.name}
              width={105}
              height={41}
              className="h-9 w-auto rounded-lg shadow-[0_4px_14px_rgb(0_0_0/0.18)] sm:h-10"
              unoptimized
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
