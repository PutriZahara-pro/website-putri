"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { useContact } from "@/contexts/ContactContext";
import "./about.css";

const PORTRAIT = "/images/about/putri-portrait.webp";
// 32×40 copy of the portrait, stretched + blurred: the loader has a picture
// on the very first paint, before the real file arrives.
const PORTRAIT_TINY =
  "data:image/jpeg;base64,/9j/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAoACADASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAABgAFAgMEB//EACYQAAIBBAEEAAcAAAAAAAAAAAECAwAEBRESBiExQRMiM0JRYXH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AQ29lHCHCM2n87rqgURKEB7CtYbYqhz+RvFuocfYkRvIOTyn7VoFW9g67/wArutPoCguLupMfkYraaUuTs89+T7pUt6bJikh5q55L31oUFPFdo6cg6ka32NUEGTgvOo7hY1M2oOAH7B2aDfFuYOQEjqB2Omrdi8vcYuSR7cITINMWGzQXGYvTa5WNvmWQAlh+KUW2bGSjgjBAk4EgEegK89e5e9uHmuTt38H0KR9OxG4vUlDbWGMhiPZPqgIvKz7LeT5rCpUoMw21C+D4pr0y8dljgHBDyEsTUqUH/9k=";
const LINKEDIN = "https://www.linkedin.com/in/putri-zaharapro/";
const TOOLS = ["Photoshop", "Illustrator", "Procreate", "Blender", "ZBrush", "After Effects"];

