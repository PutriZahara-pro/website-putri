"use client";
import { useLang } from "@/contexts/LangContext";

export default function LangToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      className={`bg-transparent border-none cursor-pointer font-mono uppercase tracking-[0.25em] transition-opacity hover:opacity-100 ${className ?? ""}`}
      style={{ fontSize: "10px", letterSpacing: "0.25em", opacity: 0.6 }}
      aria-label={lang === "en" ? "Passer le site en français" : "Switch the site to English"}
    >
      {lang === "en" ? "FR" : "EN"}
    </button>
  );
}
