"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ── Data ── */
type Project = {
  num: string;
  title: string;
  category: string;
  type: string;
  year: string;
  tools: string;
  role: string;
  description: string;
  thumbnail: string;
  images: string[];
  client?: string;
  deliverables?: string;
};

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "Cuisine Royale",
    category: "Game · Mobile & PC",
    type: "Game Art",
    year: "2024",
    tools: "Photoshop · Illustrator",
    role: "Concept Artist · UI Designer",
    description:
      "Mobile & PC cooking game inspired by iliko-style casual games. UI design, game screens and visual identity.",
    thumbnail: "/images/Portfolio/cuisine-royale/thumbnail_1920.webp",
    images: [
      "/images/Portfolio/cuisine-royale/screen-menu_1920.webp",
      "/images/Portfolio/cuisine-royale/screen-reveal_1920.webp",
      "/images/Portfolio/cuisine-royale/screen-gameplay_1920.webp",
      "/images/Portfolio/cuisine-royale/screen-regles_1920.webp",
      "/images/Portfolio/cuisine-royale/screen-felicitations_1920.webp",
      "/images/Portfolio/cuisine-royale/screen-termine_1920.webp",
    ],
  },
  {
    num: "02",
    title: "Aporion",
    category: "Game · Environment Art",
    type: "Environment Design",
    year: "2023",
    tools: "Photoshop · Blender",
    role: "Concept Artist",
    description:
      "Environment and architectural concept art for an indie fantasy game. Focus on medieval towns, castles and atmospheric lighting.",
    thumbnail: "/images/Portfolio/Aporion/thumbnail_1920.webp",
    images: [
      "/images/Portfolio/Aporion/thumbnail_1920.webp",
      "/images/Portfolio/Aporion/riiver_town_city_obi_final_1920.webp",
      "/images/Portfolio/Aporion/castle_final_1920.webp",
      "/images/Portfolio/Aporion/1_1920.webp",
      "/images/Portfolio/Aporion/2_1920.webp",
      "/images/Portfolio/Aporion/3_1920.webp",
      "/images/Portfolio/Aporion/4_1920.webp",
    ],
  },
  {
    num: "03",
    title: "The Ethians Redeemed",
    category: "Game · Full Production",
    type: "Production Design",
    client: "End-of-year project",
    year: "2024 – 2025",
    role: "Concept Artist & Game Designer",
    deliverables: "Character Designs · Environment Concepts · UI",
    tools: "Photoshop · Blender",
    description:
      "A concept art project for video game RPG, neo-medieval where the slave, Demetrius, rises and fights against the cruel empire.",
    thumbnail: "/images/title/titletitre_1920.webp",
    images: [
      "/images/Portfolio/The_Ethians_Redeemed/gate_capital_yirie_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/camp_du_travail_keyframe_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/key_frame_base_camp_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/set_design_camp_travail_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Carte_3D_camp_de_travaille_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/procesuce_creation_camp_de_travaill_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/dug_out_house_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/set_design_dug_out_house_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Concept_ville_yirie_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/gate_capital_yirie_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/design_dome_yirie_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/design_yirie_banner_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/set_design_yirie_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_recherche_yirie_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Concept_chateau_de_ether_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_set_design_ether_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/plnche_recherche_ether_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Props_ether_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Concept_chateau_de_vulkan_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_castle_vulkan_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_de_recherche_vulkan_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Props_vulcan_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/Concept_village_demetrius_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_perso_dimi_new_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/processuce_creation_demetrius_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_perso_haikal_new_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_de_vetement_haikal_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_perso_ellis_new_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/recherche_ellis_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_de_vetement_elis_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_perso_hades_new_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_de_vetement_hades_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_perso_milo_new_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_de_vetement_milo_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_de_vetement_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_props_forest_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/planche_props_slave_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/carte_monde_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/concept_UIX_jeux_1920.webp",
      "/images/Portfolio/The_Ethians_Redeemed/ui_icons_1920.webp",
    ],
  },
  {
    num: "04",
    title: "P.S. Apocalypse",
    category: "Concept Art · Publishing",
    type: "Graphic Novel",
    year: "2023",
    tools: "Photoshop",
    role: "Illustrator · Art Director",
    description:
      "Visual development for a graphic novel set in post-apocalyptic New York. Cover design, character concepts and environment mood boards.",
    thumbnail: "/images/Portfolio/ps_apocalypse/1_1920.webp",
    images: [
      "/images/Portfolio/ps_apocalypse/2_1920.webp",
      "/images/Portfolio/ps_apocalypse/3_1920.webp",
      "/images/Portfolio/ps_apocalypse/4_1920.webp",
    ],
  },
  {
    num: "05",
    title: "Tower Defense",
    category: "Game · Prop Design",
    type: "Game Art",
    year: "2024",
    tools: "Photoshop · Illustrator",
    role: "Concept Artist",
    description:
      "Seasonal tower and prop design for a strategy tower-defense game. Four distinct seasonal themes with a cohesive visual language.",
    thumbnail: "/images/Portfolio/Tower_defense_game/WORKSHOP_BATTLE_CHESS_1_1920.webp",
    images: [
      "/images/Portfolio/Tower_defense_game/general_view_1920.webp",
      "/images/Portfolio/Tower_defense_game/Tower_Summer_1920.webp",
      "/images/Portfolio/Tower_defense_game/Tower_Automne_1920.webp",
      "/images/Portfolio/Tower_defense_game/Tower_Winter_1920.webp",
      "/images/Portfolio/Tower_defense_game/Props_1920.webp",
    ],
  },
  {
    num: "06",
    title: "Sleeping Honey Beauty",
    category: "Illustration · Book",
    type: "Children's Book",
    year: "2023",
    tools: "Photoshop · Illustrator",
    role: "Illustrator · Author",
    description:
      "La Belle aux Miel Dormant — an illustrated children's book retelling Sleeping Beauty through the world of bees, honey and enchanted meadows.",
    thumbnail: "/images/Book/couverture_1920.webp",
    images: [
      "/images/Book/couverture_1920.webp",
      "/images/Book/pagedossynopsis_1920.webp",
      "/images/Book/page1_1920.webp",
      "/images/Book/page2_1920.webp",
      "/images/Book/page3_1920.webp",
      "/images/Book/page4_1920.webp",
      "/images/Book/page5_1920.webp",
      "/images/Book/page6_1920.webp",
      "/images/Book/page7_1920.webp",
      "/images/Book/page8_1920.webp",
      "/images/Book/page9_1920.webp",
    ],
  },
  {
    num: "07",
    title: "Other Works",
    category: "Illustration · Various",
    type: "Mixed",
    year: "2022 – 2024",
    tools: "Photoshop · ZBrush",
    role: "Illustrator",
    description:
      "A collection of personal projects, fan art, character studies and experimental illustrations spanning several years of practice.",
    thumbnail: "/images/Portfolio/Other_works/Fallout_fanart/Zahara_Putri_AG4_Fallout_environnement_1920.webp",
    images: [
      "/images/Portfolio/Other_works/Fallout_fanart/Zahara_Putri_AG4_Fallout_environnement_1920.webp",
      "/images/Portfolio/Other_works/Concept_monstes/compilation_concepts_1920.webp",
      "/images/Portfolio/Other_works/Gnomes/gnome_recherche_1920.webp",
      "/images/Portfolio/Other_works/Gnomes/volume_1_1920.webp",
      "/images/Portfolio/Other_works/Marchant_ambulant/Recherche_chariot_1920.webp",
      "/images/Portfolio/Other_works/building/1E1A1C08-ED86-407D-A752-0091CA984F94_1920.webp",
    ],
  },
  {
    num: "08",
    title: "Lumi",
    category: "Branding · Packaging",
    type: "Brand Identity",
    year: "2024",
    tools: "Photoshop · Illustrator",
    role: "Brand Designer · Art Director",
    description:
      "Brand identity for Lumi — a plant-based reimagining of traditional Japanese taiyaki. Logo, packaging system, color palette and full brand book.",
    thumbnail: "/images/Lumi/thumbnail.webp",
    images: [
      "/images/Lumi/Desktop-2.webp",
      "/images/Lumi/thumbnail.webp",
      "/images/Lumi/titre.webp",
    ],
  },
];

