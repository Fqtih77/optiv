"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { tr, en } from "../i18n/dictionary";

export interface LandingCopy {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
}

interface LandingState {
  tr: LandingCopy;
  en: LandingCopy;
  bannerDataUrl: string | null;
  update: (lang: "tr" | "en", patch: Partial<LandingCopy>) => void;
  setBanner: (dataUrl: string | null) => void;
}

export const useLandingStore = create<LandingState>()(
  persist<LandingState>(
    (set) => ({
      tr: {
        badge: tr["hero.badge"],
        title1: tr["hero.title1"],
        title2: tr["hero.title2"],
        subtitle: tr["hero.subtitle"],
      },
      en: {
        badge: en["hero.badge"],
        title1: en["hero.title1"],
        title2: en["hero.title2"],
        subtitle: en["hero.subtitle"],
      },
      bannerDataUrl: null,
      update: (lang, patch) =>
        set((state) => ({ [lang]: { ...state[lang], ...patch } }) as Partial<LandingState>),
      setBanner: (dataUrl) => set({ bannerDataUrl: dataUrl }),
    }),
    {
      name: "optiv-landing",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
