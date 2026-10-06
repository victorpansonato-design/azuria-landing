import Link from "next/link";
import { PlatformPreview } from "@/features/process/PlatformPreview";
import { Footer } from "@/shared/ui/Footer";
import { Arrow } from "@/shared/ui/Icons";
import { included, plan, price, totals, whatsapp } from "@/data/business";
import { PlanMark, PlansArtwork } from "./PlansArtwork";
import { PlanArtMotion } from "./PlanArtMotion";

export function PlanExperience({ faqs }: { faqs: string[][] }) {
  return (
    <>
      <main id="conteudo" className="plans-art-page" data-plan-experience>
        <PlanArtMotion />
        <section className="plan4-hero" data-scene="plan-hero" aria-labelledby="plan4-heading">
          <div className="plan4-hero-top"><span className="plan4-kicker">AZURIA / UM PLANO. UMA NOVA PRESENÇA.</span><Link href="/">Voltar para a Azuria <Arrow diagonal /></Link></div>
          <div className="plan4-hero-grid">
            <div className="plan4-hero-copy">
              <h1 id="plan4-heading">Sua marca.<br />Merece ser<br /><em>lembrada.</em></h1>
              <p>Você cuida do seu negócio.<br />A gente dá forma à sua personalidade, com conteúdo e direção de arte para o seu Instagram.</p>
              <div className="plan4-hero-actions"><Link href="/contratar" className="plan4-cta plan4-cta-lime">Quero essa nova presença <Arrow diagonal /></Link><a className="plan4-text-link" href="#seu-ciclo">Ver o que está no plano <span aria-hidden="true">↓</span></a></div>
              <span className="plan4-hero-price">{price} por ciclo mensal. <span>{plan.deliveriesPerCycle} entregas. Uma direção.</span></span>
            </div>
            <PlansArtwork />
          </div>
          <div className="plan4-hero-foot"><span>PERSONALIDADE É O PONTO DE PARTIDA.</span><span>O PRÓXIMO MOVIMENTO É SEU. ↘</span></div>
        </section>

        <section id="seu-ciclo" className="plan4-scope" data-scene="plan-scope" aria-labelledby="plan4-scope-heading">
          <header className="plan4-section-head" data-plan-reveal><span className="plan4-kicker">01 / O PLANO POR INTEIRO</span><h2 id="plan4-scope-heading">Um mês de conteúdo.<br /><em>Uma marca com direção.</em></h2><p>Presença se constrói peça por peça.<br />Seu ciclo reúne criação, legenda e organização.</p></header>
          <div className="plan4-scope-layout">
            <div className="plan4-scope-content" data-plan-reveal>
              <dl className="plan4-volumes">
                <div><dt>Posts para o feed</dt><dd>{String(plan.staticFeedPerCycle).padStart(2, "0")}</dd><span>Personalidade em uma imagem.</span></div>
                <div><dt>Carrosséis</dt><dd>{String(plan.carouselFeedPerCycle).padStart(2, "0")}</dd><span>Até {plan.maxPagesPerCarouselIncludingCover} páginas, incluindo a capa.</span></div>
                <div><dt>Stories</dt><dd>{totals.stories}</dd><span>{plan.storyAdaptationsPerCycle} adaptações + {plan.storyComplementsPerCycle} complementos.</span></div>
              </dl>
              <div className="plan4-delivery-line"><span className="plan4-delivery-dot" /><p><strong>{plan.deliveriesPerCycle} entregas no ciclo.</strong> Em cada uma: {plan.perDelivery.staticFeed} posts, {plan.perDelivery.carouselFeed} carrossel e {totals.storiesPerDelivery} stories.</p></div>
              <h3 className="plan4-included-heading">O cuidado também está nos detalhes.</h3>
              <ul className="plan4-included">{included.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul>
            </div>
            <aside className="plan4-ticket" aria-label="Preço e contratação" data-plan-reveal>
              <div className="plan4-ticket-top"><span>AZURIA</span><span>CICLO MENSAL ↗</span></div>
              <p className="plan4-ticket-tag">Seu próximo nível.</p>
              <div className="plan4-ticket-price"><span>R$</span><strong>{plan.priceCents / 100}</strong></div>
              <p className="plan4-ticket-period">por ciclo mensal</p>
              <div className="plan4-ticket-rule" />
              <p className="plan4-ticket-promise">Sua essência.<br />Nosso olhar.<br /><em>Uma nova presença.</em></p>
              <Link href="/contratar" className="plan4-cta plan4-cta-lime">Começar minha nova fase <Arrow diagonal /></Link>
              <small>Confira os detalhes na próxima etapa.<br />Demonstração: nenhum pagamento será realizado.</small>
              <div className="plan4-ticket-barcode" aria-hidden="true" />
            </aside>
          </div>
        </section>

        <section className="plan4-preview" data-scene="plan-preview" aria-labelledby="plan4-preview-heading">
          <div className="plan4-preview-copy" data-plan-reveal><span className="plan4-kicker">02 / DA IDEIA À SUA ROTINA</span><h2 id="plan4-preview-heading">A criatividade<br /><em>vira rotina.</em></h2><p>Você recebe as artes, as legendas e os arquivos organizados. Para encontrar tudo sem se perder em conversas.</p><span className="plan4-preview-note">EXPLORE UMA ENTREGA NA PRÉVIA →</span></div>
          <div className="plan4-portal" data-plan-reveal><PlatformPreview /></div>
        </section>

        <section className="plan4-fit" aria-labelledby="plan4-fit-heading">
          <header data-plan-reveal><span className="plan4-kicker">03 / ESPAÇO PARA O QUE VOCÊ PRECISA</span><h2 id="plan4-fit-heading">Uma direção clara.<br /><em>Possibilidades abertas.</em></h2></header>
          <div className="plan4-fit-grid">
            <article className="plan4-fit-base" data-plan-reveal><span className="plan4-fit-label">NO SEU CICLO</span><h3>O essencial.<br />Com personalidade.</h3><p>Direção de arte aprovada, peças do ciclo, legendas, acesso aos conteúdos e uma rodada consolidada de ajustes por entrega, dentro da janela definida.</p><a href="#seu-ciclo" className="plan4-text-link">Rever o plano <Arrow diagonal /></a><PlanMark className="plan4-fit-symbol" /></article>
            <article className="plan4-fit-extra" data-plan-reveal><span className="plan4-fit-label">SOB ORÇAMENTO</span><h3>Uma ideia<br />ainda maior?</h3><p>Artes adicionais, campanhas especiais e novas direções de arte. Vamos combinar um escopo para esse novo momento da sua marca.</p><a href={whatsapp("Olá, Victor! Quero conversar sobre um projeto sob medida para minha marca.")} target="_blank" rel="noreferrer" className="plan4-text-link">Conversar sobre minha ideia <Arrow diagonal /></a><svg className="plan4-fit-symbol" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M10 90 90 10M10 10h80v80" stroke="currentColor" strokeWidth="10" /></svg></article>
          </div>
        </section>

        <section className="plan4-faq" aria-labelledby="plan4-faq-heading">
          <header data-plan-reveal><span className="plan4-kicker">04 / ANTES DO PRIMEIRO PASSO</span><h2 id="plan4-faq-heading">Pode<br /><em>perguntar.</em></h2><p>Escopo claro para começar<br />com a mesma visão.</p></header>
          <div className="plan4-faq-list" data-plan-reveal>{faqs.map(([q, a], i) => <details key={q}><summary><span className="plan4-faq-number">{String(i + 1).padStart(2, "0")}</span><span>{q}</span><span className="plan4-faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
        </section>

        <section className="plan4-final" data-scene="plan-final" aria-labelledby="plan4-final-heading">
          <div data-plan-reveal><span className="plan4-kicker">SUA PRÓXIMA FASE COMEÇA COM UM OLHAR.</span><h2 id="plan4-final-heading">Vamos dar forma<br /><em>à sua marca.</em></h2><div className="plan4-final-actions"><Link href="/contratar" className="plan4-cta plan4-cta-lime">Quero começar meu próximo nível <Arrow diagonal /></Link><span>{price} por ciclo mensal<br />{plan.deliveriesPerCycle} entregas com direção de arte.</span></div></div>
          <PlanMark className="plan4-final-star" />
        </section>
      </main>
      <Footer compact ctaHref="/contratar" />
    </>
  );
}