/* ── Grid lines ── */
function GridLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent calc(100% / 12))",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   SLIDER VIEW  — Expandable Card Carousel
   Active card expands + stays centered.
   Others are narrow strips, always visible.
───────────────────────────────────────────── */
const INACTIVE_W = 120; /* px — collapsed card width              */
const CARD_GAP   = 8;   /* px — gap-2 between cards               */
const ACTIVE_VW  = 0.36; /* fraction of outerRef width for active  */

function SliderView({
  projects,
  activeIdx,
  onPrev,
  onNext,
  onSetIdx,
  onOpen,
}: {
  projects: Project[];
  activeIdx: number;
  onPrev: () => void;
  onNext: () => void;
  onSetIdx: (i: number) => void;
  onOpen: () => void;
}) {
  const n      = projects.length;
  const active = projects[activeIdx];

  const navRef    = useRef<HTMLElement>(null);
  const outerRef  = useRef<HTMLDivElement>(null); /* overflow-hidden container */
  const innerRef  = useRef<HTMLDivElement>(null); /* flex strip — GSAP translates */
  const bottomRef = useRef<HTMLDivElement>(null);
  const wheelRef  = useRef(0);

  /* translateX so card at `idx` is centered inside outerRef */
  const getX = useCallback((idx: number): number => {
    const outer = outerRef.current;
    if (!outer) return 0;
    const activeW           = ACTIVE_VW * outer.offsetWidth;
    const activeCenterInRow = idx * (INACTIVE_W + CARD_GAP) + activeW / 2;
    return outer.offsetWidth / 2 - activeCenterInRow;
  }, []);

  /* ── BEFORE PAINT: position strip at correct x ──
     opacity:0 is already in JSX so SSR HTML is invisible.
     Only x needs to be set here — no flash possible.      */
  useLayoutEffect(() => {
    if (innerRef.current) gsap.set(innerRef.current, { x: getX(activeIdx) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── AFTER PAINT: stagger entrance ── */
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const cards = Array.from(inner.children as HTMLCollectionOf<HTMLElement>);

    /* Bottom bar children: [left-span, center-div, right-span] */
    const bottomKids = bottomRef.current
      ? Array.from(bottomRef.current.children as HTMLCollectionOf<HTMLElement>)
      : [];

    /* Nav children: [← Home, center-div, Contact] */
    const navKids = navRef.current
      ? Array.from(navRef.current.children as HTMLCollectionOf<HTMLElement>)
      : [];

    /* Set children to from-state, then reveal parent — no flash */
    gsap.set(cards,          { opacity: 0, y: 70, scale: 0.95 });
    gsap.set(navRef.current, { opacity: 1 }); /* nav parent always visible */
    if (navKids[0]) gsap.set(navKids[0], { opacity: 0, x: -28, filter: "blur(5px)" });
    if (navKids[1]) gsap.set(navKids[1], { opacity: 0, y: -14, scale: 0.92 });
    if (navKids[2]) gsap.set(navKids[2], { opacity: 0, x:  28, filter: "blur(5px)" });
    /* Bottom bar: hide individually so parent stays in layout flow */
    if (bottomKids[0]) gsap.set(bottomKids[0], { opacity: 0, x: -22 });
    if (bottomKids[1]) gsap.set(bottomKids[1], { opacity: 0, y: 14, scale: 0.96 });
    if (bottomKids[2]) gsap.set(bottomKids[2], { opacity: 0, x:  22 });
    gsap.set(inner, { opacity: 1 }); /* parent visible, children still hidden */

    const ctx = gsap.context(() => {
      /* Nav: ← Home + Contact converge from sides, center drops from above */
      const nDelay = 0.06;
      if (navKids[0]) gsap.to(navKids[0], {
        opacity: 1, x: 0, filter: "blur(0px)",
        duration: 0.72, ease: "power3.out", delay: nDelay,
        clearProps: "transform,opacity,filter",
      });
      if (navKids[1]) gsap.to(navKids[1], {
        opacity: 1, y: 0, scale: 1,
        duration: 0.78, ease: "power3.out", delay: nDelay + 0.04,
        clearProps: "transform,opacity",
      });
      if (navKids[2]) gsap.to(navKids[2], {
        opacity: 1, x: 0, filter: "blur(0px)",
        duration: 0.72, ease: "power3.out", delay: nDelay,
        clearProps: "transform,opacity,filter",
      });
      gsap.to(cards, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.75, ease: "power3.out",
        stagger: { each: 0.06, from: "start" },
        delay: 0.15,
        clearProps: "transform,opacity",
      });
      /* Bottom: left ← center ↑ right → converge at same time */
      const bDelay = 0.68;
      if (bottomKids[0]) gsap.to(bottomKids[0], {
        opacity: 1, x: 0, duration: 0.55, ease: "power3.out", delay: bDelay,
        clearProps: "transform,opacity",
      });
      if (bottomKids[1]) gsap.to(bottomKids[1], {
        opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", delay: bDelay + 0.05,
        clearProps: "transform,opacity",
      });
      if (bottomKids[2]) gsap.to(bottomKids[2], {
        opacity: 1, x: 0, duration: 0.55, ease: "power3.out", delay: bDelay,
        clearProps: "transform,opacity",
      });
    });
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-center whenever activeIdx changes */
  useLayoutEffect(() => {
    gsap.to(innerRef.current, { x: getX(activeIdx), duration: 0.65, ease: "power3.inOut" });
  }, [activeIdx, getX]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelRef.current < 700) return;
    wheelRef.current = now;
    if (e.deltaY > 30) onOpen();
  }, [onOpen]);

  return (
    <main
      className="h-screen w-screen overflow-hidden bg-black flex flex-col"
      onWheel={handleWheel}
    >
      <GridLines />

      {/* NAV */}
      <nav ref={navRef} className="relative z-10 flex items-center justify-between px-10 py-5 flex-shrink-0">
        <Link href="/" className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-70 hover:opacity-100 transition-opacity">
          ← Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex gap-[3px] items-center">
            {projects.map((_, i) => (
              <div key={i} className="h-px transition-all duration-500" style={{
                width:      i === activeIdx ? "28px" : "14px",
                background: i === activeIdx ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)",
              }} />
            ))}
          </div>
          <span className="text-[11px] font-mono tracking-[0.2em] text-white/40">
            {active.num} / {String(n).padStart(2, "0")}
          </span>
        </div>
        <button className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer">
          Contact
        </button>
      </nav>

      {/* Outer: clips overflow, reference for centering math */}
      <div
        ref={outerRef}
        className="relative z-10 flex-1 flex items-center overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 82%, transparent 100%)",
        }}
      >

        {/* Inner strip: GSAP translates this to center active card */}
        <div ref={innerRef} className="flex items-center flex-shrink-0" style={{ gap: `${CARD_GAP}px`, opacity: 0 }}>
          {projects.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={p.num}
                onClick={() => isActive ? onOpen() : onSetIdx(i)}
                className="relative flex-shrink-0 overflow-hidden cursor-pointer group"
                style={{
                  width:      isActive ? `${ACTIVE_VW * 100}vw` : `${INACTIVE_W}px`,
                  height:     isActive ? "74vh" : "62vh",
                  transition: "width 0.65s cubic-bezier(0.77,0,0.175,1), height 0.65s cubic-bezier(0.77,0,0.175,1)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbnail} alt={p.title} draggable={false}
                  className="w-full h-full object-cover"
                  style={{
                    filter:     isActive ? "brightness(0.88)" : "grayscale(0.55) brightness(0.32)",
                    transition: "filter 0.55s ease",
                  }}
                />

                {/* Active: gradient + title overlay */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <p className="text-white/45 text-[9px] font-mono tracking-[0.32em] uppercase mb-3">
                        {p.num} · {p.category}
                      </p>
                      <h2
                        className="text-white font-black uppercase leading-[0.88] tracking-[-0.02em]"
                        style={{ fontSize: "clamp(24px, 3vw, 48px)" }}
                      >
                        {p.title}
                      </h2>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "rgba(255,255,255,0.03)" }} />
                  </>
                )}

                {/* Inactive: vertical index */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-white/20 text-[8px] font-mono tracking-[0.4em] uppercase select-none"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {p.num}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll-to-open hint — sits below active thumbnail, never on it */}
      <div className="relative z-10 flex items-center justify-center -mt-24 pb-12 flex-shrink-0 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-white text-[11px] font-bold font-mono tracking-[0.35em] uppercase">
            Scroll
          </span>
          <span
            className="text-white text-[15px] font-bold leading-none"
            style={{ animation: "scroll-hint-arrow 1.4s ease-in-out infinite" }}
          >
            ↓
          </span>
          <span className="text-white text-[11px] font-bold font-mono tracking-[0.35em] uppercase">
            to open
          </span>
        </div>
        <style jsx>{`
          @keyframes scroll-hint-arrow {
            0%, 100% { transform: translateY(0); opacity: 0.9; }
            50%      { transform: translateY(4px); opacity: 1; }
          }
        `}</style>
      </div>

      {/* Bottom bar */}
      <div
        ref={bottomRef}
        className="relative z-10 grid items-center px-10 py-5 flex-shrink-0"
        style={{ gridTemplateColumns: "1fr auto 1fr" }}
      >
        {/* Left — project type */}
        <span className="justify-self-start text-white/40 text-[9px] font-mono tracking-[0.3em] uppercase">{active.type}</span>

        {/* Center — interaction hints */}
        <div className="justify-self-center flex items-center gap-5">
          {/* Navigate */}
          <div className="flex items-center gap-2">
            {["Q", "D"].map((k, i) => (
              <div key={k} className="flex items-center gap-1.5">
                <span
                  className="font-mono text-[10px] text-white/70 leading-none"
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)",
                    padding: "3px 7px",
                    borderRadius: "3px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  {k}
                </span>
                {i === 0 && <span className="text-white/30 text-[10px]">·</span>}
              </div>
            ))}
            <span className="text-white/45 text-[9px] font-mono tracking-[0.2em] uppercase ml-1">Navigate</span>
          </div>

        </div>

        {/* Right — year */}
        <span className="justify-self-end text-white/40 text-[9px] font-mono tracking-[0.3em] uppercase">{active.year}</span>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   iPhone 3D model component (React Three Fiber)
