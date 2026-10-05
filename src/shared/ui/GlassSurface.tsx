"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./glass-surface.css";

type Channel = "R" | "G" | "B";

export interface GlassSurfaceProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: Channel;
  yChannel?: Channel;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  className?: string;
  style?: CSSProperties;
}

/** React Bits GlassSurface, adapted to TypeScript and measured without timers. */
export function GlassSurface({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style,
}: GlassSurfaceProps) {
  const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const filterId = `glass-filter-${uniqueId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<SVGFEImageElement>(null);
  const [svgSupported, setSvgSupported] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome|Chromium/.test(userAgent);
    setSvgSupported(
      !isSafari &&
        !/Firefox/.test(userAgent) &&
        CSS.supports("backdrop-filter", `url(#${filterId})`),
    );
  }, [filterId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateMap = () => {
      const rect = container.getBoundingClientRect();
      const actualWidth = Math.max(1, rect.width);
      const actualHeight = Math.max(1, rect.height);
      const edgeSize = Math.min(actualWidth, actualHeight) * borderWidth * 0.5;
      const map = `<svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect width="${actualWidth}" height="${actualHeight}" fill="black"/>
        <rect width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#r)"/>
        <rect width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#b)" style="mix-blend-mode:${mixBlendMode}"/>
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
      </svg>`;
      imageRef.current?.setAttribute("href", `data:image/svg+xml,${encodeURIComponent(map)}`);
    };

    updateMap();
    const observer = new ResizeObserver(updateMap);
    observer.observe(container);
    return () => observer.disconnect();
  }, [width, height, borderRadius, borderWidth, brightness, opacity, blur, mixBlendMode]);

  const containerStyle = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    "--glass-frost": backgroundOpacity,
    "--glass-saturation": saturation,
    "--filter-id": `url(#${filterId})`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${svgSupported ? "glass-surface--svg" : "glass-surface--fallback"} ${className}`}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={imageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={distortionScale + redOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={distortionScale + greenOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={distortionScale + blueOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation={displace} />
          </filter>
        </defs>
      </svg>
      {children && <div className="glass-surface__content">{children}</div>}
    </div>
  );
}

/** The backdrop itself is cut into the existing Azuria mark, including its counters. */
export function GlassLogo() {
  const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const bevelId = `logo-bevel-${uniqueId}`;

  return (
    <span className="glass-logo" aria-hidden="true">
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={0}
        borderWidth={0.18}
        brightness={54}
        opacity={0.82}
        blur={4}
        displace={0.22}
        backgroundOpacity={0.06}
        saturation={1.6}
        distortionScale={-36}
        redOffset={0}
        greenOffset={2}
        blueOffset={5}
        className="glass-logo__material"
      />
      <span className="glass-logo__reflection" />
      <svg className="glass-logo__bevel" viewBox="0 0 875 210" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={bevelId} x="-5%" y="-8%" width="110%" height="116%" colorInterpolationFilters="sRGB">
            <feMorphology in="SourceAlpha" operator="erode" radius="3.6" result="core" />
            <feComposite in="SourceAlpha" in2="core" operator="out" result="rim" />
            <feFlood floodColor="white" floodOpacity="0.52" result="rimLight" />
            <feComposite in="rimLight" in2="rim" operator="in" result="edge" />
            <feOffset in="SourceAlpha" dx="4.2" dy="4.2" result="shifted" />
            <feComposite in="SourceAlpha" in2="shifted" operator="out" result="crest" />
            <feFlood floodColor="white" floodOpacity="0.9" result="crestLight" />
            <feComposite in="crestLight" in2="crest" operator="in" result="highlight" />
            <feMerge><feMergeNode in="edge" /><feMergeNode in="highlight" /></feMerge>
          </filter>
        </defs>
        <image href="/brand/azuria-logo-branca.svg" width="875" height="210" filter={`url(#${bevelId})`} />
      </svg>
    </span>
  );
}
