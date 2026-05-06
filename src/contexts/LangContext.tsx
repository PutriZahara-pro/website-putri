"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/translations";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({ lang: "en", toggle: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang") as Lang | null;
      if (stored === "fr" || stored === "en") setLang(stored);
    } catch {}
  }, []);

  const toggle = () => {
    setLang(prev => {
      const next: Lang = prev === "en" ? "fr" : "en";
      try { localStorage.setItem("lang", next); } catch {}
      return next;
    });
  };

  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
