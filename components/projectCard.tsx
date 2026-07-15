"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

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

  useGSAP(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    if (!card || !img || !overlay) return;
    if (window.innerWidth < 640) return;

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
      className="relative rounded-[60px] [clip-path:inset(0_round_60px)] cursor-pointer max-sm:rounded-[30px] max-sm:[clip-path:inset(0_round_30px)]"
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
        className="absolute inset-0 flex flex-col justify-end p-6 pb-8 max-sm:p-4 max-sm:pb-4 max-sm:bg-gradient-to-t max-sm:from-black/80 max-sm:to-transparent"
        style={{
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          opacity: 1,
        }}
      >
        <h3 className="font-panchang-bold text-4xl text-white max-sm:text-2xl">{title}</h3>
        <div className="flex items-end justify-between mt-4 max-sm:mt-2">
          <div className="flex gap-3 max-sm:gap-1.5 max-sm:flex-wrap">
            {tags.map((tag) => {
              const slug = iconSlugs[tag];
              const color = "white";
              return (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/15 max-sm:px-1.5 max-sm:py-0.5"
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${slug}/${color}`}
                      alt={tag}
                      title={tag}
                      className="w-4 h-4 max-sm:w-3 max-sm:h-3"
                    />
                    <span className="text-xs font-clash-grotesk-regular text-white/70 max-sm:text-[10px]">{tag}</span>
                  </span>
              );
            })}
          </div>
          <div className="flex items-center gap-3 max-sm:gap-2">
            <a href={githubUrl} className="text-white/60 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 max-sm:w-4 max-sm:h-4">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href={previewUrl} className="text-white/60 hover:text-white transition-colors">
              <ArrowUpRight className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
