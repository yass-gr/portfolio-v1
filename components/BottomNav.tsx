"use client";

import { useState, useEffect, useCallback } from "react";
import { User, FolderKanban, Wrench, Moon, Sun } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import {
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";

const navItems = [
  { label: "About", icon: "about" },
  { label: "Projects", icon: "projects" },
  { label: "Tools", icon: "tools" },
];

const icons: Record<string, React.ReactNode> = {
  about: <User size={20} />,
  projects: <FolderKanban size={20} />,
  tools: <Wrench size={20} />,
  dark: <Moon size={20} />,
  light: <Sun size={20} />,
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function BottomNav() {
  const [activeItem, setActiveItem] = useState("about");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, [isDark]);

  return (
    <nav className="flex justify-center">
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={999}
        backgroundOpacity={0.15}
        saturation={1.8}
        className="px-2 py-1.5 max-sm:px-1.5 max-sm:py-1"
      >
        <div className="flex items-center gap-1.5 max-sm:gap-1">
            {navItems.map(({ label, icon }) => (
              <Tooltip key={label}>
                <button
                  onClick={() => {
                    setActiveItem(label.toLowerCase());
                    scrollToSection(label.toLowerCase());
                  }}
                  className={`rounded-lg p-1.5 transition-colors ${
                    activeItem === label.toLowerCase()
                      ? "text-black dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {icons[icon as keyof typeof icons]}
                </button>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}

            <div className="mx-1 h-4 w-px bg-neutral-300/50 dark:bg-neutral-600/50" />

            <Tooltip>
              <button
                onClick={toggleDark}
                className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? icons.light : icons.dark}
              </button>
              <TooltipContent>
                {isDark ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>
          </div>
        </GlassSurface>
      </nav>
    );
  }
