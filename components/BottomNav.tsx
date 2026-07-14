"use client";

import { useState, useEffect, useCallback } from "react";
import { User, FolderKanban, Moon, Sun } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

const navItems = [
  { label: "About", icon: "about" },
  { label: "Projects", icon: "projects" },
];

const icons: Record<string, React.ReactNode> = {
  about: <User size={20} />,
  projects: <FolderKanban size={20} />,
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
    <nav className="fixed inset-x-0 bottom-6 z-[1200] flex justify-center">
      <GlassSurface
        width="auto"
        height="auto"
        borderRadius={999}
        backgroundOpacity={0.15}
        saturation={1.8}
        className="px-2 py-1.5"
      >
        <div className="flex items-center gap-1.5">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              title={label}
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
          ))}

          <div className="mx-1 h-4 w-px bg-neutral-300/50 dark:bg-neutral-600/50" />

          <button
            onClick={toggleDark}
            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            title={isDark ? "Light mode" : "Dark mode"}
            aria-label="Toggle dark mode"
          >
            {isDark ? icons.dark : icons.light}
          </button>
        </div>
      </GlassSurface>
    </nav>
  );
}
