"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutPreloader } from "@/components/ui/layout-preloader";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import gsap from "gsap";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeBtn, setActiveBtn] = useState<"portfolio" | "about">("portfolio");
  const navRef = useRef<HTMLElement>(null);
  const availRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!preloaderDone) return;

    const nav = navRef.current;
    const avail = availRef.current;
    const title = titleRef.current;
    const buttons = buttonsRef.current;
    const marker = markerRef.current;
    if (!nav || !avail || !title || !buttons || !marker) return;

    const lines = title.querySelectorAll<HTMLElement>(".title-line");

    gsap.set(nav, { opacity: 0, y: -16 });
    gsap.set(avail, { opacity: 0, y: 12 });
    gsap.set(lines, { opacity: 0, y: 28 });
    gsap.set(buttons, { opacity: 0, y: 16 });
    gsap.set(marker, { opacity: 0 });

    gsap.to(nav, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.15 });
    gsap.to(avail, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.18 });
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.25,
    });
    gsap.to(buttons, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.65 });
    gsap.to(marker, { opacity: 1, duration: 0.5, delay: 0.8 });
  }, [preloaderDone]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <LayoutPreloader onComplete={() => setPreloaderDone(true)} />

      <div
        className="relative h-screen w-screen overflow-hidden"
        style={{ opacity: preloaderDone ? 1 : 0, transition: "opacity 0.25s ease" }}
      >
        {/* Background image — decorative */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/landingpage/Harbor_thumbnail_final_obi_1920.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.75) contrast(1.05)" }}
          draggable={false}
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Vertical grid lines */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent calc(100% / 12))",
          }}
        />

        {/* ── NAV ── */}
        <nav ref={navRef} aria-label="Navigation principale" className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
          <span className="text-[12px] font-bold tracking-[0.25em] text-white uppercase">
            Putri Zahara
          </span>

          <ul className="flex gap-10 text-[12px] font-bold tracking-[0.2em] text-white uppercase">
            <li>
              <button className="cursor-pointer opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 bg-transparent border-none text-white text-[12px] font-bold tracking-[0.2em] uppercase">
                Portfolio
              </button>
            </li>
            <li>
              <button className="cursor-pointer opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 bg-transparent border-none text-white text-[12px] font-bold tracking-[0.2em] uppercase">
                About
              </button>
            </li>
          </ul>

          <button className="text-[12px] font-bold tracking-[0.25em] text-white uppercase cursor-pointer opacity-80 hover:opacity-100 focus-visible:opacity-100 transition-opacity bg-transparent border-none">
            Contact
          </button>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-[28vh] px-6 md:px-10">
          <p ref={availRef} className="text-white/50 text-[11px] font-mono tracking-[0.3em] uppercase mb-4">
            Available · Freelance &amp; Full-time
          </p>

          <h1
            ref={titleRef}
            className="text-white font-black uppercase leading-[0.88] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(38px, 7.5vw, 108px)" }}
          >
            <span className="title-line block">Concept</span>
            <span className="title-line block">Artist &amp;</span>
            <span className="title-line block">UI/UX Designer</span>
          </h1>

          <div ref={buttonsRef} className="flex items-center gap-5 mb-6">
            <div
              onMouseEnter={() => setActiveBtn("portfolio")}
              onFocus={() => setActiveBtn("portfolio")}
              style={{
                opacity: activeBtn === "portfolio" ? 1 : 0.45,
                transform: activeBtn === "portfolio" ? "scale(1)" : "scale(0.96)",
                transition: "opacity 0.45s ease, transform 0.45s ease",
              }}
            >
              <LiquidMetalButton label="Portfolio" active={activeBtn === "portfolio"} />
            </div>
            <div
              onMouseEnter={() => setActiveBtn("about")}
              onFocus={() => setActiveBtn("about")}
              style={{
                opacity: activeBtn === "about" ? 1 : 0.45,
                transform: activeBtn === "about" ? "scale(1)" : "scale(0.96)",
                transition: "opacity 0.45s ease, transform 0.45s ease",
              }}
            >
              <LiquidMetalButton label="About Me" active={activeBtn === "about"} />
            </div>
          </div>

          <div className="flex items-end justify-end">
            <span ref={markerRef} aria-hidden="true" className="text-white/50 text-sm font-mono tracking-widest">::</span>
          </div>
        </div>
      </div>
    </main>
  );
}
