import type { Metadata } from "next";
import { ComingSoonGate } from "@/components/coming-soon/ComingSoonGate";
import { SITE_CONFIG } from "@/utils/consts";

export const metadata: Metadata = {
  title: "Coming soon — Seven Ways",
  description: "Seven Ways website is under construction.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string }>;
};

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  if (raw.startsWith("/coming-soon")) return "/";
  return raw;
}

export default async function ComingSoonPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#062f31] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(13,115,119,0.55),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(8,70,74,0.7),transparent_50%),linear-gradient(160deg,#041c1e_0%,#0a4548_45%,#062f31_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-100/80">
          Seven Ways
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {SITE_CONFIG.name}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-teal-50/85 sm:text-lg">
          Sayt ishlab chiqilmoqda. Tez orada ochiladi.
          <br />
          <span className="text-teal-100/70">
            Website under construction. Opening soon.
          </span>
        </p>

        <ComingSoonGate nextPath={nextPath} />

        <p className="mt-12 text-sm text-teal-100/55">
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="underline-offset-4 hover:text-white hover:underline"
          >
            {SITE_CONFIG.phoneDisplay}
          </a>
          {SITE_CONFIG.email ? (
            <>
              {" · "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="underline-offset-4 hover:text-white hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
            </>
          ) : null}
        </p>
      </div>
    </main>
  );
}
