import type { Metadata } from "next";
import { Reenie_Beanie } from "next/font/google";
import AboutView from "./AboutView";

// Ballpoint handwriting for the collage annotations
const hand = Reenie_Beanie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "About — Putri Zahara, Concept Artist & Illustrator",
  description: "Putri Zahara, concept artist et illustratrice, 4ème année au Gaming Campus Lyon. En recherche d'alternance et de stage.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView fontClass={hand.variable} />;
}
