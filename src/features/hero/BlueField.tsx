"use client";
import { useEffect, useRef } from "react";

const vertex = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * .5 + .5;
    gl_Position = vec4(aPosition, 0., 1.);
  }
`;
const fragment = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uRipples[6];
  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    vec2 delta = vec2((uv.x - uMouse.x) * aspect, uv.y - uMouse.y);
    float d = length(delta);
    float lens = exp(-d * d * 24.) * uHover;
    vec2 displacement = delta * lens * .018;
    float sheen = lens * .025;
    for (int i = 0; i < 6; i++) {
      float age = uTime - uRipples[i].z;
      vec2 diff = vec2((uv.x - uRipples[i].x) * aspect, uv.y - uRipples[i].y);
      float dist = length(diff);
      float radius = age * .12;
      float envelope = exp(-pow((dist - radius) * 28., 2.)) * exp(-age * 1.6);
      float wave = sin((dist - radius) * 90.) * envelope;
      displacement += normalize(diff + .0001) * wave * .0025;
      sheen += max(0., wave) * .018;
    }
    uv += vec2(displacement.x / aspect, displacement.y);
    float imageAspect = uImageSize.x / uImageSize.y;
    vec2 cover = aspect > imageAspect ? vec2(1., imageAspect / aspect) : vec2(aspect / imageAspect, 1.);
    uv = (uv - .5) * cover * .96 + .5;
    uv += vec2(sin(uTime * .09), cos(uTime * .07)) * .003;
    vec3 color = texture2D(uImage, uv).rgb;
    color += vec3(.30, .58, 1.) * sheen;
    gl_FragColor = vec4(color, 1.);
  }
`;

/** Refracted material, with a static CSS fallback on touch and reduced motion. */
export function BlueField() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = root.current!;
    const c = canvas.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !matchMedia("(pointer: fine)").matches) return;
    const gl = c.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      return;
    }
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((shader) => gl.deleteShader(shader)); gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(["uResolution", "uImageSize", "uMouse", "uTime", "uHover", "uRipples[0]"].map((name) => [name, gl.getUniformLocation(program, name)]));
    const texture = gl.createTexture();
    const img = new window.Image();
    let ready = false, visible = true, disposed = false, frame = 0, last = 0;
    let hover = 0, targetHover = 0, lastRipple = 0, rippleIndex = 0;
    const started = performance.now();
    const mouse = { x: .5, y: .5, targetX: .5, targetY: .5 };
    const ripples = new Float32Array(18);
    for (let i = 0; i < 6; i++) ripples[i * 3 + 2] = -100;
    function resize() {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 1.5);
      c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
      gl!.viewport(0, 0, c.width, c.height); gl!.uniform2f(uniforms.uResolution, c.width, c.height);
    }
    function draw(now: number) {
      frame = 0;
      if (!ready || !visible || document.hidden || reduced.matches || disposed) return;
      if (now - last >= 32) {
        last = now;
        mouse.x += (mouse.targetX - mouse.x) * .16;
        mouse.y += (mouse.targetY - mouse.y) * .16;
        hover += (targetHover - hover) * .1;
        gl!.uniform2f(uniforms.uMouse, mouse.x, mouse.y);
        gl!.uniform1f(uniforms.uTime, (now - started) / 1000);
        gl!.uniform1f(uniforms.uHover, hover);
        gl!.uniform3fv(uniforms["uRipples[0]"], ripples);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      }
      frame = requestAnimationFrame(draw);
    }
    function start() { if (!frame && ready && !disposed) frame = requestAnimationFrame(draw); }
    img.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform2f(uniforms.uImageSize, img.naturalWidth, img.naturalHeight);
      ready = true; resize(); el.classList.add("bluefield-live"); start();
    };
    img.src = innerWidth < 900 ? "/brand/azuria-blue-field-mobile.webp" : "/brand/azuria-blue-field-4k.webp";
    function move(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      mouse.targetX = (e.clientX - r.left) / r.width;
      mouse.targetY = 1 - (e.clientY - r.top) / r.height;
      targetHover = 1;
      const now = performance.now();
      if (now - lastRipple > 100) {
        ripples[rippleIndex * 3] = mouse.targetX; ripples[rippleIndex * 3 + 1] = mouse.targetY;
        ripples[rippleIndex * 3 + 2] = (now - started) / 1000;
        rippleIndex = (rippleIndex + 1) % 6; lastRipple = now;
      }
    }
    const leave = () => { targetHover = 0; };
    const preference = () => { el.classList.toggle("bluefield-live", !reduced.matches && ready); start(); };
    const lost = (e: Event) => { e.preventDefault(); ready = false; el.classList.remove("bluefield-live"); cancelAnimationFrame(frame); };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); });
    io.observe(el);
    const ro = new ResizeObserver(resize); ro.observe(el);
    const stage = el.parentElement;
    stage?.addEventListener("pointermove", move); stage?.addEventListener("pointerleave", leave);
    c.addEventListener("webglcontextlost", lost); document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", preference);
    return () => {
      disposed = true; cancelAnimationFrame(frame); img.onload = null; io.disconnect(); ro.disconnect();
      stage?.removeEventListener("pointermove", move); stage?.removeEventListener("pointerleave", leave);
      c.removeEventListener("webglcontextlost", lost); document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", preference);
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader)); el.classList.remove("bluefield-live");
    };
  }, []);
  return <div className="bluefield" ref={root} aria-hidden="true"><div className="bluefield-material" /><canvas ref={canvas} /></div>;
}
