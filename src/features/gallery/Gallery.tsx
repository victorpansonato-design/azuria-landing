"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clamp, galleryProgress } from "@/shared/motion/scroll-math";
import { motion, useReducedMotion } from "motion/react";
import {
  artworks,
  directions,
  initialArtworks,
  type Artwork,
} from "@/data/gallery";
import { Arrow } from "@/shared/ui/Icons";
import { Modal } from "@/shared/ui/Modal";
import { LiquidArtwork } from "./LiquidArtwork";
import "./gallery-v3.css";
export function Gallery() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const progress = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const works =
    filter === "all"
      ? initialArtworks
      : artworks.filter((work) => work.directionId === filter);
  useEffect(() => {
    const el = section.current!,
      rail = track.current!;
    const media = matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0,
      travel = 0,
      distance = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = media.matches
        ? galleryProgress(r.top, travel)
        : clamp((innerHeight - r.top) / (innerHeight + r.height));
      if (media.matches) rail.scrollLeft = p * distance;
      progress.current?.style.setProperty("stroke-dashoffset", String(1 - p));
      el.style.setProperty("--gallery-p", String(p));
    };
    const measure = () => {
      distance = Math.max(0, rail.scrollWidth - rail.clientWidth);
      travel = Math.min(distance * 0.6, innerHeight * 3.5);
      el.classList.toggle("gallery3-pinned", media.matches);
      el.style.setProperty(
        "--gallery-travel",
        media.matches ? `${travel}px` : "0px",
      );
      update();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    media.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", schedule, { passive: true });
    measure();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", schedule);
    };
  }, [filter]);
  function moveRail(direction: number) {
    const rail = track.current!,
      el = section.current!;
    if (el.classList.contains("gallery3-pinned")) {
      const distance = Math.max(1, rail.scrollWidth - rail.clientWidth);
      const p = clamp(
        (rail.scrollLeft + direction * rail.clientWidth * 0.55) / distance,
      );
      const top = el.getBoundingClientRect().top + scrollY;
      const travel = parseFloat(el.style.getPropertyValue("--gallery-travel"));
      window.dispatchEvent(
        new CustomEvent("azuria-scroll-to", {
          detail: { y: top + p * travel },
        }),
      );
    } else
      rail.scrollBy({
        left: direction * rail.clientWidth * 0.7,
        behavior: reduced ? "instant" : "smooth",
      });
  }
  function choose(id: string) {
    setFilter(id);
    track.current?.scrollTo({ left: 0, behavior: "instant" });
    const el = section.current;
    if (el?.classList.contains("gallery3-pinned"))
      window.dispatchEvent(
        new CustomEvent("azuria-scroll-to", {
          detail: {
            y: el.getBoundingClientRect().top + scrollY,
            immediate: true,
          },
        }),
      );
  }
  function preview(work: Artwork) {
    setSelected(work);
    window.dispatchEvent(new CustomEvent("zuri-look", { detail: work.id }));
  }
  return (
    <section
      id="estilos"
      ref={section}
      className="gallery3"
      data-scene="gallery"
      aria-labelledby="gallery-heading"
    >
      <div className="gallery3-stage">
        <svg className="gallery3-thread" viewBox="0 0 1600 1000" preserveAspectRatio="none" aria-hidden="true">
          <path ref={progress} pathLength="1" d="M-60 200 C240 420 580 70 840 260 S1490 260 1510 510 C1530 790 1100 620 920 820 S240 1020 -40 860" />
        </svg>
        <div className="gallery3-heading">
          <div>
            <span className="eyebrow">01 / Um novo olhar</span>
            <h2 id="gallery-heading">
              Um universo
              <br />
              <em>de possibilidades.</em>
            </h2>
          </div>
          <div className="intro-aside">
            <p>
              Sua marca pode ir além do óbvio.
              <br />Explore o que acontece quando a imaginação ganha direção.
            </p>
            <button
              className="zuri-curate"
              onClick={() => window.dispatchEvent(new Event("zuri-curate"))}
            >
              <img src="/brand/zuri.svg" width="32" height="32" alt="" />
              Zuri, me mostra um estilo
              <Arrow />
            </button>
          </div>
        </div>
        <div
          className="style-filters"
          role="group"
          aria-label="Filtrar por direção de arte"
        >
          <button aria-pressed={filter === "all"} onClick={() => choose("all")}>
            Uma mistura de estilos
          </button>
          {directions.map((direction) => (
            <button
              key={direction.id}
              aria-pressed={filter === direction.id}
              onClick={() => choose(direction.id)}
            >
              {direction.name}
            </button>
          ))}
        </div>
        <div
          className="gallery3-track"
          ref={track}
          aria-label="Obras da curadoria"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              moveRail(e.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          {works.map((work, i) => (
            <motion.figure
              layout={!reduced}
              transition={{ type: "spring", stiffness: 210, damping: 28 }}
              key={work.id}
              className={`gallery3-art gallery3-art-${i % 4}`}
            >
              <LiquidArtwork
                work={work}
                onOpen={() => preview(work)}
                onFocus={(e) => {
                  if (
                    !e.currentTarget.matches(":focus-visible") ||
                    !section.current?.classList.contains("gallery3-pinned")
                  )
                    return;
                  const rail = track.current!;
                  const figure = e.currentTarget.closest("figure")!;
                  const p = clamp((figure.offsetLeft - rail.clientWidth * 0.2) / Math.max(1, rail.scrollWidth - rail.clientWidth));
                  const el = section.current!;
                  window.dispatchEvent(
                    new CustomEvent("azuria-scroll-to", {
                      detail: {
                        y:
                          el.getBoundingClientRect().top +
                          scrollY +
                          p *
                            parseFloat(
                              el.style.getPropertyValue("--gallery-travel"),
                            ),
                        immediate: true,
                      },
                    }),
                  );
                }}
              />
              <figcaption>
                <span>{work.directionName}</span>
                <span>{work.titulo}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <div className="gallery-bottom">
          <p>
            Curadoria de referências de direção de arte.
            <br />
            Obras de terceiros, apresentadas para explorar linguagens.
          </p>
          <div className="gallery-controls">
            <button aria-label="Obras anteriores" onClick={() => moveRail(-1)}>
              ←
            </button>
            <button aria-label="Próximas obras" onClick={() => moveRail(1)}>
              →
            </button>
          </div>
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
