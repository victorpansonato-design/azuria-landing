"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ZuriFace } from "./ZuriFace";

type Interaction = "idle" | "pressed" | "holding" | "dragging" | "settling";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ZuriCompanion({
  open,
  onToggle,
  dock,
}: {
  open: boolean;
  onToggle: () => void;
  dock: RefObject<HTMLButtonElement | null>;
}) {
  const companion = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const toggle = useRef(onToggle);
  const [hint, setHint] = useState(false);
  const [interaction, setInteraction] = useState<Interaction>("idle");
  toggle.current = onToggle;

  useEffect(() => {
    const root = companion.current;
    const launcher = dock.current;
    const character = body.current;
    if (!root || !launcher || !character) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 700px)");
    let frame = 0;
    let lastFrame = 0;
    let heldTimer: ReturnType<typeof setTimeout> | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let footerVisible = false;
    let manual = false;
    let active: {
      id: number;
      startX: number;
      startY: number;
      grabX: number;
      grabY: number;
      lastX: number;
      lastY: number;
      lastTime: number;
      started: number;
      dragged: boolean;
      vx: number;
      vy: number;
    } | null = null;
    const pad = () => (mobile.matches ? 16 : 24);
    const baseSize = () => (mobile.matches ? 64 : 76);
    const model = {
      x: innerWidth - baseSize() - pad(),
      y: innerHeight - baseSize() - pad(),
      tx: innerWidth - baseSize() - pad(),
      ty: innerHeight - baseSize() - pad(),
      size: baseSize(),
      sizeTarget: baseSize(),
      rotation: 0,
      rotationVelocity: 0,
      rotationTarget: 0,
      sx: 1,
      sy: 1,
      sxVelocity: 0,
      syVelocity: 0,
      sxTarget: 1,
      syTarget: 1,
    };

    function paint() {
      root!.style.setProperty("--zuri-x", `${model.x.toFixed(2)}px`);
      root!.style.setProperty("--zuri-y", `${model.y.toFixed(2)}px`);
      root!.style.setProperty("--zuri-size", `${model.size.toFixed(2)}px`);
      character!.style.transform = reduce.matches
        ? "none"
        : `rotate(${model.rotation.toFixed(2)}deg) scale(${model.sx.toFixed(3)}, ${model.sy.toFixed(3)})`;
      root!.dataset.hintSide = model.x < innerWidth / 2 ? "right" : "left";
    }

    function tick(time: number) {
      frame = 0;
      const dt = clamp((time - lastFrame) / 16.67 || 1, 0.4, 2);
      lastFrame = time;
      model.size += (model.sizeTarget - model.size) * (reduce.matches ? 1 : 0.12 * dt);
      if (!manual && !active) {
        model.tx = innerWidth - model.size - pad();
        model.ty = innerHeight - model.size - pad();
      }
      model.tx = clamp(model.tx, 12, innerWidth - model.size - 12);
      model.ty = clamp(model.ty, 12, innerHeight - model.size - 12);
      const follow = active?.dragged ? 0.52 : 0.22;
      model.x += (model.tx - model.x) * (reduce.matches ? 1 : Math.min(1, follow * dt));
      model.y += (model.ty - model.y) * (reduce.matches ? 1 : Math.min(1, follow * dt));
      model.rotationVelocity =
        (model.rotationVelocity + (model.rotationTarget - model.rotation) * 0.13 * dt) *
        Math.pow(0.68, dt);
      model.sxVelocity =
        (model.sxVelocity + (model.sxTarget - model.sx) * 0.2 * dt) * Math.pow(0.66, dt);
      model.syVelocity =
        (model.syVelocity + (model.syTarget - model.sy) * 0.2 * dt) * Math.pow(0.66, dt);
      model.rotation += model.rotationVelocity * dt;
      model.sx += model.sxVelocity * dt;
      model.sy += model.syVelocity * dt;
      paint();
      const unsettled =
        Math.abs(model.tx - model.x) +
          Math.abs(model.ty - model.y) +
          Math.abs(model.sizeTarget - model.size) +
          Math.abs(model.rotationTarget - model.rotation) >
        0.025 ||
        Math.abs(model.sxTarget - model.sx) + Math.abs(model.syTarget - model.sy) > 0.001;
      if (unsettled && !document.hidden) frame = requestAnimationFrame(tick);
    }

    function wake() {
      if (!frame) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function resize() {
      model.sizeTarget = footerVisible ? (mobile.matches ? 76 : 100) : baseSize();
      if (manual) {
        model.tx = clamp(model.tx, 12, innerWidth - model.sizeTarget - 12);
        model.ty = clamp(model.ty, 12, innerHeight - model.sizeTarget - 12);
      }
      wake();
    }

    function down(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0) return;
      clearTimeout(settleTimer);
      setHint(false);
      const rect = root!.getBoundingClientRect();
      active = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        grabX: event.clientX - rect.left,
        grabY: event.clientY - rect.top,
        lastX: event.clientX,
        lastY: event.clientY,
        lastTime: performance.now(),
        started: performance.now(),
        dragged: false,
        vx: 0,
        vy: 0,
      };
      launcher!.setPointerCapture(event.pointerId);
      setInteraction("pressed");
      model.sxTarget = 1.13;
      model.syTarget = 0.83;
      model.rotationTarget = -5;
      heldTimer = setTimeout(() => {
        if (!active || active.dragged) return;
        setInteraction("holding");
        model.sxTarget = 1.06;
        model.syTarget = 0.94;
        model.rotationTarget = 6;
        wake();
      }, 320);
      wake();
    }

    function move(event: PointerEvent) {
      if (!active || event.pointerId !== active.id) return;
      const distance = Math.hypot(event.clientX - active.startX, event.clientY - active.startY);
      if (!active.dragged && distance < 5) return;
      if (!active.dragged) {
        active.dragged = true;
        manual = true;
        clearTimeout(heldTimer);
        setInteraction("dragging");
        root!.dataset.manuallyPlaced = "true";
      }
      const time = performance.now();
      const elapsed = Math.max(8, time - active.lastTime);
      active.vx = clamp((event.clientX - active.lastX) / elapsed, -3, 3);
      active.vy = clamp((event.clientY - active.lastY) / elapsed, -3, 3);
      active.lastX = event.clientX;
      active.lastY = event.clientY;
      active.lastTime = time;
      model.tx = event.clientX - active.grabX;
      model.ty = event.clientY - active.grabY;
      const horizontal = Math.abs(active.vx);
      const vertical = Math.abs(active.vy);
      model.rotationTarget = clamp(active.vx * 15, -28, 28);
      model.sxTarget = clamp(1 + horizontal * 0.1 - vertical * 0.075, 0.81, 1.22);
      model.syTarget = clamp(1 + vertical * 0.12 - horizontal * 0.075, 0.82, 1.27);
      wake();
    }

    function up(event: PointerEvent) {
      if (!active || event.pointerId !== active.id) return;
      const gesture = active;
      active = null;
      clearTimeout(heldTimer);
      if (launcher!.hasPointerCapture(event.pointerId)) launcher!.releasePointerCapture(event.pointerId);
      model.rotationTarget = 0;
      model.sxTarget = 1;
      model.syTarget = 1;
      model.rotationVelocity += gesture.vx * 2;
      model.sxVelocity -= 0.045;
      model.syVelocity += 0.065;
      setInteraction("settling");
      settleTimer = setTimeout(() => setInteraction("idle"), reduce.matches ? 0 : 800);
      if (!gesture.dragged && event.type === "pointerup" && performance.now() - gesture.started < 320) {
        toggle.current();
      }
      wake();
    }

    function gaze(event: PointerEvent) {
      if (event.pointerType === "touch" || active) return;
      const dx = event.clientX - model.x - model.size / 2;
      const dy = event.clientY - model.y - model.size / 2;
      root!.style.setProperty("--zuri-look-x", `${clamp(dx / 80, -3.5, 3.5).toFixed(2)}px`);
      root!.style.setProperty("--zuri-look-y", `${clamp(dy / 120, -2.5, 2.5).toFixed(2)}px`);
    }

    function visibility() {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden) wake();
    }

    const footer = document.querySelector("footer.footer2");
    const observer = new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      resize();
    });
    if (footer) observer.observe(footer);
    launcher.addEventListener("pointerdown", down);
    launcher.addEventListener("pointermove", move);
    launcher.addEventListener("pointerup", up);
    launcher.addEventListener("pointercancel", up);
    launcher.addEventListener("lostpointercapture", up);
    window.addEventListener("pointermove", gaze, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    reduce.addEventListener("change", wake);
    mobile.addEventListener("change", resize);
    paint();
    root.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(heldTimer);
      clearTimeout(settleTimer);
      observer.disconnect();
      launcher.removeEventListener("pointerdown", down);
      launcher.removeEventListener("pointermove", move);
      launcher.removeEventListener("pointerup", up);
      launcher.removeEventListener("pointercancel", up);
      launcher.removeEventListener("lostpointercapture", up);
      window.removeEventListener("pointermove", gaze);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      reduce.removeEventListener("change", wake);
      mobile.removeEventListener("change", resize);
    };
  }, [dock]);

  return (
    <div
      ref={companion}
      className="zuri-companion zuri3-companion"
      data-interaction={interaction}
      data-open={open}
      onMouseEnter={() => !open && interaction === "idle" && setHint(true)}
      onMouseLeave={() => setHint(false)}
    >
      <button
        ref={dock}
        className="zuri2-launcher zuri3-launcher"
        aria-label={open ? "Fechar ajuda do Zuri" : "Conversar com Zuri. Você também pode me arrastar."}
        aria-expanded={open}
        aria-controls={open ? "zuri-help" : undefined}
        onClick={(event) => {
          // Pointer gestures are handled on release; keyboard activation stays native.
          if (event.detail === 0) onToggle();
        }}
        onFocus={() => !open && setHint(true)}
        onBlur={() => setHint(false)}
      >
        <span ref={body} className="zuri3-body">
          <span className="zuri3-idle">
            <ZuriFace />
          </span>
        </span>
      </button>
      {hint && !open && (
        <span className="zuri-speech zuri3-speech" role="tooltip">
          Oi! Pode me arrastar.
        </span>
      )}
    </div>
  );
}
