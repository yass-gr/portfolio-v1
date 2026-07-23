"use client";

import { type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { FluidGlassMode, GlassMaterialProps } from "@/components/FluidGlass";

const FluidGlass = dynamic(() => import("@/components/FluidGlass"), {
  ssr: false,
});

interface FluidGlassCardProps {
  children: ReactNode;
  className?: string;
  /** Display mode for the 3D glass mesh */
  mode?: FluidGlassMode;
  /** Props passed to the active mode (ior, thickness, scale, …) */
  glassProps?: GlassMaterialProps;
  borderRadius?: number;
  borderWidth?: number;
  borderOpacity?: number;
  /** Kept for drop-in compatibility with LiquidGlassCard — softens the panel under the WebGL layer */
  blurAmount?: number;
  brightness?: number;
  displacementScale?: number;
  turbulenceFreq?: number;
  turbulenceOctaves?: number;
}

const DEFAULT_GLASS: Record<FluidGlassMode, GlassMaterialProps> = {
  lens: {
    ior: 1.15,
    thickness: 5,
    chromaticAberration: 0.1,
    anisotropy: 0.01,
    transmission: 1,
    roughness: 0.05,
  },
  cube: {
    ior: 1.15,
    thickness: 5,
    chromaticAberration: 0.1,
    anisotropy: 0.01,
    transmission: 1,
    roughness: 0.05,
  },
  bar: {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: "#ffffff",
    attenuationColor: "#ffffff",
    attenuationDistance: 0.25,
  },
};

/**
 * Glass content card powered by React Bits FluidGlass (MeshTransmissionMaterial).
 * Drop-in shape of the archived LiquidGlassCard: children + className + borderRadius.
 */
export default function FluidGlassCard({
  children,
  className = "",
  mode = "lens",
  glassProps = {},
  borderRadius = 60,
  borderWidth = 4,
  borderOpacity = 0.55,
  blurAmount = 12,
  brightness = 1.15,
}: FluidGlassCardProps) {
  const modeProps = { ...DEFAULT_GLASS[mode], ...glassProps };
  const lensProps = mode === "lens" ? modeProps : undefined;
  const barProps = mode === "bar" ? modeProps : undefined;
  const cubeProps = mode === "cube" ? modeProps : undefined;

  return (
    <div
      className={`relative flex flex-wrap items-center justify-center overflow-hidden ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        filter: "drop-shadow(-8px -10px 46px #0000005f)",
      }}
    >
      {/* Soft frosted base so content stays readable while WebGL loads / refracts */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          borderRadius: `${borderRadius}px`,
          backdropFilter: `brightness(${brightness}) blur(${blurAmount}px)`,
          WebkitBackdropFilter: `brightness(${brightness}) blur(${blurAmount}px)`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        }}
      />

      {/* Fluid glass WebGL layer */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-90"
        style={{ borderRadius: `${borderRadius}px` }}
        aria-hidden
      >
        <FluidGlass
          embed
          mode={mode}
          lensProps={lensProps}
          barProps={barProps}
          cubeProps={cubeProps}
        />
      </div>

      {/* Edge highlights (same language as archived LiquidGlassCard) */}
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
