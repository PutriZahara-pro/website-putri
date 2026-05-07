"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { NavContactButton } from "@/components/ui/nav-contact-button";
import { useLang } from "@/contexts/LangContext";

function LangToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <button
      onClick={toggle}
      className={`bg-transparent border-none cursor-pointer font-mono uppercase tracking-[0.25em] transition-all hover:opacity-100 ${className ?? ""}`}
      style={{
        fontSize: "10px",
        letterSpacing: "0.25em",
        opacity: 1,
        textShadow: "0 0 8px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5)",
      }}
      aria-label="Switch language"
    >
      {lang === "en" ? "FR" : "EN"}
    </button>
  );
}

/* ── i18n ──────────────────────────────────────────────────── */
const copy = {
  en: {
    nav: {
      home:  "← Home",
      label: "Putri Zahara · About",
      homeAriaLabel: "Back to home",
    },
    identity: {
      subtitle: "Concept Artist · UI/UX Designer",
      subtitleShort: "Concept Art · UI/UX",
      stats: [
        { n: "3+", l: "Years"      },
        { n: "6",  l: "Projects"   },
        { n: "3",  l: "Core tools" },
      ],
      statsMobile: [
        { n: "3+", l: "Years"    },
        { n: "6",  l: "Projects" },
        { n: "3",  l: "Tools"    },
      ],
    },
    status: {
      badge:    "open",
      label:    "Currently",
      school:   "Gaming Campus Lyon",
      year:     "4th year",
      seeking:  "Seeking alternance",
      seekingM: "· Seeking alternance",
    },
    bio: {
      p1:   <>I&apos;ve always been drawn to worlds that feel lived-in, the kind where every corner has a story. I work across <strong className="font-bold text-white/90">concept art and UI/UX design</strong>, moving between environments, characters, and visual systems depending on where I&apos;m needed. <strong className="font-bold text-white/90">Photoshop, Procreate, and Blender</strong> are my daily tools; the real work is making something that resonates.</>,
      p2:   <>I&apos;m a better designer in a <strong className="font-bold text-white/80">team</strong> than alone. The best ideas come from friction and iteration. I like ambitious briefs, honest feedback, and projects <span className="text-white/70">worth caring about</span>.</>,
      p3:   <>When I&apos;m not working, I&apos;m playing games, stockpiling references in folders that are already too full, or watching films for the production design. My goal: contribute to something that <span className="text-white/70">outlasts the deadline</span>.</>,
      p1M:  <>Drawn to worlds that feel lived-in. I work across <strong className="font-bold text-white/90">concept art and UI/UX</strong>, using <strong className="font-bold text-white/85">Photoshop, Procreate, Blender, ZBrush, After Effects</strong> to make things that resonate.</>,
      p2M:  <>Better in a <strong className="font-bold text-white/75">team</strong> than alone. I like ambitious briefs and projects <span className="text-white/70">worth caring about</span>. Goal: contribute to something that outlasts the deadline.</>,
      tools: "Tools",
    },
    rec: {
      quote:  "Putri consistently created stunning work that followed the company's style and branding guides perfectly. She has a remarkable ability to translate a vision onto paper rapidly. She was crucial to the 2D environment workflow, bringing ideas and references into final 2D renders that our 3D artists could seamlessly take over. What sets Putri apart is her enthusiastic mindset; she requires no micromanagement and possesses a great intuition for knowing exactly when to ask for feedback and how to apply it to her designs.",
      quoteM: "Putri consistently created stunning work, translating vision onto paper rapidly. Crucial to the 2D environment workflow. She requires no micromanagement and possesses great intuition for feedback.",
      author: "Jasper Ising",
      role:   "3D Environment Artist · Technical Artist — Olive Branch Interactive",
    },
  },
  fr: {
    nav: {
      home:  "← Accueil",
      label: "Putri Zahara · À propos",
      homeAriaLabel: "Retour à l'accueil",
    },
    identity: {
      subtitle: "Concept Artist · UI/UX Designer",
      subtitleShort: "Concept Art · UI/UX",
      stats: [
        { n: "3+", l: "Ans"     },
        { n: "6",  l: "Projets" },
        { n: "3",  l: "Outils"  },
      ],
      statsMobile: [
        { n: "3+", l: "Ans"     },
        { n: "6",  l: "Projets" },
        { n: "3",  l: "Outils"  },
      ],
    },
    status: {
      badge:    "ouvert",
      label:    "Actuellement",
      school:   "Gaming Campus Lyon",
      year:     "4ème année",
      seeking:  "En recherche d'alternance",
      seekingM: "· En recherche d'alternance",
    },
    bio: {
      p1:   <>Étudiante internationale en <strong className="font-bold text-white/90">Arts Graphiques – Concept Art</strong>, j&apos;ai toujours été passionnée par la création de mondes et de personnages pour les <strong className="font-bold text-white/90">jeux vidéo et le cinéma</strong>. <strong className="font-bold text-white/90">Photoshop, Procreate et Blender</strong> sont mes outils principaux pour donner vie aux concepts.</>,
      p2:   <>Que ce soit pour des <strong className="font-bold text-white/80">personnages, des environnements ou des éléments UI</strong>, je trouve une grande joie dans le processus créatif, toujours à la recherche de quelque chose <span className="text-white/70">d&apos;unique et de mémorable</span>. Je crois profondément en la force du <strong className="font-bold text-white/80">travail d&apos;équipe</strong> ; les meilleures idées naissent de la collaboration.</>,
      p3:   <>Quand je ne travaille pas sur des projets, j&apos;explore d&apos;autres formes d&apos;art, regarde des films ou plonge dans les derniers jeux pour m&apos;inspirer. Mon rêve : contribuer à des projets qui laissent une <span className="text-white/70">impression durable</span> et donnent vie à des histoires incroyables.</>,
      p1M:  <>Étudiante en <strong className="font-bold text-white/90">Arts Graphiques – Concept Art</strong>, passionnée par la création de mondes pour les <strong className="font-bold text-white/90">jeux vidéo et le cinéma</strong>. Outils : <strong className="font-bold text-white/85">Photoshop, Procreate, Blender, ZBrush, After Effects</strong>.</>,
      p2M:  <>Je crois en la force du <strong className="font-bold text-white/75">travail d&apos;équipe</strong>. Mon rêve : contribuer à des projets qui laissent une <span className="text-white/70">impression durable</span> et donnent vie à des histoires incroyables.</>,
      tools: "Outils",
    },
    rec: {
      quote:  "Putri a constamment produit un travail remarquable en suivant parfaitement les guides de style et d'identité visuelle de l'entreprise. Elle a une capacité remarquable à traduire une vision sur papier rapidement. Elle était essentielle au workflow 2D, transformant idées et références en rendus finaux que nos artistes 3D pouvaient reprendre sans friction. Ce qui distingue Putri, c'est son état d'esprit enthousiaste ; elle ne nécessite aucune microgestion et possède une excellente intuition pour savoir quand demander des retours et comment les appliquer.",
      quoteM: "Putri a constamment produit un travail remarquable, traduisant une vision sur papier rapidement. Essentielle au workflow 2D. Aucune microgestion nécessaire, excellente intuition pour les retours.",
      author: "Jasper Ising",
      role:   "3D Environment Artist · Technical Artist — Olive Branch Interactive",
    },
  },
} as const;

