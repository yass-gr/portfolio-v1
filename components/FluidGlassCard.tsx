"use client";

import { type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { GlassMaterialProps } from "@/components/FluidGlass";

const FluidGlass = dynamic(() => import("@/components/FluidGlass"), {
  ssr: false,
});

interface FluidGlassCardProps {
  children: ReactNode;
  className?: string;
  /**
   * Cube material + size.
   * - omit scale → auto-stretches cube to the card
   * - `scale` → uniform size
   * - `scaleX` / `scaleY` / `scaleZ` → non-uniform resize
   */
  glassProps?: GlassMaterialProps;
  borderRadius?: number;
  borderWidth?: number;
  borderOpacity?: number;
  /** Soft frosted layer under the cube (readable content) */
  blurAmount?: number;
  brightness?: number;
  displacementScale?: number;
  turbulenceFreq?: number;
  turbulenceOctaves?: number;
}

const DEFAULT_CUBE: GlassMaterialProps = {
  ior: 1.15,
  thickness: 5,
  chromaticAberration: 0.1,
  anisotropy: 0.01,
  transmission: 1,
  roughness: 0.05,
};

/**
 * Glass content card: transparent cube.glb only (no backdrop images).
 * Drop-in shape of the archived LiquidGlassCard.
 */
export default function FluidGlassCard({
  children,
  className = "",
  glassProps = {},
  borderRadius = 60,
  borderWidth = 4,
  borderOpacity = 0.55,
  blurAmount = 12,
  brightness = 1.15,
}: FluidGlassCardProps) {
  const cubeProps = { ...DEFAULT_CUBE, ...glassProps };

  return (
    <div
      className={`relative flex flex-wrap items-center justify-center overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        filter: "drop-shadow(-8px -10px 46px #0000005f)",
      }}
    >
      {/* Soft frosted base for readability */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          borderRadius: `${borderRadius}px`,
          backdropFilter: `brightness(${brightness}) blur(${blurAmount}px)`,
          WebkitBackdropFilter: `brightness(${brightness}) blur(${blurAmount}px)`,
        }}
      />

      {/* Cube glass only — no bg images */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ borderRadius: `${borderRadius}px` }}
        aria-hidden
      >
        <FluidGlass embed mode="cube" cubeProps={cubeProps} />
      </div>

      {/* Edge highlights */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] dark:opacity-100"
        style={{
          borderRadius: `${borderRadius}px`,
          boxShadow: `inset ${borderWidth}px ${borderWidth}px 0px -${borderWidth}px rgba(255,255,255,${borderOpacity}), inset 0 0 8px 1px rgba(255,255,255,${borderOpacity * 0.5})`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-100 dark:opacity-0"
        style={{
          borderRadius: `${borderRadius}px`,
          boxShadow: `inset ${borderWidth}px ${borderWidth}px 0px -${borderWidth}px rgba(0,0,0,${borderOpacity * 0.6}), inset 0 0 8px 1px rgba(0,0,0,${borderOpacity * 0.3})`,
        }}
      />

      <div className="relative z-10 size-full">{children}</div>
    </div>
  );
}
