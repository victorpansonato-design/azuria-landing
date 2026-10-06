"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/shared/ui/Icons";
import { LiquidPortal } from "./LiquidPortal";
import "./process-v3.css";

const chapters = [
  { label: "01 / A sua essência", title: <>Além do<br /><em>óbvio.</em></>, text: "Toda marca tem um universo próprio. A gente entra no seu antes de criar qualquer coisa." },
  { label: "02 / O nosso olhar", title: <>O mesmo negócio.<br /><em>Outra dimensão.</em></>, text: "Cor, tipografia, imagem e intenção. Uma linguagem que faz as pessoas reconhecerem você." },
  { label: "03 / A sua presença", title: <>Feito para<br /><em>ficar.</em></>, text: "A imaginação ganha uma rotina. Quatro entregas, uma direção e conteúdo com a sua personalidade." },
];

export function Process() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = section.current!;
    const media = matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    function update() {
      frame = 0;
      const r = el.getBoundingClientRect();
      if (!media.matches) {
        el.style.setProperty("--universe-p", "0");
        el.querySelectorAll<HTMLElement>(".universe3-chapter").forEach((element) => {
          element.style.removeProperty("opacity"); element.style.removeProperty("transform"); element.style.removeProperty("pointer-events"); element.inert = false;
        });
        return;
      }
      if (r.top > innerHeight || r.bottom < 0) return;
      // The author band is outside the pinned story; chapter controls use this same travel.
      const travel = el.querySelector<HTMLElement>(".universe3-author")!.offsetTop - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, travel)));
      el.style.setProperty("--universe-p", p.toFixed(4));
      const chapter = Math.min(2, Math.floor(p * 3));
      setActive((current) => current === chapter ? current : chapter);
      el.querySelectorAll<HTMLElement>(".universe3-chapter").forEach((element, i) => {
        const local = p * 3 - i;
        const enter = i === 0 ? 1 : Math.min(1, Math.max(0, (local + .12) / .22));
        const leave = i === 2 ? 1 : Math.min(1, Math.max(0, (1.08 - local) / .22));
        const opacity = Math.min(enter, leave);
        element.style.opacity = String(opacity);
        element.style.transform = `translateY(${Math.max(-24, Math.min(24, (0.42 - local) * 24))}px)`;
        element.style.pointerEvents = opacity > .8 ? "auto" : "none";
        element.inert = opacity <= .8;
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });window.addEventListener("resize",schedule);media.addEventListener("change",schedule);
    update();
    return () => { cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);media.removeEventListener("change",schedule); };
  }, []);
  function chapter(i: number) {
    const el = section.current!;
    const travel = el.querySelector<HTMLElement>(".universe3-author")!.offsetTop - innerHeight;
    const y = el.getBoundingClientRect().top + scrollY + travel * ((i + .35) / 3);
    window.dispatchEvent(new CustomEvent("azuria-scroll-to", { detail: { y } }));
  }
  return (
    <section id="como-funciona" ref={section} className="universe3" data-scene="process" aria-labelledby="process-heading">
      <div className="universe3-stage">
        <div className="universe3-atmosphere" aria-hidden="true" />
        <svg className="universe3-ribbon" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-100 680C160 900 560 800 740 540S1260 60 1550 420S1520 900 1700 1020" /></svg>
        <div className="universe3-top"><span className="eyebrow">02 / Dentro de outro universo</span><span>AZURIA / IMAGINAÇÃO COM DIREÇÃO</span></div>
        <LiquidPortal />
        <div className="universe3-copy">
          <h2 id="process-heading" className="sr-only">A sua marca, em outra dimensão.</h2>
          {chapters.map((c, i) => <article key={c.label} className={`universe3-chapter universe3-chapter-${i}`}><span>{c.label}</span><h3>{c.title}</h3><p>{c.text}</p>{i === 2 && <a href="#plano" className="universe3-cta">Levar minha marca para esse universo <Arrow diagonal /></a>}</article>)}
        </div>
        <div className="universe3-bottom"><nav aria-label="Capítulos da criação">{["Essência", "Direção", "Presença"].map((name, i) => <button key={name} onClick={() => chapter(i)} aria-current={active === i ? "step" : undefined}><span>0{i + 1}</span>{name}<i /></button>)}</nav><span>Continue. Mude o seu ponto de vista. ↓</span></div>
      </div>
      <div className="universe3-author"><span className="eyebrow">O olhar por trás desse universo</span><div><h3>Victor <em>Capitani.</em></h3><p>Sou o Victor. Criei a Azuria para dar aos pequenos negócios uma presença visual com personalidade — e uma rotina de conteúdo que cabe na vida real.</p><a href="https://victor-capitani-web.vercel.app/" target="_blank" rel="noreferrer">Entre no meu universo <Arrow diagonal /></a></div></div>
    </section>
  );
}
