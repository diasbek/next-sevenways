"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

type Props = {
  nextPath: string;
  enterLabel: string;
  errorLabel: string;
  placeholder?: string;
};

export function ComingSoonGate({
  nextPath,
  enterLabel,
  errorLabel,
  placeholder = "····",
}: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/site-gate/unlock/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim() }),
        });
        if (!res.ok) {
          setError(errorLabel);
          return;
        }
        router.replace(nextPath || "/");
        router.refresh();
      } catch {
        setError(errorLabel);
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 flex w-full max-w-sm flex-col gap-3"
    >
      <label htmlFor="gate-code" className="sr-only">
        Access code
      </label>
      <input
        id="gate-code"
        name="code"
        type="password"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={8}
        placeholder={placeholder}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className={cn(
          "h-12 w-full rounded-2xl border border-white/25 bg-white/10 px-4 text-center text-lg tracking-[0.35em] text-white",
          "placeholder:tracking-[0.35em] placeholder:text-white/40 outline-none backdrop-blur-sm",
          "focus:border-sky focus:bg-white/15",
        )}
      />
      <button
        type="submit"
        disabled={pending || code.trim().length < 4}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-sky px-5 text-sm font-semibold text-white transition",
          "enabled:hover:bg-royal disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {pending ? "…" : enterLabel}
        {!pending ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/coming-soon/arrow-right.svg"
            alt=""
            className="size-4 brightness-0 invert"
          />
        ) : null}
      </button>
      {error ? (
        <p className="text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
