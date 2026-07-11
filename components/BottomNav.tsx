"use client";

import { useState, useEffect, useCallback } from "react";
import { User, FolderKanban, Sparkles, Moon, Sun } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

const navItems = [
  { label: "About", icon: "about" },
  { label: "Projects", icon: "projects" },
  { label: "Inspirations", icon: "inspirations" },
];

const icons: Record<string, React.ReactNode> = {
  about: <User size={20} />,
  projects: <FolderKanban size={20} />,
  inspirations: <Sparkles size={20} />,
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
    <nav className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={999}
        backgroundOpacity={0.15}
        saturation={1.8}
        className="px-3 py-2"
      >
        <div className="flex items-center gap-2">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveItem(label.toLowerCase());
                scrollToSection(label.toLowerCase());
              }}
              className={`rounded-xl p-2.5 transition-colors ${
                activeItem === label.toLowerCase()
                  ? "text-black dark:text-white"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {icons[icon as keyof typeof icons]}
            </button>
          ))}

          <div className="mx-1.5 h-5 w-px bg-neutral-300/50 dark:bg-neutral-600/50" />

          <button
            onClick={toggleDark}
            className="rounded-xl p-2.5 text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Toggle dark mode"
          >
            {isDark ? icons.dark : icons.light}
          </button>
        </div>
      </GlassSurface>
    </nav>
  );
}
