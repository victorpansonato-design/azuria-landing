import faq from "@/data/zuri-faq.json";
import { business, plan, price, totals } from "@/data/business";
import { directions, artworks } from "@/data/gallery";
export const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const variables: Record<string, unknown> = {
  ...plan,
  ...business.adjustments,
  price,
  storiesPerCycle: totals.stories,
  storiesPerDelivery: totals.storiesPerDelivery,
  "perDelivery.staticFeed": plan.perDelivery.staticFeed,
  "perDelivery.carouselFeed": plan.perDelivery.carouselFeed,
};
export const template = (text: string) =>
  text.replace(/\{\{([^}]+)\}\}/g, (_, key: string) =>
    String(variables[key] ?? ""),
  );
export type Reply = {
  text: string;
  action: string;
  ids: string[];
  direction?: string;
};
const moods: Record<string, string[]> = {
  "luxo-sensorial": [
    "luxo",
    "elegante",
    "elegancia",
    "sensorial",
    "sofisticado",
    "sofisticada",
  ],
  "tipografia-impacto": [
    "ousado",
    "ousada",
    "ousados",
    "ousadas",
    "energia",
    "impacto",
    "promocao",
  ],
  "colagem-texturas": ["urbano", "urbana", "textura", "colagem"],
  "surreal-3d": ["inesperado", "inesperada", "futurista", "surreal", "3d"],
  "ilustracao-pop": [
    "divertido",
    "divertida",
    "personagem",
    "pop",
    "ilustracao",
  ],
  "editorial-minimalismo": [
    "leve",
    "minimal",
    "minimalista",
    "editorial",
    "minimalismo",
  ],
};
export function curate(text: string): Reply | undefined {
  const tokens = normalize(text).split(" ");
  const found = Object.entries(moods).find(([, words]) =>
    words.some((word) => tokens.includes(word)),
  );
  if (!found) return undefined;
  const direction = directions.find((d) => d.id === found[0])!;
  const reasons: Record<string, string> = {
    "luxo-sensorial":
      "Luz dirigida e textura valorizam o produto com uma presença sofisticada.",
    "tipografia-impacto":
      "Escala e contraste criam uma presença ousada, com o produto em destaque.",
    "colagem-texturas":
      "Recortes e texturas trazem ritmo e uma personalidade urbana.",
    "surreal-3d":
      "Mudanças de escala e cenários inesperados transformam o produto em uma ideia visual.",
    "ilustracao-pop":
      "Personagens e formas expressivas combinam com uma presença divertida.",
    "editorial-minimalismo":
      "Respiro, fotografia e hierarquia deixam sua marca falar com leveza.",
  };
  return {
    text: `${direction.name}: ${reasons[direction.id]} São referências; a direção do ciclo será aprovada no briefing.`,
    action: "estilos",
    ids: artworks
      .filter((a) => a.directionId === direction.id)
      .slice(0, 2)
      .map((a) => a.id),
    direction: direction.id,
  };
}
const extraPhrases: Record<string, string[]> = {
  incluido: [
    "inclui o que",
    "inclui",
    "incluido",
    "o que vem no plano",
    "o que vem no pacote",
    "o que tem no plano",
    "o que esta incluso",
    "o que esta incluido",
  ],
  preco: ["custa", "custo", "valor", "qnt custa"],
  publicacao: [
    "publica no insta",
    "publica no instagram",
    "faz tudo sozinho",
    "publicacao automatica",
  ],
  gerador: ["gpt", "llm", "ia"],
  prazo_inicial: ["em quanto tempo recebo", "quanto tempo para receber"],
  cancelamento: ["posso cancelar"],
  carrossel: ["carrosseis", "4 paginas sao 4 posts"],
};
export function matchQuestion(
  input: string,
  previousIds: string[] = [],
): Reply {
  const text = normalize(input.slice(0, 600))
    .replace(/\bcarroseis\b/g, "carrosseis")
    .replace(/\bprecu\b/g, "preco");
  const style = curate(text);
  if (style) return style;
  if (/^(e )?(o prazo|prazo|quanto tempo|qual prazo)$/.test(text))
    return {
      text: "Você quer saber o prazo da primeira entrega, a janela para pedir ajustes ou o atendimento?",
      action: "none",
      ids: ["prazo"],
    };
  if (
    previousIds.includes("prazo") &&
    /^(primeira|primeira entrega|entrega)$/.test(text)
  )
    return {
      text: template(faq.intents.find((i) => i.id === "prazo_inicial")!.answer),
      action: "whatsapp",
      ids: ["prazo_inicial"],
    };
  if (previousIds.includes("prazo") && /^(ajuste|ajustes|revisao)$/.test(text))
    return {
      text: template(faq.intents.find((i) => i.id === "ajuste_prazo")!.answer),
      action: "planos",
      ids: ["ajuste_prazo"],
    };
  const padded = ` ${text} `;
  const matches = faq.intents
    .map((intent) => {
      const phrases = [
        ...intent.phrases,
        ...(extraPhrases[intent.id] || []),
      ].map(normalize);
      const score = Math.max(
        0,
        ...phrases.map((phrase) =>
          padded.includes(` ${phrase} `)
            ? phrase.split(" ").length * 3 + phrase.length / 20
            : 0,
        ),
      );
      return { intent, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  if (matches.length) {
    const picked = matches
      .slice(0, 3)
      .filter(
        (m, i, all) =>
          !(
            m.intent.id === "entregas" &&
            all.some((x) => x.intent.id === "cinco_semanas")
          ) &&
          !(
            m.intent.id === "ajustes" &&
            all.some((x) => x.intent.id === "ajuste_prazo")
          ),
      );
    return {
      text: picked.map((m) => template(m.intent.answer)).join("\n\n"),
      action: picked.some((m) => m.intent.action === "whatsapp")
        ? "whatsapp"
        : picked[0].intent.action,
      ids: picked.map((m) => m.intent.id),
    };
  }
  if (/(pet|joias|restaurante|loja|negocio)/.test(text))
    return {
      text: "O segmento ajuda, mas não define o estilo. Qual sensação você quer passar: elegante, ousada, divertida ou leve? Posso mostrar duas referências a partir disso.",
      action: "curadoria",
      ids: ["nichos"],
    };
  return {
    text: "Posso ajudar com a Azuria, os estilos e o plano. Não tenho uma resposta segura para essa pergunta. O Victor pode conversar com você sobre o seu caso.",
    action: "whatsapp",
    ids: ["fallback"],
  };
}
