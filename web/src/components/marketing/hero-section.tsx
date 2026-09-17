"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { BlobField } from "@/components/visual/blob-field";
import { useT } from "@/lib/i18n/use-translation";
import { useLandingStore } from "@/lib/store/landing";
import { RevealWords } from "./reveal";

const GlassesScene = dynamic(() => import("./glasses-scene").then((m) => m.GlassesScene), {
  ssr: false,
});

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useT();
  const copy = useLandingStore((s) => s[lang]);
  const bannerDataUrl = useLandingStore((s) => s.bannerDataUrl);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const marks = [
    { k: "CR-39", v: lang === "tr" ? "Cam tipi" : "Lens type" },
    { k: "2 mm", v: lang === "tr" ? "Kalınlık" : "Thickness" },
    { k: "Fashion · Klasik", v: lang === "tr" ? "Seriler" : "Series" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <BlobField variant="hero" />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />
      {bannerDataUrl && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `url(${bannerDataUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/70 to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-24 lg:grid-cols-[1.06fr_1fr] lg:px-10">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
          >
            <span className="dot-accent h-1.5 w-1.5 rounded-full" />
            {copy.badge}
          </motion.span>

          <h1 className="display mt-8 text-[clamp(2.9rem,6.4vw,5.2rem)] text-foreground">
            <RevealWords text={copy.title1} />
            <br />
            <RevealWords text={copy.title2} accentFrom={0} delay={0.12} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-lg text-[15px] leading-[1.75] text-muted-foreground"
          >
            {copy.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/login"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-[14px] font-medium text-primary-foreground transition-all duration-300 hover:gap-3"
            >
              {t("hero.ctaPrimary")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#collection"
              className="inline-flex h-12 items-center rounded-full border border-border bg-card/60 px-6 text-[14px] text-foreground backdrop-blur transition-colors hover:bg-card"
            >
              {lang === "tr" ? "Koleksiyonu gör" : "View collection"}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border pt-7"
          >
            {marks.map((m) => (
              <div key={m.k}>
                <p className="display text-[17px] text-foreground">{m.k}</p>
                <p className="eyebrow mt-1">{m.v}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ scale: sceneScale }}
          className="relative mx-auto aspect-square w-full max-w-[620px]"
        >
          <div
            aria-hidden
            className="absolute inset-[12%] rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--blob-2), transparent 70%)" }}
          />
          <GlassesScene progress={scrollYProgress} />
        </motion.div>
      </div>

      <motion.a
        href="#collection"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9.5px] font-medium uppercase tracking-[0.24em]">{t("hero.scroll")}</span>
        <ArrowDown className="h-3.5 w-3.5" />
      </motion.a>
    </section>
  );
}
