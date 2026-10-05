import Link from "next/link";
export default function NotFound() {
  return (
    <main id="conteudo" className="inner-page legal-page">
      <span className="eyebrow">Página não encontrada</span>
      <h1>
        Vamos voltar
        <br />
        para a direção certa.
      </h1>
      <Link href="/" className="button blue">
        Voltar ao início
      </Link>
    </main>
  );
}
