"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const iconSlugs: Record<string, string> = {
  React: "react",
  Python: "python",
  TensorFlow: "tensorflow",
  "Next.js": "nextdotjs",
  Stripe: "stripe",
  PostgreSQL: "postgresql",
  GraphQL: "graphql",
  Redis: "redis",
  Docker: "docker",
  "Vue.js": "vuedotjs",
  AWS: "amazonwebservices",
  Tailwind: "tailwindcss",
  Svelte: "svelte",
  MongoDB: "mongodb",
  "D3.js": "d3dotjs",
  Go: "go",
  WebRTC: "webrtc",
  gRPC: "grpc",
  Flutter: "flutter",
  Firebase: "firebase",
  "Socket.io": "socketdotio",
};

interface ProjectCardProps {
  title: string;
  imageId: number;
  tags: string[];
  githubUrl?: string;
  previewUrl?: string;
}

export default function ProjectCard({
  title,
  imageId,
  tags,
  githubUrl = "#",
  previewUrl = "#",
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!card || !img || !overlay) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(
      overlay,
      {
        backdropFilter: "blur(60px)",
        duration: 0.9,
        ease: "power2.inOut",
      },
      0,
    );

    tl.fromTo(
      overlay,
      { y: 200 },
      {
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      },
      0,
    );

    tl.to(
      img,
      {
        scale: 1.7,
        duration: 0.9,
        ease: "power2.inOut",
      },
      0,
    );

    const handleEnter = () => tl.play();
    const handleLeave = () => tl.reverse();

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative rounded-[60px] [clip-path:inset(0_round_60px)] cursor-pointer"
    >
      <img
        ref={imgRef}
        src={`https://picsum.photos/seed/${imageId}/600/400`}
        alt={title}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col justify-end p-6 pb-8"
        style={{
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          opacity: 1,
        }}
      >
        <h3 className="font-panchang-bold text-4xl text-white">{title}</h3>
        <div className="flex items-end justify-between mt-4">
          <div className="flex gap-3">
            {tags.map((tag) => {
              const slug = iconSlugs[tag];
              const color = isDark ? "white" : "black";
              return (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/15"
                >
                  <img
                    src={`https://cdn.simpleicons.org/${slug}/${color}`}
                    alt={tag}
                    title={tag}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-white/70 font-clash-grotesk-regular">
                    {tag}
                  </span>
                </span>
              );
            })}
          </div>
          <div className="flex gap-2">
            <a
              href={githubUrl}
              className="text-xs px-3 py-1.5 rounded-full bg-white/15 text-white/80 font-clash-grotesk-semibold hover:bg-white/25 transition-colors"
            >
              GitHub
            </a>
            <a
              href={previewUrl}
              className="text-xs px-3 py-1.5 rounded-full bg-white/15 text-white/80 font-clash-grotesk-semibold hover:bg-white/25 transition-colors"
            >
              Preview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
