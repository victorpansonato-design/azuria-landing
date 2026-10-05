import Link from "next/link";
import { whatsapp } from "@/data/business";
export function Legal({ type }: { type: "privacidade" | "termos" }) {
  return (
    <main id="conteudo" className="inner-page legal-page">
      <div className="breadcrumb">
        <Link href="/">Azuria</Link>
        <span>/ {type === "privacidade" ? "Privacidade" : "Termos"}</span>
      </div>
      <span className="eyebrow">Protótipo identificado</span>
      <h1>
        {type === "privacidade" ? "Privacidade" : "Termos de uso"}
        <br />
        em preparação.
      </h1>
      <p>
        O texto do produto final ainda precisa ser definido antes do lançamento.
        Esta página não apresenta uma política legal aprovada.
      </p>
      <p>
        {type === "privacidade"
          ? "Nesta demonstração, o formulário e a conversa do Zuri ficam apenas na memória da aba. Não enviamos esses dados a servidor ou WhatsApp; recarregar descarta esse contexto. Você pode limpar a conversa no painel do Zuri."
          : "A contratação é uma simulação. Nenhum pagamento é realizado e nenhuma assinatura é ativada. Condições de renovação, cancelamento, reembolso e início das entregas ainda precisam ser confirmadas com Victor."}
      </p>
      <p>
        Os contatos externos abrem os serviços indicados somente após seu
        clique.
      </p>
      <a
        href={whatsapp()}
        target="_blank"
        rel="noreferrer"
        className="button blue"
      >
        Falar com Victor
      </a>
      <Link href="/planos">Voltar ao plano</Link>
    </main>
  );
}
