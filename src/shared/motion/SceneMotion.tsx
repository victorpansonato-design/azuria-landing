"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { clamp } from "./scroll-math";

export function SceneMotion() {
  const pathname = usePathname();
  const initialPath = useRef(pathname);
  const homeVisited = useRef(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 900px) and (pointer: fine)");
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene]"),
    );
    const hero = document.querySelector<HTMLElement>(".hero2");
    const header = document.querySelector<HTMLElement>(".header");
    const values = new WeakMap<HTMLElement, Map<string, string>>();
    let frame = 0;
    const setValue = (
      element: HTMLElement,
      property: string,
      value: number,
    ) => {
      let previous = values.get(element);
      if (!previous) {
        previous = new Map();
        values.set(element, previous);
      }
      const next = String(value);
      if (previous.get(property) === next) return;
      previous.set(property, next);
      element.style.setProperty(property, next);
    };
    const toggle = (element: Element, className: string, on: boolean) => {
      if (element.classList.contains(className) !== on)
        element.classList.toggle(className, on);
    };
    function update() {
      frame = 0;
      const hidden = document.hidden;
      const height = innerHeight;
      // Read every geometry before changing classes or CSS properties.
      const measured = hidden
        ? []
        : scenes.map((scene) => ({
            scene,
            rect: scene.getBoundingClientRect(),
          }));
      const heroRect = hidden
        ? null
        : measured.find(({ scene }) => scene === hero)?.rect ||
          hero?.getBoundingClientRect();
      toggle(document.documentElement, "page-hidden", hidden);
      if (hidden) return;
      // Follow the actual surface passing behind the header, continuously.
      // The old scroll threshold changed the entire header midway through the Hero.
      if (header) {
        const galleryRect = measured.find(({ scene }) => scene.dataset.scene === "gallery")?.rect;
        const smooth = (p: number) => p * p * (3 - 2 * p);
        let tone = pathname === "/" ? 0 : 1;
        if (pathname === "/" && galleryRect) {
          const enter = smooth(clamp((190 - galleryRect.top) / 230));
          const leave = smooth(clamp((galleryRect.bottom + 40) / 230));
          tone = Math.min(enter, leave);
          if (heroRect && desktop.matches && !reduced.matches) {
            const exit = clamp(-heroRect.top / Math.max(1, heroRect.height - height));
            if (heroRect.bottom > 190) tone = Math.max(tone, smooth(clamp((exit - 0.55) / 0.45)));
          }
        }
        setValue(header, "--header-tone", Number(tone.toFixed(3)));
        toggle(header, "header-scrolled", pathname !== "/");
      }
      measured.forEach(({ scene, rect: r }) => {
        toggle(scene, "scene-visible", r.top < height && r.bottom > 0);
        if (r.top > height * 1.2 || r.bottom < -height || reduced.matches)
          return;
        const entry = clamp((height - r.top) / (height * 0.95));
        setValue(scene, "--scene-entry", entry);
        if (scene.dataset.scene === "process")
          setValue(
            scene,
            "--bridge-p",
            clamp((height - r.top) / (height * 0.9)),
          );
        if (scene.dataset.scene === "pricing")
          setValue(
            scene,
            "--curtain-p",
            clamp((height - r.top) / (height * 0.8)),
          );
        if (scene.dataset.scene === "footer")
          setValue(scene, "--footer-p", clamp((height - r.top) / height));
      });
      if (hero && heroRect) {
        const exit =
          desktop.matches && !reduced.matches
            ? clamp(-heroRect.top / Math.max(1, heroRect.height - height))
            : 0;
        setValue(hero, "--hero-exit", exit);
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    desktop.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      desktop.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [pathname]);
  useEffect(() => {
    if (pathname !== "/") return;
    const hero = document.querySelector<HTMLElement>(".hero2");
    if (!hero) return;
    const firstHome = !homeVisited.current;
    // Commit after mount so React's development effect replay stays harmless.
    const visitFrame = requestAnimationFrame(() => {
      homeVisited.current = true;
    });
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const reload =
      firstHome && initialPath.current === "/" && navigation?.type === "reload";
    let saved: number | null = null;
    try {
      const stored = sessionStorage.getItem("azuria-home-scroll");
      const value = stored === null ? NaN : Number(stored);
      if (Number.isFinite(value)) saved = Math.max(0, value);
    } catch {
      /* Storage can be unavailable in private sessions. */
    }
    const restored = reload && saved !== null && !location.hash;
    const position = restored ? (saved ?? scrollY) : scrollY;
    const play =
      firstHome &&
      navigation?.type !== "back_forward" &&
      (reload || !location.hash) &&
      position < 80 &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const remember = () => {
      try {
        sessionStorage.setItem("azuria-home-scroll", String(scrollY));
      } catch {
        /* Native history remains the fallback. */
      }
    };
    const previousRestoration = history.scrollRestoration;
    let restoreFrame = 0;
    const restore = () => {
      cancelAnimationFrame(restoreFrame);
      restoreFrame = requestAnimationFrame(() => {
        window.dispatchEvent(
          new CustomEvent("azuria-scroll-to", {
            detail: { y: position, immediate: true },
          }),
        );
        // Native back/forward restoration must resume after the reload jump.
        if (restored) history.scrollRestoration = previousRestoration;
      });
    };
    if (restored) {
      history.scrollRestoration = "manual";
      restore();
      if (document.readyState !== "complete")
        window.addEventListener("pageshow", restore, { once: true });
    }
    const cleanRestoration = () => {
      cancelAnimationFrame(visitFrame);
      cancelAnimationFrame(restoreFrame);
      window.removeEventListener("pageshow", restore);
      if (restored) history.scrollRestoration = previousRestoration;
      window.removeEventListener("pagehide", remember);
    };
    window.addEventListener("pagehide", remember);
    if (!play) return cleanRestoration;
    hero.classList.add("hero2-entering");
    const finish = () => hero.classList.remove("hero2-entering");
    const timer = setTimeout(finish, 1900);
    window.addEventListener("pointerdown", finish, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("wheel", finish, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      finish();
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("wheel", finish);
      cleanRestoration();
    };
  }, [pathname]);
  return null;
}
