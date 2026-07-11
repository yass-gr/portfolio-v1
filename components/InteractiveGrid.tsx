"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface InteractiveGridProps {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  effectColor?: string;
  darkEffectColor?: string;
  trailLength?: number;
  width?: string;
  height?: string;
  idleSpeed?: number;
  glow?: boolean;
  glowRadius?: number;
  showFade?: boolean;
  fadeIntensity?: number;
  idleRandomCount?: number;
  className?: string;
  children?: ReactNode;
}

export function InteractiveGrid({
  gridSize = 30,
  gridColor = "#cbcbcb",
  darkGridColor = "#303030",
  effectColor = "rgba(0, 0, 0, 0.6)",
  darkEffectColor = "rgba(255, 255, 255, 0.6)",
  trailLength = 3,
  width,
  height,
  idleSpeed = 0.2,
  glow = true,
  glowRadius = 20,
  showFade = true,
  fadeIntensity = 20,
  idleRandomCount = 5,
  className = "",
  children,
}: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const lastMoveRef = useRef(Date.now());
  const activeGridColor = isDark ? darkGridColor : gridColor;

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(() => check());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rect: DOMRect | null = null;
    const container = containerRef.current;
    const updateRect = () => {
      if (container) rect = container.getBoundingClientRect();
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    const onMove = (e: MouseEvent) => {
      if (!container) return;
      if (!rect) rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      lastMoveRef.current = Date.now();

      const gx = Math.floor(x / gridSize);
      const gy = Math.floor(y / gridSize);
      const trail = trailRef.current;
      if (!trail[0] || trail[0].x !== gx || trail[0].y !== gy) {
        trail.unshift({ x: gx, y: gy });
        if (trail.length > trailLength) trail.pop();
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", onMove);
    };
  }, [gridSize, trailLength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
      return { w, h };
    };

    let { w, h } = resize();

    const cols = Math.floor(w / gridSize);
    const rows = Math.floor(h / gridSize);
    const color = isDark ? darkEffectColor : effectColor;

    let idleTargets = Array.from({ length: idleRandomCount }, () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    }));
    let idleDots = idleTargets.map((d) => ({ ...d }));

    const ro = new ResizeObserver(() => {
      ({ w, h } = resize());
    });
    ro.observe(container);

    let animId: number;

    const draw = () => {
      const trail = trailRef.current;
      ctx.clearRect(0, 0, w, h);

      if (Date.now() - lastMoveRef.current > 2000) {
        const newCols = Math.floor(w / gridSize);
        const newRows = Math.floor(h / gridSize);
        idleTargets.forEach((target, i) => {
          const dot = idleDots[i];
          const dx = target.x - dot.x;
          const dy = target.y - dot.y;
          if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            idleDots[i] = {
              x: Math.floor(Math.random() * newCols),
              y: Math.floor(Math.random() * newRows),
            };
          } else {
            dot.x += dx * idleSpeed;
            dot.y += dy * idleSpeed;
          }
          const ox = Math.round(dot.x);
          const oy = Math.round(dot.y);
          if (!trail[0] || trail[0].x !== ox || trail[0].y !== oy) {
            trail.unshift({ x: ox, y: oy });
            if (trail.length > trailLength * idleRandomCount) trail.pop();
          }
        });
      }

      trail.forEach((point, idx) => {
        const alpha = 1 - (1 / (trailLength + 1)) * idx;
        const fill = color.replace(/[\d.]+\)$/g, `${alpha})`);
        ctx.fillStyle = fill;
        if (glow) {
          ctx.shadowColor = fill;
          ctx.shadowBlur = glowRadius;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(point.x * gridSize, point.y * gridSize, gridSize, gridSize);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [
    gridSize,
    gridColor,
    darkGridColor,
    effectColor,
    darkEffectColor,
    isDark,
    trailLength,
    idleSpeed,
    glow,
    glowRadius,
    idleRandomCount,
  ]);

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${activeGridColor} 1px, transparent 1px), linear-gradient(to bottom, ${activeGridColor} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-white dark:bg-black"
          style={{
            maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
          }}
        />
      )}
      <div className="relative z-10 size-full">{children}</div>
    </div>
  );
}
