import type { PaymentBrand } from "./types";

/** Trust / license logos — networks accepted via PSP acquiring. */
export const PAYMENT_BRANDS: PaymentBrand[] = [
  {
    id: "click",
    name: "Click",
    logoSrc: "/images/payments/click.png",
    kind: "psp",
  },
  {
    id: "payme",
    name: "Payme",
    logoSrc: "/images/payments/payme.png",
    kind: "psp",
  },
  {
    id: "uzum",
    name: "Uzum Bank",
    logoSrc: "/images/payments/uzum.png",
    kind: "psp",
  },
  {
    id: "humo",
    name: "Humo",
    logoSrc: "/images/payments/humo.png",
    kind: "network",
  },
  {
    id: "uzcard",
    name: "Uzcard",
    logoSrc: "/images/payments/uzcard.png",
    kind: "network",
  },
  {
    id: "visa",
    name: "Visa",
    logoSrc: "/images/payments/visa.png",
    kind: "network",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    logoSrc: "/images/payments/mastercard.png",
    kind: "network",
  },
];
