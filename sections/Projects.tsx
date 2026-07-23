"use client";

import { useRef, useState, useEffect } from "react";
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 640px) and (max-width: 1023px)",
        isMobile: "(max-width: 639px)",
      },
      (context) => {
        const conditions = context.conditions as Record<string, boolean>;

        if (conditions.isDesktop) {
          gsap.fromTo(
            titleRef.current,
            { fontSize: "3vw", x: 0, y: "-70%" },
            {
              fontSize: "6.5vw",
              x: "24dvw",
              y: "-10%",
              ease: "power1.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: 0,
              },
            },
          );
        } else if (conditions.isTablet) {
          gsap.fromTo(
            titleRef.current,
            { fontSize: "1.5vw", x: "-0.5%", y: "-350%" },
            {
              fontSize: "8vw",
              x: "20dvw",
              y: "-130%",
              ease: "power1.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top top",
                scrub: 0,
              },
            },
          );
        } else {
          gsap.fromTo(
            titleRef.current,
            { fontSize: "1vw", x: "-3%", y: "-10%" },
            {
              fontSize: "10vw",
              x: "11dvw",
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
        }
      },
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-dvh p-5 max-sm:pt-[15vh] max-lg:pt-[15vh]"
    >
      <h1 ref={titleRef} className="font-panchang-bold text-center text-5xl">
        Projects
      </h1>

      <LiquidGlassCard className="-translate-y-[3.5%] mt-20 max-sm:-translate-y-[2.3%] max-lg:-translate-y-[2.3%]">
        <div className="min-h-dvh p-5 grid grid-cols-12 py-[100px] max-sm:grid-cols-1 max-sm:py-6 max-sm:p-3 max-lg:grid-cols-1 max-lg:py-6 max-lg:p-3">
          <div className="text-2xl col-span-3 mt-20 ml-8 sticky top-40 h-fit max-sm:col-span-1 max-sm:static max-sm:text-lg max-sm:mb-6 max-sm:px-4 max-sm:mt-4 max-sm:ml-4 max-lg:col-span-1 max-lg:static max-lg:text-lg max-lg:mb-6 max-lg:px-4 max-lg:mt-4 max-lg:ml-4">
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
              <h2 className="font-clash-grotesk-regular">
                and everything in <br />
                between.
              </h2>
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-2 gap-8 content-start p-4 max-sm:col-span-1 max-sm:grid-cols-1 max-sm:gap-4 max-sm:p-0 max-lg:col-span-1 max-lg:grid-cols-1 max-lg:gap-4 max-lg:p-0 max-lg:max-w-lg max-lg:mx-auto">
            {projects.map((project) => (
              <Magnet
                key={project.imageId}
                padding={10}
                magnetStrength={10}
                disabled={!isDesktop}
              >
                <ProjectCard {...project} />
              </Magnet>
            ))}
          </div>
        </div>
      </LiquidGlassCard>
    </section>
  );
}
