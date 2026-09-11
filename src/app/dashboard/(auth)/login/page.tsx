"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLoginForm } from "@/components/dashboard/DashboardLoginForm";
import { dashShell } from "@/styles/dashboard";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard/";
  const error = params.get("error") || "";

  return (
    <div className={`${dashShell} grid place-items-center px-4 py-10`}>
      <div className="w-full max-w-sm">
        <DashboardLoginForm
          nextPath={next}
          initialError={
            error === "already_bootstrapped"
              ? "Owner already created — sign in."
              : error === "setup-locked"
                ? "Setup locked."
                : ""
          }
        />
        <p className="mt-4 text-center text-xs text-black/45">
          First time?{" "}
          <Link href="/dashboard/setup/" className="text-primary hover:underline">
            Setup owner
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center text-sm text-black/45">
          …
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
