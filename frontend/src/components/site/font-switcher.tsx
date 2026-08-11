"use client";

import { useState, useRef, useEffect } from "react";
import { FONTS, useFontContext } from "./font-provider";
import type { FontId } from "./font-provider";

/**
 * Font Switcher — compact "Aa" button that opens a popover with 5 font options.
 * Placed inside the SiteHeader's right action area.
 */
export function FontSwitcher() {
  const { fontId, setFont } = useFontContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentFont = FONTS.find((f) => f.id === fontId) ?? FONTS[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change reading font"
        aria-expanded={open}
        className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-zinc-700 hover:border-primary text-zinc-400 hover:text-white transition-all text-[11px] font-black uppercase tracking-wider"
        title="Change font"
      >
        <span style={{ fontFamily: currentFont.headingFamily }}>Aa</span>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200 shadow-2xl rounded-sm z-[100] py-1">
          <p className="px-4 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            Reading Font
          </p>
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => {
                setFont(font.id as FontId);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-zinc-100 last:border-0 ${
                fontId === font.id
                  ? "bg-zinc-50 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {/* Live preview of the font */}
              <span
                style={{ fontFamily: font.headingFamily }}
                className="text-base leading-none shrink-0 w-8 text-center"
              >
                Aa
              </span>
              <span className="text-[11px] font-bold tracking-wide leading-tight">
                {font.label}
              </span>
              {fontId === font.id && (
                <span className="ml-auto text-primary text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
