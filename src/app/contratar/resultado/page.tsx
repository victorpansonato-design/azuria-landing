import { siteUrl } from "@/data/business";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Result } from "@/features/checkout/Result";
export const metadata: Metadata = {
  title: "Resultado da simulação",
  description:
    "Estados demonstrativos da contratação Azuria. A simulação não ativa assinatura ou acesso ao portal.",
  ...(siteUrl ? { alternates: { canonical: "/contratar/resultado" } } : {}),
};
export default function ResultPage() {
  return (
    <main id="conteudo" className="inner-page result-page">
      <Suspense fallback={<p>Carregando demonstração…</p>}>
        <Result />
      </Suspense>
    </main>
  );
}
