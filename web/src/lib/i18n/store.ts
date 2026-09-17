"use client";

import { create } from "zustand";
import type { Lang } from "./dictionary";

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const STORAGE_KEY = "optiv-lang";

export const useLangStore = create<LangState>((set, get) => ({
  lang: "tr",
  setLang: (lang) => {
    set({ lang });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  },
  toggleLang: () => {
    const next = get().lang === "tr" ? "en" : "tr";
    get().setLang(next);
  },
}));

export function initLangFromStorage() {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === "tr" || saved === "en") {
    useLangStore.setState({ lang: saved });
  }
}
