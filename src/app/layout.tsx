import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/contexts/LangContext";
import { ContactProvider } from "@/contexts/ContactContext";

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit:  "cover",
  themeColor:   "#000000",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.putrizahara.com"),
  title: "Putri Zahara — Concept Artist & UI/UX Designer",
  description: "Portfolio de Putri Zahara, Concept Artist et UI/UX Designer. Disponible pour des projets freelance et des opportunités full-time.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Putri Zahara",
    title: "Putri Zahara — Concept Artist & UI/UX Designer",
    description: "Portfolio de Putri Zahara, Concept Artist et UI/UX Designer. Disponible pour des projets freelance et des opportunités full-time.",
    images: [
      {
        url: "/images/landingpage/Harbor_thumbnail_final_obi_1920.webp",
        width: 1920,
        height: 1080,
        alt: "Concept art — Putri Zahara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Putri Zahara — Concept Artist & UI/UX Designer",
    description: "Portfolio de Putri Zahara, Concept Artist et UI/UX Designer.",
    images: ["/images/landingpage/Harbor_thumbnail_final_obi_1920.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col"><LangProvider><ContactProvider>{children}</ContactProvider></LangProvider></body>
    </html>
  );
}
