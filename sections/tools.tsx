"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidGlassCard from "@/components/LiquidGlassCard";

gsap.registerPlugin(ScrollTrigger);

interface Tool {
  name: string
  slug: string
  color: string
}

const tabs = ["dev", "design", "ai"] as const
type Tab = (typeof tabs)[number]

const toolData: Record<Tab, Tool[]> = {
  dev: [
    { name: "React", slug: "react", color: "#61DAFB" },
    { name: "Next.js", slug: "nextdotjs", color: "#000000" },
    { name: "TypeScript", slug: "typescript", color: "#3178C6" },
    { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
    { name: "Python", slug: "python", color: "#3776AB" },
    { name: "Docker", slug: "docker", color: "#2496ED" },
    { name: "Tailwind", slug: "tailwindcss", color: "#06B6D4" },
  ],
  design: [
    { name: "Figma", slug: "figma", color: "#F24E1E" },
    { name: "Photoshop", slug: "adobephotoshop", color: "#31A8FF" },
    { name: "Illustrator", slug: "adobeillustrator", color: "#FF9A00" },
    { name: "Blender", slug: "blender", color: "#E87D0D" },
    { name: "Canva", slug: "canva", color: "#00C4CC" },
    { name: "After Effects", slug: "adobeaftereffects", color: "#9999FF" },
  ],
  ai: [
    { name: "TensorFlow", slug: "tensorflow", color: "#FF6F00" },
    { name: "PyTorch", slug: "pytorch", color: "#EE4C2C" },
    { name: "OpenAI", slug: "openai", color: "#412991" },
    { name: "LangChain", slug: "langchain", color: "#1C3C3C" },
    { name: "Hugging Face", slug: "huggingface", color: "#FFD21E" },
    { name: "scikit-learn", slug: "scikitlearn", color: "#F7931E" },
  ],
}

const tabColors: Record<Tab, string> = {
  dev: "#3178C6",
  design: "#F24E1E",
  ai: "#EE4C2C",
}

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dev");

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

  const activeColor = tabColors[activeTab];

  return (
    <section ref={sectionRef} id="tools" className="min-h-dvh p-5">
      <h1 ref={titleRef} className="font-panchang-bold text-center text-5xl">
        Tools
      </h1>
      <p className="text-center text-2xl font-clash-grotesk-regular text-neutral-500 dark:text-neutral-400 mt-2">
        tools i use
      </p>

      <LiquidGlassCard className="-translate-y-[3.5%] mt-16">
        <div className="min-h-dvh p-8 flex flex-col">
          <div className="flex gap-0 border-b border-neutral-300 dark:border-neutral-700">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-8 py-3 text-lg font-clash-grotesk-semibold capitalize transition-colors"
                style={{
                  color: activeTab === tab ? tabColors[tab] : undefined,
                }}
              >
                {tab}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: tabColors[tab] }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 pt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 content-start">
              {toolData[activeTab].map((tool) => (
                <div
                  key={tool.name}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${tool.color}0d`,
                    border: `1.5px solid ${tool.color}30`,
                  }}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color.replace("#", "")}`}
                    alt={tool.name}
                    className="w-10 h-10"
                  />
                  <span
                    className="text-sm font-clash-grotesk-semibold text-center"
                    style={{ color: tool.color }}
                  >
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LiquidGlassCard>
    </section>
  );
}
