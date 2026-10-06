import type { Metadata } from "next";

const title = "Portfolio — Putri Zahara, Concept Artist & Illustrator";
const description =
  "Projets de concept art, illustration et UI/UX de Putri Zahara : Aporion, The Ethians Redeemed, P.S. Apocalypse, Cuisine Royale et plus.";

// The page itself is a client component, so its metadata lives here.
// openGraph is redeclared in full: nested fields replace the root layout's, they don't merge.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: {
    type: "website",
    url: "/portfolio",
    siteName: "Putri Zahara",
    title,
    description,
    images: [
      {
        url: "/images/landingpage/Harbor_thumbnail_final_obi_1920.webp",
        width: 1920,
        height: 1080,
        alt: "Concept art — Putri Zahara",
      },
    ],
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
