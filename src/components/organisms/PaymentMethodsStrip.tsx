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
}: {
  locale: Locale;
  className?: string;
  inverted?: boolean;
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
      <p
        className={
          inverted
            ? "mt-1 text-xs text-white/60"
            : "mt-1 text-xs text-ink-muted"
        }
      >
        {copy.note}
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-3">
        {PAYMENT_BRANDS.map((brand) => (
          <li
            key={brand.id}
            className="flex h-10 items-center rounded-lg border border-black/8 bg-white px-3"
            title={brand.name}
          >
            <Image
              src={brand.logoSrc}
              alt={brand.name}
              width={72}
              height={28}
              className="h-7 w-auto object-contain"
              unoptimized
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
