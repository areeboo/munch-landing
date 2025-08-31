"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // Initialize from localStorage or system preference
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme = stored ?? "light"; // default to light
    applyTheme(initial);
    setTheme(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTheme(next: Theme) {
    const root = document.documentElement;
    if (next === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  const base =
    "btn btn-outline rounded-full transition-all duration-200 focus:ring-2 focus:ring-offset-2 btn-sm sm:btn-md px-3 sm:px-4";
  const themed =
    theme === "dark"
      ? "border-white/20 text-white bg-white/5 hover:bg-white/10 focus:ring-white/40"
      : "border-black/10 text-gray-900 bg-white/70 hover:bg-white focus:ring-black/20";

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`${base} ${themed}`}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        // Sun icon
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-amber-300 w-4 h-4 sm:w-[18px] sm:h-[18px]">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45 10.45l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 4V1h-0v3h0zm0 19v-3h-0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM19.16 6.76l1.4-1.4 1.8 1.79-1.41 1.41-1.79-1.8zM12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      ) : (
        // Moon icon
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-sky-600 w-4 h-4 sm:w-[18px] sm:h-[18px]">
          <path d="M21 12.79A9 9 0 1111.21 3c.09 0 .18 0 .27 0A7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
