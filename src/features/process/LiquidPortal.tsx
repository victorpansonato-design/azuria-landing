"use client";
import { useEffect, useRef } from "react";
import { createSceneProgram } from "@/shared/motion/webgl";

const vertex = `
attribute vec3 position;
attribute vec3 normal;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform float progress;
varying vec3 surface;
varying vec3 direction;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
void main(){
  mat3 rotation = rz(-.24 + sin(time*.09)*.1) * ry(.4 + time*.085 + progress*1.25 + pointer.x*.23) * rx(.32 + progress*.45 + pointer.y*.18);
  vec3 p = rotation * position;
  surface = normalize(rotation * normal);
  direction = normalize(vec3(0.,0.,5.2)-p);
  float perspective = 2.8 / (5.2-p.z);
  gl_Position = vec4(p.x * perspective * resolution.y / resolution.x, p.y * perspective, -p.z*.15, 1.);
}`;
const fragment = `
precision highp float;
varying vec3 surface;
varying vec3 direction;
uniform float time;
vec3 environment(vec3 r){
  float key = exp(-pow((r.x*.72 + r.y*.68 - .35)*6.,2.));
  float strip = exp(-pow((r.x*.84 - r.y*.35 + r.z*.16 + .34)*22.,2.));
  float rim = pow(max(0.,r.y),12.);
  float low = exp(-pow((r.z*.65 + r.y + .6)*9.,2.));
  vec3 blue = mix(vec3(.008,.015,.08),vec3(.026,.16,.72),smoothstep(-.7,.8,r.z));
  blue += vec3(.12,.42,.95)*key*.75;
  blue += vec3(.8,.94,1.)*strip*1.7;
  blue += vec3(.3,.65,1.)*rim*1.5;
  blue += vec3(.22,.13,.48)*low*.7;
  return blue;
}
void main(){
  vec3 n=normalize(surface), v=normalize(direction);
  vec3 reflected=reflect(-v,n);
  float fresnel=pow(1.-max(0.,dot(n,v)),3.);
  float diffuse=max(0.,dot(n,normalize(vec3(-2.,3.,4.))));
  vec3 color=environment(reflected)*( .78 + diffuse*.22 );
  color+=vec3(.12,.33,.87)*fresnel*.75;
  float spec=pow(max(0.,dot(reflect(-normalize(vec3(-3.,4.,3.)),n),v)),110.);
  color+=vec3(.78,.9,1.)*spec*.75;
  color=color/(color+vec3(.7));
  color=pow(color,vec3(.4545));
  gl_FragColor=vec4(color,1.);
}`;

type V = [number, number, number];
const normalize = (a: V): V => { const d=Math.hypot(...a)||1; return [a[0]/d,a[1]/d,a[2]/d]; };
const cross = (a: V,b: V): V => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function curve(t: number): V {
  const radius = .88 + .3 * Math.cos(3*t);
  return [radius*Math.cos(2*t), radius*Math.sin(2*t), .42*Math.sin(3*t)];
}
/** Closed trefoil, with smooth normals and a generous camera safe area. */
function sculptureMesh() {
  const segments=420, sides=48, data:number[]=[];
  const sample=(i:number,j:number)=>{
    const t=i/segments*Math.PI*2, a=j/sides*Math.PI*2;
    const p=curve(t), next=curve(t+.001), previous=curve(t-.001);
    const tangent=normalize([next[0]-previous[0],next[1]-previous[1],next[2]-previous[2]]);
    const normal=normalize(cross(tangent,[0,0,1])), binormal=normalize(cross(tangent,normal));
    const n:V=[normal[0]*Math.cos(a)+binormal[0]*Math.sin(a),normal[1]*Math.cos(a)+binormal[1]*Math.sin(a),normal[2]*Math.cos(a)+binormal[2]*Math.sin(a)];
    const radius=.205+.025*Math.sin(t*3);
    return [p[0]+n[0]*radius,p[1]+n[1]*radius,p[2]+n[2]*radius,...n];
  };
  for(let i=0;i<segments;i++) for(let j=0;j<sides;j++){
    const a=sample(i,j),b=sample(i+1,j),c=sample(i,j+1),d=sample(i+1,j+1);
    data.push(...a,...b,...c,...c,...b,...d);
  }
  return new Float32Array(data);
}