───────────────────────────────────────────── */
function IPhoneModel({
  phase,
  screenIdx,
  hoverTiltRef,
}: {
  phase: number;
  screenIdx: number;
  hoverTiltRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/asset3D/scene.gltf");
  const baseYRef = useRef(0);

  /* ── 1. Scale + center the model, set initial rotation ── */
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 2.8 / Math.max(size.x, size.y, size.z);
    g.scale.setScalar(scale);
    g.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    g.rotation.y = -0.78;
    g.rotation.x =  0.08;
    baseYRef.current = g.position.y;
  }, [scene]);

  /* ── 2. Screen setup ────────────────────────────────────────────────────
     MeshBasicMaterial = 100 % non-éclairé : zéro diffuse, zéro IBL,
     zéro emissive — la texture s'affiche exactement comme dans Photoshop.
     On remplace le matériau uniquement sur le mesh d'écran (Object_40,
     dans le groupe Screen_16) sans toucher aux autres meshes Display.
     Glass_screen reçoit une transparence légère pour l'effet reflet verre. */
  const displayMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    displayMatRef.current = null;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats: THREE.Material[] = Array.isArray(child.material)
        ? child.material : [child.material];

      /* Glass_screen = bordure noire opaque autour de l'écran — on ne
         modifie rien, elle s'affiche telle quelle depuis le GLTF.    */

      /* Screen mesh : Object_40.001 après re-export Blender.
         Fallback : n'importe quel mesh avec UV coords (TEXCOORD_0). */
      const isScreen = child.name === "Object_40.001"
        || (child.geometry.attributes.uv && !displayMatRef.current);

      if (isScreen && !displayMatRef.current) {
        const basicMat = new THREE.MeshBasicMaterial({
          color: 0x111111,
          side:  THREE.DoubleSide,
        });
        child.material        = basicMat;
        displayMatRef.current = basicMat;
      }
    });
  }, [scene]);

  /* ── 3. Swap screenshot texture when screenIdx changes ── */
  useEffect(() => {
    const mat = displayMatRef.current;
    if (!mat) return;
    new THREE.TextureLoader().load(
      CUISINE_SCREENS_R3F[screenIdx],
      (tex) => {
        tex.flipY      = false;                  /* Blender/GLTF : UV origin bottom-left */
        tex.colorSpace = THREE.SRGBColorSpace;   /* sRGB screenshots → couleurs fidèles  */
        mat.map        = tex;
        mat.color.setHex(0xffffff);
        mat.needsUpdate = true;
      },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, screenIdx]);

  /* ── 4. Phase animation + hover tilt ──
     No levitation — phone stays fixed.
     Hover tilt: smooth tilt follows mouse, snaps back when cursor leaves. */
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const hover = hoverTiltRef.current;
    const tY = (phase === 0 ? -0.78 : 0) + hover.y;
    const tX = (phase === 0 ?  0.08 : 0) + hover.x;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, tY, delta * 4);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tX, delta * 4);
    g.position.y = THREE.MathUtils.lerp(g.position.y, baseYRef.current, delta * 5);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* preload so model is ready before CuisineRoyaleView mounts */
useGLTF.preload("/asset3D/scene.gltf");

/* ─────────────────────────────────────────────
   CUISINE ROYALE VIEW — iPhone 17 3D scroll experience
   Scroll phase 0 : iPhone appears at 3/4 angle
   Scroll phase 1 : iPhone pivots to face-on
   Scroll phase 2+: game screenshots cycle inside the screen
───────────────────────────────────────────── */
/* Used both by the R3F component (texture preload) and the legacy fallback */
const CUISINE_SCREENS_R3F = [
  "/images/Portfolio/cuisine-royale/screen-menu_1920.webp",
  "/images/Portfolio/cuisine-royale/screen-reveal_1920.webp",
  "/images/Portfolio/cuisine-royale/screen-gameplay_1920.webp",
  "/images/Portfolio/cuisine-royale/screen-regles_1920.webp",
  "/images/Portfolio/cuisine-royale/screen-felicitations_1920.webp",
  "/images/Portfolio/cuisine-royale/screen-termine_1920.webp",
];
const CUISINE_SCREENS = CUISINE_SCREENS_R3F; /* alias kept for other code */

