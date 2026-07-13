"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidGlassCard from "@/components/LiquidGlassCard";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { fontSize: "5vw", y: "-65%" },
      {
        fontSize: "8.5vw",
        y: "-20%",
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="h-dvh">
      <h1 ref={titleRef} className="font-clash-grotesk-bold text-center">
        projects
      </h1>

      <LiquidGlassCard>
        <h1>hi</h1>
      </LiquidGlassCard>
    </section>
  );
}
