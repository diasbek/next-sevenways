export type MoneyCurrency = "UZS" | "USD";

export type PaymentProviderId = "click" | "payme" | "uzum";

export type PaymentStatus =
  | "pending"
  | "waiting"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type BookingMode = "lead_only" | "checkout";

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  currency: MoneyCurrency;
  description: string;
  returnUrl: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  meta?: Record<string, unknown>;
};

export type CreatePaymentResult = {
  redirectUrl: string;
  externalId?: string;
};

export type PaymentEvent = {
  orderId: string;
  externalId?: string;
  status: PaymentStatus;
  amount?: number;
  currency?: MoneyCurrency;
  raw?: unknown;
};

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  /** Currencies this adapter can charge in the current contract/config. */
  supportedCurrencies: readonly MoneyCurrency[];
  isConfigured: () => boolean | Promise<boolean>;
  createPayment: (input: CreatePaymentInput) => Promise<CreatePaymentResult>;
  getStatus?: (externalId: string) => Promise<PaymentStatus>;
};

export type PaymentBrandId =
  | "click"
  | "payme"
  | "uzum"
  | "humo"
  | "uzcard"
  | "visa"
  | "mastercard";

export type PaymentBrand = {
  id: PaymentBrandId;
  name: string;
  logoSrc: string;
  /** Display-only network logos have no checkout adapter. */
  kind: "psp" | "network";
};
