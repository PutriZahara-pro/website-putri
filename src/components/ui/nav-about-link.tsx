"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import t from "@/lib/translations";

// Same look as NavContactButton. Hidden on phones: the portfolio bars have no room left there.
export function NavAboutLink({ className }: { className?: string }) {
  const { lang } = useLang();
  return (
    <Link
      href="/about"
      className={className ?? "hidden sm:inline text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-60 hover:opacity-100 transition-opacity"}
    >
      {t[lang].nav.about}
    </Link>
  );
}
