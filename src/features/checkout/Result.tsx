"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { business, price, whatsapp } from "@/data/business";
import { type CheckoutStatus } from "./payment";
import { Arrow } from "@/shared/ui/Icons";
const states: Record<
  CheckoutStatus,
  { title: string; body: string; symbol: string }
> = {
  aguardando: {
    title: "Checkout em demonstração.",
    body: "Explore o retorno de um checkout hospedado. Escolha um resultado abaixo para continuar a simulação.",
    symbol: "↗",
  },
  concluido: {
    title: "Simulação concluída.",
    body: "O fluxo demonstrativo chegou ao final. Nenhum pagamento foi realizado e nenhuma assinatura está ativa.",
    symbol: "✓",
  },
  cancelado: {
    title: "Simulação cancelada.",
    body: "Você pode retomar a mesma tentativa. Os dados preenchidos continuam na memória enquanto esta aba não for recarregada.",
    symbol: "↶",
  },
  erro: {
    title: "Erro demonstrativo.",
    body: "Este estado representa uma falha de checkout. Você pode tentar novamente sem criar uma cobrança.",
    symbol: "!",
  },
};
export function Result() {
  const params = useSearchParams();
  const router = useRouter();
  const rawId = params.get("tentativa");
  const validId =
    rawId &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(rawId)
      ? rawId
      : undefined;
  const raw = params.get("estado");
  const status =
    validId && raw && Object.hasOwn(states, raw)
      ? (raw as CheckoutStatus)
      : undefined;
  const scene = status
    ? states[status]
    : {
        title: "Inicie uma demonstração.",
        body: "Para preservar o contexto da tentativa, comece pela página de contratação.",
        symbol: "↗",
      };
  function change(next: CheckoutStatus) {
    if (validId)
      router.replace(
        `/contratar/resultado?estado=${next}&tentativa=${validId}`,
        { scroll: false },
      );
  }
  return (
    <div className="result-card">
      <span className="result-symbol" aria-hidden="true">
        {scene.symbol}
      </span>
      <span className="eyebrow">{business.checkout.demoNotice}</span>
      <h1>{scene.title}</h1>
      <p aria-live="polite">{scene.body}</p>
      {validId && (
        <small>
          Tentativa {validId.slice(0, 8)} · Plano Azuria · {price}/ciclo
        </small>
      )}
      {status === "aguardando" ? (
        <div className="result-actions">
          <button className="button blue" onClick={() => change("concluido")}>
            Simular conclusão
            <Arrow />
          </button>
          <button
            className="button outline"
            onClick={() => change("cancelado")}
          >
            Simular cancelamento
          </button>
          <button className="text-button" onClick={() => change("erro")}>
            Testar estado de erro
          </button>
        </div>
      ) : (
        <div className="result-actions">
          <Link className="button blue" href="/contratar">
            {status === "cancelado" || status === "erro"
              ? "Retomar tentativa"
              : "Voltar à contratação"}
            <Arrow />
          </Link>
          <Link href="/planos" className="button outline">
            Revisar plano
          </Link>
        </div>
      )}
      <a href={whatsapp()} target="_blank" rel="noreferrer">
        Conversar com Victor
        <Arrow diagonal />
      </a>
    </div>
  );
}
