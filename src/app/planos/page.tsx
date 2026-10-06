import type { Metadata } from "next";
import { PlanExperience } from "@/features/pricing/PlanExperience";
import {
  business,
  plan,
  price,
  totals,
  siteUrl,
} from "@/data/business";
import "./plans-art.css";

export const metadata: Metadata = {
  title: "Plano — Sua marca merece ser lembrada.",
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
  return <PlanExperience faqs={faqs} />;
}
