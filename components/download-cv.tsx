"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip";

export default function DownloadCvButton() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="overflow-hidden">
          {isDesktop ? (
            <GlassSurface
              width="auto"
              height="auto"
              borderRadius={999}
              backgroundOpacity={0.25}
              saturation={1.8}
              className="p-1.5 cursor-pointer max-sm:p-1 max-lg:p-1"
            >
              <a
                href="/cv.pdf"
                download
                className="flex items-center justify-center p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300"
              >
                <Download size={20} />
              </a>
            </GlassSurface>
          ) : (
            <div
              className="p-1.5 cursor-pointer max-sm:p-1 max-lg:p-1"
              style={{
                borderRadius: 999,
                background: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.25)",
                backdropFilter: "blur(12px) saturate(1.8)",
                WebkitBackdropFilter: "blur(12px) saturate(1.8)",
              }}
            >
              <a
                href="/cv.pdf"
                download
                className="flex items-center justify-center p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300"
              >
                <Download size={20} />
              </a>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>Download CV</TooltipContent>
    </Tooltip>
  );
}