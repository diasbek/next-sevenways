import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getBootstrapStatus } from "./actions";
import SetupFormClient from "./setup-form";

export default async function DashboardSetupPage() {
  const status = await getBootstrapStatus();
  if (!status.ok) {
    redirect(`/dashboard/login/?error=${status.reason}`);
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-surface-muted px-4 py-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <SetupFormClient />
        </Suspense>
        <p className="mt-4 text-center text-sm text-ink-muted">
          <Link href="/dashboard/login/" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
