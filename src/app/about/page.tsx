"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

/* ── Vertical grid (matches rest of site) ─────────────────── */
function GridLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent calc(100% / 12))",
      }}
    />
  );
}

/* ── Retro OS window chrome ────────────────────────────────── */
function Win({
  title,
  badge,
  children,
  className = "",
  style,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`border border-white/[0.11] flex flex-col ${className}`}
      style={style}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.11] px-3 h-[26px] flex-shrink-0 bg-white/[0.025]">
        <div
          aria-hidden="true"
          className="w-[7px] h-[7px] border border-white/20 flex-shrink-0"
        />
        <span className="flex-1 text-center text-[8px] font-mono tracking-[0.32em] uppercase text-white/30 leading-none select-none">
          {title}
        </span>
        {badge}
      </div>
      {children}
    </div>
  );
}

/* ── Dot badge (live / open) ───────────────────────────────── */
function DotBadge({ label, pulse = false }: { label: string; pulse?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 flex-shrink-0">
      <span className="text-[7.5px] font-mono tracking-[0.22em] uppercase text-white/25">
        {label}
      </span>
      <span
        className={`w-[5px] h-[5px] rounded-full bg-white/35 ${pulse ? "animate-pulse" : ""}`}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const router   = useRouter();
  const wrapRef  = useRef<HTMLDivElement>(null);
  const navRef   = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const col2Ref  = useRef<HTMLDivElement>(null);

  /* ── Fade-out transition before navigation ── */
  const goHome = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) { router.push("/"); return; }
    gsap.to(wrap, { opacity: 0, duration: 0.38, ease: "power2.in", onComplete: () => router.push("/") });
  }, [router]);

  /* ── Entrance animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.48, ease: "power2.out", delay: 0.1 },
      );
      gsap.fromTo(photoRef.current,
        { opacity: 0, scale: 0.97, filter: "blur(6px)" },
        { opacity: 1, scale: 1,    filter: "blur(0px)", duration: 0.9, ease: "power3.out", delay: 0.18,
          clearProps: "filter,transform,opacity" },
      );
      gsap.fromTo(col2Ref.current,
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.3 },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={wrapRef}
      className="relative h-screen w-screen overflow-hidden bg-black text-white flex flex-col"
      aria-label="About Putri Zahara"
    >
      <GridLines />

      {/* ════════════ NAV ════════════ */}
      <nav
        ref={navRef}
        aria-label="Navigation principale"
        className="relative z-20 flex-shrink-0 flex items-center justify-between px-6 sm:px-10 py-[14px] border-b border-white/[0.07]"
      >
        <button
          onClick={goHome}
          aria-label="Retour à l'accueil"
          className="text-[11px] font-mono tracking-[0.25em] text-white/50 hover:text-white focus-visible:text-white uppercase transition-colors bg-transparent border-none cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-4"
        >
          ← Home
        </button>

        <div className="flex items-center gap-3 select-none" aria-hidden="true">
          <span className="hidden md:block text-[10px] font-mono leading-none tracking-[0.08em] text-white/[0.07]">
            ████████████
          </span>
          <span className="text-[9.5px] font-mono tracking-[0.38em] text-white/40 uppercase">
            Putri Zahara · About
          </span>
          <span className="hidden md:block text-[10px] font-mono leading-none tracking-[0.08em] text-white/[0.07]">
            ████████████
          </span>
        </div>

        <button
          aria-label="Contacter Putri Zahara"
          className="text-[11px] font-mono tracking-[0.25em] text-white/50 hover:text-white focus-visible:text-white uppercase transition-colors bg-transparent border-none cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-4"
        >
          Contact
        </button>
      </nav>

      {/* ════════════ DESKTOP LAYOUT ════════════ */}
      <div className="relative z-10 flex-1 hidden md:flex gap-3 p-4 lg:p-5 overflow-hidden min-h-0">

        {/* ── Photo column ── */}
        <div ref={photoRef} className="w-[38%] lg:w-[36%] flex-shrink-0 min-h-0">
          <Win title="putri-zahara.webp" badge={<DotBadge label="live feed" />} className="h-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/putri-zahara-profile_1920.webp"
              alt="Putri Zahara, concept artist and UI/UX designer, at work"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 18%" }}
              draggable={false}
            />
          </Win>
        </div>

        {/* ── Right column ── */}
        <div ref={col2Ref} className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* ── Window 1: Identity + stats ── */}
          <Win title="identity.txt" className="flex-shrink-0">
            <div className="px-6 py-5 flex items-end justify-between gap-6">
              {/* Name + title */}
              <div>
                <p className="text-[8px] font-mono tracking-[0.38em] text-white/25 uppercase mb-2">
                  Concept Artist · UI/UX Designer
                </p>
                <h1
                  className="font-black uppercase text-white leading-[0.86] tracking-[-0.025em]"
                  style={{ fontSize: "clamp(36px, 4.2vw, 64px)" }}
                >
                  Putri<br />Zahara
                </h1>
              </div>

              {/* Stats */}
              <div className="flex gap-2 flex-shrink-0 pb-1">
                {[
                  { n: "3+", l: "Years" },
                  { n: "6",  l: "Projects" },
                  { n: "3",  l: "Core tools" },
                ].map(({ n, l }) => (
                  <div
                    key={l}
                    className="border border-white/[0.11] px-4 py-3 flex flex-col items-center gap-1 min-w-[72px]"
                  >
                    <span
                      className="font-black text-white leading-none"
                      style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}
                    >
                      {n}
                    </span>
                    <span className="text-[7.5px] font-mono tracking-[0.28em] uppercase text-white/30 text-center">
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Win>

          {/* ── Window 2: Status / alternance ── */}
          <Win title="status.txt" badge={<DotBadge label="open" pulse />} className="flex-shrink-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[8px] font-mono tracking-[0.32em] uppercase text-white/25">Currently</span>
                <span className="text-[12px] font-mono text-white/70">
                  <strong className="font-bold text-white/90">Gaming Campus Lyon</strong>
                  <span className="text-white/40 ml-2">· <strong className="font-bold text-white/70">4ème année</strong></span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full bg-white/55 animate-pulse flex-shrink-0" />
                <strong className="text-[9px] font-bold font-mono tracking-[0.25em] uppercase text-white/85">
                  Seeking alternance
                </strong>
              </div>
            </div>
          </Win>

          {/* ── Window 3: Bio ── */}
          <Win title="readme.txt" className="flex-1 min-h-0 overflow-hidden">
            <div className="px-6 py-5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

              <p className="text-[12.5px] lg:text-[13px] font-mono text-white/65 leading-[1.95] mb-4">
                International student in <strong className="font-bold text-white/90">Graphic Arts – Concept Art</strong>, I've always been passionate
                about creating worlds and characters for <strong className="font-bold text-white/90">video games and films</strong>.
                <strong className="font-bold text-white/90"> Photoshop, Procreate, and Blender</strong> are my main tools to bring concepts to life.
              </p>

              <p className="text-[12.5px] lg:text-[13px] font-mono text-white/50 leading-[1.95] mb-4">
                Whether designing <strong className="font-bold text-white/80">characters, environments, or UI elements</strong>, I find great joy in the
                creative process — always seeking something <span className="text-white/70">unique and memorable</span>.
                I strongly believe in the power of <strong className="font-bold text-white/80">teamwork</strong>; the best ideas come from collaboration.
              </p>

              <p className="text-[12.5px] lg:text-[13px] font-mono text-white/50 leading-[1.95]">
                When not working on projects, I explore other art forms, watch movies, or dive into
                the latest games for inspiration. My dream: contribute to projects that leave
                a <span className="text-white/70">lasting impression</span> and bring incredible stories to life.
              </p>

              {/* Divider + tools */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-3 flex-wrap">
                <span className="text-[7.5px] font-mono tracking-[0.32em] uppercase text-white/25 mr-1">
                  Tools
                </span>
                {["Photoshop", "Procreate", "Blender"].map((t) => (
                  <span
                    key={t}
                    className="border border-white/[0.16] px-3 py-1 text-[8.5px] font-mono tracking-[0.22em] text-white/50 uppercase hover:text-white/80 hover:border-white/30 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Win>

        </div>
      </div>

      {/* ════════════ MOBILE LAYOUT ════════════ */}
      <div className="relative z-10 flex-1 flex flex-col gap-2.5 p-3 overflow-y-auto md:hidden" style={{ scrollbarWidth: "none" }}>

        {/* Photo */}
        <Win title="putri-zahara.webp" badge={<DotBadge label="live" />} className="flex-shrink-0" style={{ height: "260px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/putri-zahara-profile_1920.webp"
            alt="Putri Zahara, concept artist and UI/UX designer"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 18%" }}
            draggable={false}
          />
        </Win>

        {/* Identity */}
        <Win title="identity.txt" className="flex-shrink-0">
          <div className="px-4 py-4">
            <p className="text-[7.5px] font-mono tracking-[0.32em] text-white/25 uppercase mb-2">
              Concept Art · UI/UX
            </p>
            <h1 className="font-black uppercase text-white text-[40px] leading-[0.86] tracking-[-0.025em] mb-4">
              Putri<br />Zahara
            </h1>
            <div className="flex gap-2">
              {[{ n: "3+", l: "Years" }, { n: "6", l: "Projects" }, { n: "3", l: "Tools" }].map(({ n, l }) => (
                <div key={l} className="border border-white/[0.11] flex-1 py-3 flex flex-col items-center gap-1">
                  <span className="font-black text-white text-[26px] leading-none">{n}</span>
                  <span className="text-[7px] font-mono tracking-[0.25em] uppercase text-white/30">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </Win>

        {/* Status */}
        <Win title="status.txt" badge={<DotBadge label="open" pulse />} className="flex-shrink-0">
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="w-[5px] h-[5px] rounded-full bg-white/50 animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-mono text-white/60 leading-[1.6]">
              Gaming Campus Lyon · 4ème année
              <span className="text-white/85 ml-1">· Seeking alternance</span>
            </span>
          </div>
        </Win>

        {/* Bio */}
        <Win title="readme.txt" className="flex-shrink-0">
          <div className="px-4 py-4">
            <p className="text-[11px] font-mono text-white/60 leading-[1.95] mb-3">
              International student in <strong className="font-bold text-white/90">Graphic Arts – Concept Art</strong>, passionate about creating worlds
              for <strong className="font-bold text-white/90">video games and films</strong>. Main tools: <strong className="font-bold text-white/85">Photoshop, Procreate, Blender</strong>.
            </p>
            <p className="text-[11px] font-mono text-white/45 leading-[1.95] mb-4">
              I believe <strong className="font-bold text-white/75">teamwork</strong> brings the best ideas. My dream: contribute to projects that leave
              a <span className="text-white/70">lasting impression</span> and bring incredible stories to life.
            </p>
            <div className="pt-4 border-t border-white/[0.08] flex gap-2 flex-wrap">
              {["Photoshop", "Procreate", "Blender"].map((t) => (
                <span key={t} className="border border-white/[0.16] px-2.5 py-1 text-[8px] font-mono tracking-[0.2em] text-white/45 uppercase">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Win>
      </div>
    </main>
  );
}
