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

export function RequestTourForm({
  locale,
  initialDestination = "",
  initialHotel = "",
}: {
  locale: Locale;
  initialDestination?: string;
  initialHotel?: string;
}) {
  const content = getContent(locale);
  const requestId = useId().replace(/:/g, "");
  const [done, setDone] = useState(false);

  const schema = useMemo(
    () =>
      Yup.object({
        name: Yup.string().trim().required(),
        phone: phoneRequired(),
        destination: Yup.string().trim(),
        dates: Yup.string().trim(),
        comment: Yup.string().trim(),
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
        website: "",
      }}
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        const data = withNormalizedPhone(values);
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
              <span className="mt-1 block text-xs text-danger">{content.ui.required}</span>
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
              <span className="mt-1 block text-xs text-danger">{content.ui.required}</span>
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
              <option value="">{content.ui.allDestinations}</option>
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
          <p className="text-xs text-ink-muted">{content.ui.priceDisclaimer}</p>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {content.ui.send}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
