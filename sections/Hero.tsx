"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Avatar from "@/components/Avatar";
import TechStack from "@/sections/TechStack";

const lines = [
  <>
    <strong>Yassine Grairi</strong> is a 23 y/o <strong>full-stack</strong>{" "}
    developer from <strong>Morocco</strong>, currently studying.
  </>,
  <>
    Specialised in the <strong>JavaScript</strong> ecosystem with a background
    in <strong>design</strong>,
  </>,
  <>focused on building clean, performant Software</>,
  <>
    Interested in <strong>AI</strong> & agentic workflows, and Always Curious
    about the latest Tech developments.
  </>,
  <>
    Available for <strong>freelance</strong>.
  </>,
];

const words = ["YASSINE", "GRAIRI"];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = containerRef.current;
    if (!ctx) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const wordEls = ctx.querySelectorAll(".hero-word");
    if (wordEls.length) {
      tl.fromTo(
        wordEls,
        { filter: "blur(10px)", opacity: 0, y: 20 },
        { filter: "blur(0px)", opacity: 1, y: 0, stagger: 0.15, duration: 0.8 },
      );
    }

    const lineEls = ctx.querySelectorAll(".hero-line");
    if (lineEls.length) {
      tl.fromTo(
        lineEls,
        { filter: "blur(10px)", opacity: 0, y: 20 },
        { filter: "blur(0px)", opacity: 1, y: 0, stagger: 0.12, duration: 0.6 },
        "-=0.2",
      );
    }
  }, []);

  return (
    <div ref={containerRef}>
      <div className="flex justify-center mx-4 xl:lg:-translate-y-10 lg:-translate-y-6 sm:-translate-y-4">
        <h1 className="mx-auto text-[12.5vw] font-clash-grotesk-bold">
          {words.map((word, i) => (
            <span key={i} className="hero-word inline-block">
              {word}
              {i < words.length - 1 && "\u00A0"}
            </span>
          ))}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 mt-2 md:mt-4 px-4 items-start max-w-4xl mx-auto">
        <div className="justify-self-center md:justify-self-start">
          <Avatar />
        </div>
        <p className="font-clash-grotesk-regular text-2xl text-pretty text-base sm:text-lg md:text-xl leading-relaxed md:pt-2">
          {lines.map((line, i) => (
            <span key={i} className="hero-line block">
              {line}
            </span>
          ))}
        </p>
      </div>
      <TechStack />
    </div>
  );
}
