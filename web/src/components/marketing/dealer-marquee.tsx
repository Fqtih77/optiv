"use client";

import { useT } from "@/lib/i18n/use-translation";
import { seedCustomers } from "@/lib/mock/seed";

export function DealerMarquee() {
  const { lang } = useT();
  const names = seedCustomers.map((c) => c.name);
  const row = [...names, ...names];

  return (
    <section className="relative border-y border-border py-8">
      <div className="mx-auto mb-6 max-w-7xl px-6 lg:px-10">
        <p className="eyebrow text-center">
          {lang === "tr" ? "Optiv ile çalışan bayiler" : "Dealers working with Optiv"}
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-background to-transparent"
        />
        <div className="animate-marquee flex w-max items-center gap-12 pr-12">
          {row.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="display whitespace-nowrap text-[22px] text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
