"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/types";
import { cn } from "@/lib/cn";

export function FaqList({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("divide-y divide-black/8", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.question}
            className={cn(
              "rounded-2xl transition-colors duration-200",
              isOpen && "bg-sky-tint/70",
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="text-[0.95rem] font-bold leading-snug text-midnight sm:text-base">
                {item.question}
              </span>
              <span
                className="grid size-8 shrink-0 place-items-center text-xl font-medium leading-none text-royal"
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-5 text-sm leading-relaxed text-ink-muted sm:px-5">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