/* ── Per-screen descriptive text ── */
const SCREEN_TEXTS = [
  {
    title: "Menu Principal",
    desc:  "L'écran d'entrée présente l'univers culinaire royal du jeu. Le joueur découvre le gain maximum et peut lancer un tirage ou consulter les règles.",
  },
  {
    title: "Révélation",
    desc:  "Le plat gagnant est dévoilé avec une animation de cloche soulevée. Le montant du gain s'affiche en grand sur une bannière dorée, avec les options pour continuer ou revenir au menu.",
  },
  {
    title: "Gameplay",
    desc:  "Une grille 3×3 de plats couverts à gratter un par un. Les mises de 2 €, 4 € ou 6 € ajustent la cagnotte. Un compteur affiche les grattages restants, avec un bouton « Révéler » pour tout découvrir.",
  },
  {
    title: "Règles du Jeu",
    desc:  "Une fenêtre règles s'affiche sur un panneau en bois chaleureux. Le joueur peut lire le fonctionnement de la mécanique de grattage avant de miser.",
  },
  {
    title: "Félicitations",
    desc:  "L'écran gagnant explose de confettis et d'étoiles. Le gain est confirmé en grande typographie dorée, avec des appels à l'action clairs pour rejouer ou revenir au menu.",
  },
  {
    title: "Partie Terminée",
    desc:  "Sans gain, le joueur voit un écran sobre avec son résultat et une invitation à réessayer — le ton reste léger pour encourager une nouvelle partie.",
  },
];

function CuisineRoyaleView({ project, onClose }: { project: Project; onClose: () => void }) {
  /* phase 0 = 3/4 view · 1 = face-on · 2 = image cycling */
  const [phase,     setPhase]     = useState(0);
  const [screenIdx, setScreenIdx] = useState(0);

  /* displayIdx lags screenIdx by one animation cycle so text swaps mid-fade */
  const [displayIdx, setDisplayIdx] = useState(0);

  const navRef        = useRef<HTMLElement>(null);
  const phoneRef      = useRef<HTMLDivElement>(null);
  const infoRef       = useRef<HTMLDivElement>(null);
  const hintRef       = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const textPanelRef  = useRef<HTMLDivElement>(null);
  const textTitleRef  = useRef<HTMLHeadingElement>(null);
  const textDescRef   = useRef<HTMLParagraphElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  const wheelRef      = useRef(0);
  const mountTime     = useRef(Date.now());
  const closingRef    = useRef(false);
  const touchStartY   = useRef(0);

  /* hover tilt data passed into R3F without causing re-renders */
  const hoverTiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Entrance — use gsap.context() so StrictMode double-mount is safe ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(phoneRef.current,
        { opacity: 0, y: 55, scale: 0.93, filter: "blur(7px)" },
        { opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)", duration: 1.1, ease: "power3.out", delay: 0.05, clearProps: "filter,transform,opacity" },
      );
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.28 },
      );
      gsap.fromTo(infoRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: 0.38 },
      );
      gsap.fromTo(hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.58 },
      );
      gsap.fromTo(scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.82 },
      );
    });
    return () => ctx.revert();
  }, []);

  /* ── Text panel entry / exit ── */
  useEffect(() => {
    const panel = textPanelRef.current;
    if (!panel) return;
    if (phase === 0) {
      gsap.to(panel, isMobile
        ? { opacity: 0, y: 60, duration: 0.3, ease: "power2.in", overwrite: true }
        : { opacity: 0, x: 70, duration: 0.3, ease: "power2.in", overwrite: true }
      );
      return;
    }
    if (phase === 1) {
      gsap.fromTo(panel,
        isMobile ? { opacity: 0, y: 60 } : { opacity: 0, x: 70 },
        isMobile
          ? { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.4, overwrite: true }
          : { opacity: 1, x: 0, duration: 0.75, ease: "power3.out", delay: 0.4, overwrite: true },
      );
    }
    /* phase 2 — panel already visible, nothing to do */
  }, [phase, isMobile]);

  /* ── Text swap when screenIdx changes ── */
  useEffect(() => {
    if (screenIdx === displayIdx) return; /* initial mount — no animation */
    const title = textTitleRef.current;
    const desc  = textDescRef.current;
    if (!title || !desc) { setDisplayIdx(screenIdx); return; }

    /* Fade out current text, update content, fade back in */
    gsap.to([title, desc], {
      opacity: 0, y: -10, duration: 0.18, ease: "power2.in", overwrite: "auto",
      onComplete: () => {
        setDisplayIdx(screenIdx);
        /* tiny defer so React has painted the new text */
        requestAnimationFrame(() => {
          gsap.fromTo(
            [title, desc],
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0,  duration: 0.38, ease: "power3.out", stagger: 0.07 },
          );
        });
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenIdx]);

  /* ── Exit ── */
  const animateOut = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    onClose();
  }, [onClose]);

  /* ── Hover tilt handlers ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width  - 0.5; /* -0.5 → 0.5 */
    const cy = (e.clientY - rect.top)  / rect.height - 0.5; /* -0.5 → 0.5 */
    hoverTiltRef.current = {
      y:  cx * 0.32,  /* yaw   ±~9° */
      x: -cy * 0.18,  /* pitch ±~5° */
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTiltRef.current = { x: 0, y: 0 };
  }, []);

  /* ── Touch ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 40) return;
    const now = Date.now();
    if (now - mountTime.current < 600) return;
    if (now - wheelRef.current   < 350) return;
    wheelRef.current = now;
    if (dy > 0) {
      if (phase === 0)      setPhase(1);
      else if (phase === 1) setPhase(2);
      else setScreenIdx(i => Math.min(i + 1, CUISINE_SCREENS.length - 1));
    } else {
      if      (phase === 2 && screenIdx > 0)  setScreenIdx(i => i - 1);
      else if (phase === 2 && screenIdx === 0) setPhase(1);
      else if (phase === 1)                    setPhase(0);
      else                                     animateOut();
    }
  }, [phase, screenIdx, animateOut]);

  /* ── Wheel ── */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    if (now - mountTime.current < 600) return;
    if (now - wheelRef.current   < 350) return;
    wheelRef.current = now;

    if (e.deltaY > 30) {
      if (phase === 0)      setPhase(1);
      else if (phase === 1) setPhase(2);
      else setScreenIdx(i => Math.min(i + 1, CUISINE_SCREENS.length - 1));
    } else if (e.deltaY < -30) {
      if      (phase === 2 && screenIdx > 0)  setScreenIdx(i => i - 1);
      else if (phase === 2 && screenIdx === 0) setPhase(1);
      else if (phase === 1)                    setPhase(0);
      else                                     animateOut();
    }
  }, [phase, screenIdx, animateOut]);

  /* ── Go-to-top handler ── */
  const handleGoTop = useCallback(() => {
    setPhase(0);
    setScreenIdx(0);
    setDisplayIdx(0);
  }, []);

  /* hint text per phase */
  const hintText =
    phase === 0 ? "Scroll ↓ pour pivoter" :
    phase === 1 ? "Scroll ↓ pour explorer" :
    `${screenIdx + 1} / ${CUISINE_SCREENS.length}`;

  return (
    <main
      className="h-screen w-screen overflow-hidden bg-black flex flex-col"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GridLines />

      {/* NAV */}
      <nav ref={navRef} className="relative z-10 flex items-center justify-between px-10 py-5 flex-shrink-0">
        <Link href="/" className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-70 hover:opacity-100 transition-opacity">
          ← Home
        </Link>
        <button
          onClick={animateOut}
          className="text-[11px] font-mono tracking-[0.25em] text-white/45 hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Projects
        </button>
        <button className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer">
          Contact
        </button>
      </nav>

      {/* ── 3D Stage ── */}
      <div
        className="relative z-10 flex-1 overflow-hidden"
        style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* ── Phone column — slides left on phase >= 1 ── */}
        <div
          ref={phoneRef}
          className="relative flex-shrink-0 flex flex-col items-center justify-center"
          style={{
            width:       isMobile ? "100%" : (phase >= 1 ? "50%" : "100%"),
            height:      isMobile && phase >= 1 ? "42vh" : "auto",
            flexGrow:    isMobile && phase === 0 ? 1 : 0,
            flexShrink:  isMobile && phase >= 1 ? 0 : 1,
            flexBasis:   isMobile && phase === 0 ? "auto" : undefined,
            paddingLeft: !isMobile && phase >= 1 ? "8%" : "0%",
            transition: "width 0.9s cubic-bezier(0.77, 0, 0.175, 1), height 0.9s cubic-bezier(0.77, 0, 0.175, 1), padding-left 0.9s cubic-bezier(0.77, 0, 0.175, 1)",
          }}
        >
          {/* Warm glow */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: "560px", height: "560px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,180,60,0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              opacity: phase >= 1 ? 0.85 : 0.5,
              transition: "opacity 0.8s ease",
            }}
          />

          {/* Canvas */}
          <Canvas
            camera={{ position: [0, 0, 5.2], fov: 34 }}
            style={{ width: "100%", maxWidth: isMobile ? "none" : "580px", height: isMobile ? "100%" : "min(860px, 74vh)" }}
            gl={{ antialias: true, alpha: true, toneMappingExposure: 0.72 }}
          >
            <ambientLight intensity={0.22} />
            <directionalLight position={[3, 6, 4]}  intensity={0.65} castShadow />
            <directionalLight position={[-4, 2, 2]} intensity={0.14} color="#ffd580" />
            <pointLight        position={[0, -3, 3]} intensity={0.15} />
            <Environment preset="studio" />
            <Suspense fallback={null}>
              <IPhoneModel phase={phase} screenIdx={screenIdx} hoverTiltRef={hoverTiltRef} />
            </Suspense>
          </Canvas>

          {/* Scroll hint below the phone */}
          <div
            ref={scrollHintRef}
            className="pointer-events-none flex flex-col items-center gap-[6px] mt-3"
            style={{ opacity: phase === 0 ? 1 : 0, transition: "opacity 0.5s ease" }}
          >
            <span className="text-white/25 text-[8px] font-mono tracking-[0.4em] uppercase">scroll down</span>
            <div style={{
              width: "1px", height: "22px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
            }} />
          </div>
        </div>

        {/* ── Text panel — right half on desktop, bottom sheet on mobile ── */}
        <div
          ref={textPanelRef}
          className="absolute flex flex-col justify-center"
          style={isMobile ? {
            bottom: 0, left: 0, right: 0, top: "auto",
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(12px)",
            padding: "24px 20px 28px",
            opacity: 0,
            pointerEvents: phase >= 1 ? "auto" : "none",
          } : {
            top: 0, right: 0, bottom: 0,
            width: "50%",
            padding: "0 clamp(32px, 5vw, 80px)",
            opacity: 0,
            pointerEvents: phase >= 1 ? "auto" : "none",
          }}
        >
            {/* Screen counter */}
            <p className="text-white/25 text-[8px] font-mono tracking-[0.4em] uppercase mb-8">
              {String(displayIdx + 1).padStart(2, "0")} / {String(CUISINE_SCREENS.length).padStart(2, "0")}
            </p>

            {/* Title */}
            <h3
              ref={textTitleRef}
              className="font-black uppercase text-white leading-[0.88] tracking-[-0.02em] mb-5"
              style={{ fontSize: "clamp(26px, 2.8vw, 46px)" }}
            >
              {SCREEN_TEXTS[displayIdx].title}
            </h3>

            {/* Divider */}
            <div style={{ width: "32px", height: "1px", background: "rgba(255,255,255,0.18)", marginBottom: "24px" }} />

            {/* Description */}
            <p
              ref={textDescRef}
              className="text-white/45 font-mono leading-[1.85] tracking-[0.03em]"
              style={{ fontSize: "clamp(11px, 2.5vw, 13px)", maxWidth: "400px" }}
            >
              {SCREEN_TEXTS[displayIdx].desc}
            </p>

            {/* Dot navigation */}
            <div className="flex gap-[5px] mt-10">
              {CUISINE_SCREENS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setScreenIdx(i)}
                  className="bg-transparent border-none cursor-pointer p-0"
                  aria-label={`Screen ${i + 1}`}
                >
                  <div className="h-px transition-all duration-400" style={{
                    width:      i === displayIdx ? "22px" : "10px",
                    background: i === displayIdx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
                  }} />
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 flex items-end justify-between px-5 sm:px-10 pb-4 sm:pb-6 flex-shrink-0">

        {/* Project info */}
        <div ref={infoRef}>
          <p className="text-white/30 text-[8px] font-mono tracking-[0.3em] uppercase mb-2">
            {project.num} · {project.category}
          </p>
          <h2
            className="text-white font-black uppercase leading-[0.88] tracking-[-0.02em]"
            style={{ fontSize: "clamp(18px, 5vw, 42px)" }}
          >
            {project.title}
          </h2>
          <p className="text-white/35 text-[10px] font-mono tracking-[0.12em] mt-2">
            {project.tools} · {project.year}
          </p>
        </div>

        {/* Right side: hint + up button */}
        <div ref={hintRef} className="flex items-center gap-3">
          <span className="text-white/30 text-[9px] font-mono tracking-[0.3em] uppercase">
            {hintText}
          </span>

          {/* Up button — visible when past phase 0 */}
          <button
            onClick={handleGoTop}
            aria-label="Revenir au début"
            style={{
              width: "30px", height: "30px",
              background: "#000",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 0 8px rgba(255,255,255,0.07), 0 0 18px rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              opacity: phase > 0 || screenIdx > 0 ? 1 : 0,
              transition: "opacity 0.4s ease",
              flexShrink: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="5" y1="9" x2="5" y2="1" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
              <polyline points="2,4 5,1 8,4" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   LUMI VIEW — Just Desktop-2.webp scrollable
───────────────────────────────────────────── */
function LumiView({ onClose }: { project: Project; onClose: () => void }) {
  const navRef     = useRef<HTMLElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const wheelRef   = useRef(0);
  const mountTime  = useRef(Date.now());
  const touchY     = useRef(0);

  const animateOut = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    onClose();
  }, [onClose]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.4 });
    });
    return () => ctx.revert();
  }, []);

  // Scroll up at top of content → close project (back to carousel)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    if (now - mountTime.current < 600) return;
    if (now - wheelRef.current < 250) return;
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop === 0 && e.deltaY < -30) {
      wheelRef.current = now;
      animateOut();
    }
  }, [animateOut]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (el.scrollTop === 0 && dy > 60) animateOut();
  }, [animateOut]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-black flex flex-col">
      <nav ref={navRef} className="relative z-30 flex items-center justify-between px-10 py-5 flex-shrink-0 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-70 hover:opacity-100 transition-opacity">
          ← Home
        </Link>
        <button
          onClick={animateOut}
          className="text-[11px] font-mono tracking-[0.25em] text-white/45 hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Projects
        </button>
        <button className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer">
          Contact
        </button>
      </nav>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/Lumi/Desktop-2.webp" alt="Lumi" className="w-full block" />
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   PROJECT VIEW
   No layer-level entrance animation here —
   the parent layer handles the slide in/out.
   Element animations are delayed ~0.65-0.75s so
   they fire right as the layer finishes arriving.
