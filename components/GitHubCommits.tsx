"use client";

import { useEffect, useState, useMemo } from "react";
import { ActivityCalendar } from "react-activity-calendar";

const styles = `
.gh-scroll > div {
  overflow-x: hidden !important;
  scrollbar-width: none;
}
.gh-scroll > div::-webkit-scrollbar {
  display: none;
}
`;

interface Activity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const levelFromCount = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

export function GitHubCommits({ username = "yass-gr" }: { username?: string }) {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((res) => res.json())
      .then((json: { contributions?: { date: string; count: number }[] }) => {
        const contributions = json.contributions ?? [];
        const mapped = contributions.map((c) => ({
          date: c.date,
          count: c.count,
          level: levelFromCount(c.count),
        }));
        setData(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const displayData = useMemo(() => {
    if (typeof window === "undefined") return data;
    const isMobile = window.innerWidth < 640;
    if (!isMobile || data.length === 0) return data;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return data.filter((d) => new Date(d.date) >= sixMonthsAgo);
  }, [data]);

  return (
    <>
      <style>{styles}</style>
      <div className="w-full">
      {loading ? (
        <div className="flex gap-1 h-28 items-end">
          {Array.from({ length: 52 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div
                  key={j}
                  className="size-3 rounded-sm bg-neutral-200 dark:bg-neutral-800 animate-pulse"
                  style={{ opacity: 1 - j * 0.1 }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <ActivityCalendar
          className="gh-scroll"
          data={displayData}
          blockSize={10}
          blockMargin={3}
          fontSize={11}
          colorScheme={isDark ? "dark" : "light"}
          theme={{
            light: ["#e5e5e5", "#b3b3b3", "#737373", "#333333", "#000000"],
            dark: ["#111111", "#666666", "#b3b3b3", "#e6e6e6", "#ffffff"],
          }}
          showMonthLabels={false}
          showColorLegend={false}
          showTotalCount={false}
        />
      )}
    </div>
    </>
  );
}