export function LiquidPortal() {
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    // A fresh node for each setup also survives React's development effect replay.
    const c=document.createElement("canvas");
    c.setAttribute("aria-hidden","true");
    const gl=c.getContext("webgl",{alpha:true,antialias:true,depth:true,powerPreference:"low-power"});
    if(!gl)return;
    const program=createSceneProgram(gl,vertex,fragment);
    if(!program)return;
    host.current!.append(c);
    const mesh=sculptureMesh(),buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
    for(const [name,offset] of [["position",0],["normal",12]] as const){
      const attr=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,3,gl.FLOAT,false,24,offset);
    }
    gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
    const u=Object.fromEntries(["resolution","pointer","time","progress"].map(name=>[name,gl.getUniformLocation(program,name)]));
    const reduced=matchMedia("(prefers-reduced-motion: reduce)"),touch=matchMedia("(pointer: coarse)");
    const stage=c.closest<HTMLElement>(".universe3");
    let frame=0,last=0,visible=false,failed=false;
    const point={x:0,y:0,tx:0,ty:0};
    function draw(now:number){
      frame=0;if(!visible||document.hidden||failed)return;
      if(now-last>(touch.matches?50:30)||reduced.matches){
        last=now;point.x+=(point.tx-point.x)*.06;point.y+=(point.ty-point.y)*.06;
        gl!.uniform2f(u.pointer,point.x,point.y);
        gl!.uniform1f(u.time,reduced.matches?0:now/1000);
        gl!.uniform1f(u.progress,reduced.matches?0:parseFloat(stage?.style.getPropertyValue("--universe-p")||"0"));
        gl!.clear(gl!.COLOR_BUFFER_BIT|gl!.DEPTH_BUFFER_BIT);gl!.drawArrays(gl!.TRIANGLES,0,mesh.length/6);
        c.classList.add("portal-ready");
      }
      if(!reduced.matches)frame=requestAnimationFrame(draw);
    }
    function start(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
    function resize(){
      const r=c.getBoundingClientRect();
      const limit=Math.min(3840,gl!.getParameter(gl!.MAX_RENDERBUFFER_SIZE));
      const width=touch.matches?Math.min(1280,r.width*2):Math.min(limit,Math.max(1920,r.width*Math.max(2,devicePixelRatio||1)));
      c.width=Math.max(1,Math.round(width));c.height=Math.max(1,Math.round(width*r.height/Math.max(1,r.width)));
      gl!.viewport(0,0,c.width,c.height);gl!.uniform2f(u.resolution,c.width,c.height);start();
    }
    function move(e:PointerEvent){if(e.pointerType!=="mouse")return;const r=c.getBoundingClientRect();point.tx=Math.max(-.5,Math.min(.5,(e.clientX-r.left)/r.width-.5));point.ty=Math.max(-.5,Math.min(.5,(e.clientY-r.top)/r.height-.5));}
    function lost(){failed=true;c.classList.remove("portal-ready");cancelAnimationFrame(frame);}
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}});
    const ro=new ResizeObserver(resize);io.observe(c);ro.observe(c);
    const pointerSurface=stage?.querySelector(".universe3-stage");
    pointerSurface?.addEventListener("pointermove",move as EventListener);c.addEventListener("webglcontextlost",lost);
    window.addEventListener("scroll",start,{passive:true});document.addEventListener("visibilitychange",start);reduced.addEventListener("change",start);
    resize();
    return()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();pointerSurface?.removeEventListener("pointermove",move as EventListener);c.removeEventListener("webglcontextlost",lost);window.removeEventListener("scroll",start);document.removeEventListener("visibilitychange",start);reduced.removeEventListener("change",start);gl.deleteBuffer(buffer);gl.deleteProgram(program);c.remove();gl.getExtension("WEBGL_lose_context")?.loseContext();};
  },[]);
  return <div ref={host} className="universe3-sculpture" aria-hidden="true"><svg className="universe3-fallback" viewBox="0 0 600 600"><defs><linearGradient id="knot-fallback" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c3efff"/><stop offset=".2" stopColor="#275bab"/><stop offset=".45" stopColor="#87c4ec"/><stop offset=".65" stopColor="#143d8f"/><stop offset="1" stopColor="#b4c8ff"/></linearGradient></defs><path d="M300 130C440 60 540 250 430 355C290 490 110 455 130 300C150 160 450 115 460 280C470 440 225 525 195 375C165 225 180 90 300 130Z" fill="none" stroke="url(#knot-fallback)" strokeWidth="48" strokeLinecap="round"/></svg></div>;
}
