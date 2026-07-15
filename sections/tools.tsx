"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import Gravity, {
  GravityRef,
  MatterBody,
} from "@/components/fancy/physics/gravity";

gsap.registerPlugin(ScrollTrigger);

interface Tool {
  name: string;
  slug: string;
  color: string;
}

const devTools: Tool[] = [
  { name: "React", slug: "react", color: "#61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "#666666" },
  { name: "TypeScript", slug: "typescript", color: "#3178C6" },
  { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
  { name: "Python", slug: "python", color: "#3776AB" },
  { name: "Docker", slug: "docker", color: "#2496ED" },
  { name: "Tailwind", slug: "tailwindcss", color: "#06B6D4" },
  { name: "Svelte", slug: "svelte", color: "#FF3E00" },
  { name: "Go", slug: "go", color: "#00ADD8" },
  { name: "GraphQL", slug: "graphql", color: "#E10098" },
];

const designTools: Tool[] = [
  { name: "Figma", slug: "figma", color: "#F24E1E" },
  { name: "Blender", slug: "blender", color: "#E87D0D" },
  { name: "Sketch", slug: "sketch", color: "#F7B500" },
  { name: "GIMP", slug: "gimp", color: "#5C5543" },
  { name: "Dribbble", slug: "dribbble", color: "#EA4C89" },
];

const aiTools: Tool[] = [
  { name: "TensorFlow", slug: "tensorflow", color: "#FF6F00" },
  { name: "PyTorch", slug: "pytorch", color: "#EE4C2C" },
  { name: "LangChain", slug: "langchain", color: "#1C3C3C" },
  { name: "Hugging Face", slug: "huggingface", color: "#FFD21E" },
  { name: "scikit-learn", slug: "scikitlearn", color: "#F7931E" },
  { name: "Keras", slug: "keras", color: "#D00000" },
  { name: "Jupyter", slug: "jupyter", color: "#F37626" },
  { name: "MLflow", slug: "mlflow", color: "#0194E2" },
];

interface Bucket {
  label: string;
  tools: Tool[];
  x: string;
  width: string;
}

const buckets: Bucket[] = [
  { label: "dev", tools: devTools, x: "3%", width: "30%" },
  { label: "design", tools: designTools, x: "35%", width: "30%" },
  { label: "ai", tools: aiTools, x: "67%", width: "30%" },
];

function getBucketCenter(bucket: Bucket): number {
  return parseFloat(bucket.x) + parseFloat(bucket.width) / 2;
}

function getBucketRight(bucket: Bucket): number {
  return parseFloat(bucket.x) + parseFloat(bucket.width);
}

function getGapCenter(left: Bucket, right: Bucket): string {
  return `${(getBucketRight(left) + parseFloat(right.x)) / 2}%`;
}

function ToolPill({
  tool,
  x,
  y,
  clampMinX,
  clampMaxX,
}: {
  tool: Tool;
  x: string;
  y: string;
  clampMinX?: string;
  clampMaxX?: string;
}) {
  const [iconFailed, setIconFailed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const iconColor = isDark ? "ffffff" : "000000";
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-white/15" : "border-black/10";
  const bgColor = isDark ? "bg-white/8" : "bg-black/5";

  return (
    <MatterBody
      matterBodyOptions={{ friction: 1, restitution: 0.01, density: 0.005 }}
      x={x}
      y={y}
      bodyType="rectangle"
      clampMinX={clampMinX}
      clampMaxX={clampMaxX}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-clash-grotesk-semibold cursor-grab active:cursor-grabbing ${textColor} ${borderColor} ${bgColor}`}
        style={{
          borderWidth: "1.5px",
          boxShadow: isDark
            ? "0 0 20px rgba(255,255,255,0.06)"
            : "0 0 20px rgba(0,0,0,0.04)",
        }}
      >
        {iconFailed ? (
          <span className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
            {tool.name[0]}
          </span>
        ) : (
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}/${iconColor}`}
            alt={tool.name}
            className="w-6 h-6"
            onError={() => setIconFailed(true)}
          />
        )}
        {tool.name}
      </div>
    </MatterBody>
  );
}

function rng(base: number, range: number) {
  return `${base + (Math.random() - 0.5) * range}%`;
}

