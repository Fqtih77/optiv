"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLangStore, initLangFromStorage } from "@/lib/i18n/store";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLangStore();

  useEffect(() => {
    initLangFromStorage();
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5 text-[10.5px] font-medium",
        className
      )}
    >
      {(["tr", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "relative rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors",
            lang === l ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10">{l}</span>
        </button>
      ))}
    </div>
  );
}
