"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { artworks, directions, initialArtworks, type Artwork } from "@/data/gallery";
import { Arrow } from "@/shared/ui/Icons";
import { Modal } from "@/shared/ui/Modal";
import { LiquidArtwork } from "./LiquidArtwork";
import "./gallery-v3.css";

export function Gallery() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const section = useRef<HTMLElement>(null);
  const ribbon = useRef<SVGPathElement>(null);
  const works = filter === "all" ? initialArtworks : artworks.filter((work) => work.directionId === filter);
  useEffect(() => {
    const el = section.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function update() {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - rect.top) / (rect.height + innerHeight * .15)));
      ribbon.current?.style.setProperty("stroke-dashoffset", String(reduced.matches ? 0 : 1 - Math.min(1, p + .14)));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    update();
    return () => { cancelAnimationFrame(frame); ro.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);
  function choose(id: string) { setFilter(id); }
  function preview(work: Artwork) {
    setSelected(work);
    window.dispatchEvent(new CustomEvent("zuri-look", { detail: work.id }));
  }
  return (
    <section id="estilos" ref={section} className="gallery3" data-scene="gallery" aria-labelledby="gallery-heading">
      <div className="gallery3-stage">
        <svg className="gallery3-thread" viewBox="0 0 1600 5400" preserveAspectRatio="none" aria-hidden="true">
          <path ref={ribbon} pathLength="1" d="M-80 120 C160 60 370 320 500 360 C730 440 710 140 560 180 C260 270 540 680 960 550 C1320 435 1220 740 1540 760 C1740 780 1660 1170 1390 1180 C1140 1190 1390 1470 1090 1550 C620 1680 200 1260 100 1560 C-80 1930 460 1810 700 2070 C990 2380 1200 1890 1430 2190 C1750 2600 1160 2490 1220 2840 C1300 3250 690 2980 500 3320 C280 3680 50 3360 -70 3730 C-230 4180 600 3810 980 4050 C1390 4310 1610 4120 1480 4490 C1350 4850 740 4530 620 4870 C530 5120 1230 5200 1630 5460" />
        </svg>
        <div className="gallery3-heading">
          <div>
            <span className="eyebrow">01 / Um novo olhar</span>
            <h2 id="gallery-heading">Um universo<br /><em>de possibilidades.</em></h2>
          </div>
          <div className="intro-aside">
            <p>Sua marca pode ir além do óbvio.<br />Explore o que acontece quando a imaginação ganha direção.</p>
            <button className="zuri-curate" onClick={() => window.dispatchEvent(new Event("zuri-curate"))}>
              <img src="/brand/zuri.svg" width="32" height="32" alt="" />Zuri, me mostra um estilo<Arrow />
            </button>
          </div>
        </div>
        <div className="style-filters" role="group" aria-label="Filtrar por direção de arte">
          <button aria-pressed={filter === "all"} onClick={() => choose("all")}>Uma mistura de estilos</button>
          {directions.map((direction) => <button key={direction.id} aria-pressed={filter === direction.id} onClick={() => choose(direction.id)}>{direction.name}</button>)}
        </div>
        <div className="gallery3-track" aria-label="Obras da curadoria">
          {[0, 1].map((column) => <div className="gallery3-column" key={column}>
          {works.map((work, i) => ({ work, i })).filter(({ i }) => i % 2 === column).map(({ work, i }) => (
            <figure key={work.id} style={{ "--art-ratio": work.largura / work.altura } as CSSProperties} className={`gallery3-art gallery3-art-${i % 4}`}>
              <LiquidArtwork work={work} onOpen={() => preview(work)} />
              <figcaption><span>{work.directionName}</span><span>{work.titulo}</span></figcaption>
            </figure>
          ))}
          </div>)}
        </div>
        <div className="gallery-bottom">
          <p>Curadoria de referências de direção de arte.<br />Obras de terceiros, apresentadas para explorar linguagens.</p>
          <a href="#como-funciona" className="gallery3-next">Existe algo além.<Arrow diagonal /></a>
        </div>
      </div>
      {selected && (
        <Modal
          label={selected.titulo}
          onClose={() => setSelected(null)}
          className="art-modal"
        >
          <div className="art-modal-image">
            <Image
              src={`/${selected.image}`}
              alt={selected.titulo}
              width={selected.largura}
              height={selected.altura}
              sizes="(max-width: 700px) 90vw, 55vw"
            />
          </div>
          <div className="art-modal-copy">
            <span className="eyebrow">Referência de direção de arte</span>
            <h2>{selected.titulo}</h2>
            <p className="art-direction">{selected.directionName}</p>
            <h3>O que observar</h3>
            <p>{selected.oQueObservar}</p>
            <p className="credit">
              {selected.origem.autorConfirmado ||
                "Autoria não confirmada no material recebido."}
              <br />
              Origem:{" "}
              {selected.origem.tipo === "pinterest"
                ? "curadoria do Pinterest"
                : "anexo do kit do usuário"}
              . Uso como referência no protótipo.
            </p>
            {selected.origem.paginaConsultada && (
              <a
                href={selected.origem.paginaConsultada}
                target="_blank"
                rel="noreferrer"
              >
                Consultar procedência
                <Arrow diagonal />
              </a>
            )}
            <Link
              href="/planos"
              className="button blue"
              onClick={() => setSelected(null)}
            >
              Quero uma direção para minha marca
              <Arrow diagonal />
            </Link>
          </div>
        </Modal>
      )}
    </section>
  );
}
