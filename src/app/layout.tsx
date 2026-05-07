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
  title: "Putri Zahara — Concept Artist & UI/UX Designer",
  description: "Portfolio de Putri Zahara, Concept Artist et UI/UX Designer. Disponible pour des projets freelance et des opportunités full-time.",
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
      <head>
        {/* Preload 3D model so it's cached before portfolio page opens */}
        <link rel="preload" href="/asset3D/scene.gltf" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/asset3D/scene.bin"  as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col"><LangProvider><ContactProvider>{children}</ContactProvider></LangProvider></body>
    </html>
  );
}
