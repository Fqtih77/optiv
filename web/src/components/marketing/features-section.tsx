"use client";

import { motion } from "framer-motion";
import { Boxes, ClipboardCheck, Landmark, ShieldCheck } from "lucide-react";
import { LensOrb } from "@/components/visual/lens-orb";
import { useT } from "@/lib/i18n/use-translation";
import { Reveal, RevealWords } from "./reveal";

const features = [
  { icon: Boxes, titleKey: "features.stock.title", descKey: "features.stock.desc" },
  { icon: ClipboardCheck, titleKey: "features.orders.title", descKey: "features.orders.desc" },
  { icon: Landmark, titleKey: "features.finance.title", descKey: "features.finance.desc" },
  { icon: ShieldCheck, titleKey: "features.security.title", descKey: "features.security.desc" },
];

export function FeaturesSection() {
  const { t, lang } = useT();

  return (
    <section id="capabilities" className="relative overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal>
              <p className="eyebrow">{t("nav.features")}</p>
            </Reveal>
            <h2 className="display mt-4 max-w-xl text-[clamp(2rem,3.8vw,3.2rem)] text-foreground">
              <RevealWords text={lang === "tr" ? "Tek panelde" : "One panel"} />{" "}
              <RevealWords
                text={lang === "tr" ? "tüm ticaret akışı" : "for the whole flow"}
                accentFrom={0}
                delay={0.1}
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-[14.5px] leading-[1.75] text-muted-foreground">
                {t("features.subtitle")}
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
              {features.map((f, i) => (
                <Reveal key={f.titleKey} delay={0.1 + i * 0.08}>
                  <div className="group">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-accent-fg transition-all duration-500 group-hover:border-accent-soft group-hover:bg-accent-soft">
                      <f.icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <h3 className="display mt-5 text-[18px] text-foreground">{t(f.titleKey)}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      {t(f.descKey)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} className="relative">
            <div className="surface relative overflow-hidden rounded-[34px] p-8">
              <div aria-hidden className="absolute inset-0 bg-dots opacity-60" />
              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <LensOrb size={230} />
                </motion.div>
                <p className="display mt-8 text-[22px] text-foreground">
                  {lang === "tr" ? "Optik netlik, dijital hız" : "Optical clarity, digital speed"}
                </p>
                <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                  {lang === "tr"
                    ? "Stok, sipariş ve cari hesap tek akışta; her hareket saniyeler içinde panele yansır."
                    : "Stock, orders and ledgers in one flow — every movement lands in the panel within seconds."}
                </p>

                <div className="mt-8 grid w-full grid-cols-3 gap-3 border-t border-border pt-6">
                  {[
                    { k: "< 1s", v: lang === "tr" ? "Stok güncelleme" : "Stock sync" },
                    { k: "100%", v: lang === "tr" ? "Hareket kaydı" : "Audit trail" },
                    { k: "0 ₺", v: lang === "tr" ? "Boş ay yok" : "No gap months" },
                  ].map((s) => (
                    <div key={s.k}>
                      <p className="display nums text-[17px] text-foreground">{s.k}</p>
                      <p className="eyebrow mt-1 leading-tight">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
