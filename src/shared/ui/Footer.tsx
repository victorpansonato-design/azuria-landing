import Link from "next/link";
import { Arrow, SocialIcon } from "./Icons";
import { business, whatsapp } from "@/data/business";
import { LiquidWordmark } from "./LiquidWordmark";
export function Footer({ compact = false, ctaHref }: { compact?: boolean; ctaHref?: string }) {
  return (
    <footer
      id="contato"
      className={`footer2 ${compact ? "footer2-compact" : ""}`}
      data-scene="footer"
    >
      <div className="footer2-sky" aria-hidden="true" />
      <div className="footer2-top">
        <div>
          <span className="eyebrow">O próximo movimento é seu.</span>
          <h2>
            Vamos fazer
            <br />
            <em>sua marca ficar?</em>
          </h2>
        </div>
        <div className="footer2-companion" data-zuri-home>
          <span>
            O Zuri veio se despedir.
            <br />
            Pode arrastar. Ele gosta.
          </span>
        </div>
      </div>
      <div className="footer2-links">
        <Link className="button white" href={ctaHref ?? (compact ? "/planos" : "#plano")}>
          Dar uma direção à minha marca <Arrow diagonal />
        </Link>
        <a href={whatsapp()} target="_blank" rel="noreferrer">
          <SocialIcon kind="whatsapp" /> Vamos conversar <Arrow diagonal />
        </a>
        <a
          href={business.contacts.instagramUrl}
          target="_blank"
          rel="noreferrer"
        >
          <SocialIcon kind="instagram" /> @_{"capitanii"}_ <Arrow diagonal />
        </a>
      </div>
      <LiquidWordmark />
      <div className="footer2-bottom">
        <span>© {new Date().getFullYear()} Azuria</span>
        <span>Um projeto de Victor Capitani.</span>
        <nav aria-label="Rodapé">
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/termos">Termos</Link>
          <a href="#conteudo">Voltar ao topo ↑</a>
        </nav>
      </div>
    </footer>
  );
}
