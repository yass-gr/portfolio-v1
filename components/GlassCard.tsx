"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { LiquidGlass } from "@ybouane/liquidglass";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: number;
  saturation?: number;
  backgroundOpacity?: number;
  borderRadius?: number;
  borderOpacity?: number;
  borderWidth?: number;
}

const DEFAULTS = {
  blur: 20,
  saturation: 1.8,
  backgroundOpacity: 0.08,
  borderRadius: 60,
  borderOpacity: 0.35,
  borderWidth: 1,
} as const;

export default function GlassCard({
  children,
  className = "",
  blur = DEFAULTS.blur,
  saturation = DEFAULTS.saturation,
  backgroundOpacity = DEFAULTS.backgroundOpacity,
  borderRadius = DEFAULTS.borderRadius,
  borderOpacity = DEFAULTS.borderOpacity,
  borderWidth = DEFAULTS.borderWidth,
}: GlassCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReturnType<typeof LiquidGlass.init> | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glass = glassRef.current;
    if (!root || !glass) return;

    const instance = LiquidGlass.init({
      root,
      glassElements: [glass],
    });
    instanceRef.current = instance;

    // Apply background opacity to glass element (under the canvas)
    glass.style.backgroundColor = `rgba(255,255,255,${backgroundOpacity})`;

    // Set data-config for LiquidGlass (optional, but keeps reactive if library reads it)
    glass.dataset.config = JSON.stringify({
      // Map blur px (0-100) to blurAmount 0-1
      blurAmount: Math.min(Math.max(blur / 100, 0), 1),
      // Map GlassCard saturation (assumed 0-3) to LiquidGlass saturation (-1 to 1)
      // 1 => 0, 0 => -1, 2 => 1, clamped
      saturation: Math.max(Math.min(saturation - 1, 1), -1),
      // Corner radius in px
      cornerRadius: borderRadius,
      // Use default values for other options (can be exposed as props later)
      refraction: 0.69,
      chromAberration: 0.05,
      edgeHighlight: 0.05,
      specular: 0,
      fresnel: 1.29,
      zRadius: 15,
      brightness: 0,
      shadowOpacity: 0.3,
      shadowSpread: 10,
      bevelMode: 0,
    });

    // Optional: keep border styling as fallback (may be hidden by canvas)
    glass.style.borderRadius = `${borderRadius}px`;
    glass.style.boxShadow = `inset 0 0 0 ${borderWidth}px rgba(255,255,255,${borderOpacity})`;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [
    blur,
    saturation,
    backgroundOpacity,
    borderRadius,
    borderOpacity,
    borderWidth,
    className,
  ]);

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-wrap items-center justify-center overflow-hidden ${className}`}
      style={{ background: "transparent" }} // ensure base is transparent
    >
      {/* Glass element that LiquidGlass will enhance */}
      <div
        ref={glassRef}
        data-json="{}" // placeholder; actual data set in useEffect
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="relative z-10 size-full">{children}</div>
      </div>
    </div>
  );
}