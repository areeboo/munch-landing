"use client";

import { useEffect, useRef, useState } from "react";

export default function LocationBadge() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Support hover open on desktop while keeping click/tap for mobile
  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  return (
    <div
      ref={containerRef}
      className="ml-3 flex flex-col items-center relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        type="button"
        className="nova-badge btn btn-sm rounded-full uppercase tracking-wider flex items-center gap-1.5 px-3"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="location-menu"
        onClick={toggleMenu}
      >
        NOVA Edition
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <span className="text-xs text-muted-foreground font-medium mt-0.5">Northern Virginia</span>

      <div
        id="location-menu"
        role="menu"
        className={`absolute top-full mt-2 w-64 rounded-2xl shadow-xl z-50 bg-base-200/90 border border-white/10 backdrop-blur-xl ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="p-4">
          <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Current Location
          </div>
          <div className="rounded-lg p-3 mb-4 bg-base-100/80">
            <div className="font-medium">Northern Virginia (NOVA)</div>
            <div className="text-xs text-muted-foreground mt-1">Arlington • Alexandria • Fairfax • Loudoun • Prince William</div>
          </div>

          <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Coming Soon
          </div>
          <div className="space-y-2">
            {["Washington DC", "New York City", "Baltimore", "Philadelphia"].map((city) => (
              <div key={city} className="py-2 px-3 bg-base-100/70 rounded-lg">
                <div className="font-medium text-foreground text-sm">{city}</div>
                <div className="text-xs text-muted-foreground">
                  {city === "Washington DC"
                    ? "Metro area"
                    : city === "New York City"
                    ? "Manhattan & Brooklyn"
                    : city === "Baltimore"
                    ? "Inner Harbor & Fells Point"
                    : "Center City & Fishtown"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 text-center">
            <span className="text-xs text-muted-foreground">Want your city next? </span>
            <a
              href="mailto:hello@themunch.news"
              className="text-xs text-primary hover:text-primary/80 underline font-medium"
            >
              Let us know!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
