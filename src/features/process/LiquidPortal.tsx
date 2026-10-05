"use client";
import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision mediump float;
varying vec2 uv;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform float progress;
mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float field(vec3 p){
  p.xy*=rotate(-.25+progress*.7);
  p.xz*=rotate(.35+sin(time*.18)*.13+pointer.x*.14);
  p.yz*=rotate(.18+pointer.y*.12+progress*.6);
  float a=atan(p.y,p.x);
  float radius=.94+.11*sin(a*3.+time*.3)+.035*cos(a*7.-time*.2);
  float thickness=.205+.045*cos(a*3.-time*.22);
  return length(vec2(length(p.xy)-radius,p.z-.15*sin(a*3.+time*.28)))-thickness;
}
vec3 normal(vec3 p){vec2 e=vec2(.003,0.);return normalize(vec3(field(p+e.xyy)-field(p-e.xyy),field(p+e.yxy)-field(p-e.yxy),field(p+e.yyx)-field(p-e.yyx)));}
vec3 environment(vec3 r){
  float band=pow(max(0.,sin(r.x*4.+r.y*2.+r.z*3.)),6.);
  float blue=sin(r.x*5.-r.y*3.+r.z*4.)*.5+.5;
  return mix(vec3(.018,.055,.22),vec3(.075,.28,.95),blue)+vec3(.65,.82,1.)*band;
}
void main(){
  vec2 q=(uv-.5)*2.;q.x*=resolution.x/resolution.y;
  vec3 origin=vec3(0.,0.,3.8-progress*.65);
  vec3 ray=normalize(vec3(q,-2.25));
  float distance=0.;float hit=0.;vec3 p;
  for(int i=0;i<56;i++){
    p=origin+ray*distance;
    float step=field(p);
    if(step<.002){hit=1.;break;}
    distance+=step*.72;
    if(distance>7.)break;
  }
  vec3 color=vec3(0.);
  float alpha=0.;
  if(hit>.5){
    vec3 n=normal(p);
    vec3 reflected=reflect(ray,n);
    float fresnel=pow(1.-max(0.,dot(n,-ray)),3.);
    float specular=pow(max(0.,dot(reflect(-normalize(vec3(-2.,3.,4.)),n),-ray)),80.);
    color=environment(reflected)*1.15+vec3(.15,.35,1.)*fresnel*.9+vec3(.9,.95,1.)*specular;
    color=pow(color,vec3(.82));alpha=1.;
  }
  gl_FragColor=vec4(color,alpha);
}`;

/** A slowly breathing, impossible cobalt sculpture rendered in real 3D. */
export function LiquidPortal() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!;
    const gl = c.getContext("webgl", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!; shaders.push(s); gl.shaderSource(s, source); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment), program = gl.createProgram();
    if (!vs || !fs || !program) { shaders.forEach((s) => gl.deleteShader(s)); return; }
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); shaders.forEach((s) => gl.deleteShader(s)); return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program,"position"); gl.enableVertexAttribArray(attr); gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
    const u = Object.fromEntries(["resolution","pointer","time","progress"].map((name) => [name,gl.getUniformLocation(program,name)]));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const touch = matchMedia("(max-width: 899px), (pointer: coarse)");
    const stage = c.closest<HTMLElement>(".universe3");
    let frame = 0, last = 0, visible = false, failed = false;
    const point = { x: 0, y: 0, tx: 0, ty: 0 };
    function draw(now: number) {
      frame = 0;
      if (!visible || document.hidden || failed) return;
      if (now - last > 40 || reduced.matches || touch.matches) {
        last = now; point.x += (point.tx-point.x)*.08; point.y += (point.ty-point.y)*.08;
        gl!.uniform2f(u.pointer,point.x,point.y);
        gl!.uniform1f(u.time,reduced.matches || touch.matches ? 0 : now/1000);
        gl!.uniform1f(u.progress,parseFloat(stage?.style.getPropertyValue("--universe-p") || "0"));
        gl!.drawArrays(gl!.TRIANGLES,0,6);
        c.classList.add("portal-ready");
      }
      if (!reduced.matches && !touch.matches) frame = requestAnimationFrame(draw);
    }
    function start() { if (!frame) frame = requestAnimationFrame(draw); }
    function resize() {
      const r=c.getBoundingClientRect();
      const scale=Math.min(1,1200/Math.max(r.width,1));
      c.width=Math.round(r.width*scale);c.height=Math.round(r.height*scale);
      gl!.viewport(0,0,c.width,c.height);gl!.uniform2f(u.resolution,c.width,c.height);start();
    }
    function move(e: PointerEvent) {
      const r=c.getBoundingClientRect();
      point.tx=(e.clientX-r.left)/r.width-.5;point.ty=(e.clientY-r.top)/r.height-.5;
    }
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();});io.observe(c);
    const ro=new ResizeObserver(resize);ro.observe(c);
    const lost=()=>{failed=true;c.classList.remove("portal-ready");cancelAnimationFrame(frame);};
    c.addEventListener("webglcontextlost",lost);
    const pointerSurface = stage?.querySelector(".universe3-stage");
    pointerSurface?.addEventListener("pointermove",move as EventListener);
    window.addEventListener("scroll",start,{passive:true});document.addEventListener("visibilitychange",start);reduced.addEventListener("change",start);
    resize();
    return()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();c.removeEventListener("webglcontextlost",lost);pointerSurface?.removeEventListener("pointermove",move as EventListener);window.removeEventListener("scroll",start);document.removeEventListener("visibilitychange",start);reduced.removeEventListener("change",start);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach((s)=>gl.deleteShader(s));};
  }, []);
  return <div className="universe3-sculpture" aria-hidden="true"><div className="universe3-fallback" /><canvas ref={canvas} /></div>;
}
