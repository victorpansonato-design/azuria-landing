"use client";
import { useEffect } from "react";
export function PerformanceProbe() {
  useEffect(() => {
    if (!new URLSearchParams(location.search).has("auditoria")) return;
    const output = document.createElement("output");
    output.hidden = true;
    output.id = "azuria-performance";
    document.body.append(output);
    const stats = {
      lcpMs: 0,
      cls: 0,
      interactionMs: 0,
      frameMedianMs: 0,
      frameP95Ms: 0,
      framesOver34Ms: 0,
      frames: 0,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    const observers: PerformanceObserver[] = [];
    const publish = () => {
      output.textContent = JSON.stringify(stats);
    };
    for (const type of ["largest-contentful-paint", "layout-shift", "event"]) {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (type === "largest-contentful-paint")
            stats.lcpMs = entry.startTime;
          if (type === "layout-shift") {
            const shift = entry as PerformanceEntry & {
              hadRecentInput: boolean;
              value: number;
            };
            if (!shift.hadRecentInput) stats.cls += shift.value;
          }
          if (type === "event")
            stats.interactionMs = Math.max(stats.interactionMs, entry.duration);
        }
        publish();
      });
      observer.observe({
        type,
        buffered: true,
        ...(type === "event" ? { durationThreshold: 16 } : {}),
      });
      observers.push(observer);
    }
    let previous = 0,
      frame = 0,
      elapsed = 0;
    const times: number[] = [];
    const sample = (time: number) => {
      if (previous && !document.hidden) {
        const delta = time - previous;
        if (delta < 1000) {
          times.push(delta);
          elapsed += delta;
        }
      }
      previous = time;
      if (elapsed < 8000) frame = requestAnimationFrame(sample);
      else {
        const sorted = times.toSorted((a, b) => a - b);
        stats.frames = times.length;
        stats.frameMedianMs = sorted[Math.floor(sorted.length * 0.5)] || 0;
        stats.frameP95Ms = sorted[Math.floor(sorted.length * 0.95)] || 0;
        stats.framesOver34Ms = sorted.filter((t) => t > 34).length;
        publish();
      }
    };
    frame = requestAnimationFrame(sample);
    publish();
    return () => {
      cancelAnimationFrame(frame);
      observers.forEach((o) => o.disconnect());
      output.remove();
    };
  }, []);
  return null;
}
