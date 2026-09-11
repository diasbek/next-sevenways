"use client";

import { useActionState } from "react";
import { bootstrapOwnerAction } from "./actions";

export default function SetupFormClient() {
  const [state, formAction, pending] = useActionState(
    bootstrapOwnerAction,
    null,
  );

  return (
    <form
      action={formAction}
      className="w-full max-w-sm space-y-4 rounded-2xl border border-black/8 bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold">Bootstrap owner</h1>
      <p className="text-sm text-ink-muted">
        Creates the first CMS owner. Requires CMS_BOOTSTRAP_SECRET.
      </p>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Bootstrap secret</span>
        <input
          name="secret"
          type="password"
          required
          className="w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Display name</span>
        <input
          name="displayName"
          className="w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-black/10 px-3 py-2.5"
        />
      </label>
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "…" : "Create owner"}
      </button>
    </form>
  );
}
