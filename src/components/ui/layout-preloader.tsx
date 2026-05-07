"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const IMAGES = [
  "/images/landingpage/1E1A1C08-ED86-407D-A752-0091CA984F94_1920.webp",
  "/images/landingpage/Concept_ville_yirie_1920.webp",
  "/images/landingpage/Harbor_thumbnail_final_obi_1920.webp",
];

interface LayoutPreloaderProps {
  onComplete?: () => void;
}

export function LayoutPreloader({ onComplete }: LayoutPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLDivElement>(null);
  const titleRightRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted,   setMounted]   = useState(false);
  const [key, setKey] = useState(0);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  const killAll = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    const targets = [
      containerRef.current,
      titleLeftRef.current,
      titleRightRef.current,
      ...imageRefs.current.filter(Boolean),
    ].filter(Boolean);
    if (targets.length) gsap.killTweensOf(targets);
  };

  const finishOnce = useRef(false);
  const finish = () => {
    if (finishOnce.current) return;
    finishOnce.current = true;
    setIsVisible(false);
    onComplete?.();
  };

  const runAnimation = () => {
    if (!containerRef.current) return;
    const imgs = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (imgs.length < 3) { finish(); return; }

    const L = titleLeftRef.current!;
    const R = titleRightRef.current!;

    // — Set hidden initial states via CSS transforms directly —
    gsap.set([L, R], { opacity: 0, x: 0 });
    gsap.set(imgs, { yPercent: 100, scale: 1.1, opacity: 0 });

    // t=0ms  — letters fade in
    gsap.to(L, { opacity: 1, duration: 0.28, ease: "power2.out" });
    gsap.to(R, { opacity: 1, duration: 0.28, ease: "power2.out", delay: 0.05 });

    // t=350ms — image 1 slides up
    addTimer(() => {
      gsap.to(imgs[0], { yPercent: 0, scale: 1, opacity: 1, duration: 0.30, ease: "power2.out" });
    }, 350);

    // t=720ms — push img1 back + image 2 slides up
    addTimer(() => {
      gsap.to(imgs[0], { yPercent: -6, scale: 0.96, opacity: 0.4, duration: 0.22, ease: "power2.inOut" });
      gsap.to(imgs[1], { yPercent: 0, scale: 1, opacity: 1, duration: 0.30, ease: "power2.out", delay: 0.06 });
    }, 720);

    // t=1090ms — push img2 back + image 3 slides up
    addTimer(() => {
      gsap.to(imgs[1], { yPercent: -6, scale: 0.96, opacity: 0.4, duration: 0.22, ease: "power2.inOut" });
      gsap.to(imgs[2], { yPercent: 0, scale: 1, opacity: 1, duration: 0.30, ease: "power2.out", delay: 0.06 });
    }, 1090);

    // t=1550ms — exit: preloader slides up
    addTimer(() => {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.60,
        ease: "power3.inOut",
        onComplete: finish,
      });
    }, 1550);
  };

  useEffect(() => {
    setMounted(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem("preloaderSeen") === "1";
    if (reduced || alreadySeen) {
      finish();
      return;
    }
    sessionStorage.setItem("preloaderSeen", "1");

    // ── Prefetch heavy assets during loading animation ──
    // Browser caches these; when page requests them later = instant.
    const PREFETCH = [
      // 3D iPhone model (GLTF + binary)
      "/asset3D/scene.gltf",
      "/asset3D/scene.bin",
      // Portfolio thumbnails (above-the-fold)
      "/images/Portfolio/cuisine-royale/thumbnail_1920.webp",
      "/images/Portfolio/Aporion/thumbnail_1920.webp",
      "/images/title/titletitre_1920.webp",
      "/images/Portfolio/ps_apocalypse/1_1920.webp",
      "/images/Portfolio/Tower_defense_game/WORKSHOP_BATTLE_CHESS_1_1920.webp",
      "/images/Book/couverture_1920.webp",
      "/images/Portfolio/Other_works/Fallout_fanart/Zahara_Putri_AG4_Fallout_environnement_1920.webp",
      "/images/Lumi/thumbnail.webp",
    ];
    PREFETCH.forEach(url => {
      fetch(url, { priority: "low" } as RequestInit).catch(() => {});
    });

    timersRef.current = [];
    const boot = setTimeout(runAnimation, 120);
    // Hard failsafe: never block page longer than 4s on slow devices
    const failsafe = setTimeout(finish, 4000);
    return () => {
      clearTimeout(boot);
      clearTimeout(failsafe);
      killAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const handleRestart = () => {
    killAll();
    gsap.set(containerRef.current, { yPercent: 0 });
    setIsVisible(true);
    setKey((k) => k + 1);
  };

  // Before mount: return null on both SSR and first client render
  // → no hydration mismatch, no flash on return visits
  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      key={key}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#f0ede8]"
    >
      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-[-50%] z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
          animation: "noise-animation 0.5s steps(1) infinite",
        }}
      />

      {/* PUTRI | images | ZAHARA — image dead center via 1fr auto 1fr grid */}
      <div
        className="relative z-20 grid w-full items-center px-6 md:px-12"
        style={{ gridTemplateColumns: "1fr auto 1fr" }}
      >
        <div
          ref={titleLeftRef}
          className="justify-self-end pr-3 select-none font-serif text-[clamp(18px,6vw,96px)] font-bold leading-none tracking-tighter text-neutral-800"
          style={{ opacity: 0 }}
        >
          PUTRI
        </div>

        <div
          className="relative flex-shrink-0 overflow-hidden rounded-sm"
          style={{ width: "clamp(100px,28vw,460px)", height: "clamp(70px,19.6vw,310px)" }}
        >
          {IMAGES.map((src, i) => (
            <div
              key={i}
              ref={(el) => { imageRefs.current[i] = el; }}
              className="absolute inset-0 overflow-hidden"
              style={{ zIndex: i + 1, opacity: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
          ))}
        </div>

        <div
          ref={titleRightRef}
          className="justify-self-start pl-3 select-none font-serif text-[clamp(18px,6vw,96px)] font-bold leading-none tracking-tighter text-neutral-800"
          style={{ opacity: 0 }}
        >
          ZAHARA
        </div>
      </div>

      {/* Loading label — bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase">
        Loading
      </div>
    </div>
  );
}