───────────────────────────────────────────── */
function ProjectView({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(272); // continuous: 272 (1 col) → 544 (2 cols)
  const wheelRef      = useRef(0);
  const mountTime     = useRef(Date.now()); // ignore wheel for 900ms after mount
  const scrollDir     = useRef(1);
  const closingRef    = useRef(false);
  const animatedRef   = useRef(false); // StrictMode double-run guard
  const firstImageRef = useRef(true);  // skip image-change anim on initial mount
  const isDragging    = useRef(false);
  const dragEndedAt   = useRef(0); // timestamp of last drag release — block nav events for cooldown
  const dragCleanupTO = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navRef      = useRef<HTMLElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const categoryRef = useRef<HTMLParagraphElement>(null);
  const centerRef   = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);
  const thumbsRef       = useRef<HTMLDivElement>(null);
  const thumbsScrollRef = useRef<HTMLDivElement>(null);
  const hintRef         = useRef<HTMLDivElement>(null);
  const titleBannerRef  = useRef<HTMLDivElement>(null);
  const counterRef      = useRef<HTMLDivElement>(null);

  /* ── Entrance animation
     Delays are offset by ~0.65s so elements animate in
     right as the 0.85s layer slide finishes. */
  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    /* Nav — slides in as layer lands */
    gsap.from(navRef.current, {
      opacity: 0, y: -10, duration: 0.45, ease: "power2.out", delay: 0.72,
    });

    /* Title — clipPath reveal begins mid-slide, finishes after */
    gsap.fromTo(
      titleRef.current,
      { clipPath: "inset(100% 0% 0% 0%)", y: 20 },
      { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.0, ease: "power4.out", delay: 0.65 },
    );

    /* Category */
    gsap.from(categoryRef.current, {
      opacity: 0, y: 14, duration: 0.65, ease: "power3.out", delay: 0.9,
    });

    /* Center image — subtle scale-in (bottom half visible earlier) */
    const img = centerRef.current?.querySelector("img");
    if (img) gsap.from(img, { scale: 1.08, duration: 1.0, ease: "power2.out", delay: 0.3 });

    /* Meta — bottom area enters view early */
    if (metaRef.current) {
      gsap.from(Array.from(metaRef.current.children), {
        opacity: 0, y: 20, duration: 0.55, ease: "power3.out", stagger: 0.07, delay: 0.72,
      });
    }

    /* Scroll hint */
    gsap.from(hintRef.current, { opacity: 0, duration: 0.6, delay: 1.05 });

    /* Thumbnails — right filmstrip enters from right, visible early */
    if (thumbsScrollRef.current) {
      gsap.from(Array.from(thumbsScrollRef.current.children), {
        x: 28, duration: 0.55, ease: "power3.out", stagger: 0.08, delay: 0.38,
        clearProps: "transform",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Image change: instant swap ── */
  useEffect(() => {
    firstImageRef.current = false;
  }, [activeImage]);

  /* ── Filmstrip: keep active thumb centered ── */
  useEffect(() => {
    const container = thumbsScrollRef.current;
    if (!container) return;
    const thumb = container.children[activeImage] as HTMLElement | undefined;
    if (!thumb) return;
    container.scrollTo({
      top: thumb.offsetTop - container.offsetHeight / 2 + thumb.offsetHeight / 2,
      behavior: "smooth",
    });
  }, [activeImage]);

  /* ── Exit: call onClose immediately — Portfolio layer handles the slide ── */
  const animateOut = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    scrollDir.current = 1;
    setActiveImage((i) => (i < project.images.length - 1 ? i + 1 : i));
  }, [project.images.length]);

  const goPrev = useCallback(() => {
    scrollDir.current = -1;
    setActiveImage((i) => {
      if (i === 0) { animateOut(); return 0; }
      return i - 1;
    });
  }, [animateOut]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isDragging.current) return; // drawer drag in progress
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  /* ── Touch swipe ── */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchOnMain  = useRef(false); // true only if touchstart fired on <main>
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isDragging.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchOnMain.current = true;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isDragging.current || !touchOnMain.current) { touchOnMain.current = false; return; }
    touchOnMain.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext(); else goPrev();
    } else if (Math.abs(dy) > 40) {
      if (dy < 0) goNext(); else goPrev();
    }
  }, [goNext, goPrev]);

  /* ── Wheel handler ── */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isDragging.current) return; // drag in progress
      const now = Date.now();
      if (now - dragEndedAt.current < 350) return; // post-drag cooldown
      if (now - mountTime.current < 900) return;
      if (now - wheelRef.current < 160) return;
      wheelRef.current = now;
      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();
    },
    [goNext, goPrev],
  );

  return (
    <main
      className="h-screen w-screen overflow-hidden bg-black flex flex-col"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GridLines />

      {/* NAV */}
      <nav ref={navRef} className="relative z-10 flex items-center justify-between px-10 py-5 flex-shrink-0">
        <Link href="/" className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-70 hover:opacity-100 transition-opacity">
          ← Home
        </Link>
        <button
          onClick={animateOut}
          className="text-[11px] font-mono tracking-[0.25em] text-white/45 hover:text-white uppercase transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Projects
        </button>
        <button className="text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer">
          Contact
        </button>
      </nav>

      {/* ═══════════════ MOBILE LAYOUT ═══════════════ */}
      <div
        className="sm:hidden flex flex-col flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const el = e.currentTarget;
          const dy = e.changedTouches[0].clientY - touchStartY.current;
          if (el.scrollTop === 0 && dy > 60) animateOut();
        }}
      >
        {/* Title */}
        <div className="px-5 pt-3 pb-2 flex-shrink-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)" }}
        >
          <h1 className="text-white font-black uppercase leading-[0.92] tracking-[-0.025em]"
            style={{ fontSize: "clamp(26px, 8vw, 48px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >{project.title}</h1>
          <p className="text-white/45 text-[9px] font-mono tracking-[0.3em] uppercase mt-2">{project.category}</p>
        </div>

        {/* Image */}
        <div className="flex-shrink-0 w-full" style={{ height: "55vw", minHeight: 200 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[activeImage]}
            alt={project.title}
            className="w-full h-full object-contain bg-black"
          />
        </div>

        {/* Horizontal thumbnail strip */}
        <div className="flex gap-2 px-4 py-2 flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {project.images.map((img, i) => (
            <div
              key={i}
              onClick={() => { scrollDir.current = i > activeImage ? 1 : -1; setActiveImage(i); }}
              className="flex-shrink-0 cursor-pointer overflow-hidden"
              style={{
                width: 56, height: 38,
                opacity: i === activeImage ? 1 : 0.3,
                outline: i === activeImage ? "1px solid rgba(255,255,255,0.6)" : "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.replace("_1920.webp","_640.webp")} alt="" draggable={false} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Meta */}
        <div className="px-5 pt-3 pb-8 space-y-4">
          <div className="grid gap-x-4 gap-y-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              { label: project.client ? "Client" : "Type", value: project.client ?? project.type },
              { label: "Year",  value: project.year  },
              { label: "Role",  value: project.role  },
              ...(project.deliverables ? [{ label: "Deliverables", value: project.deliverables }] : []),
              { label: "Tools", value: project.tools },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white/40 text-[9px] font-mono tracking-[0.22em] uppercase mb-1">{label}</p>
                <p className="text-white/90 text-[11px] font-mono leading-[1.4]">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-white/70 text-[13px] leading-[1.65]">{project.description}</p>
          <p className="text-white/30 text-[9px] font-mono tracking-[0.25em] uppercase">
            {String(activeImage + 1).padStart(2,"0")} / {String(project.images.length).padStart(2,"0")}
          </p>
        </div>
      </div>

      {/* ═══════════════ DESKTOP LAYOUT ═══════════════ */}
      <div className="hidden sm:block relative flex-1 overflow-hidden">

        {/* IMAGE — original centered format, never resized */}
        <div ref={centerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.images[activeImage]}
            alt={project.title}
            className="object-contain pointer-events-auto"
            style={{
              filter: "brightness(1.0)",
              maxWidth:  "58%",
              maxHeight: "70%",
            }}
          />
        </div>

        {/* Counter — bottom-center, follows drawer to stay clear */}
        <div
          ref={counterRef}
          className="absolute z-20 flex justify-center pointer-events-none"
          style={{
            bottom: 16,
            left:   0,
            right:  (drawerWidth + 24) + "px",
            transition: "right 0.4s cubic-bezier(0.77,0,0.175,1)",
          }}
        >
          <span className="text-white/35 text-[9px] font-mono tracking-[0.25em]">
            {String(activeImage + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
          </span>
        </div>

        {/* Scroll cue */}
        <div ref={hintRef} className="absolute top-1/2 right-[15%] -translate-y-1/2 z-20 flex flex-col items-center gap-1 opacity-15 pointer-events-none">
          <div className="w-px h-8 bg-white" />
          <span className="text-white text-[7px] font-mono tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>scroll</span>
          <div className="w-px h-8 bg-white" />
        </div>

        {/* TOP banner — title spans wide horizontally */}
        <div
          ref={titleBannerRef}
          className="absolute left-0 right-0 top-0 z-15 px-9 pt-7 pointer-events-none"
          style={{
            paddingRight: (drawerWidth + 24) + "px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)",
            paddingBottom: "32px",
            transition: "padding-right 0.4s cubic-bezier(0.77,0,0.175,1)",
          }}
        >
          <div className="pointer-events-auto min-w-0">
            <h1
              ref={titleRef}
              className="text-white font-black uppercase leading-[0.92] tracking-[-0.025em]"
              style={{
                fontSize: "clamp(34px, 5.2vw, 78px)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {project.title}
            </h1>
            <p ref={categoryRef} className="text-white/45 text-[10px] font-mono tracking-[0.35em] uppercase mt-3">
              {project.category}
            </p>
          </div>
        </div>

        {/* LEFT — metadata column.
            Width scales with viewport (20vw) to stay clear of image's left edge (image at 58% centered → left edge at 21vw).
            On narrow viewports, column shrinks; on wide, it's larger.
            Single-col stack inside avoids column-squeeze layout bugs. */}
        <div
          className="absolute left-0 bottom-0 z-10 flex flex-col px-7 pb-10 pointer-events-none overflow-y-auto"
          style={{
            top:          "clamp(110px, 13vh, 165px)",
            width:        "min(20vw, 380px)",
            scrollbarWidth: "none",
          }}
        >
          <div ref={metaRef} className="space-y-5 pointer-events-auto" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 2px 20px rgba(0,0,0,0.8)" }}>
            <div className="grid gap-y-3" style={{ gridTemplateColumns: "1fr" }}>
              {[
                { label: project.client ? "Client" : "Type", value: project.client ?? project.type },
                { label: "Year", value: project.year },
                { label: "Role", value: project.role },
              ].map(({ label, value }) => (
                <div key={label} className="min-w-0">
                  <p className="text-white/40 text-[9px] font-mono tracking-[0.25em] uppercase mb-1.5">{label}</p>
                  <p className="text-white/90 text-[12px] font-mono tracking-[0.04em] leading-[1.4] break-words">{value}</p>
                </div>
              ))}
            </div>
            {project.deliverables && (
              <div>
                <p className="text-white/40 text-[9px] font-mono tracking-[0.25em] uppercase mb-1.5">Deliverables</p>
                <p className="text-white/90 text-[12px] font-mono tracking-[0.04em] leading-[1.4]">{project.deliverables}</p>
              </div>
            )}
            <div>
              <p className="text-white/40 text-[9px] font-mono tracking-[0.25em] uppercase mb-1.5">Tools</p>
              <p className="text-white/90 text-[12px] font-mono tracking-[0.04em] leading-[1.4]">{project.tools}</p>
            </div>
            <p className="text-white/80 text-[12.5px] leading-[1.65]">{project.description}</p>
            {/* Progress dots — windowed max 12 centered on active */}
            <div className="flex gap-1 pt-1">
              {(() => {
                const total = project.images.length;
                const MAX = 12;
                const half = Math.floor(MAX / 2);
                const start = Math.max(0, Math.min(activeImage - half, total - MAX));
                const end = Math.min(total, start + MAX);
                return Array.from({ length: end - start }, (_, j) => {
                  const i = start + j;
                  return (
                    <button
                      key={i}
                      onClick={() => { scrollDir.current = i > activeImage ? 1 : -1; setActiveImage(i); }}
                      className="bg-transparent border-none cursor-pointer p-0"
                      aria-label={`Image ${i + 1}`}
                    >
                      <div
                        className="h-px transition-all duration-400"
                        style={{
                          width:      i === activeImage ? "22px" : "10px",
                          background: i === activeImage ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
                        }}
                      />
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* RIGHT — filmstrip drawer: 272px (1 col) → 544px (2 cols) */}
        <div
          ref={thumbsRef}
          className="absolute right-0 bottom-0 z-20"
          style={{
            top:        "clamp(80px, 12vh, 140px)",
            width:      drawerWidth + "px",
            transition: "width 0.4s cubic-bezier(0.77,0,0.175,1)",
          }}
          onWheel={e => e.stopPropagation()}
        >
          {/* Grab handle — sits just outside drawer left edge, owns drag logic */}
          <div
            className="group absolute top-0 bottom-0 z-30 flex items-center justify-center cursor-ew-resize select-none"
            style={{ left: -16, width: 28, touchAction: "none" }}
            onWheel={e => e.stopPropagation()}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const MIN = 272; const MAX = 544;
              const CLICK_TOLERANCE = 5;
              const startX = e.clientX;
              const startW = thumbsRef.current?.offsetWidth ?? drawerWidth;
              document.body.style.userSelect = "none";
              document.body.style.cursor = "ew-resize";
              isDragging.current = true;
              if (dragCleanupTO.current) { clearTimeout(dragCleanupTO.current); dragCleanupTO.current = null; }
              if (thumbsRef.current) thumbsRef.current.style.transition = "none";

              const applyLayout = (w: number) => {
                if (thumbsRef.current)      thumbsRef.current.style.width             = w + "px";
                if (counterRef.current)     counterRef.current.style.right            = (w + 24) + "px";
                if (titleBannerRef.current) titleBannerRef.current.style.paddingRight = (w + 24) + "px";
              };
              const EASE = "0.4s cubic-bezier(0.77,0,0.175,1)";
              const setTransitions = (active: boolean) => {
                if (thumbsRef.current)      thumbsRef.current.style.transition        = active ? "width " + EASE : "none";
                if (counterRef.current)     counterRef.current.style.transition       = active ? "right " + EASE : "none";
                if (titleBannerRef.current) titleBannerRef.current.style.transition   = active ? "padding-right " + EASE : "none";
              };
              setTransitions(false);

              const onMove = (ev: MouseEvent) => {
                const dx = startX - ev.clientX;
                const clamped = Math.max(MIN, Math.min(MAX, startW + dx));
                applyLayout(clamped);
              };
              const onUp = (ev: MouseEvent) => {
                isDragging.current = false;
                dragEndedAt.current = Date.now();
                document.body.style.userSelect = "";
                document.body.style.cursor = "";
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);

                const dx = startX - ev.clientX;
                const moved = Math.abs(dx) > CLICK_TOLERANCE;
                const finalW = !moved
                  ? (startW > (MIN + MAX) / 2 ? MIN : MAX)
                  : Math.max(MIN, Math.min(MAX, startW + dx));

                setTransitions(true);
                if (thumbsRef.current) void thumbsRef.current.offsetWidth;
                applyLayout(finalW);
                setDrawerWidth(finalW);
                setDrawerOpen(finalW > (MIN + MAX) / 2);
                dragCleanupTO.current = setTimeout(() => {
                  // Only clear transitions (not inline values — React JSX uses inline style attribute)
                  if (thumbsRef.current)      thumbsRef.current.style.transition      = "";
                  if (counterRef.current)     counterRef.current.style.transition     = "";
                  if (titleBannerRef.current) titleBannerRef.current.style.transition = "";
                  dragCleanupTO.current = null;
                }, 440);
              };
              document.addEventListener("mousemove", onMove);
              document.addEventListener("mouseup", onUp);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              const MIN = 272; const MAX = 544;
              const CLICK_TOLERANCE = 5;
              const startX = e.touches[0].clientX;
              const startW = thumbsRef.current?.offsetWidth ?? drawerWidth;
              isDragging.current = true;
              if (dragCleanupTO.current) { clearTimeout(dragCleanupTO.current); dragCleanupTO.current = null; }

              const applyLayout = (w: number) => {
                if (thumbsRef.current)      thumbsRef.current.style.width             = w + "px";
                if (counterRef.current)     counterRef.current.style.right            = (w + 24) + "px";
                if (titleBannerRef.current) titleBannerRef.current.style.paddingRight = (w + 24) + "px";
              };
              const EASE = "0.4s cubic-bezier(0.77,0,0.175,1)";
              const setTransitions = (active: boolean) => {
                if (thumbsRef.current)      thumbsRef.current.style.transition        = active ? "width " + EASE : "none";
                if (counterRef.current)     counterRef.current.style.transition       = active ? "right " + EASE : "none";
                if (titleBannerRef.current) titleBannerRef.current.style.transition   = active ? "padding-right " + EASE : "none";
              };
              setTransitions(false);

              const onMove = (ev: TouchEvent) => {
                ev.preventDefault();
                const dx = startX - ev.touches[0].clientX;
                const clamped = Math.max(MIN, Math.min(MAX, startW + dx));
                applyLayout(clamped);
              };
              const onEnd = (ev: TouchEvent) => {
                isDragging.current = false;
                dragEndedAt.current = Date.now();
                document.removeEventListener("touchmove", onMove);
                document.removeEventListener("touchend", onEnd);
                document.removeEventListener("touchcancel", onEnd);

                const dx = startX - (ev.changedTouches[0]?.clientX ?? startX);
                const moved = Math.abs(dx) > CLICK_TOLERANCE;
                const finalW = !moved
                  ? (startW > (MIN + MAX) / 2 ? MIN : MAX)
                  : Math.max(MIN, Math.min(MAX, startW + dx));

                setTransitions(true);
                if (thumbsRef.current) void thumbsRef.current.offsetWidth;
                applyLayout(finalW);
                setDrawerWidth(finalW);
                setDrawerOpen(finalW > (MIN + MAX) / 2);
                dragCleanupTO.current = setTimeout(() => {
                  // Only clear transitions (not inline values — React JSX uses inline style attribute)
                  if (thumbsRef.current)      thumbsRef.current.style.transition      = "";
                  if (counterRef.current)     counterRef.current.style.transition     = "";
                  if (titleBannerRef.current) titleBannerRef.current.style.transition = "";
                  dragCleanupTO.current = null;
                }, 440);
              };
              document.addEventListener("touchmove", onMove, { passive: false });
              document.addEventListener("touchend", onEnd);
              document.addEventListener("touchcancel", onEnd);
            }}
          >
            <div
              className="flex flex-col gap-[4px] transition-all duration-200 group-hover:gap-[5px]"
              style={{ pointerEvents: "none" }}
            >
              {[0,1,2].map(i => (
                <div
                  key={i}
                  className="w-[3px] h-[3px] rounded-full bg-white/60 transition-all duration-200 group-hover:bg-white group-hover:w-[4px] group-hover:h-[4px]"
                />
              ))}
            </div>
          </div>

          {/* Content area — overflow-hidden clips thumbnails */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)" }}
          >
            {/* Fade gradient top */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-10"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
            />

            {/* Thumbnails — auto-fit grid:
                Drawer ≤ ~460px → 1 col with all images stacked vertically
                Drawer ≥ ~462px → 2 cols, images split row-major */}
            <div
              ref={thumbsScrollRef}
              data-thumbs-scroll
              className="h-full w-full overflow-y-auto py-3"
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                scrollbarWidth: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 6,
                alignContent: "start",
              }}
              onWheel={e => e.stopPropagation()}
            >
              {project.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => { scrollDir.current = i > activeImage ? 1 : -1; setActiveImage(i); }}
                  className="flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300"
                  style={{
                    height: "110px",
                    opacity: i === activeImage ? 1 : 0.35,
                    outline: i === activeImage ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.replace("_1920.webp", "_640.webp")} alt="" draggable={false} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>{/* end desktop */}
    </main>
  );
}

/* ─────────────────────────────────────────────
   PAGE ROOT
   Dual-layer architecture:
   · sliderLayer  — always mounted, slides UP on open  (y: 0 → -100%)
   · projectLayer — mounted on open, slides UP from below (y: 100% → 0)
   Both layers move simultaneously → feels like scrolling down a page.
───────────────────────────────────────────── */
export default function Portfolio() {
  const [activeIdx, setActiveIdx]     = useState(0);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const n = PROJECTS.length;

  const sliderLayerRef  = useRef<HTMLDivElement>(null);
  const projectLayerRef = useRef<HTMLDivElement>(null);
  /* Guard to prevent a second transition while one is in progress */
  const transitionRef   = useRef(false);

  const prevProject = useCallback(() => setActiveIdx((i) => (i - 1 + n) % n), [n]);
  const nextProject = useCallback(() => setActiveIdx((i) => (i + 1) % n), [n]);
  const gotoProject = useCallback((i: number) => setActiveIdx(i), []);

  const openCurrent = useCallback(() => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    setOpenProject(PROJECTS[activeIdx]);
  }, [activeIdx]);

  /* ── Slide both layers when project mounts ── */
  useEffect(() => {
    if (!openProject) return;
    const sl = sliderLayerRef.current;
    const pl = projectLayerRef.current;
    if (!sl || !pl) return;

    const tl = gsap.timeline({
      onComplete: () => { transitionRef.current = false; },
    });
    tl.to(sl, { y: "-100%", duration: 0.85, ease: "power3.inOut" }, 0);
    tl.to(pl, { y: 0,       duration: 0.85, ease: "power3.inOut" }, 0);

    return () => { tl.kill(); };
  }, [openProject]);

  /* ── Reverse slide on close ── */
  const closeProject = useCallback(() => {
    if (transitionRef.current) return;
    transitionRef.current = true;

    const sl = sliderLayerRef.current;
    const pl = projectLayerRef.current;
    if (!sl || !pl) {
      setOpenProject(null);
      transitionRef.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setOpenProject(null);
        transitionRef.current = false;
      },
    });
    tl.to(pl, { y: "100%", duration: 0.85, ease: "power3.inOut" }, 0);
    tl.to(sl, { y: 0,      duration: 0.85, ease: "power3.inOut" }, 0);
  }, []);

  /* Q = prev · D = next (slider only) */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (openProject) return;
      if (e.key === "q" || e.key === "Q") prevProject();
      if (e.key === "d" || e.key === "D") nextProject();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openProject, prevProject, nextProject]);

  return (
    <>
      {/* ── Hidden image preloader — keeps all project images in browser cache ── */}
      <div aria-hidden style={{ display: "none" }}>
        {PROJECTS.flatMap((p) => p.images).map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" />
        ))}
      </div>

      {/* ── Two-layer scroll container ── */}
      <div className="relative h-screen w-screen overflow-hidden bg-black">

        {/* Slider layer — always in DOM */}
        <div ref={sliderLayerRef} className="absolute inset-0">
          <SliderView
            projects={PROJECTS}
            activeIdx={activeIdx}
            onPrev={prevProject}
            onNext={nextProject}
            onSetIdx={gotoProject}
            onOpen={openCurrent}
          />
        </div>

        {/* Project layer — mounted when open.
            Ref callback positions it instantly below viewport (no flash). */}
        {openProject && (
          <div
            ref={(el) => {
              projectLayerRef.current = el;
              if (el) gsap.set(el, { y: "100%" });
            }}
            className="absolute inset-0"
          >
            {openProject.num === "01" ? <CuisineRoyaleView project={openProject} onClose={closeProject} />
             : openProject.num === "08" ? <LumiView project={openProject} onClose={closeProject} />
             : <ProjectView project={openProject} onClose={closeProject} />
            }
          </div>
        )}
      </div>
    </>
  );
}
