"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard/";
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-muted px-4">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-black/8 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-ink">Seven Ways CMS</h1>
        <p className="text-sm text-ink-muted">Sign in with your admin account.</p>
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-black/10 px-3 py-2.5"
          />
        </label>
        {state?.error ? (
          <p className="text-sm text-danger">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? "…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-ink-muted">
          First time?{" "}
          <a href="/dashboard/setup/" className="text-primary hover:underline">
            Setup owner
          </a>
        </p>
      </form>
    </div>
  );
}
