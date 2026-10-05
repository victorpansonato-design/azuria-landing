import { Logo } from "@/shared/ui/Logo";
import { Arrow } from "@/shared/ui/Icons";
import { price } from "@/data/business";
import { BlueField } from "./BlueField";

export function Hero() {
  return (
    <section className="hero2" data-scene="hero" aria-labelledby="hero-heading">
      <div className="hero2-stage">
        <BlueField />
        <div className="hero2-content">
          <div className="hero2-brand">
            <Logo white />
            <span>
              Direção de arte.
              <br />
              Presença de verdade.
            </span>
          </div>
          <h1 id="hero-heading">
            <span>Sua marca.</span>
            <span>
              Outro <em>nível.</em>
            </span>
          </h1>
          <div className="hero2-bottom">
            <p>
              Seu negócio já tem personalidade.
              <br />
              Vamos fazer o seu Instagram mostrar isso.
              <br />
              <span>Posts, carrosséis e stories com direção de arte.</span>
            </p>
            <div>
              <a className="button white" href="#plano">
                Quero elevar minha marca <Arrow diagonal />
              </a>
              <small>Uma boa direção. {price} por ciclo mensal.</small>
            </div>
          </div>
          <div className="hero2-foot">
            <a href="#estilos">
              Um novo olhar começa aqui <span>↓</span>
            </a>
            <span>AZURIA — DESIGN & CONTEÚDO</span>
          </div>
        </div>
        <div className="hero2-opening" aria-hidden="true">
          <img src="/brand/azuria-logo-branca.svg" alt="" />
          <span>um novo olhar.</span>
        </div>
      </div>
    </section>
  );
}
