"use client";

import { useActionState } from "react";
import { bootstrapOwnerAction } from "./actions";
import {
  dashBtnPrimary,
  dashCardPad,
  dashInput,
  dashLabel,
  dashPageLead,
  dashPageTitle,
} from "@/styles/dashboard";

export default function SetupFormClient() {
  const [state, formAction, pending] = useActionState(
    bootstrapOwnerAction,
    null,
  );

  return (
    <form action={formAction} className={`${dashCardPad} w-full max-w-sm space-y-4`}>
      <div>
        <h1 className={dashPageTitle}>Bootstrap owner</h1>
        <p className={dashPageLead}>
          Creates the first CMS owner. Requires CMS_BOOTSTRAP_SECRET.
        </p>
      </div>
      <label className="grid gap-1.5">
        <span className={dashLabel}>Bootstrap secret</span>
        <input name="secret" type="password" required className={dashInput} />
      </label>
      <label className="grid gap-1.5">
        <span className={dashLabel}>Display name</span>
        <input name="displayName" className={dashInput} />
      </label>
      <label className="grid gap-1.5">
        <span className={dashLabel}>Email</span>
        <input name="email" type="email" required className={dashInput} />
      </label>
      <label className="grid gap-1.5">
        <span className={dashLabel}>Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className={dashInput}
        />
      </label>
      {state?.error ? (
        <p className="m-0 text-sm font-medium text-primary">{state.error}</p>
      ) : null}
      <button type="submit" disabled={pending} className={`${dashBtnPrimary} w-full`}>
        {pending ? "…" : "Create owner"}
      </button>
    </form>
  );
}
