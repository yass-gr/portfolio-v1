"use client";

import React, { useEffect, useRef, useState, useId } from "react";

export interface GlassCubeProps {
  children?: React.ReactNode;
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
  className?: string;
  style?: React.CSSProperties;
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      const isClassDark = document.documentElement.classList.contains("dark");
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(isClassDark || isSystemDark);
    };
    check();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const mediaHandler = (e: MediaQueryListEvent) => {
      if (!document.documentElement.classList.contains("dark")) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener("change", mediaHandler);
    const observer = new MutationObserver(() => check());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mediaQuery.removeEventListener("change", mediaHandler);
      observer.disconnect();
    };
  }, []);
  return isDark;
};

const GlassCube: React.FC<GlassCubeProps> = ({
  children,
  width = "auto",
  height = "auto",
  borderRadius = 24,
  borderWidth = 0.1,
  brightness = 60,
  opacity = 0.95,
  blur = 15,
  displace = 0.5,
  backgroundOpacity = 0,
  saturation = 1.5,
  distortionScale = -280,
  redOffset = 0,
  greenOffset = 15,
  blueOffset = 30,
  className = "",
  style = {},
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `cube-glass-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;
  const cubeMapId = `cube-map-${uniqueId}`;

  const [svgSupported, setSvgSupported] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const isDarkMode = useDarkMode();

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
          <pattern id="${cubeMapId}" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="black"/>
            <polygon points="30,0 60,30 30,60 0,30" fill="white" opacity="0.3"/>
            <rect x="15" y="15" width="30" height="30" fill="white" opacity="0.15"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: difference" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="url(#${cubeMapId})" style="mix-blend-mode: overlay; opacity: 0.15" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute("href", generateDisplacementMap());
  };

  useEffect(() => {
    updateDisplacementMap();
    [{ ref: redChannelRef, offset: redOffset },
     { ref: greenChannelRef, offset: greenOffset },
     { ref: blueChannelRef, offset: blueOffset }].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute("scale", (distortionScale + offset).toString());
        ref.current.setAttribute("xChannelSelector", "R");
        ref.current.setAttribute("yChannelSelector", "G");
      }
    });
    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [width, height, borderRadius, borderWidth, brightness, opacity, blur, displace, distortionScale, redOffset, greenOffset, blueOffset]);

  useEffect(() => {
    setSvgSupported(supportsSVGFilters());
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => setTimeout(updateDisplacementMap, 0));
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(updateDisplacementMap, 0);
  }, [width, height]);

  const supportsSVGFilters = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return false;
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isWebkit || isFirefox) return false;
    const div = document.createElement("div");
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== "";
  };

  const supportsBackdropFilter = () => {
    if (typeof window === "undefined") return false;
    return CSS.supports("backdrop-filter", "blur(10px)");
  };

  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      ...style,
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      borderRadius: `${borderRadius}px`,
      "--glass-frost": backgroundOpacity,
      "--glass-saturation": saturation,
    } as React.CSSProperties;

    const backdropFilterSupported = supportsBackdropFilter();

    if (svgSupported) {
      return {
        ...baseStyles,
        background: isDarkMode
          ? `hsl(0 0% 0% / ${backgroundOpacity})`
          : `hsl(0 0% 100% / ${backgroundOpacity})`,
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        boxShadow: isDarkMode
          ? "0 8px 32px rgba(255,255,255,0.1)"
          : "0 8px 32px rgba(0,0,0,0.15)",
      };
    } else {
      if (isDarkMode) {
        return backdropFilterSupported
          ? { ...baseStyles, background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(12px) saturate(1.5) brightness(1.2)", WebkitBackdropFilter: "blur(12px) saturate(1.5) brightness(1.2)" }
          : { ...baseStyles, background: "rgba(0, 0, 0, 0.5)" };
      } else {
        return backdropFilterSupported
          ? { ...baseStyles, background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(12px) saturate(1.5) brightness(1.1)", WebkitBackdropFilter: "blur(12px) saturate(1.5) brightness(1.1)" }
          : { ...baseStyles, background: "rgba(255, 255, 255, 0.3)" };
      }
    }
  };

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      className={`relative flex items-center justify-center transition-opacity duration-[260ms] ease-out ${className}`}
      style={getContainerStyles()}
    >
      <svg
        className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" id="greenchannel" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCube;
