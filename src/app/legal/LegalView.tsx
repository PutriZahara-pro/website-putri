"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { useContact } from "@/contexts/ContactContext";
import LangToggle from "@/components/ui/lang-toggle";
import { NavContactButton } from "@/components/ui/nav-contact-button";
import type { Lang } from "@/lib/translations";

/* A block is a paragraph, or a bullet list when it is an array. */
type Block = string | string[];
type Section = {
  id: string;
  title: string;
  blocks: Block[];
  links?: { href: string; label: string }[];
  contact?: boolean; // show the "contact me" button under the section
};

const copy: Record<Lang, {
  home: string; kicker: string; title: string; updated: string;
  toc: string; contactCta: string; sections: Section[];
}> = {
  fr: {
    home:       "← Accueil",
    kicker:     "Informations légales",
    title:      "Mentions légales & confidentialité",
    updated:    "Dernière mise à jour : 4 octobre 2026",
    toc:        "Sommaire",
    contactCta: "Écrire via le formulaire →",
    sections: [
      {
        id: "editeur",
        title: "Éditrice du site",
        blocks: [
          "Ce site est le portfolio personnel et non commercial de Putri Zahara, étudiante.",
          "Directrice de la publication : Putri Zahara.",
          "Contact : uniquement via le formulaire de contact du site.",
        ],
        contact: true,
      },
      {
        id: "hebergement",
        title: "Hébergement",
        blocks: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis."],
        links: [{ href: "https://vercel.com", label: "vercel.com" }],
      },
      {
        id: "confidentialite",
        title: "Données personnelles",
        blocks: [
          "Responsable du traitement : Putri Zahara.",
          "Données collectées : uniquement ce que vous saisissez dans le formulaire de contact — votre nom, votre adresse e-mail et votre message. Il n'y a ni compte, ni inscription, ni donnée sensible.",
          "Finalité : vous répondre. Base légale : l'intérêt légitime à répondre aux personnes qui prennent contact (article 6.1.f du RGPD). Vos données ne sont ni vendues, ni louées, ni utilisées pour de la prospection.",
          "Durée de conservation : le temps de traiter votre demande, et au plus 3 ans après notre dernier échange.",
          "Prestataires qui traitent ces données pour le compte du site :",
          [
            "Resend — acheminement de votre message par e-mail ;",
            "Cloudflare Turnstile — protection anti-spam, chargée uniquement à l'ouverture du formulaire ; elle analyse des informations techniques (adresse IP, navigateur) pour vérifier que vous n'êtes pas un robot ;",
            "Vercel — hébergement du site (journaux techniques de connexion) et mesure d'audience anonyme sans cookie (Vercel Web Analytics).",
          ],
          "Ces prestataires peuvent traiter des données hors de l'Union européenne, notamment aux États-Unis, avec des garanties appropriées (clauses contractuelles types de la Commission européenne ou équivalent).",
          "Vos droits : accès, rectification, effacement, limitation, opposition et portabilité. Pour les exercer, écrivez via le formulaire de contact. Vous pouvez aussi adresser une réclamation à la CNIL.",
        ],
        links: [{ href: "https://www.cnil.fr", label: "cnil.fr" }],
        contact: true,
      },
      {
        id: "cookies",
        title: "Cookies et stockage local",
        blocks: [
          "Ce site ne dépose aucun cookie : ni publicité, ni pistage, ni réseaux sociaux. La mesure d'audience (Vercel Web Analytics) fonctionne sans cookie et ne produit que des statistiques globales.",
          "Le site enregistre seulement, dans votre navigateur :",
          [
            "votre choix de langue (localStorage) ;",
            "l'état de navigation de la session : animation d'introduction déjà vue, dernier projet et filtre consultés (sessionStorage, effacé à la fermeture de l'onglet).",
          ],
          "Ces informations servent uniquement au fonctionnement du site : elles sont exemptées de consentement, c'est pourquoi aucun bandeau cookies n'est affiché. Vous pouvez les effacer à tout moment dans les réglages de votre navigateur.",
        ],
      },
      {
        id: "propriete",
        title: "Propriété intellectuelle",
        blocks: [
          "Les œuvres présentées (illustrations, concept arts, designs, animations, textes) appartiennent à Putri Zahara, sauf mention contraire. Toute reproduction, diffusion ou réutilisation — y compris pour entraîner une intelligence artificielle — sans autorisation écrite préalable est interdite (Code de la propriété intellectuelle).",
          "Les projets réalisés pour des clients ou dans un cadre scolaire sont présentés à titre de portfolio ; les marques, noms et univers associés restent la propriété de leurs titulaires.",
          "Les fan arts (par exemple autour de Fallout) sont des créations personnelles et non commerciales ; les univers, personnages et marques d'origine appartiennent à leurs ayants droit (Fallout © Bethesda Softworks).",
        ],
      },
      {
        id: "conditions",
        title: "Conditions d'utilisation",
        blocks: [
          "Ce site présente le travail de Putri Zahara. Il est consultable gratuitement et ne vend aucun produit ni service.",
          "Les informations y sont fournies à titre indicatif. L'éditrice ne peut être tenue responsable d'une interruption du site ni du contenu des sites externes vers lesquels il renvoie (par exemple LinkedIn).",
          "Ces mentions sont régies par le droit français.",
        ],
      },
      {
        id: "accessibilite",
        title: "Accessibilité",
        blocks: [
          "Le site est pensé pour être utilisable au clavier (Tab, flèches, Échap) et avec un lecteur d'écran, et il respecte le réglage « réduire les animations » de votre appareil. Si quelque chose vous bloque, signalez-le via le formulaire de contact.",
        ],
        contact: true,
      },
    ],
  },
  en: {
    home:       "← Home",
    kicker:     "Legal information",
    title:      "Legal notice & privacy",
    updated:    "Last updated: October 4, 2026",
    toc:        "Contents",
    contactCta: "Write via the form →",
    sections: [
      {
        id: "editeur",
        title: "Publisher",
        blocks: [
          "This website is the personal, non-commercial portfolio of Putri Zahara, a student.",
          "Publication director: Putri Zahara.",
          "Contact: only through the contact form on this site.",
        ],
        contact: true,
      },
      {
        id: "hebergement",
        title: "Hosting",
        blocks: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States."],
        links: [{ href: "https://vercel.com", label: "vercel.com" }],
      },
      {
        id: "confidentialite",
        title: "Personal data",
        blocks: [
          "Data controller: Putri Zahara.",
          "Data collected: only what you type in the contact form — your name, your email address and your message. There are no accounts, no sign-ups and no sensitive data.",
          "Purpose: replying to you. Legal basis: the legitimate interest in answering people who get in touch (Article 6(1)(f) GDPR). Your data is never sold, rented or used for marketing.",
          "Retention: as long as needed to handle your request, and at most 3 years after our last exchange.",
          "Service providers processing this data on behalf of the site:",
          [
            "Resend — delivers your message by email;",
            "Cloudflare Turnstile — anti-spam protection, loaded only when you open the form; it checks technical information (IP address, browser) to make sure you are not a bot;",
            "Vercel — hosting (technical connection logs) and anonymous, cookie-free audience statistics (Vercel Web Analytics).",
          ],
          "These providers may process data outside the European Union, in particular in the United States, under appropriate safeguards (European Commission standard contractual clauses or equivalent).",
          "Your rights: access, rectification, erasure, restriction, objection and portability. To exercise them, write via the contact form. You can also lodge a complaint with the CNIL, the French data protection authority.",
        ],
        links: [{ href: "https://www.cnil.fr", label: "cnil.fr" }],
        contact: true,
      },
      {
        id: "cookies",
        title: "Cookies & local storage",
        blocks: [
          "This site sets no cookies: no advertising, no tracking, no social media. Audience statistics (Vercel Web Analytics) work without cookies and only produce aggregate numbers.",
          "The site only stores, in your browser:",
          [
            "your language choice (localStorage);",
            "this session's navigation state: intro animation already seen, last project and filter viewed (sessionStorage, cleared when you close the tab).",
          ],
          "This information is only used to make the site work, so it is exempt from consent — which is why there is no cookie banner. You can clear it at any time in your browser settings.",
        ],
      },
      {
        id: "propriete",
        title: "Intellectual property",
        blocks: [
          "The works shown (illustrations, concept art, designs, animations, texts) belong to Putri Zahara unless stated otherwise. Any reproduction, distribution or reuse — including to train artificial intelligence — without prior written permission is prohibited.",
          "Projects made for clients or at school are shown as portfolio pieces; the associated brands, names and worlds remain the property of their owners.",
          "Fan art (for example around Fallout) is personal and non-commercial; the original worlds, characters and trademarks belong to their respective owners (Fallout © Bethesda Softworks).",
        ],
      },
      {
        id: "conditions",
        title: "Terms of use",
        blocks: [
          "This site presents Putri Zahara's work. It is free to browse and sells no products or services.",
          "Information is provided for reference only. The publisher cannot be held liable for interruptions of the site or for the content of external sites it links to (for example LinkedIn).",
          "This notice is governed by French law.",
        ],
      },
      {
        id: "accessibilite",
        title: "Accessibility",
        blocks: [
          "The site is designed to work with a keyboard (Tab, arrow keys, Esc) and with screen readers, and it follows your device's \"reduce motion\" setting. If anything gets in your way, please report it via the contact form.",
        ],
        contact: true,
      },
    ],
  },
};

