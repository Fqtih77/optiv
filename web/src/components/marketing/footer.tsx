"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useT } from "@/lib/i18n/use-translation";

export function Footer() {
  const { t, lang } = useT();

  return (
    <footer className="relative border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[13.5px] leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <p className="mt-6 text-[12px] text-muted-foreground">
              Bursa · Türkiye · <span className="text-foreground">info@optiv.com</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div>
              <p className="eyebrow">{t("footer.product")}</p>
              <ul className="mt-4 space-y-3 text-[13px] text-muted-foreground">
                <li>
                  <a href="#collection" className="transition-colors hover:text-foreground">
                    {t("nav.products")}
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="transition-colors hover:text-foreground">
                    {t("nav.features")}
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-foreground">
                    {t("nav.howItWorks")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">{t("footer.company")}</p>
              <ul className="mt-4 space-y-3 text-[13px] text-muted-foreground">
                <li>
                  <Link href="/login" className="transition-colors hover:text-foreground">
                    {t("nav.login")}
                  </Link>
                </li>
                <li>
                  <a href="#contact" className="transition-colors hover:text-foreground">
                    {t("nav.contact")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">{lang === "tr" ? "Seriler" : "Series"}</p>
              <ul className="mt-4 space-y-3 text-[13px] text-muted-foreground">
                <li>CR-39 Fashion</li>
                <li>CR-39 {lang === "tr" ? "Klasik" : "Classic"}</li>
                <li>2 mm {lang === "tr" ? "güneş camı" : "sun lenses"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 overflow-hidden border-t border-border pt-8">
          <p className="display select-none text-[clamp(3rem,11vw,9rem)] leading-none text-foreground/[0.06]">
            optiv
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            © {new Date().getFullYear()} Optiv — {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
