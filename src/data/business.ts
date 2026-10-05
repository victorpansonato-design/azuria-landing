import config from "./config-landing.json";
export const business = config;
export const plan = config.plan;
export const price = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
}).format(plan.priceCents / 100);
export const totals = {
  stories: plan.storyAdaptationsPerCycle + plan.storyComplementsPerCycle,
  storiesPerDelivery:
    plan.perDelivery.storyAdaptations + plan.perDelivery.storyComplements,
  feedPublications: plan.staticFeedPerCycle + plan.carouselFeedPerCycle,
};
export const included = [
  `${plan.staticFeedPerCycle} posts estáticos para feed`,
  `${plan.carouselFeedPerCycle} carrosséis de até ${plan.maxPagesPerCarouselIncludingCover} páginas, incluindo a capa`,
  `${totals.stories} stories: ${plan.storyAdaptationsPerCycle} adaptações + ${plan.storyComplementsPerCycle} complementos`,
  `${plan.deliveriesPerCycle} entregas organizadas por ciclo`,
  `${plan.approvedDirectionsPerCycle} direção de arte aprovada por ciclo`,
  `${config.adjustments.consolidatedRoundsPerDelivery} rodada consolidada de ajustes por entrega, solicitada em até ${config.adjustments.requestWindowBusinessDays} dias úteis`,
  "Artes, legendas e downloads organizados no portal",
];
export const whatsapp = (
  message = "Olá, Victor! Quero conhecer o plano da Azuria.",
) => `${config.contacts.whatsappUrl}?text=${encodeURIComponent(message)}`;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || undefined;
export const platformUrl =
  process.env.NEXT_PUBLIC_PLATFORM_URL ||
  (config.contacts.platformVerified ? config.contacts.platformUrl : undefined);
