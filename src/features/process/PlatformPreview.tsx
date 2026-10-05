"use client";
import { useState } from "react";
import { Logo } from "@/shared/ui/Logo";
import { plan, totals } from "@/data/business";
export function PlatformPreview() {
  const [delivery, setDelivery] = useState(1);
  const [tab, setTab] = useState("Conteúdos");
  return (
    <div className="platform-preview">
      <div className="window-bar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>Prévia da plataforma</span>
        <span className="preview-lock">Demonstração</span>
      </div>
      <div className="portal-body">
        <div className="portal-top">
          <Logo />
          <span>Seu conteúdo, no lugar.</span>
        </div>
        <div className="portal-tabs" role="group" aria-label="Explorar prévia">
          {["Conteúdos", "Legenda", "Baixar"].map((name) => (
            <button
              aria-pressed={tab === name}
              onClick={() => setTab(name)}
              key={name}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="portal-delivery">
          <div>
            <small>Ciclo mensal</small>
            <h3>Entrega {delivery}</h3>
          </div>
          <select
            aria-label="Entrega da prévia"
            value={delivery}
            onChange={(e) => setDelivery(Number(e.target.value))}
          >
            {Array.from({ length: plan.deliveriesPerCycle }, (_, i) => (
              <option key={i} value={i + 1}>
                Entrega {i + 1}
              </option>
            ))}
          </select>
        </div>
        {tab === "Conteúdos" ? (
          <>
            <div className="portal-content-grid">
              <div className="demo-piece demo-piece-blue">
                <small>Sua marca</small>
                <strong>
                  Feito
                  <br />
                  com
                  <br />
                  intenção.
                </strong>
                <span>Post estático</span>
              </div>
              <div className="demo-piece demo-piece-paper">
                <small>Sua marca</small>
                <strong>
                  O detalhe
                  <br />
                  faz parte
                  <br />
                  da história.
                </strong>
                <span>Capa de carrossel</span>
              </div>
              <div className="demo-piece demo-piece-story">
                <small>Sua marca</small>
                <div className="demo-circle" />
                <strong>
                  Um novo
                  <br />
                  olhar.
                </strong>
                <span>Story</span>
              </div>
            </div>
            <p className="portal-summary">
              {plan.perDelivery.staticFeed} posts ·{" "}
              {plan.perDelivery.carouselFeed} carrossel ·{" "}
              {totals.storiesPerDelivery} stories por entrega
            </p>
          </>
        ) : tab === "Legenda" ? (
          <div className="portal-tab-content">
            <h4>Arte e legenda, juntas.</h4>
            <p>
              “Cada detalhe conta uma história. Conheça os produtos da nossa
              marca e escolha o que combina com você.”
            </p>
            <small>
              Texto de exemplo para explicar a organização de uma entrega.
            </small>
          </div>
        ) : (
          <div className="portal-tab-content">
            <h4>Seus arquivos, organizados.</h4>
            <p>
              No portal real, as peças da sua marca acompanham legenda e
              download.
            </p>
            <small>
              Esta prévia é ilustrativa; não disponibiliza arquivos de uma
              entrega contratada.
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
