"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Artwork } from "@/data/gallery";
import { Arrow } from "@/shared/ui/Icons";
import { createSceneProgram } from "@/shared/motion/webgl";

const vertex = `
attribute vec2 position;
varying vec2 uv;
uniform float time;
uniform float energy;
uniform vec2 pointer;
uniform float drift;
void main() {
  uv = position;
  vec2 p = position * 2. - 1.;
  float envelope = sin(position.x * 3.14159) * sin(position.y * 3.14159);
  float wave = sin(position.y * 5. + time * .85) * cos(position.x * 3. - time * .45);
  p.x += sin(position.y * 5. + time * .7) * (.008 + energy * .022) + drift * envelope * .045;
  p.y += wave * (.006 + energy * .022);
  p += vec2(pointer.x - .5, .5 - pointer.y) * envelope * energy * .025;
  gl_Position = vec4(p * .945, 0., 1.);
}`;
const fragment = `
precision highp float;
varying vec2 uv;
uniform sampler2D artwork;
uniform vec2 pointer;
uniform float time;
uniform float energy;
uniform float drift;
void main() {
  vec2 v = uv;
  vec2 delta = v - vec2(pointer.x, 1. - pointer.y);
  float dist = length(delta);
  float wave = sin(dist * 23. - time * 2.6) * exp(-dist * 4.) * energy;
  v += normalize(delta + .0001) * wave * .012;
  v.x += sin(v.y * 6. + time * .65) * (.0018 + abs(drift) * .006);
  vec3 color = texture2D(artwork, clamp(v, .001, .999)).rgb;
  float light = exp(-dist * dist * 6.) * energy * .05;
  gl_FragColor = vec4(color + light, 1.);
}`;

/** A subdivided image surface: its edges and texture move together. */
export function LiquidArtwork({ work, onOpen }: { work: Artwork; onOpen: () => void }) {
  const host = useRef<HTMLButtonElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [source, setSource] = useState("");
  const [active, setActive] = useState(false);
  const loaded = useCallback((img: HTMLImageElement) => { image.current = img; setSource(img.currentSrc); }, []);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let near = false;
    const update = () => setActive(near && !reduced.matches);
    const observer = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; update(); }, { rootMargin: "200px" });
    observer.observe(host.current!); reduced.addEventListener("change", update);
    return () => { observer.disconnect(); reduced.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (!source || !image.current || !active) return;
    const button = host.current!;
    const c = document.createElement("canvas");
    c.setAttribute("aria-hidden", "true");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)");
    if (reduced.matches) return;
    const gl = c.getContext("webgl", { alpha: true, antialias: true, depth: false, powerPreference: "low-power" });
    if (!gl) return;
    const program = createSceneProgram(gl, vertex, fragment);
    if (!program) return;
    button.insertBefore(c, button.querySelector(".artwork-open"));
    const vertices: number[] = [];
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      const a = x / 32, b = y / 32, d = (x + 1) / 32, e = (y + 1) / 32;
      vertices.push(a,b,d,b,a,e,a,e,d,b,d,e);
    }
    const buffer = gl.createBuffer(), texture = gl.createTexture();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.current); }
    catch { gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); c.remove(); gl.getExtension("WEBGL_lose_context")?.loseContext(); return; }
    const uniforms = Object.fromEntries(["time", "pointer", "energy", "drift"].map((name) => [name, gl.getUniformLocation(program, name)]));
    let frame = 0, visible = false, failed = false, last = 0, energy = 0, targetEnergy = 0, drift = 0, targetDrift = 0, previousY = scrollY;
    const point = { x: .5, y: .5, tx: .5, ty: .5 };
    function draw(now: number) {
      frame = 0;
      if (!visible || document.hidden || failed || reduced.matches) return;
      if (now - last >= (coarse.matches ? 50 : 30)) {
        last = now;
        energy += (targetEnergy - energy) * .08;
        drift += (targetDrift - drift) * .1; targetDrift *= .9;
        point.x += (point.tx - point.x) * .08; point.y += (point.ty - point.y) * .08;
        gl!.uniform1f(uniforms.time, now / 1000);
        gl!.uniform1f(uniforms.energy, energy);
        gl!.uniform1f(uniforms.drift, drift);
        gl!.uniform2f(uniforms.pointer, point.x, point.y);
        gl!.clear(gl!.COLOR_BUFFER_BIT); gl!.drawArrays(gl!.TRIANGLES, 0, vertices.length / 2);
        button.classList.add("liquid-ready");
      }
      frame = requestAnimationFrame(draw);
    }
    function start() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    function resize() {
      const r = button.getBoundingClientRect(), scale = Math.min(devicePixelRatio || 1, 1.6, 1920 / Math.max(1, r.width));
      c.width = Math.max(1, Math.round(r.width * scale)); c.height = Math.max(1, Math.round(r.height * scale));
      gl!.viewport(0, 0, c.width, c.height); start();
    }
    function move(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = button.getBoundingClientRect(); point.tx = (e.clientX - r.left) / r.width; point.ty = (e.clientY - r.top) / r.height;
      targetEnergy = 1;
    }
    function leave() { targetEnergy = 0; point.tx = point.ty = .5; }
    function scroll() { targetDrift = Math.max(-1, Math.min(1, (scrollY - previousY) / 45)); previousY = scrollY; }
    function lost() { failed = true; button.classList.remove("liquid-ready"); cancelAnimationFrame(frame); }
    function preference() { button.classList.remove("liquid-ready"); if (reduced.matches) { cancelAnimationFrame(frame); frame = 0; } else start(); }
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; } });
    const ro = new ResizeObserver(resize); io.observe(button); ro.observe(button);
    button.addEventListener("pointermove", move); button.addEventListener("pointerleave", leave);
    c.addEventListener("webglcontextlost", lost);
    window.addEventListener("scroll", scroll, { passive: true }); document.addEventListener("visibilitychange", start); reduced.addEventListener("change", preference);
    resize();
    return () => {
      cancelAnimationFrame(frame); io.disconnect(); ro.disconnect(); button.classList.remove("liquid-ready");
      button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave); c.removeEventListener("webglcontextlost", lost);
      window.removeEventListener("scroll", scroll); document.removeEventListener("visibilitychange", start); reduced.removeEventListener("change", preference);
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      c.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [source, active]);
  return (
    <button ref={host} className="artwork-image gallery3-liquid" onClick={onOpen} aria-label={`Ver ${work.titulo}`}>
      <Image src={`/${work.image}`} alt={work.titulo} width={work.largura} height={work.altura}
        sizes="(max-width: 700px) 90vw, 48vw" loading="lazy" onLoad={(e) => loaded(e.currentTarget)} />
      <span className="artwork-open"><Arrow diagonal /></span>
    </button>
  );
}
