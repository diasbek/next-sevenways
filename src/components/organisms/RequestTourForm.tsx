"use client";

import { useId, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import type { Locale } from "@/i18n/config";
import { getContent } from "@/i18n/get-content";
import { DESTINATIONS } from "@/data/tours/catalog";
import { phoneRequired, withNormalizedPhone } from "@/lib/form/schemas";
import { submitLead } from "@/lib/form/submitLead";
import { Button } from "@/components/atoms/Button";
import { HoneypotField } from "@/components/atoms/form/HoneypotField";
import type {
  BookingMode,
  MoneyCurrency,
  PaymentProviderId,
} from "@/lib/payments/types";

export type CheckoutProviderOption = {
  id: PaymentProviderId;
  label: string;
  currencies: MoneyCurrency[];
};

export function RequestTourForm({
  locale,
  initialDestination = "",
  initialHotel = "",
  initialAmount,
  initialCurrency = "USD",
  initialOfferId = "",
  bookingMode = "lead_only",
  paymentsEnabled = false,
  providerOptions = [],
}: {
  locale: Locale;
  initialDestination?: string;
  initialHotel?: string;
  initialAmount?: number;
  initialCurrency?: MoneyCurrency;
  initialOfferId?: string;
  bookingMode?: BookingMode;
  paymentsEnabled?: boolean;
  providerOptions?: CheckoutProviderOption[];
}) {
  const content = getContent(locale);
  const requestId = useId().replace(/:/g, "");
  const [done, setDone] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const checkoutProviders = providerOptions.filter((p) =>
    p.currencies.includes(initialCurrency),
  );

  const checkoutOn =
    bookingMode === "checkout" &&
    paymentsEnabled &&
    Number.isFinite(initialAmount) &&
    (initialAmount ?? 0) > 0 &&
    checkoutProviders.length > 0;

  const schema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().trim().required(),
        phone: phoneRequired(),
        destination: Yup.string().trim(),
        dates: Yup.string().trim(),
        comment: Yup.string().trim(),
        provider: Yup.string().trim(),
        website: Yup.string(),
      }),
    [],
  );

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary-soft p-6 text-sm text-ink">
        {content.request.success}
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        name: "",
        phone: "",
        destination: initialDestination,
        dates: "",
        comment: initialHotel ? `Hotel: ${initialHotel}` : "",
        provider: checkoutProviders[0]?.id ?? "",
        website: "",
      }}
      enableReinitialize
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        setPayError(null);
        const data = withNormalizedPhone(values);

        if (checkoutOn && values.provider) {
          try {
            const res = await fetch("/api/payments/create/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: initialAmount,
                currency: initialCurrency,
                provider: values.provider,
                offerId: initialOfferId || undefined,
                description: [initialHotel, data.destination, "Seven Ways tour"]
                  .filter(Boolean)
                  .join(" · "),
                name: data.name,
                phone: data.phone,
              }),
            });
            const json = (await res.json()) as {
              ok?: boolean;
              redirectUrl?: string;
              error?: string;
            };
            if (!res.ok || !json.redirectUrl) {
              setPayError(
                json.error || "Payment unavailable — leave a request.",
              );
            } else {
              window.location.href = json.redirectUrl;
              return;
            }
          } catch {
            setPayError("Payment error — submitting as request.");
          }
        }

        const result = await submitLead({
          type: "tour",
          locale,
          requestId: `tour-${requestId}`,
          website: values.website,
          data: {
            name: data.name,
            phone: data.phone,
            destination: data.destination,
            dates: data.dates,
            comment: data.comment,
            hotel: initialHotel || undefined,
            amount: initialAmount,
            currency: initialCurrency,
            offerId: initialOfferId || undefined,
          },
          successTitle: content.request.title,
          successText: content.request.success,
          eventPrefix: "tour_request",
        });
        helpers.setSubmitting(false);
        if (result) {
          setDone(true);
          helpers.resetForm();
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          <HoneypotField label="website" />
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              {content.request.name}
            </span>
            <Field
              name="name"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            {touched.name && errors.name ? (
              <span className="mt-1 block text-xs text-danger">
                {content.ui.required}
              </span>
            ) : null}
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              {content.request.phone}
            </span>
            <Field
              name="phone"
              placeholder="+998"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            {touched.phone && errors.phone ? (
              <span className="mt-1 block text-xs text-danger">
                {content.ui.required}
              </span>
            ) : null}
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              {content.request.destination}
            </span>
            <Field
              as="select"
              name="destination"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">—</option>
              {DESTINATIONS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name[locale]}
                </option>
              ))}
            </Field>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              {content.request.dates}
            </span>
            <Field
              name="dates"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              {content.request.comment}
            </span>
            <Field
              as="textarea"
              name="comment"
              rows={3}
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          {checkoutOn ? (
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">
                Payment · {initialCurrency}
              </span>
              <Field
                as="select"
                name="provider"
                className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {checkoutProviders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Field>
            </label>
          ) : null}

          {payError ? (
            <p className="text-sm text-warning" role="alert">
              {payError}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? "…"
              : checkoutOn
                ? locale === "ru"
                  ? "Оплатить"
                  : locale === "en"
                    ? "Pay now"
                    : "Toʻlash"
                : content.ui.leaveRequest}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
