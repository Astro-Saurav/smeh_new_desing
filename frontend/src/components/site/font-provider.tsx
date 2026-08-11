"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── Font Definitions ─────────────────────────────────────────────────────────
export const FONTS = [
  {
    id: "inter",
    label: "Inter",
    headingFamily: "Inter, sans-serif",
    bodyFamily: "Inter, sans-serif",
  },
  {
    id: "playfair",
    label: "Playfair Display",
    headingFamily: "'Playfair Display', serif",
    bodyFamily: "Inter, sans-serif",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    headingFamily: "'Merriweather', serif",
    bodyFamily: "'Merriweather', serif",
  },
  {
    id: "lato",
    label: "Lato",
    headingFamily: "Lato, sans-serif",
    bodyFamily: "Lato, sans-serif",
  },
  {
    id: "source-serif",
    label: "Source Serif 4",
    headingFamily: "'Source Serif 4', serif",
    bodyFamily: "'Source Serif 4', serif",
  },
] as const;

export type FontId = (typeof FONTS)[number]["id"];

// ─── Context ──────────────────────────────────────────────────────────────────
interface FontContextValue {
  fontId: FontId;
  setFont: (id: FontId) => void;
}

const FontContext = createContext<FontContextValue>({
  fontId: "inter",
  setFont: () => {},
});

export function useFontContext() {
  return useContext(FontContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "mrt-font";

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontId, setFontId] = useState<FontId>("inter");

  // On mount: restore from localStorage and apply to <html>
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as FontId | null;
      const initial: FontId =
        stored && FONTS.some((f) => f.id === stored) ? stored : "inter";
      applyFont(initial);
      setFontId(initial);
    } catch {
      // SSR / private browsing — use default
    }
  }, []);

  const applyFont = (id: FontId) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-font", id);
  };

  const setFont = useCallback((id: FontId) => {
    setFontId(id);
    applyFont(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore storage errors
    }
  }, []);

  return (
    <FontContext.Provider value={{ fontId, setFont }}>
      {children}
    </FontContext.Provider>
  );
}
