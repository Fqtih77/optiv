"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LensSwatch } from "@/components/shared/lens-swatch";
import { Chip } from "@/components/shared/surface";
import { seedProducts } from "@/lib/mock/seed";
import { useT } from "@/lib/i18n/use-translation";
import { formatTRY } from "@/lib/format";
import { Reveal, RevealWords } from "./reveal";

type Filter = "ALL" | "FASHION" | "KLASIK";

export function ProductShowcase() {
  const { t, lang } = useT();
  const [filter, setFilter] = useState<Filter>("ALL");

  const products = seedProducts.filter((p) => filter === "ALL" || p.type === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: "ALL", label: lang === "tr" ? "Tümü" : "All" },
    { key: "FASHION", label: "Fashion" },
    { key: "KLASIK", label: lang === "tr" ? "Klasik" : "Classic" },
  ];

  return (
    <section id="collection" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Reveal>
              <p className="eyebrow">{t("nav.products")}</p>
            </Reveal>
            <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)] text-foreground">
              <RevealWords text={lang === "tr" ? "Koleksiyonun" : "Every shade"} />{" "}
              <RevealWords
                text={lang === "tr" ? "her tonu" : "of the line"}
                accentFrom={0}
                delay={0.1}
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-5 text-[14.5px] leading-[1.75] text-muted-foreground">
                {t("showcase.subtitle")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative rounded-full px-4 py-2 text-[12.5px] transition-colors ${
                    filter === f.key
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter === f.key && (
                    <motion.span
                      layoutId="showcase-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <motion.article
              layout
              key={p.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="surface group relative overflow-hidden rounded-3xl p-3.5 transition-transform duration-500 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <LensSwatch
                  colorFrom={p.colorFrom}
                  colorTo={p.colorTo}
                  className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <Chip tone="neutral" className="backdrop-blur">
                    {p.code}
                  </Chip>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              <div className="px-1.5 pb-1 pt-4">
                <p className="display text-[16px] leading-tight text-foreground">{p.name}</p>
                <p className="eyebrow mt-1.5">
                  {p.type} · {p.thicknessMm}mm
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="nums text-[13.5px] font-medium text-accent-fg">
                    {formatTRY(p.unitPrice)}
                  </span>
                  <span className="nums text-[11px] text-muted-foreground">
                    {p.remaining > 0
                      ? `${p.remaining} ${lang === "tr" ? "ad" : "pcs"}`
                      : lang === "tr"
                        ? "tükendi"
                        : "sold out"}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
