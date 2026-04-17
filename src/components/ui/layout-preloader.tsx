"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const IMAGES = [
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
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

  const runAnimation = () => {
    if (!containerRef.current) return;
    const imgs = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    if (imgs.length < 3) return;

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
        onComplete: () => {
          setIsVisible(false);
          onComplete?.();
        },
      });
    }, 1550);
  };

  useEffect(() => {
    timersRef.current = [];
    const boot = setTimeout(runAnimation, 120);
    return () => {
      clearTimeout(boot);
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

  if (!isVisible) {
    return (
      <button
        onClick={handleRestart}
        className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
      >
        Replay
      </button>
    );
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

      {/* PUTRI | images | ZAHARA */}
      <div className="relative z-20 flex w-full items-center justify-center px-6 md:px-12">
        <div
          ref={titleLeftRef}
          className="select-none font-serif text-[clamp(36px,6vw,96px)] font-bold leading-none tracking-tighter text-neutral-800"
          style={{ opacity: 0 }}
        >
          PUTRI
        </div>

        <div
          className="relative mx-4 flex-shrink-0 overflow-hidden rounded-sm"
          style={{ width: "clamp(200px,30vw,460px)", height: "clamp(140px,21vw,310px)" }}
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
          className="select-none font-serif text-[clamp(36px,6vw,96px)] font-bold leading-none tracking-tighter text-neutral-800"
          style={{ opacity: 0 }}
        >
          ZAHARA
        </div>
      </div>

      {/* Loading label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase">
        Loading
      </div>
    </div>
  );
}