/* ── Vertical grid ─────────────────────────────────────────── */
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

/* ── Retro OS window chrome ─────────────────────────────────── */
function Win({
  title, badge, children, className = "", style,
}: {
  title: string; badge?: React.ReactNode;
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={`border border-white/[0.11] flex flex-col ${className}`} style={style}>
      <div className="flex items-center gap-2 border-b border-white/[0.11] px-3 h-[26px] flex-shrink-0 bg-white/[0.025]">
        <div aria-hidden="true" className="w-[7px] h-[7px] border border-white/20 flex-shrink-0" />
        <span className="flex-1 text-center text-[8px] font-mono tracking-[0.32em] uppercase text-white/30 leading-none select-none">
          {title}
        </span>
        {badge}
      </div>
      {children}
    </div>
  );
}

/* ── Dot badge ─────────────────────────────────────────────── */
function DotBadge({ label, pulse = false }: { label: string; pulse?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 flex-shrink-0">
      <span className="text-[7.5px] font-mono tracking-[0.22em] uppercase text-white/25">{label}</span>
      <span className={`w-[5px] h-[5px] rounded-full bg-white/35 ${pulse ? "animate-pulse" : ""}`} />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const router   = useRouter();
  const { lang } = useLang();
  const c        = copy[lang];
  const wrapRef  = useRef<HTMLDivElement>(null);
  const navRef   = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const col2Ref  = useRef<HTMLDivElement>(null);
  const recRef   = useRef<HTMLDivElement>(null);

  const goHome = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) { router.push("/"); return; }
    gsap.to(wrap, { opacity: 0, duration: 0.38, ease: "power2.in", onComplete: () => router.push("/") });
  }, [router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.48, ease: "power2.out", delay: 0.1 },
      );
      gsap.fromTo(photoRef.current,
        { opacity: 0, scale: 0.97, filter: "blur(6px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", delay: 0.18,
          clearProps: "filter,transform,opacity" },
      );
      gsap.fromTo(col2Ref.current,
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.3 },
      );
      gsap.fromTo(recRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", delay: 0.55 },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={wrapRef}
      className="relative h-[100dvh] w-screen max-w-full overflow-hidden bg-black text-white flex flex-col"
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
          aria-label={c.nav.homeAriaLabel}
          className="text-[11px] font-mono tracking-[0.25em] text-white/50 hover:text-white focus-visible:text-white uppercase transition-colors bg-transparent border-none cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40 focus-visible:outline-offset-4"
        >
          {c.nav.home}
        </button>

        <div className="flex items-center gap-3 select-none" aria-hidden="true">
          <span className="hidden md:block text-[10px] font-mono leading-none tracking-[0.08em] text-white/[0.07]">████████████</span>
          <span className="text-[9.5px] font-mono tracking-[0.38em] text-white/40 uppercase">{c.nav.label}</span>
          <span className="hidden md:block text-[10px] font-mono leading-none tracking-[0.08em] text-white/[0.07]">████████████</span>
        </div>

        <div className="flex items-center gap-5">
          <LangToggle className="text-white opacity-60" />
          <a
            href="https://www.linkedin.com/in/putri-zaharapro/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-[11px] font-mono tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors"
            aria-label="LinkedIn profile"
          >
            LinkedIn
          </a>
          <NavContactButton className="text-[11px] font-mono tracking-[0.25em] text-white/50 hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer" />
        </div>
      </nav>

      {/* ════════════ DESKTOP LAYOUT ════════════ */}
      <div className="relative z-10 flex-1 hidden md:flex gap-3 p-4 lg:p-5 overflow-hidden min-h-0">

        {/* Photo column */}
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

        {/* Right column */}
        <div ref={col2Ref} className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* identity.txt */}
          <Win title="identity.txt" className="flex-shrink-0">
            <div className="px-6 py-5 flex items-end justify-between gap-6">
              <div>
                <p className="text-[8px] font-mono tracking-[0.38em] text-white/25 uppercase mb-2">
                  {c.identity.subtitle}
                </p>
                <h1
                  className="font-black uppercase text-white leading-[0.86] tracking-[-0.025em]"
                  style={{ fontSize: "clamp(36px, 4.2vw, 64px)" }}
                >
                  Putri<br />Zahara
                </h1>
              </div>
              <div className="flex gap-2 flex-shrink-0 pb-1">
                {c.identity.stats.map(({ n, l }) => (
                  <div key={l} className="border border-white/[0.11] px-4 py-3 flex flex-col items-center gap-1 min-w-[72px]">
                    <span className="font-black text-white leading-none" style={{ fontSize: "clamp(22px, 2.2vw, 32px)" }}>{n}</span>
                    <span className="text-[7.5px] font-mono tracking-[0.28em] uppercase text-white/30 text-center">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </Win>

          {/* status.txt */}
          <Win title="status.txt" badge={<DotBadge label={c.status.badge} pulse />} className="flex-shrink-0">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[8px] font-mono tracking-[0.32em] uppercase text-white/25">{c.status.label}</span>
                <span className="text-[12px] font-mono text-white/70">
                  <strong className="font-bold text-white/90">{c.status.school}</strong>
                  <span className="text-white/40 ml-2">· <strong className="font-bold text-white/70">{c.status.year}</strong></span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full bg-white/55 animate-pulse flex-shrink-0" />
                <strong className="text-[9px] font-bold font-mono tracking-[0.25em] uppercase text-white/85">
                  {c.status.seeking}
                </strong>
              </div>
            </div>
          </Win>

          {/* readme.txt */}
          <Win title="readme.txt" className="flex-1 min-h-0 overflow-hidden">
            <div className="px-6 py-5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <p className="text-[12.5px] lg:text-[13px] font-mono text-white/65 leading-[1.95] mb-4">{c.bio.p1}</p>
              <p className="text-[12.5px] lg:text-[13px] font-mono text-white/50 leading-[1.95] mb-4">{c.bio.p2}</p>
              <p className="text-[12.5px] lg:text-[13px] font-mono text-white/50 leading-[1.95]">{c.bio.p3}</p>
              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-3 flex-wrap">
                <span className="text-[7.5px] font-mono tracking-[0.32em] uppercase text-white/25 mr-1">{c.bio.tools}</span>
                {["Photoshop", "Illustrator", "Procreate", "Blender", "ZBrush", "After Effects"].map((t) => (
                  <span key={t} className="border border-white/[0.16] px-3 py-1 text-[8.5px] font-mono tracking-[0.22em] text-white/50 uppercase hover:text-white/80 hover:border-white/30 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Win>
        </div>
      </div>

      {/* ════════════ RECOMMENDATION ROW (desktop) ════════════ */}
      <div ref={recRef} className="relative z-10 hidden md:block flex-shrink-0 px-4 lg:px-5 pb-4">
        <Win title="linkedin_recommendation.txt">
          <div className="px-6 py-4 flex gap-5 items-start">
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
                aria-label="Jasper Ising"
              >
                <span className="text-[9px] font-mono text-white/40">JI</span>
              </div>
              <span className="text-[7px] font-mono tracking-[0.18em] text-white/25 uppercase text-center whitespace-nowrap">LinkedIn</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-mono text-white/55 leading-[1.8] mb-3">
                <span className="text-white/25 text-[14px] font-bold mr-1">&ldquo;</span>
                {c.rec.quote}
                <span className="text-white/25 text-[14px] font-bold ml-1">&rdquo;</span>
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[8.5px] font-bold font-mono tracking-[0.18em] text-white/75 uppercase">{c.rec.author}</span>
                <span className="text-white/20 text-[8px]">·</span>
                <span className="text-[8px] font-mono tracking-[0.12em] text-white/35">{c.rec.role}</span>
              </div>
            </div>
          </div>
        </Win>
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
            <p className="text-[7.5px] font-mono tracking-[0.32em] text-white/25 uppercase mb-2">{c.identity.subtitleShort}</p>
            <h1 className="font-black uppercase text-white text-[40px] leading-[0.86] tracking-[-0.025em] mb-4">Putri<br />Zahara</h1>
            <div className="flex gap-2">
              {c.identity.statsMobile.map(({ n, l }) => (
                <div key={l} className="border border-white/[0.11] flex-1 py-3 flex flex-col items-center gap-1">
                  <span className="font-black text-white text-[26px] leading-none">{n}</span>
                  <span className="text-[7px] font-mono tracking-[0.25em] uppercase text-white/30">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </Win>

        {/* Status */}
        <Win title="status.txt" badge={<DotBadge label={c.status.badge} pulse />} className="flex-shrink-0">
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="w-[5px] h-[5px] rounded-full bg-white/50 animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-mono text-white/60 leading-[1.6]">
              {c.status.school} · {c.status.year}
              <span className="text-white/85 ml-1">{c.status.seekingM}</span>
            </span>
          </div>
        </Win>

        {/* Bio */}
        <Win title="readme.txt" className="flex-shrink-0">
          <div className="px-4 py-4">
            <p className="text-[11px] font-mono text-white/60 leading-[1.95] mb-3">{c.bio.p1M}</p>
            <p className="text-[11px] font-mono text-white/45 leading-[1.95] mb-4">{c.bio.p2M}</p>
            <div className="pt-4 border-t border-white/[0.08] flex gap-2 flex-wrap">
              {["Photoshop", "Illustrator", "Procreate", "Blender", "ZBrush", "After Effects"].map((t) => (
                <span key={t} className="border border-white/[0.16] px-2.5 py-1 text-[8px] font-mono tracking-[0.2em] text-white/45 uppercase">{t}</span>
              ))}
            </div>
          </div>
        </Win>

        {/* Recommendation */}
        <Win title="linkedin_recommendation.txt" className="flex-shrink-0">
          <div className="px-4 py-4 flex gap-3 items-start">
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-[8px] font-mono text-white/40">JI</span>
            </div>
            <div>
              <p className="text-[10px] font-mono text-white/50 leading-[1.8] mb-2">
                &ldquo;{c.rec.quoteM}&rdquo;
              </p>
              <p className="text-[8px] font-bold font-mono tracking-[0.18em] text-white/65 uppercase">
                {c.rec.author} <span className="font-normal text-white/30">· {c.rec.role}</span>
              </p>
            </div>
          </div>
        </Win>
      </div>
    </main>
  );
}