function BucketVisual({
  bucket,
  borderColor,
  blurBg,
}: {
  bucket: Bucket;
  borderColor: string;
  blurBg: string;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: bucket.x,
        width: bucket.width,
        top: "5%",
        height: "92%",
        border: `1.5px solid ${borderColor}`,
        borderRadius: 60,
        backgroundColor: blurBg,
      }}
    >
      <div
        id={`bucket-label-${bucket.label}`}
        className="absolute top-8 left-8 font-panchang-bold text-4xl text-black dark:text-white capitalize pointer-events-none transition-all duration-500 ease-out translate-y-[-120%] opacity-0"
      >
        {bucket.label}
      </div>
    </div>
  );
}

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gravityContainerRef = useRef<HTMLDivElement>(null);
  const gravityRef = useRef<GravityRef>(null);
  const gravityStarted = useRef(false);
  const [isDark, setIsDark] = useState(false);
  const hoveredRef = useRef<string | null>(null);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !gravityStarted.current) {
          gravityStarted.current = true;
          gravityRef.current?.start();
        }
      },
      { threshold: 0 },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  function updateBucketLabel(label: string | null) {
    for (const bucket of buckets) {
      const el = document.getElementById(`bucket-label-${bucket.label}`);
      if (!el) continue;
      if (bucket.label === label) {
        el.classList.remove("translate-y-[-120%]", "opacity-0");
        el.classList.add("translate-y-0", "opacity-100");
      } else {
        el.classList.remove("translate-y-0", "opacity-100");
        el.classList.add("translate-y-[-120%]", "opacity-0");
      }
    }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gravityContainerRef.current) return;
    const rect = gravityContainerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    let found: string | null = null;
    for (const bucket of buckets) {
      const bx = parseFloat(bucket.x);
      const bw = parseFloat(bucket.width);
      if (mouseX >= bx && mouseX <= bx + bw && mouseY >= 5 && mouseY <= 97) {
        found = bucket.label;
        break;
      }
    }
    if (found !== hoveredRef.current) {
      hoveredRef.current = found;
      updateBucketLabel(found);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoveredRef.current !== null) {
      hoveredRef.current = null;
      updateBucketLabel(null);
    }
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { fontSize: "3vw", x: 0, y: "-70%" },
      {
        fontSize: "6.5vw",
        x: "-30dvw",
        y: "-20%",
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 0,
        },
      },
    );
  }, []);

  const borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)";
  const blurBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(230,230,235,0.6)";

  return (
    <section ref={sectionRef} id="tools" className="min-h-dvh p-5">
      <h1 ref={titleRef} className="font-panchang-bold text-center text-5xl">
        Tools
      </h1>

      <LiquidGlassCard className="-translate-y-[11.5%] mt-16 pb-14">
        <div className="pt-14 pb-10 px-10 max-sm:pt-8 max-sm:pb-6 max-sm:px-4">
          <p className="font-clash-grotesk-regular text-2xl text-neutral-700 dark:text-neutral-300 pl-6 max-sm:text-base max-sm:pl-2">
            everything i need to build, design, and ship
          </p>
        </div>
        <div
          className="min-h-[600px] px-10 pb-5 relative"
          ref={gravityContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Gravity
            ref={gravityRef}
            gravity={{ x: 0, y: 0.2 }}
            className="w-full h-full"
            grabCursor
            addTopWall
            autoStart={false}
          >
            {buckets.map((bucket) => (
              <BucketVisual
                key={bucket.label}
                bucket={bucket}
                borderColor={borderColor}
                blurBg={blurBg}
              />
            ))}

            {buckets.map((bucket) =>
              bucket.tools.map((tool, i) => (
                <ToolPill
                  key={`${bucket.label}-${tool.name}`}
                  tool={tool}
                  x={rng(
                    getBucketCenter(bucket),
                    parseFloat(bucket.width) * 0.3,
                  )}
                  y={`${12 + i * 8}%`}
                  clampMinX={bucket.x}
                  clampMaxX={`${getBucketRight(bucket)}%`}
                />
              )),
            )}

            {buckets.slice(0, -1).map((bucket, i) => (
              <MatterBody
                key={`wall-${i}`}
                matterBodyOptions={{ isStatic: true, friction: 1 }}
                x={getGapCenter(bucket, buckets[i + 1])}
                y="50%"
              >
                <div
                  className="opacity-0 pointer-events-none"
                  style={{ width: 80, height: 3000 }}
                />
              </MatterBody>
            ))}

            <MatterBody
              matterBodyOptions={{ isStatic: true, friction: 1 }}
              x={buckets[0].x}
              y="50%"
            >
              <div
                className="opacity-0 pointer-events-none"
                style={{ width: 60, height: 3000 }}
              />
            </MatterBody>

            <MatterBody
              matterBodyOptions={{ isStatic: true, friction: 1 }}
              x={`${getBucketRight(buckets[buckets.length - 1])}%`}
              y="50%"
            >
              <div
                className="opacity-0 pointer-events-none"
                style={{ width: 60, height: 3000 }}
              />
            </MatterBody>

            <MatterBody
              matterBodyOptions={{ isStatic: true, friction: 1 }}
              x="50%"
              y="93%"
            >
              <div
                className="opacity-0 pointer-events-none"
                style={{ width: 5000, height: 40 }}
              />
            </MatterBody>
          </Gravity>
        </div>
      </LiquidGlassCard>
    </section>
  );
}
