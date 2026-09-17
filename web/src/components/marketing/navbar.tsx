"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useT } from "@/lib/i18n/use-translation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#collection", label: t("nav.products") },
    { href: "#capabilities", label: t("nav.features") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 lg:px-8"
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 lg:px-6",
          scrolled ? "glass border border-border shadow-lift" : "border border-transparent"
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/login"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("nav.login")}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground" />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[290px]">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-4 flex flex-col gap-8">
                <Logo />
                <nav className="flex flex-col gap-1">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="display rounded-2xl px-3 py-3 text-[22px] text-foreground transition-colors hover:bg-muted"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <div className="flex flex-col gap-3">
                  <LanguageSwitcher className="self-start" />
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground"
                  >
                    {t("nav.login")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
