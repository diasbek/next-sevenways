"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getHash(): string {
  return window.location.hash.replace(/^#/, "");
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function scrollToHash(behavior: ScrollBehavior = "smooth"): boolean {
  const hash = getHash();
  if (!hash) return false;
  const el = document.getElementById(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: "start" });
  return true;
}

function scrollToHashWithRetry(behavior: ScrollBehavior = "auto") {
  let attempts = 0;
  const tryScroll = () => {
    if (scrollToHash(behavior)) return;
    attempts += 1;
    if (attempts < 16) window.setTimeout(tryScroll, 40);
  };
  window.requestAnimationFrame(tryScroll);
}

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (getHash()) scrollToHashWithRetry("auto");
    else scrollToTop();

    const onHashChange = () => {
      if (getHash()) scrollToHash("smooth");
      else scrollToTop();
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