/* ── i18n ──────────────────────────────────────────────────── */
const copy = {
  en: {
    aria: "About Putri Zahara",
    nav: { label: "Main navigation", home: "Home", portfolio: "Portfolio", about: "About", contact: "Contact", lang: "Passer le site en français" },
    page: "About me",
    loader: {
      role: "Concept Artist & Illustrator",
      rows: [["File.", "PZ_PROFILE_01"], ["Loc.", "Lyon — FR"]],
      load: "Load.",
      scan: "Scan", detect: "Face detection", match: "Match",
      skip: "Tap or click to skip",
    },
    hero: {
      hi: ["Hi! I'm Putri..."],
      where: ["Drawing worlds", "in Lyon"],
      stars: ["Concept Art", "UI/UX", "Characters", "Environments"],
      dims: "Portrait",
      subject: "Subject · Putri",
      alt: "Black and white portrait of Putri Zahara, chin resting on her hand",
      role: "Concept Artist & Illustrator",
      school: "Gaming Campus Lyon ·", year: "4th year",
      page: "(about page)",
      status: ["Available", "Work-study & Internship"],
      scroll: "Open the file", scrollSub: "Scroll",
    },
    file: {
      title: "SUBJECT FILE — PZ-0047.dat",
      capture: "Capture · Profile",
      bio: [
        <>I&apos;ve always been drawn to worlds that feel lived-in, the kind where every corner has a story. I work across <b>concept art and UI/UX design</b>, moving between environments, characters, and visual systems depending on where I&apos;m needed. <b>Photoshop, Procreate, and Blender</b> are my daily tools; the real work is making something that resonates.</>,
        <>I&apos;m a better designer in a <b>team</b> than alone. The best ideas come from friction and iteration. I like ambitious briefs, honest feedback, and projects <span className="hl">worth caring about</span>.</>,
        <>When I&apos;m not working, I&apos;m playing games, stockpiling references in folders that are already too full, or watching films for the production design. My goal: contribute to something that <span className="hl">outlasts the deadline</span>.</>,
      ],
      fields: "ID fields",
      stats: [["Years", "3+"], ["Pro projects", "06"], ["Core tools", "03"]],
      status: "Status",
      statusRows: ["Available — Work-study & Internship", "Gaming Campus Lyon · 4th year", "Lyon, France"],
      tools: "Tools",
      matches: "Match results — open the portfolio",
      ready: "Ready", count: "3 matches",
    },
    rec: {
      note: "real LinkedIn rec.",
      quote: "Putri consistently created stunning work that followed the company's style and branding guides perfectly. She has a remarkable ability to translate a vision onto paper rapidly. She was crucial to the 2D environment workflow, bringing ideas and references into final 2D renders that our 3D artists could seamlessly take over. What sets Putri apart is her enthusiastic mindset; she requires no micromanagement and possesses a great intuition for knowing exactly when to ask for feedback and how to apply it to her designs.",
      role: "3D Environment Artist · Technical Artist — Olive Branch Interactive",
    },
    outro: { title: "Let's make something together", rights: "All rights reserved", legal: "Legal notice & privacy" },
  },
  fr: {
    aria: "À propos de Putri Zahara",
    nav: { label: "Navigation principale", home: "Accueil", portfolio: "Portfolio", about: "À propos", contact: "Contact", lang: "Switch the site to English" },
    page: "À propos",
    loader: {
      role: "Concept Artist & Illustratrice",
      rows: [["Fich.", "PZ_PROFIL_01"], ["Lieu.", "Lyon — FR"]],
      load: "Charg.",
      scan: "Scan", detect: "Détection visage", match: "Corresp.",
      skip: "Toucher ou cliquer pour passer",
    },
    hero: {
      hi: ["Salut !", "Moi c'est Putri..."],
      where: ["Des mondes", "dessinés à Lyon"],
      stars: ["Concept Art", "UI/UX", "Personnages", "Environnements"],
      dims: "Portrait",
      subject: "Sujet · Putri",
      alt: "Portrait en noir et blanc de Putri Zahara, le menton posé sur la main",
      role: "Concept Artist & Illustratrice",
      school: "Gaming Campus Lyon ·", year: "4ème année",
      page: "(page à propos)",
      status: ["Disponible", "Alternance & stage"],
      scroll: "Ouvrir le dossier", scrollSub: "Défiler",
    },
    file: {
      title: "FICHE SUJET — PZ-0047.dat",
      capture: "Capture · Profil",
      bio: [
        <>Étudiante internationale en <b>Arts Graphiques – Concept Art</b>, j&apos;ai toujours été passionnée par la création de mondes et de personnages pour les <b>jeux vidéo et le cinéma</b>. <b>Photoshop, Procreate et Blender</b> sont mes outils principaux pour donner vie aux concepts.</>,
        <>Que ce soit pour des <b>personnages, des environnements ou des éléments UI</b>, je trouve une grande joie dans le processus créatif, toujours à la recherche de quelque chose <span className="hl">d&apos;unique et de mémorable</span>. Je crois profondément en la force du <b>travail d&apos;équipe</b> ; les meilleures idées naissent de la collaboration.</>,
        <>Quand je ne travaille pas sur des projets, j&apos;explore d&apos;autres formes d&apos;art, regarde des films ou plonge dans les derniers jeux pour m&apos;inspirer. Mon rêve : contribuer à des projets qui laissent une <span className="hl">impression durable</span> et donnent vie à des histoires incroyables.</>,
      ],
      fields: "Champs ID",
      stats: [["Ans", "3+"], ["Projets pro", "06"], ["Outils", "03"]],
      status: "Statut",
      statusRows: ["Disponible — Alternance & stage", "Gaming Campus Lyon · 4ème année", "Lyon, France"],
      tools: "Outils",
      matches: "Résultats — ouvrir le portfolio",
      ready: "Prêt", count: "3 résultats",
    },
    rec: {
      note: "vraie reco LinkedIn",
      quote: "Putri a constamment produit un travail remarquable en suivant parfaitement les guides de style et d'identité visuelle de l'entreprise. Elle a une capacité remarquable à traduire une vision sur papier rapidement. Elle était essentielle au workflow 2D, transformant idées et références en rendus finaux que nos artistes 3D pouvaient reprendre sans friction. Ce qui distingue Putri, c'est son état d'esprit enthousiaste ; elle ne nécessite aucune microgestion et possède une excellente intuition pour savoir quand demander des retours et comment les appliquer.",
      role: "3D Environment Artist · Technical Artist — Olive Branch Interactive · traduit de l'anglais",
    },
    outro: { title: "Créons quelque chose ensemble", rights: "Tous droits réservés", legal: "Mentions légales & confidentialité" },
  },
} as const;

const MATCHES = [
  { name: "Aporion", src: "/images/Portfolio/Aporion/Harbor_thumbnail_final_obi_640.webp" },
  { name: "The Ethians Redeemed", src: "/images/Portfolio/The_Ethians_Redeemed/Concept_ville_yirie_640.webp" },
  { name: "P.S. Apocalypse", src: "/images/Portfolio/ps_apocalypse/2_640.webp" },
];

