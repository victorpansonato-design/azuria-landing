import type { Metadata } from "next";
import Link from "next/link";
import { PlanDetails } from "@/features/pricing/Pricing";
import { PlatformPreview } from "@/features/process/PlatformPreview";
import { Footer } from "@/shared/ui/Footer";
import { Arrow } from "@/shared/ui/Icons";
import {
  business,
  plan,
  price,
  totals,
  whatsapp,
  siteUrl,
} from "@/data/business";
export const metadata: Metadata = {
  title: "Plano — Design forte. Escopo claro.",
  description: `${price} por ciclo mensal: posts, carrosséis e stories com direção de arte, quatro entregas e conteúdo organizado no portal. Conheça o escopo completo.`,
  ...(siteUrl ? { alternates: { canonical: "/planos" } } : {}),
};
const faqs = [
  [
    "O que recebo em cada entrega?",
    `${plan.perDelivery.staticFeed} posts estáticos, ${plan.perDelivery.carouselFeed} carrossel de até ${plan.maxPagesPerCarouselIncludingCover} páginas incluindo a capa e ${totals.storiesPerDelivery} stories. O ciclo tem ${plan.deliveriesPerCycle} entregas.`,
  ],
  [
    "Como funcionam os ajustes?",
    `Uma rodada consolidada de ajustes por entrega, solicitada em até ${business.adjustments.requestWindowBusinessDays} dias úteis a partir do próximo dia útil após a entrega. Erros da própria Azuria não consomem essa rodada. Mudanças de escopo são sob orçamento.`,
  ],
  [
    "Posso usar mais de um estilo?",
    `O plano inclui ${plan.approvedDirectionsPerCycle} direção de arte aprovada por ciclo. Novas direções e campanhas especiais podem ter um orçamento próprio.`,
  ],
  [
    "Um mês com cinco semanas muda a quantidade?",
    `O plano é um ciclo mensal com ${plan.deliveriesPerCycle} entregas. Cinco semanas não aumentam automaticamente as quantidades contratadas.`,
  ],
  [
    "Vocês publicam no Instagram?",
    "A oferta entrega conteúdo organizado, com artes, legendas e downloads. Publicação ou agendamento automático no Instagram não estão incluídos.",
  ],
  [
    "As artes da galeria são clientes da Azuria?",
    "A galeria deste protótipo é uma curadoria de referências de terceiros para explorar linguagens. Os créditos disponíveis estão nos detalhes de cada obra.",
  ],
  [
    "Quando recebo a primeira entrega?",
    "O prazo inicial precisa ser alinhado com Victor e com o briefing. Nenhum prazo fixo está aprovado nesta demonstração.",
  ],
  [
    "Como funcionam pagamento, cancelamento e reembolso?",
    "Este checkout é demonstrativo. Gateway, renovação, cancelamento e reembolso precisam ser definidos antes da contratação real. Converse com Victor para confirmar as condições.",
  ],
];
export default function Plans() {
  return (
    <>
      <main id="conteudo" className="inner-page plans-page">
        <div className="breadcrumb">
          <Link href="/">Azuria</Link>
          <span>/ Plano</span>
        </div>
        <header className="page-heading">
          <span className="eyebrow">Direção para a sua marca</span>
          <h1>
            Design forte.
            <br />
            Escopo claro.
          </h1>
          <p>
            Uma presença visual com intenção.
            <br />
            {price} por ciclo mensal, em {plan.deliveriesPerCycle} entregas.
          </p>
          <Link href="/contratar" className="button blue">
            Continuar para contratação
            <Arrow diagonal />
          </Link>
        </header>
        <div className="plans-stage">
          <PlanDetails checkout />
          <div className="delivery-preview">
            <h2>Uma entrega, por dentro.</h2>
            <p>
              Mude a entrega na prévia para explorar a organização. As
              quantidades permanecem iguais em cada uma.
            </p>
            <PlatformPreview />
          </div>
        </div>
        <section className="comparison">
          <h2>Você sabe o que está no plano.</h2>
          <div>
            <article>
              <h3>Incluído</h3>
              <p>
                Direção aprovada, peças do ciclo, legendas, acesso aos conteúdos
                e rodada de ajustes dentro da janela definida.
              </p>
            </article>
            <article>
              <h3>Sob orçamento</h3>
              <p>
                Artes adicionais, campanhas especiais e novas direções de arte.
                Um escopo combinado para o que sua marca precisa.
              </p>
              <a
                href={whatsapp(
                  "Olá, Victor! Quero conversar sobre um projeto sob medida para minha marca.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                Conversar sobre um projeto
                <Arrow diagonal />
              </a>
            </article>
          </div>
        </section>
        <section className="faq">
          <span className="eyebrow">Antes de começar</span>
          <h2>
            O que você
            <br />
            quer saber?
          </h2>
          <div>
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <div className="plans-final">
          <h2>
            Pronto para dar uma direção
            <br />
            ao seu Instagram?
          </h2>
          <Link href="/contratar" className="button blue">
            Continuar para contratação
            <Arrow diagonal />
          </Link>
        </div>
      </main>
      <Footer compact />
    </>
  );
}
