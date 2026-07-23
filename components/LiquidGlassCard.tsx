"use client";

import { useId, type ReactNode } from "react";

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  blurAmount?: number;
  brightness?: number;
  displacementScale?: number;
  turbulenceFreq?: number;
  turbulenceOctaves?: number;
  borderWidth?: number;
  borderOpacity?: number;
  borderRadius?: number;
}

const DEFAULTS = {
  blurAmount: 17,
  brightness: 2,
  displacementScale: 30,
  turbulenceFreq: 0.012,
  turbulenceOctaves: 2,
  borderWidth: 4,
  borderOpacity: 0.55,
  borderRadius: 60,
} as const;

export default function LiquidGlassCard({
  children,
  className = "",
  blurAmount = DEFAULTS.blurAmount,
  brightness = DEFAULTS.brightness,
  displacementScale = DEFAULTS.displacementScale,
  turbulenceFreq = DEFAULTS.turbulenceFreq,
  turbulenceOctaves = DEFAULTS.turbulenceOctaves,
  borderWidth = DEFAULTS.borderWidth,
  borderOpacity = DEFAULTS.borderOpacity,
  borderRadius = DEFAULTS.borderRadius,
}: LiquidGlassCardProps) {
  const uid = useId().replace(/[:.]/g, "-");
  const filterId = `lg-filter-${uid}`;

  return (
    <>
      <svg style={{ display: "none" }}>
        <filter id={filterId}>
          <feTurbulence type="turbulence" baseFrequency={turbulenceFreq} numOctaves={turbulenceOctaves} result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale={displacementScale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        className={`relative flex flex-wrap items-center justify-center ${className}`}
        style={{
          borderRadius: `${borderRadius}px`,
          filter: "drop-shadow(-8px -10px 46px #0000005f)",
          backdropFilter: `brightness(${brightness}) blur(${blurAmount}px) url(#${filterId})`,
          WebkitBackdropFilter: `brightness(${brightness}) blur(${blurAmount}px) url(#${filterId})`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 dark:opacity-100"
          style={{
            borderRadius: `${borderRadius}px`,
            boxShadow: `inset ${borderWidth}px ${borderWidth}px 0px -${borderWidth}px rgba(255,255,255,${borderOpacity}), inset 0 0 8px 1px rgba(255,255,255,${borderOpacity * 0.5})`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-100 dark:opacity-0"
          style={{
            borderRadius: `${borderRadius}px`,
            boxShadow: `inset ${borderWidth}px ${borderWidth}px 0px -${borderWidth}px rgba(0,0,0,${borderOpacity * 0.6}), inset 0 0 8px 1px rgba(0,0,0,${borderOpacity * 0.3})`,
          }}
        />
        <div className="relative z-10 size-full">{children}</div>
      </div>
    </>
  );
}
