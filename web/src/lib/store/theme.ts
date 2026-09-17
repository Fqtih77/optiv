"use client";

import { create } from "zustand";

export type Theme = "dark" | "light";

const KEY = "optiv-theme";

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  syncFromStorage: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  setTheme: (theme) => {
    apply(theme);
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, theme);
    set({ theme });
  },
  toggle: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  syncFromStorage: () => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(KEY) as Theme | null;
    const theme: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    apply(theme);
    set({ theme });
  },
}));
