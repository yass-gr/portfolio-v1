"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import ProjectCard from "@/components/projectCard";
import Magnet from "@/components/magnet";

const projects = [
  {
    title: "AI Dashboard",
    imageId: 42,
    tags: ["React", "Python", "TensorFlow"],
  },
  {
    title: "E-Commerce App",
    imageId: 77,
    tags: ["Next.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "Social Platform",
    imageId: 133,
    tags: ["GraphQL", "Redis", "Docker"],
  },
  {
    title: "Portfolio Builder",
    imageId: 256,
    tags: ["Vue.js", "AWS", "Tailwind"],
  },
  {
    title: "Task Manager",
    imageId: 314,
    tags: ["Svelte", "Socket.io", "MongoDB"],
  },
  {
    title: "Weather App",
    imageId: 512,
    tags: ["React Native", "D3.js"],
  },
  {
    title: "Chat Engine",
    imageId: 618,
    tags: ["Go", "WebRTC", "gRPC"],
  },
  {
    title: "Fitness Tracker",
    imageId: 777,
    tags: ["Flutter", "Firebase"],
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
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
    <section ref={sectionRef} className="min-h-dvh p-5">
      <h1 ref={titleRef} className="font-panchang-bold text-center text-5xl">
        Projects
      </h1>

      <LiquidGlassCard className="-translate-y-[5%] mt-20 ">
        <div className="min-h-dvh p-5 grid grid-cols-12 py-[100px]">
          <div className="text-2xl col-span-3 mt-20 ml-8 sticky top-40 h-fit">
            <div className="text-left">
              <h2 className="font-clash-grotesk-regular leading-15">
                i do{" "}
                <span className="outline rounded-full m-2 inline-block leading-none px-4 py-3 rotate-3 hover:rotate-0 transition-all duration-200 ease-in-out">
                  Web developpement
                </span>
                <br />
                <span className="outline rounded-full m-2 inline-block leading-none -rotate-2 px-4 py-3 hover:rotate-0 transition-all duration-200 ease-in-out">
                  Mobile Developpement
                </span>
                <br />
                <span className="outline rounded-full m-2 inline-block leading-none px-4 py-3 transition-all hover:rotate-1 duration-200 ease-in-out">
                  Design
                </span>
                <br />
              </h2>
              <h2 className="font-clash-grotesk-regular ">
                and everything in <br />
                between.
              </h2>
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-2 gap-8 content-start p-4">
            {projects.map((project) => (
              <Magnet key={project.imageId} padding={10} magnetStrength={10}>
                <ProjectCard {...project} />
              </Magnet>
            ))}
          </div>
        </div>
      </LiquidGlassCard>
    </section>
  );
}
