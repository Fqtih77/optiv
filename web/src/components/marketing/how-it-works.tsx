"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, CheckCircle2, Landmark } from "lucide-react";
import { useT } from "@/lib/i18n/use-translation";
import { Reveal, RevealWords } from "./reveal";

const steps = [
  { icon: ShoppingCart, titleKey: "how.step1.title", descKey: "how.step1.desc" },
  { icon: CheckCircle2, titleKey: "how.step2.title", descKey: "how.step2.desc" },
  { icon: Landmark, titleKey: "how.step3.title", descKey: "how.step3.desc" },
];

export function HowItWorks() {
  const { t, lang } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow">{t("nav.howItWorks")}</p>
          </Reveal>
          <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)] text-foreground">
            <RevealWords text={lang === "tr" ? "Üç adımda" : "Three steps,"} />{" "}
            <RevealWords
              text={lang === "tr" ? "sipariş ve tahsilat" : "order to payment"}
              accentFrom={0}
              delay={0.1}
            />
          </h2>
        </div>

        <div ref={ref} className="relative mt-16">
          <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-px bg-border md:hidden" />
          <motion.div
            aria-hidden
            style={{ scaleX: lineScale }}
            className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-gradient-to-r from-[color:var(--accent-fg)] via-border to-transparent md:block"
          />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.titleKey} delay={i * 0.12}>
                <div className="relative pl-14 md:pl-0">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-accent-fg md:relative md:mb-7">
                    <s.icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <p className="eyebrow mb-3 hidden md:block">
                    {lang === "tr" ? "Adım" : "Step"} {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display text-[20px] text-foreground">{t(s.titleKey)}</h3>
                  <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                    {t(s.descKey)}
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