export default function LegalView() {
  const { lang } = useLang();
  const { open } = useContact();
  const c = copy[lang];

  return (
    <main className="relative min-h-[100dvh] w-full bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent calc(100% / 12))",
        }}
      />

      <nav
        aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"}
        className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-10 py-4 bg-black/85 backdrop-blur-md border-b border-white/10"
      >
        <Link href="/" className="text-[11px] sm:text-[12px] font-bold tracking-[0.25em] text-white uppercase opacity-80 hover:opacity-100 transition-opacity">
          {c.home}
        </Link>
        <div className="flex items-center gap-4">
          <LangToggle className="text-white" />
          <NavContactButton />
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-10 pt-12 pb-20 sm:pt-16">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">{c.kicker}</p>
        <h1 className="mt-3 font-black uppercase leading-[0.95] tracking-[-0.02em] text-balance" style={{ fontSize: "clamp(30px, 6vw, 56px)" }}>
          {c.title}
        </h1>
        <p className="mt-4 text-[11px] font-mono tracking-[0.15em] text-white/60">{c.updated}</p>

        <nav aria-label={c.toc} className="mt-10 border-y border-white/10 py-5">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60 mb-3">{c.toc}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {c.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[13px] text-white/80 hover:text-white underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {c.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-12 scroll-mt-24">
            <h2 id={`${s.id}-title`} className="text-[12px] font-mono tracking-[0.3em] uppercase text-white">
              {s.title}
            </h2>
            <div className="mt-4 space-y-3 text-[14px] leading-[1.7] text-white/75">
              {s.blocks.map((b, i) =>
                Array.isArray(b) ? (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 marker:text-white/40">
                    {b.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                ) : (
                  <p key={i}>{b}</p>
                ),
              )}
            </div>
            {(s.links || s.contact) && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {s.links?.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-mono tracking-[0.1em] text-white/80 hover:text-white underline underline-offset-4"
                  >
                    {l.label} ↗
                  </a>
                ))}
                {s.contact && (
                  <button
                    onClick={open}
                    className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/85 hover:text-white border border-white/30 hover:border-white/70 px-3 py-2 transition-colors cursor-pointer bg-transparent"
                  >
                    {c.contactCta}
                  </button>
                )}
              </div>
            )}
          </section>
        ))}

        <p className="mt-16 text-[10px] font-mono tracking-[0.25em] uppercase text-white/55">
          © {new Date().getFullYear()} Putri Zahara
        </p>
      </div>
    </main>
  );
}