/* ── Small drawings ────────────────────────────────────────── */
function PixelFolder() {
  return (
    <svg viewBox="0 0 16 13" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M1 0h6v1h1v1h7v1h1v10H0V1h1z" fill="#1a1a1a" />
      <path d="M1 1h5v1h1v1h8v9H1z" fill="#f2d65b" />
      <path d="M1 5h14v1H1z" fill="#c9a72f" />
      <path d="M2 2h4v1H2zM2 6h12v1H2z" fill="#fff4b8" />
    </svg>
  );
}

function Warning() {
  return (
    <svg viewBox="0 0 24 21" aria-hidden="true">
      <path d="M12 1.5 23 20H1z" fill="#f6d32d" stroke="#141414" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7.5v6.5" stroke="#141414" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.3" fill="#141414" />
    </svg>
  );
}

function Cross({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
type Phase = "load" | "shrink" | "done";

export default function AboutView({ fontClass }: { fontClass: string }) {
  const { lang, toggle } = useLang();
  const { open: openContact } = useContact();
  const c = copy[lang];

  const [phase, setPhase] = useState<Phase>("load");
  const [now, setNow] = useState<Date | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const introImgRef = useRef<HTMLImageElement>(null);
  const blurRef = useRef<HTMLImageElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<() => void>(() => {});

  // Match results: one selected card (red frame + colour), first by default, follows the pointer
  const [sel, setSel] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const selFrameRef = useRef<HTMLSpanElement>(null);
  const matchImgRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prevSel = useRef(0);
  const selAnim = useRef<Animation | null>(null);

  // Live clock (intro timecode, signature)
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, []);

  // Intro: loader (CSS) → FLIP shrink into the photo slot → reveal
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setPhase("done"));
      return () => cancelAnimationFrame(raf);
    }

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    let cancelled = false;
    let running: Animation[] = [];
    const counter = countRef.current?.getAnimations()[0];

    skipRef.current = () => {
      counter?.finish();
      running.forEach((a) => a.finish());
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        skipRef.current();
      }
    };
    window.addEventListener("keydown", onKey);

    const finish = () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
    };

    (async () => {
      // 1. Wait for the loading counter, and for the sharp photo to be decoded
      await (counter?.finished.catch(() => {}) ?? Promise.resolve());
      const img = introImgRef.current;
      if (img) await Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 2500))]);
      if (cancelled) return;

      const box = boxRef.current, slot = slotRef.current;
      if (!box || !slot) { finish(); setPhase("done"); return; }

      // 2. FLIP: the full-screen photo becomes the portrait in the page
      const v = box.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      const s = Math.max(v.width / r.width, v.height / r.height);
      const dx = v.left + v.width / 2 - (r.left + r.width / 2);
      const dy = v.top + v.height / 2 - (r.top + r.height / 2);
      const ix = Math.max(0, (r.width - v.width / s) / 2);
      const iy = Math.max(0, (r.height - v.height / s) / 2);

      Object.assign(box.style, { inset: "auto", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      // Whip in, overshoot slightly smaller, snap back: the slam the impact (CSS) answers
      running = [
        box.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${s})`, clipPath: `inset(${iy}px ${ix}px)`, easing: "cubic-bezier(0.9, 0, 0.1, 1)" },
            { transform: "translate(0px, 0px) scale(0.94)", clipPath: "inset(0px 0px)", offset: 0.8, easing: "cubic-bezier(0.3, 1.8, 0.5, 1)" },
            { transform: "translate(0px, 0px) scale(1)", clipPath: "inset(0px 0px)" },
          ],
          { duration: 620, fill: "both" },
        ),
        ...(blurRef.current ? [blurRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, delay: 60, easing: "ease-out", fill: "both" })] : []),
        ...(shadeRef.current ? [shadeRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "both" })] : []),
      ];
      setPhase("shrink");

      await Promise.all(running.map((a) => a.finished.catch(() => {})));
      if (cancelled) return;
      finish();
      setPhase("done");
    })();

    return () => {
      cancelled = true;
      running.forEach((a) => a.cancel());
      finish();
    };
  }, []);

  // Scroll reveals below the hero
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.classList.add("ab-js");
    const els = main.querySelectorAll<HTMLElement>("[data-io]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Red frame on the selected match image; on change it locks on like the hero's face box
  useEffect(() => {
    const grid = gridRef.current, frame = selFrameRef.current, img = matchImgRefs.current[sel];
    if (!grid || !frame || !img) return;
    const place = () => {
      const g = grid.getBoundingClientRect(), r = img.getBoundingClientRect();
      if (!r.width) return false; // card hidden (3rd one on phones)
      Object.assign(frame.style, {
        left: `${r.left - g.left}px`, top: `${r.top - g.top}px`,
        width: `${r.width}px`, height: `${r.height}px`, opacity: "1",
      });
      return true;
    };
    if (place() && prevSel.current !== sel) {
      selAnim.current?.cancel();
      selAnim.current = frame.animate(
        [
          { transform: "scale(1.22)", opacity: 0 },
          { transform: "scale(0.97)", opacity: 1, offset: 0.45 },
          { opacity: 0.2, offset: 0.6 },
          { opacity: 1, offset: 0.72 },
          { opacity: 0.4, offset: 0.84 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 480, easing: "cubic-bezier(0.3, 0.8, 0.3, 1)" },
      );
    }
    prevSel.current = sel;
    const ro = new ResizeObserver(place);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [sel]);

  const timecode = now ? `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}` : "--:--:--";
  const hhmm = now ? `${pad2(now.getHours())}:${pad2(now.getMinutes())}` : "--:--";
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

  return (
    <main ref={mainRef} className={`ab ${fontClass}`} data-phase={phase} aria-label={c.aria}>

      {/* ════════════ INTRO ════════════ */}
      {phase !== "done" && (
        <div className="ab-intro" aria-hidden="true" onClick={() => skipRef.current()}>
          <div ref={boxRef} className="ab-intro-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={introImgRef} src={PORTRAIT} alt="" draggable={false} fetchPriority="high" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={blurRef} src={PORTRAIT_TINY} alt="" className="ab-intro-blur" draggable={false} />
            <div ref={shadeRef} className="ab-intro-shade" />
          </div>

          <div className="ab-intro-osd">
            <i /><i /><i /><i />
            <p className="ab-osd-tl"><span className="ab-rec" />REC<br />CCTV 01</p>
            <p className="ab-osd-tr">{timecode}<br />SCENE 03/05</p>
          </div>

          <div className="ab-loader">
            <p className="ld" style={d(40)}>Putri Zahara</p>
            <p className="ld" style={d(80)}>{c.loader.role}</p>
            <div className="gap" />
            {c.loader.rows.map(([k, v], i) => (
              <p key={k} className="ld row" style={d(200 + i * 60)}><span>{k}</span><span>{v}</span></p>
            ))}
            <p className="ld row" style={d(320)}><span>{c.loader.load}</span><span ref={countRef} className="ab-count" /></p>
            <div className="ld ab-bar" style={d(320)} />
            <div className="gap" />
            <p className="ld row end" style={d(480)}><span>{c.loader.scan}</span><span>03</span></p>
            <p className="ld" style={d(560)}>{c.loader.detect}<span className="ab-dots" /></p>
            <p className="ld row end" style={d(950)}><span>{c.loader.match}</span><span>PZ-0047 ✓</span></p>
          </div>

          <p className="ab-intro-skip">{c.loader.skip}</p>
        </div>
      )}

      {/* ════════════ HERO ════════════ */}
      <section className="ab-hero">

        {/* Pen scribbles (Padilla) */}
        <svg className="ab-scribble" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="ab-stroke rv rv-draw" style={{ ...d(1700), "--rv-dur": "1.6s" } as CSSProperties} pathLength={1} vectorEffect="non-scaling-stroke"
            stroke="#6f8fe8" strokeWidth="1" opacity="0.45"
            d="M14 70 C 16 72, 13 74, 16 77 C 18 79, 15 82, 18 84" />
        </svg>

        {/* Top bar */}
        <header className="ab-top">
          <Link href="/" className="ab-logo rv rv-down" style={d(60)} aria-label={c.nav.home}>
            Putri Zahara
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.8l6-.7z" fill="#ffe14d" stroke="#141414" strokeWidth="1.3" strokeLinejoin="round" /></svg>
          </Link>

          {/* Page name, handwritten and circled in pen */}
          <p className="ab-page" aria-hidden="true">
            <span className="ab-hand rv rv-write" style={{ ...d(140), "--rv-dur": "0.9s" } as CSSProperties}>{c.page}</span>
            <svg viewBox="0 0 108 38" preserveAspectRatio="none">
              <path className="ab-stroke rv rv-draw" style={d(700)} pathLength={1} vectorEffect="non-scaling-stroke" stroke="#1d2bd9" strokeWidth="1.5"
                d="M10 24 C 2 12, 28 3, 58 3 C 90 3, 106 12, 102 22 C 98 33, 62 37, 36 35 C 14 33, 4 27, 14 13" />
            </svg>
          </p>

          <nav className="ab-nav" aria-label={c.nav.label}>
            <Link href="/" className="ab-btn rv rv-down" style={d(160)}>{c.nav.home}</Link>
            <Link href="/portfolio" className="ab-btn rv rv-down" style={d(230)}>{c.nav.portfolio}</Link>
            <Link href="/about" aria-current="page" className="ab-btn rv rv-down" style={d(300)}>{c.nav.about}</Link>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="ab-btn rv rv-down" style={d(370)}>LinkedIn</a>
            <button type="button" onClick={openContact} className="ab-btn rv rv-down" style={d(440)}>{c.nav.contact}</button>
            <button type="button" onClick={toggle} className="ab-lang rv rv-down" style={d(500)} aria-label={c.nav.lang}>{lang === "en" ? "FR" : "EN"}</button>
          </nav>
        </header>

        {/* Photo + collage */}
        <div ref={slotRef} className="ab-photo">
          <div className="ab-band rv" style={{ ...d(0), "--rv-dur": "1s" } as CSSProperties} aria-hidden="true" />
          <div className="ab-ghost ab-ghost-l rv rv-ghost-l" style={d(150)} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" draggable={false} />
          </div>
          <div className="ab-ghost ab-ghost-r rv rv-ghost-r" style={d(150)} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" draggable={false} />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PORTRAIT} alt={c.hero.alt} className="ab-photo-img" draggable={false} />
          <div className="ab-scan rv" style={d(200)} aria-hidden="true" />

          {/* Face detection */}
          <div className="ab-box ab-box-red rv rv-lock" style={d(250)} aria-hidden="true">
            <span className="ab-id">ID 00000047</span>
          </div>
          <div className="ab-box ab-box-blue rv rv-lock" style={d(480)} aria-hidden="true">
            <span className="ab-tag rv rv-wipe" style={d(820)}>{c.hero.subject}</span>
          </div>
          <span className="ab-eye rv rv-pop" style={{ ...d(950), left: "46%", top: "40.2%" }} aria-hidden="true"><Cross color="#fff" /></span>
          <span className="ab-eye rv rv-pop" style={{ ...d(1030), left: "57.9%", top: "44%" }} aria-hidden="true"><Cross color="#fff" /></span>
          <svg className="ab-link-line" aria-hidden="true">
            <line className="ab-stroke rv rv-draw only-d" style={{ ...d(1000), "--rv-dur": "0.6s" } as CSSProperties} pathLength={1} x1="69%" y1="25%" x2="137%" y2="58%" stroke="#1d2bd9" strokeWidth="1.6" />
            <line className="ab-stroke rv rv-draw only-m" style={{ ...d(1000), "--rv-dur": "0.6s" } as CSSProperties} pathLength={1} x1="69%" y1="25%" x2="108%" y2="66%" stroke="#1d2bd9" strokeWidth="1.6" />
          </svg>
          <div className="ab-zoom rv rv-wipe" style={{ ...d(1450), backgroundImage: `url(${PORTRAIT})` }} aria-hidden="true">
            <span className="ab-zoom-label">#PZ0047</span>
          </div>
          <svg className="ab-cursor rv rv-cursor" style={d(1700)} viewBox="0 0 12 19" aria-hidden="true">
            <path d="M.5.5v15.6l3.8-3.7 2.6 6 2.4-1-2.6-5.9h5.3z" fill="#fff" stroke="#141414" strokeWidth="1" strokeLinejoin="round" />
          </svg>

          {/* Star labels */}
          {c.hero.stars.map((label, i) => (
            <span key={label} className={`ab-star ab-star-${i + 1}`}>
              <span className="ab-star-in rv rv-pop" style={d(560 + i * 110)}>
                {label}<b aria-hidden="true">★</b>
              </span>
            </span>
          ))}

          {/* Handwriting */}
          <p className="ab-hand ab-hi rv rv-write" style={d(700)}>{c.hero.hi.map((l, i) => <span key={l}>{i > 0 && <br />}{l}</span>)}</p>
          <p className="ab-hand ab-where rv rv-write" style={{ ...d(1100), "--rv-dur": "1.3s" } as CSSProperties} aria-hidden="true">
            {c.hero.where[0]}<br />{c.hero.where[1]}
          </p>
          <div className="ab-dims" aria-hidden="true">
            <span className="ab-hand rv rv-write" style={d(650)}>{c.hero.dims}</span>
            <svg viewBox="0 0 120 14">
              <path className="ab-stroke rv rv-draw" style={d(800)} pathLength={1} stroke="#141414" strokeWidth="1.3" d="M1 2v10M1 7h18M27 7h18M53 7h18M79 7h18M105 7h13M112 3l6 4-6 4" />
            </svg>
            <span className="ab-hand boxed rv rv-write" style={d(1050)}>1024×1280</span>
            <span className="ab-hand rv rv-write" style={d(1250)}>(PZ_01)</span>
          </div>

          {/* Name label + role */}
          <div className="ab-under">
            <svg className="ab-arrow" viewBox="0 0 86 64" aria-hidden="true">
              <path className="ab-stroke rv rv-draw" style={d(1150)} pathLength={1} stroke="#141414" strokeWidth="1.4"
                d="M8 4 C 2 24, 14 46, 46 50 C 58 52, 70 50, 80 46 M70 39 L81 46 L71 54" />
            </svg>
            <h1 className="ab-name rv rv-tilt" style={d(420)}>
              <span className="ab-tape ab-tape-l" aria-hidden="true" />
              Putri Zahara
              <span className="ab-tape ab-tape-r" aria-hidden="true" />
            </h1>
            <p className="ab-role rv rv-rise" style={d(620)}>
              {c.hero.role}
              <svg viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden="true">
                <path className="ab-stroke rv rv-draw" style={d(1250)} pathLength={1} vectorEffect="non-scaling-stroke" stroke="#141414" strokeWidth="1.3" d="M1 5 C 22 1, 40 7, 62 4 S 100 2, 119 5" />
              </svg>
            </p>
            <p className="ab-school rv rv-rise" style={d(740)}>
              {c.hero.school}{" "}
              <span className="circled">
                {c.hero.year}
                <svg viewBox="0 0 108 38" preserveAspectRatio="none" aria-hidden="true">
                  <path className="ab-stroke rv rv-draw" style={d(1400)} pathLength={1} vectorEffect="non-scaling-stroke" stroke="#141414" strokeWidth="1.3"
                    d="M10 24 C 2 12, 28 3, 58 3 C 90 3, 106 12, 102 22 C 98 33, 62 37, 36 35 C 14 33, 4 27, 14 13" />
                </svg>
              </span>
            </p>
          </div>

          <div className="ab-sign" aria-hidden="true">
            <span className="ab-hand rv rv-write" style={d(1500)}>Putri Z.</span>
            <small className="rv rv-write" style={d(1800)} suppressHydrationWarning>{hhmm}. {c.hero.page}</small>
          </div>
        </div>

        {/* Bottom-left: status + folders (CCTV) */}
        <p className="ab-status rv rv-rise" style={d(1000)}>
          <Warning />
          <span><b>{c.hero.status[0]}</b><br />{c.hero.status[1]}</span>
        </p>
        <div className="ab-folders">
          <Link href="/portfolio" className="ab-folder rv rv-pop" style={d(1100)}><PixelFolder />Portfolio</Link>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="ab-folder rv rv-pop" style={d(1180)}><PixelFolder />LinkedIn</a>
        </div>

        {/* Bottom-right: scroll cue */}
        <div className="ab-scene rv rv-rise" style={d(1600)}>
          <a href="#file" className="ab-scroll">
            <span className="ab-hand">{c.hero.scroll}</span>
            <span className="ab-mono"><i aria-hidden="true">↓</i> {c.hero.scrollSub}</span>
          </a>
        </div>
      </section>

      {/* ════════════ FILE ════════════ */}
      <div className="ab-file-wrap" id="file">
        <section className="ab-win" data-io aria-labelledby="ab-file-title">
          <div className="ab-win-title">
            <h2 id="ab-file-title">{c.file.title}</h2>
            <span className="ab-win-btns" aria-hidden="true"><span>_</span><span>□</span><span>×</span></span>
          </div>

          <div className="ab-win-body">
            <div className="ab-group">
              <h3 className="ab-legend">{c.file.capture}</h3>
              <div className="ab-sunken ab-bio">
                {c.file.bio.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
              <div className="ab-group">
                <h3 className="ab-legend">{c.file.fields}</h3>
                <dl className="ab-fields">
                  {c.file.stats.map(([k, v], i) => (
                    <div key={k} className="ab-field">
                      <dt>{i + 1} · {k}</dt>
                      <dd className="ab-sunken">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="ab-group">
                <h3 className="ab-legend">{c.file.status}</h3>
                <div className="ab-kv">
                  <div><Warning /><b>{c.file.statusRows[0]}</b></div>
                  <div><span aria-hidden="true" style={{ width: 18, textAlign: "center" }}>▸</span>{c.file.statusRows[1]}</div>
                  <div><span aria-hidden="true" style={{ width: 18, textAlign: "center" }}>▸</span>{c.file.statusRows[2]}</div>
                </div>
              </div>

              <div className="ab-group">
                <h3 className="ab-legend">{c.file.tools}</h3>
                <ul className="ab-tools">
                  {TOOLS.map((t) => <li key={t} className="ab-sunken">{t}</li>)}
                </ul>
              </div>
            </div>

            <div className="ab-group ab-matches" data-io style={d(150)}>
              <h3 className="ab-legend">{c.file.matches}</h3>
              <div ref={gridRef} className="ab-match-grid">
                {MATCHES.map((m, i) => (
                  <Link key={m.name} href="/portfolio" className={`ab-match${sel === i ? " is-sel" : ""}`}
                    onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)}>
                    <span className="ab-match-id"><span>{i + 1} · ID</span><span className="ab-sunken">{`0000000${i + 1}`}</span></span>
                    <span ref={(el) => { matchImgRefs.current[i] = el; }} className="ab-match-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.src} alt="" loading="lazy" draggable={false} />
                    </span>
                    <span className="ab-match-name">{m.name}</span>
                  </Link>
                ))}
                <span ref={selFrameRef} className="ab-match-sel" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="ab-win-statusbar" aria-hidden="true">
            <span className="ab-sunken">{c.file.ready}</span>
            <span className="ab-sunken">{c.file.count}</span>
            <span className="ab-sunken">PZ-0047</span>
          </div>
        </section>
      </div>

      {/* ════════════ RECOMMENDATION ════════════ */}
      <div className="ab-rec-wrap" data-io>
        <p className="ab-hand ab-note-ann" aria-hidden="true">
          {c.rec.note} ✓
          <svg viewBox="0 0 48 38"><path className="ab-stroke" stroke="#141414" strokeWidth="1.4" d="M42 4 C 26 6, 12 14, 9 33 M3 25 L9 34 L16 26" /></svg>
        </p>
        <figure className="ab-note">
          <span className="ab-tape ab-tape-l" aria-hidden="true" />
          <span className="ab-tape ab-tape-r" aria-hidden="true" />
          <blockquote>“{c.rec.quote}”</blockquote>
          <figcaption><b>Jasper Ising</b><span>{c.rec.role}</span></figcaption>
        </figure>
      </div>

      {/* ════════════ OUTRO ════════════ */}
      <footer className="ab-outro" data-io>
        <p className="ab-hand">{c.outro.title} →</p>
        <div className="ab-outro-ctas">
          <button type="button" onClick={openContact} className="ab-btn">{c.nav.contact}</button>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="ab-btn">LinkedIn</a>
          <Link href="/portfolio" className="ab-btn">{c.nav.portfolio}</Link>
        </div>
        <div className="ab-foot">
          <span>© {new Date().getFullYear()} Putri Zahara — {c.outro.rights}</span>
          <Link href="/legal">{c.outro.legal}</Link>
        </div>
      </footer>
    </main>
  );
}
