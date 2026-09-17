"use client";

import { useEffect } from "react";
import { useLangStore, initLangFromStorage } from "./store";
import { dictionaries } from "./dictionary";

export function useT() {
  const lang = useLangStore((s) => s.lang);

  useEffect(() => {
    initLangFromStorage();
  }, []);

  return {
    t: (key: string) => dictionaries[lang][key] ?? key,
    lang,
  };
}
