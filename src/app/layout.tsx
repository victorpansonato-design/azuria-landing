import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/shared/ui/Header";
import { Zuri } from "@/features/zuri/Zuri";
import { SceneMotion } from "@/shared/motion/SceneMotion";
import { PerformanceProbe } from "@/shared/motion/PerformanceProbe";
import { ScrollExperience } from "@/shared/motion/ScrollExperience";
import { PlanTransition } from "@/shared/motion/PlanTransition";
import { siteUrl, price } from "@/data/business";
import "./globals.css";
import "lenis/dist/lenis.css";
import "./v2.css";
import "./immersive.css";
import "./zuri-v3.css";
const manrope = localFont({
  src: "../../public/brand/Manrope.ttf",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});
const instrument = localFont({
  src: "../../public/brand/InstrumentSans.woff2",
  display: "swap",
  variable: "--font-instrument",
  weight: "400 700",
});
export const metadata: Metadata = {
  title: {
    default: "Azuria — Seu produto tem o que mostrar.",
    template: "%s | Azuria",
  },
  description: `Posts, carrosséis e stories com direção de arte e entregas organizadas. Design para pequenas marcas, por ${price} por ciclo mensal.`,
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: "Azuria — Sua marca tem o que mostrar.",
    description: "Direção de arte. Conteúdo com rotina.",
    locale: "pt_BR",
    type: "website",
    ...(siteUrl ? { images: ["/og.png"] } : {}),
  },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#164BEA",
  interactiveWidget: "resizes-content",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${instrument.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preload" as="image" href="/brand/azuria-blue-field-4k.webp" media="(min-width: 900px)" />
        <link rel="preload" as="image" href="/brand/azuria-blue-field-mobile.webp" media="(max-width: 899px)" />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        {children}
        <Zuri />
        <SceneMotion />
        <ScrollExperience />
        <PlanTransition />
        <PerformanceProbe />
      </body>
    </html>
  );
}
