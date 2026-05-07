"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LayoutPreloader } from "@/components/ui/layout-preloader";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { NavContactButton } from "@/components/ui/nav-contact-button";
import gsap from "gsap";


export default function Home() {
  const router = useRouter();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeBtn, setActiveBtn]         = useState<"portfolio" | "about">("portfolio");
  const navRef      = useRef<HTMLElement>(null);
  const availRef    = useRef<HTMLParagraphElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const buttonsRef  = useRef<HTMLDivElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const portWrapRef = useRef<HTMLDivElement>(null);
  const aboutWrapRef= useRef<HTMLDivElement>(null);

  const punchAndGo = useCallback((target: "portfolio" | "about") => {
    const wrapBtn  = target === "portfolio" ? portWrapRef.current  : aboutWrapRef.current;
    const path     = target === "portfolio" ? "/portfolio"         : "/about";

    if (wrapBtn) {
      gsap.fromTo(wrapBtn,
        { scale: 1 },
        { scale: 0.92, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1, overwrite: "auto" }
      );
    }

    const wrap = wrapRef.current;
    if (!wrap) { router.push(path); return; }
    gsap.to(wrap, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
      delay: 0.22,
      onComplete: () => router.push(path),
    });
  }, [router]);

  const goToPortfolio = useCallback(() => punchAndGo("portfolio"), [punchAndGo]);
  const goToAbout     = useCallback(() => punchAndGo("about"),     [punchAndGo]);

  useEffect(() => {
    if (!preloaderDone) return;

    const nav     = navRef.current;
    const avail   = availRef.current;
    const title   = titleRef.current;
    const buttons = buttonsRef.current;
    if (!nav || !avail || !title || !buttons) return;

    const lines = title.querySelectorAll<HTMLElement>(".title-line");

    gsap.set(nav,     { opacity: 0, y: -12, filter: "blur(6px)" });
    gsap.set(avail,   { opacity: 0, y: 14,  filter: "blur(6px)", letterSpacing: "0.55em" });
    gsap.set(lines,   { opacity: 0, y: 36,  filter: "blur(12px)" });
    gsap.set(buttons, { opacity: 0, y: 18,  filter: "blur(8px)", scale: 0.96 });

    gsap.to(nav, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 1.0, ease: "expo.out", delay: 0.1,
    });
    gsap.to(avail, {
      opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.3em",
      duration: 1.15, ease: "expo.out", delay: 0.25,
    });
    gsap.to(lines, {
      opacity: 1, y: 0, filter: "blur(0px)",
      duration: 1.3, ease: "expo.out",
      stagger: { each: 0.16, from: "start" },
      delay: 0.45,
    });
    gsap.to(buttons, {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      duration: 1.1, ease: "expo.out", delay: 1.15,
    });
  }, [preloaderDone]);


  return (
    <main className="relative h-[100dvh] w-screen max-w-full overflow-hidden bg-black">
      <LayoutPreloader onComplete={() => setPreloaderDone(true)} />

      <div
        ref={wrapRef}
        className="relative h-[100dvh] w-screen max-w-full overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Vertical grid lines */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent calc(100% / 12))",
          }}
        />

        {/* ── NAV ── */}
        <nav ref={navRef} aria-label="Navigation principale" className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-6 py-5 md:px-10">
          <span className="text-[12px] font-bold tracking-[0.25em] text-white uppercase">
            Putri Zahara
          </span>
          <NavContactButton />
        </nav>

        {/* ── Radial fade behind centered content ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-15"
          style={{
            background:
              "radial-gradient(ellipse 55% 48% at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 85%)",
          }}
        />

        {/* ── MAIN CONTENT ── */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 sm:px-6 md:px-10">
          <div className="text-center">
            <p ref={availRef} className="text-white/55 text-[10px] font-mono tracking-[0.3em] uppercase mb-4">
              Available · Freelance &amp; Full-time
            </p>

            <h1
              ref={titleRef}
              className="text-white font-black uppercase leading-none tracking-[-0.02em] mb-6 sm:mb-8"
              style={{ fontSize: "clamp(38px, 7.5vw, 108px)" }}
            >
              <span className="title-line block">Concept</span>
              <span className="title-line block">Artist &amp;</span>
              <span className="title-line block">UI/UX Designer</span>
            </h1>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <div
                ref={portWrapRef}
                onMouseEnter={() => setActiveBtn("portfolio")}
                onFocus={() => setActiveBtn("portfolio")}
                style={{
                  opacity:    activeBtn === "portfolio" ? 1 : 0.4,
                  transition: "opacity 0.45s ease",
                }}
              >
                <LiquidMetalButton label="Portfolio" active={activeBtn === "portfolio"} onClick={goToPortfolio} />
              </div>
              <div
                ref={aboutWrapRef}
                onMouseEnter={() => setActiveBtn("about")}
                onFocus={() => setActiveBtn("about")}
                style={{
                  opacity:    activeBtn === "about" ? 1 : 0.4,
                  transition: "opacity 0.45s ease",
                }}
              >
                <LiquidMetalButton label="About Me" active={activeBtn === "about"} onClick={goToAbout} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
