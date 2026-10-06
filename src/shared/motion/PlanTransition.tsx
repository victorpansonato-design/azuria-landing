"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/** All internal destinations share the iris; links inside a dialog can close it normally. */
export function PlanTransition() {
  const pathname = usePathname(), router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const routeReady = useRef<(() => void) | null>(null);
  useEffect(() => { routeReady.current?.(); routeReady.current = null; }, [pathname]);
  useEffect(() => {
    const el = overlay.current!, reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let busy = false, disposed = false;
    let animation: Animation | null = null;
    let routeTimer: ReturnType<typeof setTimeout> | undefined;
    const finishAnimation = (current: Animation, duration: number) => new Promise<void>((resolve) => {
      // Background tabs and busy graphics can suspend animation completion callbacks.
      const finish = () => { clearTimeout(timer); resolve(); };
      const timer = setTimeout(finish, duration + 250);
      current.finished.then(finish, finish);
    });
    const lock = (locked: boolean) => window.dispatchEvent(new CustomEvent("azuria-scroll-lock", { detail: { id: "plan-vignette", locked } }));
    const jump = (target: HTMLElement, hash: string) => {
      lock(false);
      window.dispatchEvent(new CustomEvent("azuria-scroll-to", { detail: { y: target.getBoundingClientRect().top + scrollY, immediate: true } }));
      if (location.hash !== hash) history.pushState(null, "", hash);
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    };
    async function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download") || link.classList.contains("skip-link")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      const samePage = url.pathname === location.pathname && url.search === location.search;
      const target = samePage && url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : samePage && url.pathname === "/" && !url.hash ? document.getElementById("conteudo") : null;
      const route = !samePage && ["/", "/planos", "/contratar", "/privacidade", "/termos"].includes(url.pathname);
      if (!target && !route) return;
      if (reduced.matches) { if (target) { event.preventDefault(); jump(target, url.hash || "#conteudo"); } return; }
      event.preventDefault();
      if (busy) return;
      busy = true;
      const label = el.querySelector("span")!;
      label.textContent = url.hash === "#estilos" ? "um novo olhar." : url.hash === "#como-funciona" ? "além do óbvio." : url.hash === "#contato" ? "o próximo movimento." : url.hash === "#conteudo" || url.pathname === "/" && !url.hash ? "azuria." : "um novo nível.";
      el.classList.add("plan-vignette-active"); lock(true);
      try {
        animation = el.animate([{ "--iris": "150%", opacity: 0 }, { "--iris": "0%", opacity: 1 }], { duration: 460, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" });
        await finishAnimation(animation, 460);
        if (disposed) return;
        if (target) jump(target, url.hash || "#conteudo");
        else {
          await new Promise<void>((resolve) => {
            routeReady.current = resolve;
            routeTimer = setTimeout(resolve, 4500);
            router.push(url.pathname + url.search + url.hash);
          });
          clearTimeout(routeTimer); routeReady.current = null; lock(false);
        }
        // Commit the covered destination without depending on an active animation frame.
        await new Promise<void>((resolve) => setTimeout(resolve, 40));
        if (disposed) return;
        if (!target && url.hash) {
          const destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
          if (destination) jump(destination, url.hash);
        }
        const closing = animation;
        animation = el.animate([{ "--iris": "0%", opacity: 1 }, { "--iris": "150%", opacity: 0 }], { duration: 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" });
        // Release the first fill; otherwise it reappears when the opening is cancelled.
        closing?.cancel();
        await finishAnimation(animation, 720);
      } catch { /* Cancellation still releases every lock and the covering surface. */ }
      finally { animation?.cancel(); el.classList.remove("plan-vignette-active"); lock(false); busy = false; }
    }
    document.addEventListener("click", click, true);
    return () => { disposed = true; clearTimeout(routeTimer); routeReady.current?.(); routeReady.current = null; document.removeEventListener("click", click, true); animation?.cancel(); el.classList.remove("plan-vignette-active"); lock(false); };
  }, [router]);
  return <div ref={overlay} className="plan-vignette" aria-hidden="true"><span>um novo nível.</span></div>;
}
