"use client";
import { useEffect, useRef } from "react";

/** The light exhibition closes into an expanding aperture before the dark sculpture. */
export function ImmersionBridge() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!, reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function update() {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = reduced.matches ? 1 : Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / Math.max(1, r.height - innerHeight * .4)));
      el.style.setProperty("--passage-p", p.toFixed(4));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule); reduced.addEventListener("change", schedule); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);
  return (
    <section ref={ref} className="immersion-bridge" data-scene="bridge" aria-labelledby="bridge-heading">
      <div className="immersion-bridge-stage">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"><path d="M-80 30C340 360 940-190 1190 190S920 720 1620 850" /></svg>
        <div className="immersion-bridge-dark" aria-hidden="true" />
        <div className="immersion-bridge-copy"><span className="eyebrow">Mude o seu ponto de vista.</span><h2 id="bridge-heading">Existe um universo<br />dentro da <em>sua marca.</em></h2><span className="immersion-bridge-cue">CONTINUE PARA ENTRAR ↓</span></div>
      </div>
    </section>
  );
}
