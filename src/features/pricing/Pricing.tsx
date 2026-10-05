import Link from "next/link";
import { price, plan, totals, included, whatsapp } from "@/data/business";
import { Arrow, SocialIcon } from "@/shared/ui/Icons";
export function PlanDetails({ checkout = false }: { checkout?: boolean }) {
  return (
    <div className="plan-details">
      <div className="plan-name">
        Azuria<span>Ciclo mensal</span>
      </div>
      <div className="plan-price">
        {price}
        <span>por ciclo mensal</span>
      </div>
      <p>
        Uma direção. Quatro entregas.
        <br />
        Uma presença que faz sentido para sua marca.
      </p>
      <ul className="included-list">
        {included.map((item) => (
          <li key={item}>
            <span aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <Link href={checkout ? "/contratar" : "/planos"} className="button blue">
        {checkout ? "Continuar para contratação" : "Conhecer e contratar"}
        <Arrow diagonal />
      </Link>
      <small>
        {plan.perDelivery.staticFeed} posts + {plan.perDelivery.carouselFeed}{" "}
        carrossel + {totals.storiesPerDelivery} stories em cada entrega.
      </small>
    </div>
  );
}
export function Pricing() {
  return (
    <section
      id="plano"
      className="pricing2 pricing3"
      data-scene="pricing"
      aria-labelledby="pricing-heading"
    >
      <div className="pricing3-material" aria-hidden="true" />
      <div className="pricing2-title">
        <span className="eyebrow">03 / Seu próximo nível</span>
        <h2 id="pricing-heading">
          Sua marca merece
          <br />
          <em>esse cuidado.</em>
        </h2>
        <p>
          Design com personalidade. Conteúdo com constância.
          <br />
          Um ciclo completo para tirar seu Instagram do improviso.
        </p>
      </div>
      <div className="pricing2-offer">
        <div className="pricing2-price">
          <span className="pricing3-label">UM PLANO. UMA NOVA PRESENÇA.</span>
          <div className="pricing3-number">
            <sup>R$</sup>
            <strong>{plan.priceCents / 100}</strong>
          </div>
          <span className="pricing3-period">por ciclo mensal · {plan.deliveriesPerCycle} entregas</span>
          <p>
            Sua personalidade em cada peça.
            <br />
            A criação e a organização ficam com a Azuria.
          </p>
          <Link className="button white" href="/planos">
            Começar meu próximo nível <Arrow diagonal />
          </Link>
          <small>Veja todos os detalhes do plano e continue para contratação.</small>
        </div>
        <div className="pricing2-scope">
          <h3>
            Seu ciclo, por inteiro.
          </h3>
          <dl className="pricing3-quantities">
            <div><dt>Posts</dt><dd>{plan.staticFeedPerCycle}</dd></div>
            <div><dt>Carrosséis</dt><dd>{plan.carouselFeedPerCycle}</dd></div>
            <div><dt>Stories</dt><dd>{totals.stories}</dd></div>
          </dl>
          <p className="pricing3-delivery">{plan.deliveriesPerCycle} entregas. Uma direção de arte aprovada.<br />Artes + legendas + downloads no portal.</p>
          <ul className="included-list">
            {included.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <span>2 posts + 1 carrossel + 6 stories em cada entrega.</span>
        </div>
      </div>
      <div className="pricing2-bespoke">
        <span className="eyebrow">Sob medida</span>
        <h3>
          Sua campanha
          <br />
          pede algo a mais?
        </h3>
        <p>
          Artes adicionais, campanhas especiais e novas direções: vamos montar
          um escopo para sua marca.
        </p>
        <a
          href={whatsapp(
            "Olá, Victor! Quero conversar sobre um projeto sob medida para minha marca.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          <SocialIcon kind="whatsapp" />
          Conversar sobre um projeto
          <Arrow diagonal />
        </a>
        <span className="bespoke-note">
          Orçamento independente do plano mensal.
        </span>
      </div>
    </section>
  );
}
