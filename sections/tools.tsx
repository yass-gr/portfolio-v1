"use client";

import { useRef } from "react";
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

function ToolIcon({ tool, x, y }: { tool: Tool; x: string; y: string }) {
  return (
    <MatterBody
      matterBodyOptions={{ friction: 0.5, restitution: 0.3 }}
      x={x}
      y={y}
      bodyType="rectangle"
    >
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-clash-grotesk-semibold cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: `${tool.color}20`,
          color: tool.color,
          border: `1.5px solid ${tool.color}40`,
        }}
      >
        <img
          src={`https://cdn.simpleicons.org/${tool.slug}/${tool.color.replace("#", "")}`}
          alt={tool.name}
          className="w-4 h-4"
        />
        {tool.name}
      </div>
    </MatterBody>
  )
}

function randomOffset(base: number, range: number) {
  return base + (Math.random() - 0.5) * range
}

function devY(index: number) {
  return `${randomOffset(15, 10) + index * 8}%`
}

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  return (
    <section ref={sectionRef} id="tools" className="min-h-dvh p-5">
      <h1 ref={titleRef} className="font-panchang-bold text-center text-5xl">
        Tools
      </h1>

      <LiquidGlassCard className="-translate-y-[3.5%] mt-20 ">
        <div className="min-h-dvh p-5 grid grid-cols-12 py-[100px]">
          <div className="text-2xl col-span-3 mt-20 ml-8 sticky top-40 h-fit">
            <div className="text-left">
              <h2 className="font-clash-grotesk-regular leading-15">
                <span className="text-[#3178C6]">dev</span>
                <span className="text-neutral-400 dark:text-neutral-500"> / </span>
                <span className="text-[#F24E1E]">design</span>
                <span className="text-neutral-400 dark:text-neutral-500"> / </span>
                <span className="text-[#EE4C2C]">ai</span>
                <br />
                <span className="text-3xl">tools i use</span>
              </h2>
            </div>
          </div>
          <div className="col-span-9 relative p-4 min-h-[500px]">
            <Gravity
              gravity={{ x: 0, y: 1 }}
              className="w-full h-full"
              grabCursor
              addTopWall
            >
              {devTools.map((tool, i) => (
                <ToolIcon
                  key={tool.name}
                  tool={tool}
                  x={`${randomOffset(18, 8)}%`}
                  y={devY(i)}
                />
              ))}
              {designTools.map((tool, i) => (
                <ToolIcon
                  key={tool.name}
                  tool={tool}
                  x={`${randomOffset(48, 8)}%`}
                  y={devY(i)}
                />
              ))}
              {aiTools.map((tool, i) => (
                <ToolIcon
                  key={tool.name}
                  tool={tool}
                  x={`${randomOffset(78, 8)}%`}
                  y={devY(i)}
                />
              ))}
            </Gravity>
          </div>
        </div>
      </LiquidGlassCard>
    </section>
  );
}
