"use client";

import { useState, useEffect, useCallback } from "react";
import { User, FolderKanban, Wrench, Moon, Sun } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip";

const navItems = [
  { label: "About", icon: "about" },
  { label: "Projects", icon: "projects" },
  { label: "Tools", icon: "tools" },
];

const icons: Record<string, React.ReactNode> = {
  about: <User size={24} />,
  projects: <FolderKanban size={24} />,
  tools: <Wrench size={24} />,
  dark: <Moon size={24} />,
  light: <Sun size={24} />,
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function NavContent({
  activeItem,
  setActiveItem,
  isDark,
  toggleDark,
}: {
  activeItem: string;
  setActiveItem: (v: string) => void;
  isDark: boolean;
  toggleDark: () => void;
}) {
  return (
    <>
      {navItems.map(({ label, icon }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setActiveItem(label.toLowerCase());
                scrollToSection(label.toLowerCase());
              }}
              className={`rounded-lg p-1.5 max-lg:p-2 transition-colors ${
                activeItem === label.toLowerCase()
                  ? "text-black dark:text-white"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {icons[icon as keyof typeof icons]}
            </button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
      <div className="mx-1 h-4 w-px bg-neutral-300/50 dark:bg-neutral-600/50 max-lg:h-5"></div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleDark}
            className="rounded-lg p-1.5 max-lg:p-2 text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Toggle dark mode"
          >
            {isDark ? icons.light : icons.dark}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {isDark ? "Light mode" : "Dark mode"}
        </TooltipContent>
      </Tooltip>
    </>
  );
}

export function BottomNav() {
  const [activeItem, setActiveItem] = useState("about");
  const [isDark, setIsDark] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleDark = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, [isDark]);

  return (
    <nav className="flex justify-center overflow-hidden max-w-full">
      <div className="overflow-hidden">
        {isDesktop ? (
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            backgroundOpacity={0.4}
            saturation={1.8}
            className="px-3 py-2 max-sm:px-1.5 max-sm:py-1 max-lg:px-4 max-lg:py-2.5 max-w-full"
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center gap-2 max-sm:gap-1 max-lg:gap-3">
              <NavContent
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isDark={isDark}
                toggleDark={toggleDark}
              />
            </div>
          </GlassSurface>
        ) : (
          <div
            className="px-3 py-2 max-sm:px-1.5 max-sm:py-1 max-lg:px-4 max-lg:py-2.5 max-w-full"
            style={{
              borderRadius: 999,
              minHeight: 44,
              background: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,255,255,0.25)",
              backdropFilter: "blur(12px) saturate(1.8)",
              WebkitBackdropFilter: "blur(12px) saturate(1.8)",
            }}
          >
            <div className="flex items-center gap-2 max-sm:gap-1 max-lg:gap-3">
              <NavContent
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                isDark={isDark}
                toggleDark={toggleDark}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}