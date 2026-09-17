"use client";

import { useT } from "@/lib/i18n/use-translation";
import { CountUp } from "./count-up";
import { Reveal } from "./reveal";

const stats = [
  { key: "stats.stock", value: 1240, suffix: "+" },
  { key: "stats.dealers", value: 180, suffix: "+" },
  { key: "stats.orders", value: 3200, suffix: "+" },
  { key: "stats.uptime", value: 99.9, suffix: "%", decimals: 1 },
];

export function StatsSection() {
  const { t, lang } = useT();

  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="surface overflow-hidden rounded-[34px]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-8 py-6">
            <p className="eyebrow">{t("stats.title")}</p>
            <p className="text-[12.5px] text-muted-foreground">
              {lang === "tr" ? "2026 üçüncü çeyrek verileri" : "Q3 2026 figures"}
            </p>
          </div>
          <div className="grid grid-cols-2 divide-border lg:grid-cols-4 lg:divide-x">
            {stats.map((s, i) => (
              <Reveal key={s.key} delay={i * 0.08}>
                <div className="px-8 py-10">
                  <p className="display nums text-[clamp(2.2rem,3.6vw,3rem)] text-foreground">
                    <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="mt-3 max-w-[14ch] text-[12.5px] leading-snug text-muted-foreground">
                    {t(s.key)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
