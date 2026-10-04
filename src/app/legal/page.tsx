import type { Metadata } from "next";
import LegalView from "./LegalView";

export const metadata: Metadata = {
  title: "Mentions légales & confidentialité — Putri Zahara",
  description: "Mentions légales, politique de confidentialité, cookies et conditions d'utilisation du portfolio de Putri Zahara.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return <LegalView />;
}
