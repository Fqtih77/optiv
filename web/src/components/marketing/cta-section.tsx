"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlobField } from "@/components/visual/blob-field";
import { useT } from "@/lib/i18n/use-translation";
import { Reveal, RevealWords } from "./reveal";

export function CtaSection() {
  const { t, lang } = useT();

  return (
    <section id="contact" className="relative pb-24 lg:pb-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal>
          <div className="surface relative overflow-hidden rounded-[40px] px-8 py-20 text-center sm:px-16">
            <BlobField variant="quiet" className="opacity-80" />
            <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
            <div className="relative">
              <p className="eyebrow">{lang === "tr" ? "Başlayalım" : "Get started"}</p>
              <h2 className="display mx-auto mt-5 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] text-foreground">
                <RevealWords text={lang === "tr" ? "İşletmenizi" : "Bring your"} />{" "}
                <RevealWords
                  text={lang === "tr" ? "dijitale taşıyın" : "business online"}
                  accentFrom={0}
                  delay={0.1}
                />
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[14.5px] leading-[1.75] text-muted-foreground">
                {t("cta.subtitle")}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-[14px] font-medium text-primary-foreground transition-all duration-300 hover:gap-3"
                >
                  {t("cta.button")}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="mailto:info@optiv.com"
                  className="inline-flex h-12 items-center rounded-full border border-border bg-card/60 px-6 text-[14px] text-foreground backdrop-blur transition-colors hover:bg-card"
                >
                  info@optiv.com
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
