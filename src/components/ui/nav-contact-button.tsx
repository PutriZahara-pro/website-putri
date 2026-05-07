"use client";
import { useContact } from "@/contexts/ContactContext";
import { useLang } from "@/contexts/LangContext";
import t from "@/lib/translations";

export function NavContactButton({ className }: { className?: string }) {
  const { open } = useContact();
  const { lang }  = useLang();
  return (
    <button
      onClick={open}
      className={className ?? "text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"}
    >
      {t[lang].nav.contact}
    </button>
  );
}
