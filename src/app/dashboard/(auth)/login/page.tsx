import { Suspense } from "react";
import LoginForm from "./login-form";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center text-sm text-ink-muted">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
