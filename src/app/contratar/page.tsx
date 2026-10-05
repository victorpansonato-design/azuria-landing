import { siteUrl } from "@/data/business";
import type { Metadata } from "next";
import Link from "next/link";
import { Checkout } from "@/features/checkout/Checkout";
export const metadata: Metadata = {
  title: "Contratação demonstrativa",
  description:
    "Explore a contratação do plano Azuria. Ambiente de demonstração: nenhum cartão ou pagamento será solicitado.",
  ...(siteUrl ? { alternates: { canonical: "/contratar" } } : {}),
};
export default function Contract() {
  return (
    <main id="conteudo" className="inner-page">
      <div className="breadcrumb">
        <Link href="/">Azuria</Link>
        <span>/</span>
        <Link href="/planos">Plano</Link>
        <span>/ Contratação</span>
      </div>
      <Checkout />
    </main>
  );
}
