"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  nextPath: string;
};

export function ComingSoonGate({ nextPath }: Props) {
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
          setError("Notoʻgʻri kod. Wrong code.");
          return;
        }
        router.replace(nextPath || "/");
        router.refresh();
      } catch {
        setError("Xatolik. Try again.");
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-10 flex w-full max-w-xs flex-col gap-3"
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
        placeholder="····"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="h-12 rounded-xl border border-white/25 bg-white/10 px-4 text-center text-lg tracking-[0.35em] text-white placeholder:text-white/35 outline-none backdrop-blur-sm focus:border-white/50"
      />
      <button
        type="submit"
        disabled={pending || code.trim().length < 4}
        className="h-12 rounded-xl bg-white font-semibold text-royal transition enabled:hover:bg-white/90 disabled:opacity-50"
      >
        {pending ? "…" : "Kirish · Enter"}
      </button>
      {error ? (
        <p className="text-center text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
