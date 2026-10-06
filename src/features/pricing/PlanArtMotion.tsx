"use client";
import { useEffect } from "react";

export function PlanArtMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-plan-experience]");
    const hero = root?.querySelector<HTMLElement>(".plan4-hero");
    if (!root || !hero) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, pointerX = 0, pointerY = 0;
    const reveals = root.querySelectorAll<HTMLElement>("[data-plan-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { (target as HTMLElement).dataset.visible = "true"; observer.unobserve(target); }
      });
    }, { threshold: .08 });
    function update() {
      frame = 0;
      const r = hero!.getBoundingClientRect();
      const p = reduced.matches ? 0 : Math.min(1, Math.max(0, -r.top / r.height));
      hero!.style.setProperty("--plan-scroll", String(p));
      hero!.style.setProperty("--plan-x", reduced.matches ? "0" : String(pointerX));
      hero!.style.setProperty("--plan-y", reduced.matches ? "0" : String(pointerY));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    function move(e: PointerEvent) {
      if (e.pointerType !== "mouse" || reduced.matches) return;
      pointerX = (e.clientX / innerWidth - .5) * 2;
      pointerY = (e.clientY / innerHeight - .5) * 2;
      schedule();
    }
    const leave = () => { pointerX = pointerY = 0; schedule(); };
    function preference() {
      root!.dataset.motion = reduced.matches ? "reduced" : "ready";
      if (reduced.matches) reveals.forEach((el) => { el.dataset.visible = "true"; });
      schedule();
    }
    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.dataset.visible = "true";
      observer.observe(el);
    });
    preference();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", preference);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); delete root.dataset.motion;
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", preference);
    };
  }, []);
  return null;
}
