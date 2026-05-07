export type Lang = "en" | "fr";

const t = {
  en: {
    nav: {
      home:     "← Home",
      projects: "← Projects",
      contact:  "Contact",
    },
    slider: {
      scrollToOpen: "Scroll ↓ to open",
      navigate:     "Navigate",
      filters: {
        all:          "All",
        game:         "Game",
        ui:           "UI",
        conceptArt:   "Concept Art",
        illustration: "Illustration",
        animation:    "Animation",
        branding:     "Branding",
      },
    },
    project: {
      type:         "Type",
      year:         "Year",
      role:         "Role",
      tools:        "Tools",
      client:       "Client",
      deliverables: "Deliverables",
      info:         "Info",
      scrollDown:   "scroll down",
    },
    cuisine: {
      pivotHint:   "Scroll ↓ to pivot",
      exploreHint: "Scroll ↓ to explore",
      goTop:       "Back to top",
    },
    projects: {
      "01": {
        description:  "UI design and visual development for a mobile & PC casual cooking game in the iliko-style. Full screen layout, HUD design, iconography, game flow and visual identity.",
        category:     "Game · Mobile & PC",
        type:         "UI / Game Art",
        role:         "Concept Artist · UI Designer",
      },
      "02": {
        description:  "Environment concept art and key visual development for Aporion VTT — a next-generation virtual tabletop platform. Architectural ideation, atmospheric lighting studies and set dressing for medieval harbour, river town and castle biomes.",
        category:     "Game · Environment Art",
        type:         "Environment Design",
        role:         "Concept Artist",
        deliverables: "Environment Concept Art · Key Visuals · Set Design",
      },
      "03": {
        description:  "Full brand identity for Lumi — a plant-based reimagining of the Japanese taiyaki. Logo design, packaging system, colour palette, typographic pairing, brand guidelines and brand book.",
        category:     "Branding · Packaging",
        type:         "Brand Identity",
        role:         "Brand Designer · Art Director",
      },
      "04": {
        description:  "A short hand-drawn animation — illustrated frame by frame in Procreate on iPad, then composited and animated in After Effects.",
        category:     "2D Animation",
        type:         "Short Animation",
        role:         "2D Animator",
      },
      "05": {
        description:  "Full production concept art pipeline for a neo-medieval RPG. Includes world-building, environment key frames, set design orthographics, character turnarounds, costume design sheets, prop design, 3D blockout and UI/UX design.",
        category:     "Game · Full Production",
        type:         "Production Design",
        role:         "Concept Artist · Game Designer",
        deliverables: "Character Sheets · Environment Concepts · Set Design · Props · UI",
      },
      "06": {
        description:  "Visual development for a post-apocalyptic graphic novel set in New York. Cover design, character concepts, costume exploration, environment mood boards and sequential art direction.",
        category:     "Concept Art · Publishing",
        type:         "Graphic Novel",
        role:         "Illustrator · Art Director",
      },
      "07": {
        description:  "Seasonal prop and tower design for a strategy tower-defense title. Four distinct seasonal biomes — summer, autumn, winter and spring — with cohesive silhouette language, material reads and colour script per season.",
        category:     "Game · Prop Design",
        type:         "Game Art",
        role:         "Concept Artist",
      },
      "08": {
        description:  "La Belle aux Miel Dormant — original illustrated children's book. Full pictorial narrative, character design, environment illustration and hand-lettered typography. A reimagining of Sleeping Beauty through the world of bees and enchanted meadows.",
        category:     "Illustration · Book",
        type:         "Children's Book",
        role:         "Illustrator · Author",
      },
      "09": {
        description:  "Personal sketchbook — fan art, character studies, creature concept explorations and experimental illustration techniques spanning several years of artistic practice.",
        category:     "Illustration · Various",
        type:         "Mixed Media",
        role:         "Illustrator",
      },
    },
  },

  fr: {
    nav: {
      home:     "← Accueil",
      projects: "← Projets",
      contact:  "Contact",
    },
    slider: {
      scrollToOpen: "Défiler ↓ pour ouvrir",
      navigate:     "Naviguer",
      filters: {
        all:          "Tous",
        game:         "Jeu",
        ui:           "UI",
        conceptArt:   "Concept Art",
        illustration: "Illustration",
        animation:    "Animation",
        branding:     "Branding",
      },
    },
    project: {
      type:         "Type",
      year:         "Année",
      role:         "Rôle",
      tools:        "Outils",
      client:       "Client",
      deliverables: "Livrables",
      info:         "Info",
      scrollDown:   "défiler vers le bas",
    },
    cuisine: {
      pivotHint:   "Défiler ↓ pour pivoter",
      exploreHint: "Défiler ↓ pour explorer",
      goTop:       "Revenir au début",
    },
    projects: {
      "01": {
        description:  "Design UI et développement visuel pour un jeu casual de cuisine mobile & PC dans le style iliko. Mise en page des écrans, design du HUD, iconographie, game flow et identité visuelle.",
        category:     "Jeu · Mobile & PC",
        type:         "UI / Art de Jeu",
        role:         "Concept Artist · Designer UI",
      },
      "02": {
        description:  "Concept art d'environnement pour Aporion VTT, une plateforme de jeu de rôle virtuel nouvelle génération. J'ai travaillé sur les key visuals, l'idéation architecturale et les études d'ambiance lumineuse pour trois biomes principaux : le port, la ville fluviale et le château.",
        category:     "Jeu · Art d'Environnement",
        type:         "Design d'Environnement",
        role:         "Concept Artist",
        deliverables: "Art Concept d'Environnement · Key Visuals · Set Design",
      },
      "03": {
        description:  "Identité de marque complète pour Lumi — une réinvention végétale du taiyaki japonais. Design du logo, système de packaging, palette chromatique, accord typographique, charte graphique et brand book.",
        category:     "Branding · Packaging",
        type:         "Identité de Marque",
        role:         "Brand Designer · Directrice Artistique",
      },
      "04": {
        description:  "Une courte animation dessinée à la main — illustrée image par image dans Procreate sur iPad, puis compositée et animée dans After Effects.",
        category:     "Animation 2D",
        type:         "Court Métrage d'Animation",
        role:         "Animatrice 2D",
      },
      "05": {
        description:  "Pipeline complet de concept art de production pour un RPG néo-médiéval. Comprend le world-building, les key frames d'environnement, les orthographiques de set design, les turnarounds de personnages, les planches de design de costumes, le design de props, le blockout 3D et le design UI/UX.",
        category:     "Jeu · Production Complète",
        type:         "Design de Production",
        role:         "Concept Artist · Game Designer",
        deliverables: "Character Sheets · Concepts d'Environnement · Set Design · Props · UI",
      },
      "06": {
        description:  "Développement visuel pour un roman graphique post-apocalyptique à New York. Design de couverture, concepts de personnages, exploration de costumes, mood boards d'environnement et direction artistique de la narration séquentielle.",
        category:     "Concept Art · Édition",
        type:         "Roman Graphique",
        role:         "Illustratrice · Directrice Artistique",
      },
      "07": {
        description:  "Design de props et de tours saisonniers pour un jeu de stratégie tower-defense. Quatre biomes saisonniers distincts — été, automne, hiver et printemps — avec un langage de silhouette cohérent, des lectures matières et un color script par saison.",
        category:     "Jeu · Design de Props",
        type:         "Art de Jeu",
        role:         "Concept Artist",
      },
      "08": {
        description:  "La Belle aux Miel Dormant — livre illustré original pour enfants. Narration picturale complète, character design, illustration d'environnements et typographie lettrée à la main. Une réinterprétation de La Belle au Bois Dormant dans l'univers des abeilles et des prairies enchantées.",
        category:     "Illustration · Livre",
        type:         "Livre Jeunesse",
        role:         "Illustratrice · Autrice",
      },
      "09": {
        description:  "Carnet personnel — fan arts, études de personnages, explorations de concept de créatures et techniques d'illustration expérimentales développées sur plusieurs années de pratique artistique.",
        category:     "Illustration · Divers",
        type:         "Techniques Mixtes",
        role:         "Illustratrice",
      },
    },
  },
} as const;

export default t;
