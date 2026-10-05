"use client";
import Image from "next/image";
import { useEffect, useId, useRef, type FocusEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { Artwork } from "@/data/gallery";
import { Arrow } from "@/shared/ui/Icons";

/** A soft image membrane: movement bends it, then the spring settles naturally. */
export function LiquidArtwork({
  work,
  onOpen,
  onFocus,
}: {
  work: Artwork;
  onOpen: () => void;
  onFocus: (event: FocusEvent<HTMLButtonElement>) => void;
}) {
  const reduced = useReducedMotion();
  const id = `art-gel-${useId().replace(/:/g, "")}`;
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const previous = useRef({ x: 0, y: 0, time: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const bend = useMotionValue(0);
  const spring = { stiffness: 135, damping: 13, mass: 0.65 };
  const rotateY = useSpring(x, spring);
  const rotateX = useSpring(y, spring);
  const membrane = useSpring(bend, { stiffness: 110, damping: 10, mass: 0.5 });
  useEffect(() => membrane.on("change", (value) => {
    displacement.current?.setAttribute("scale", String(value));
  }), [membrane]);

  return (
    <motion.button
      className="artwork-image gallery3-liquid"
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      onClick={onOpen}
      onFocus={onFocus}
      aria-label={`Ver ${work.titulo}`}
      onPointerEnter={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        previous.current = { x: event.clientX, y: event.clientY, time: performance.now() };
        bend.set(5);
      }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const now = performance.now();
        const last = previous.current;
        const speed = Math.hypot(event.clientX - last.x, event.clientY - last.y) /
          Math.max(16, now - last.time);
        x.set(px * 9);
        y.set(-py * 9);
        bend.set(Math.min(16, 4 + speed * 9));
        event.currentTarget.style.setProperty("--gel-x", `${(px + 0.5) * 100}%`);
        event.currentTarget.style.setProperty("--gel-y", `${(py + 0.5) * 100}%`);
        previous.current = { x: event.clientX, y: event.clientY, time: now };
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
        bend.set(0);
      }}
    >
      <svg className="gallery3-filter" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.018" numOctaves="1" seed="8" result="wave" />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="wave" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <span className="gallery3-membrane" style={reduced ? undefined : { filter: `url(#${id})` }}>
        <Image
          src={`/${work.image}`}
          alt={work.titulo}
          width={work.largura}
          height={work.altura}
          sizes="(max-width: 700px) 78vw, (max-width: 1100px) 48vw, 38vw"
          loading="lazy"
        />
      </span>
      <span className="gallery3-shine" aria-hidden="true" />
      <span className="artwork-open"><Arrow diagonal /></span>
    </motion.button>
  );
}
