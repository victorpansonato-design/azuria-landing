"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { clamp, railPosition } from "./scroll-math";

export function ScrollExperience() {
  const path = usePathname();
  const rail = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const grabOffset = useRef(0);
  const locks = useRef(new Set<string>());
  useEffect(() => {
    const desktop = matchMedia("(min-width: 900px) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!rail.current || !thumb.current) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      const h = rail.current.clientHeight;
      const size = clamp(
        (innerHeight /
          Math.max(innerHeight, document.documentElement.scrollHeight)) *
          h,
        42,
        h,
      );
      thumb.current.style.height = `${size}px`;
      thumb.current.style.transform = `translateY(${clamp(scrollY / Math.max(1, max)) * (h - size)}px)`;
      rail.current.setAttribute(
        "aria-valuenow",
        String(Math.round(clamp(scrollY / Math.max(1, max)) * 100)),
      );
      rail.current.style.opacity = max > 10 ? "1" : "0";
    };
    const configure = () => {
      lenis.current?.destroy();
      lenis.current = null;
      if (desktop.matches && !reduced.matches)
        lenis.current = new Lenis({
          autoRaf: true,
          lerp: 0.075,
          wheelMultiplier: 0.64,
          syncTouch: false,
          anchors: true,
          prevent: (node) =>
            !!node.closest("dialog,.zuri-panel,[data-lenis-prevent]"),
        });
      document.documentElement.classList.add("azuria-rail-ready");
      if (locks.current.size) lenis.current?.stop();
      update();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const jump = (e: Event) => {
      if (locks.current.size) return;
      const { y, immediate } = (
        e as CustomEvent<{ y: number; immediate?: boolean }>
      ).detail;
      if (lenis.current) lenis.current.scrollTo(y, { immediate, force: true });
      else
        window.scrollTo({
          top: y,
          behavior: immediate || reduced.matches ? "instant" : "smooth",
        });
    };
    configure();
    const lock = (e: Event) => {
      const { id, locked } = (e as CustomEvent<{ id: string; locked: boolean }>)
        .detail;
      if (locked) locks.current.add(id);
      else locks.current.delete(id);
      if (locks.current.size) lenis.current?.stop();
      else lenis.current?.start();
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("azuria-scroll-to", jump);
    window.addEventListener("azuria-scroll-lock", lock);
    desktop.addEventListener("change", configure);
    reduced.addEventListener("change", configure);
    return () => {
      lenis.current?.destroy();
      lenis.current = null;
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("azuria-scroll-to", jump);
      window.removeEventListener("azuria-scroll-lock", lock);
      desktop.removeEventListener("change", configure);
      reduced.removeEventListener("change", configure);
      document.documentElement.classList.remove("azuria-rail-ready");
    };
  }, [path]);
  function scrub(clientY: number) {
    const r = rail.current!.getBoundingClientRect();
    const y = railPosition(
      clientY,
      r.top,
      r.height,
      thumb.current!.clientHeight,
      document.documentElement.scrollHeight - innerHeight,
      grabOffset.current,
    );
    if (lenis.current)
      lenis.current.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: "instant" });
  }
  return (
    <div
      ref={rail}
      className="azuria-scrollbar"
      role="scrollbar"
      aria-label="Navegar pela página"
      aria-controls="conteudo"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        const rect = thumb.current!.getBoundingClientRect();
        const grabbedThumb = e.clientY >= rect.top && e.clientY <= rect.bottom;
        grabOffset.current = grabbedThumb
          ? e.clientY - rect.top
          : rect.height / 2;
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.dataset.dragging = "true";
        scrub(e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e.clientY);
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
        delete e.currentTarget.dataset.dragging;
      }}
      onPointerCancel={(e) => {
        delete e.currentTarget.dataset.dragging;
      }}
      onKeyDown={(e) => {
        const values: Record<string, number> = {
          ArrowDown: scrollY + 80,
          ArrowUp: scrollY - 80,
          PageDown: scrollY + innerHeight * 0.8,
          PageUp: scrollY - innerHeight * 0.8,
          Home: 0,
          End: document.documentElement.scrollHeight,
        };
        if (e.key in values) {
          e.preventDefault();
          window.dispatchEvent(
            new CustomEvent("azuria-scroll-to", {
              detail: { y: values[e.key], immediate: true },
            }),
          );
        }
      }}
    >
      <span className="azuria-scrollbar-line" />
      <span ref={thumb} className="azuria-scrollbar-thumb">
        <i />
      </span>
    </div>
  );
}
