"use client";
import { useEffect, useRef } from "react";
import { Logo } from "./Logo";

const vertex = `attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 v_uv;uniform float u_time;uniform vec2 u_pointer;
void main(){
 vec2 uv=vec2(v_uv.x,1.-v_uv.y);vec2 p=uv-u_pointer;float wake=exp(-dot(p*vec2(1.,.28),p*vec2(1.,.28))*19.);
 float field=sin(uv.x*8.+uv.y*4.-u_time*.25)+cos(uv.y*7.-uv.x*3.+u_time*.21);
 float ribbon=pow(.5+.5*sin(field*2.2+wake*3.),5.);
 vec3 silver=mix(vec3(.30,.49,.93),vec3(.95,.98,1.),smoothstep(-.8,.75,field));
 silver=mix(silver,vec3(1.),ribbon*.75);
 gl_FragColor=vec4(silver,1.);
}`;
/** Original vector silhouette with a locally rendered, pointer-lit satin material. */
export function LiquidWordmark() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !matchMedia("(pointer: fine)").matches
    )
      return;
    const el = root.current!,
      c = canvas.current!;
    const gl = c.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex),
      fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const time = gl.getUniformLocation(program, "u_time"),
      pointer = gl.getUniformLocation(program, "u_pointer");
    let frame = 0,
      visible = false,
      ready = true,
      disposed = false,
      last = 0;
    const point = { x: 0.5, y: 0.5 },
      target = { x: 0.5, y: 0.5 };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      c.width = Math.min(el.clientWidth, 1600);
      c.height = (c.width * 210) / 875;
      gl.viewport(0, 0, c.width, c.height);
    };
    function draw(now: number) {
      frame = 0;
      if (
        !ready ||
        !visible ||
        document.hidden ||
        reduced.matches ||
        disposed
      ) {
        if (reduced.matches) el.classList.remove("liquid-ready");
        return;
      }
      if (now - last > 32) {
        last = now;
        point.x += (target.x - point.x) * 0.08;
        point.y += (target.y - point.y) * 0.08;
        gl!.uniform1f(time, now / 1000);
        gl!.uniform2f(pointer, point.x, point.y);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);
        el.classList.add("liquid-ready");
      }
      frame = requestAnimationFrame(draw);
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    resize();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(el);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
    };
    const lost = (e: Event) => {
      e.preventDefault();
      ready = false;
      el.classList.remove("liquid-ready");
    };
    el.addEventListener("pointermove", move);
    c.addEventListener("webglcontextlost", lost);
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", start);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", move);
      c.removeEventListener("webglcontextlost", lost);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", start);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      el.classList.remove("liquid-ready");
    };
  }, []);
  return (
    <div className="liquid-wordmark" ref={root}>
      <Logo white />
      <canvas ref={canvas} aria-hidden="true" />
      <span className="liquid-caption" aria-hidden="true">
        Uma marca. Infinitas possibilidades.
      </span>
    </div>
  );
}
