"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Close the iris, change the scene while covered, then reveal the offer. */
export function PlanTransition() {
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = overlay.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let busy = false, disposed = false;
    let animation: Animation | null = null;
    const lock = (locked: boolean) => window.dispatchEvent(new CustomEvent("azuria-scroll-lock", { detail: { id: "plan-vignette", locked } }));
    const go = (target: HTMLElement, immediate: boolean) => {
      const top = target.getBoundingClientRect().top + scrollY;
      window.dispatchEvent(new CustomEvent("azuria-scroll-to", { detail: { y: top, immediate } }));
      history.pushState(null, "", "#plano");
      target.focus({ preventScroll: true });
    };
    async function click(event: MouseEvent) {
      if (pathname !== "/" || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== "/" || url.hash !== "#plano") return;
      const target = document.getElementById("plano");
      if (!target) return;
      event.preventDefault();
      if (busy) return;
      target.tabIndex = -1;
      if (reduced.matches) { go(target, true); return; }
      busy = true;
      el.classList.add("plan-vignette-active");
      lock(true);
      try {
        // Registered custom property animates a transparent aperture in the mask.
        animation = el.animate([{ "--iris": "150%", opacity: 0 }, { "--iris": "0%", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" });
        await animation.finished;
        if (disposed) return;
        lock(false); go(target, true); lock(true);
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        if (disposed) return;
        animation = el.animate([{ "--iris": "0%", opacity: 1 }, { "--iris": "150%", opacity: 0 }], { duration: 820, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
        await animation.finished;
      } catch {
        // A cancelled animation must always release scrolling.
      } finally {
        animation?.cancel(); el.classList.remove("plan-vignette-active"); lock(false); busy = false;
      }
    }
    document.addEventListener("click", click, true);
    return () => { disposed = true; document.removeEventListener("click", click, true); animation?.cancel(); el.classList.remove("plan-vignette-active"); lock(false); };
  }, [pathname]);
  return <div ref={overlay} className="plan-vignette" aria-hidden="true"><span>um novo nível.</span></div>;
}
