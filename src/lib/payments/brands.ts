import type { PaymentBrand } from "./types";

/** Trust / license logos — networks accepted via PSP acquiring. */
export const PAYMENT_BRANDS: PaymentBrand[] = [
  {
    id: "click",
    name: "Click",
    logoSrc: "/images/payments/click.svg",
    kind: "psp",
  },
  {
    id: "payme",
    name: "Payme",
    logoSrc: "/images/payments/payme.svg",
    kind: "psp",
  },
  {
    id: "uzum",
    name: "Uzum Bank",
    logoSrc: "/images/payments/uzum.svg",
    kind: "psp",
  },
  {
    id: "humo",
    name: "Humo",
    logoSrc: "/images/payments/humo.svg",
    kind: "network",
  },
  {
    id: "uzcard",
    name: "Uzcard",
    logoSrc: "/images/payments/uzcard.svg",
    kind: "network",
  },
  {
    id: "visa",
    name: "Visa",
    logoSrc: "/images/payments/visa.svg",
    kind: "network",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    logoSrc: "/images/payments/mastercard.svg",
    kind: "network",
  },
];
