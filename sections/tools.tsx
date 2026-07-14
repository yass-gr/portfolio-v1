"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity";

gsap.registerPlugin(ScrollTrigger);

interface Tool {
  name: string
  slug: string
  color: string
}

const devTools: Tool[] = [
  { name: "React", slug: "react", color: "#61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "#000000" },
  { name: "TypeScript", slug: "typescript", color: "#3178C6" },
  { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
  { name: "Python", slug: "python", color: "#3776AB" },
  { name: "Docker", slug: "docker", color: "#2496ED" },
  { name: "Tailwind", slug: "tailwindcss", color: "#06B6D4" },
]

const designTools: Tool[] = [
  { name: "Figma", slug: "figma", color: "#F24E1E" },
  { name: "Photoshop", slug: "adobephotoshop", color: "#31A8FF" },
  { name: "Illustrator", slug: "adobeillustrator", color: "#FF9A00" },
  { name: "Blender", slug: "blender", color: "#E87D0D" },
  { name: "Canva", slug: "canva", color: "#00C4CC" },
  { name: "After Effects", slug: "adobeaftereffects", color: "#9999FF" },
]

const aiTools: Tool[] = [
  { name: "TensorFlow", slug: "tensorflow", color: "#FF6F00" },
  { name: "PyTorch", slug: "pytorch", color: "#EE4C2C" },
  { name: "OpenAI", slug: "openai", color: "#412991" },
  { name: "LangChain", slug: "langchain", color: "#1C3C3C" },
  { name: "Hugging Face", slug: "huggingface", color: "#FFD21E" },
  { name: "scikit-learn", slug: "scikitlearn", color: "#F7931E" },
]

interface Bucket {
  label: string
  tools: Tool[]
  x: string
  width: string
}

const buckets: Bucket[] = [
  { label: "dev", tools: devTools, x: "3%", width: "30%" },
  { label: "design", tools: designTools, x: "35%", width: "30%" },
  { label: "ai", tools: aiTools, x: "67%", width: "30%" },
]

function getBucketCenter(bucket: Bucket): number {
  return parseFloat(bucket.x) + parseFloat(bucket.width) / 2
}

function ToolPill({ tool, x, y }: { tool: Tool; x: string; y: string }) {
  return (
    <MatterBody
      matterBodyOptions={{ friction: 0.8, restitution: 0.08, density: 0.002 }}
      x={x}
      y={y}
      bodyType="rectangle"
    >
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-full text-lg font-clash-grotesk-semibold cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: `${tool.color}18`,
          color: tool.color,
          border: `1.5px solid ${tool.color}35`,
        }}
      >
        <img
          src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color.replace("#", "")}`}
          alt={tool.name}
          className="w-10 h-10"
        />
        {tool.name}
      </div>
    </MatterBody>
  )
}

function rng(base: number, range: number) {
  return `${base + (Math.random() - 0.5) * range}%`
}

function getBucketRight(bucket: Bucket): number {
  return parseFloat(bucket.x) + parseFloat(bucket.width)
}

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { fontSize: "3vw", x: 0, y: "-70%" },
      {
        fontSize: "6.5vw",
        x: "24dvw",
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

  const borderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const labelBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "text-neutral-100" : "text-neutral-900";

  return (
    <section ref={sectionRef} id="tools" className="min-h-dvh p-5">
      <h1 ref={titleRef} className="font-panchang-bold text-center text-5xl">
        Tools
      </h1>

      <LiquidGlassCard className="-translate-y-[3.5%] mt-16">
        <div className="p-6">
          <p className="text-center text-xl font-clash-grotesk-regular text-neutral-500 dark:text-neutral-400 mb-4">
            tools i use
          </p>
        </div>
        <div className="min-h-[600px] px-5 pb-5 relative">
          <Gravity
            gravity={{ x: 0, y: 0.4 }}
            className="w-full h-full"
            grabCursor
            addTopWall
          >
            {buckets.map((bucket) => (
              <div key={bucket.label}>
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    left: bucket.x,
                    width: bucket.width,
                    top: "5%",
                    height: "92%",
                    border: `1.5px solid ${borderColor}`,
                  }}
                />
                <div
                  className={`absolute top-0 left-0 text-base font-clash-grotesk-semibold capitalize pointer-events-none px-3 py-1 rounded-lg ${textColor}`}
                  style={{
                    left: bucket.x,
                    backgroundColor: labelBg,
                  }}
                >
                  {bucket.label}
                </div>
                {bucket.tools.map((tool, i) => (
                  <ToolPill
                    key={tool.name}
                    tool={tool}
                    x={rng(getBucketCenter(bucket), parseFloat(bucket.width) * 0.4)}
                    y={`${18 + i * 10}%`}
                  />
                ))}
              </div>
            ))}

            {buckets.slice(0, -1).map((bucket) => {
              const wallX = getBucketRight(bucket)
              return (
                <MatterBody
                  key={`wall-${bucket.label}`}
                  matterBodyOptions={{ isStatic: true, friction: 1 }}
                  x={`${wallX}%`}
                  y="50%"
                >
                  <div className="w-[6px] h-[900px] opacity-0 pointer-events-none" />
                </MatterBody>
              )
            })}
          </Gravity>
        </div>
      </LiquidGlassCard>
    </section>
  );
}
