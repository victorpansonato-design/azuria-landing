"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PlatformPreview } from "./PlatformPreview";
const chapters = [
  {
    title: "Personalidade",
    phrase: "Começa com você.",
    text: "Seu negócio, seu público, seus produtos. A gente entende o que faz a sua marca ser sua antes de escolher uma cor ou desenhar uma peça.",
  },
  {
    title: "Direção",
    phrase: "Nada por acaso.",
    text: "Uma linguagem visual aprovada guia o ciclo. Tipografia, cor, composição e conteúdo passam a conversar entre si.",
  },
  {
    title: "Rotina",
    phrase: "Tudo no seu lugar.",
    text: "Quatro entregas por ciclo, com artes, legendas e downloads organizados no portal. Você vê o que recebeu e encontra o que precisa.",
  },
];
export function DirectionStudio() {
  const [chapter, setChapter] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="studio2">
      <div
        className="studio2-tabs"
        role="group"
        aria-label="Conhecer o caminho da sua marca"
      >
        {chapters.map((c, i) => (
          <button
            key={c.title}
            aria-pressed={chapter === i}
            onClick={() => {
              setChapter(i);
              window.dispatchEvent(
                new CustomEvent("zuri-look", {
                  detail: i % 2 ? "left" : "right",
                }),
              );
            }}
          >
            <span>0{i + 1}</span>
            {c.title}
            <span>↗</span>
          </button>
        ))}
      </div>
      <div className="studio2-body">
        <div className="studio2-copy">
          <span>0{chapter + 1} / 03</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
            >
              <h3>{chapters[chapter].phrase}</h3>
              <p>{chapters[chapter].text}</p>
            </motion.div>
          </AnimatePresence>
          <span className="studio2-note">Uma boa direção muda tudo.</span>
        </div>
        <div className={`studio2-art studio2-art-${chapter}`}>
          {chapter === 2 ? (
            <PlatformPreview />
          ) : (
            <div className="studio2-sculpture" aria-hidden="true">
              <span className="studio2-orbit" />
              <span className="studio2-orbit orbit-b" />
              <div className="studio2-card card-a">
                <small>{chapter === 0 ? "Sua essência" : "Tipografia"}</small>
                <strong>{chapter === 0 ? "a sua\nmarca." : "Aa"}</strong>
                <span>AZURIA / DIREÇÃO DE ARTE</span>
              </div>
              <div className="studio2-card card-b">
                <small>{chapter === 0 ? "Seu universo" : "Paleta"}</small>
                <div className="studio2-colors">
                  <i />
                  <i />
                  <i />
                </div>
                <span>PERSONALIDADE EM CADA ESCOLHA</span>
              </div>
              <div className="studio2-card card-c">
                <small>{chapter === 0 ? "Um novo olhar" : "Composição"}</small>
                <img src="/brand/azuria-logo-branca.svg" alt="" />
                <span>FEITO COM INTENÇÃO.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
