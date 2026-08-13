"use client";

import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";


// ─── Navigation Config ───────────────────────────────────────────────────────
// "Beyond Campus" has a dropdown. All others are flat links.
const navConfig = [
  {
    name: "Beyond Campus",
    url: "/category/beyond-campus",
    children: [
      { name: "Current Affairs",             url: "/category/current-affairs" },
      { name: "Entertainment & Lifestyle Feature", url: "/category/entertainment-lifestyle" },
      { name: "Sports",                      url: "/category/sports" },
    ],
  },
  { name: "Campus Buzz",     url: "/category/campus-buzz" },
  { name: "Social Buzz",     url: "/category/social-buzz" },
  { name: "MR TV",           url: "/category/mr-tv" },
  { name: "MR Podcast",      url: "/category/mr-podcast" },
  { name: "Students Voices", url: "/category/students-voices" },
  { name: "Photo Gallery",   url: "/category/photo-gallery" },
  { name: "Announcements",   url: "/category/announcement" },
  { name: "About Us",        url: "/about" },
  { name: "Contact",         url: "/contact" },
];

// ─── Desktop Dropdown Item ────────────────────────────────────────────────────
function DropdownNavItem({
  item,
}: {
  item: (typeof navConfig)[0];
}) {
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

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.url}
        className="flex items-center gap-0.5 text-[10px] lg:text-[11px] font-black uppercase tracking-normal text-zinc-900 hover:text-primary transition-all whitespace-nowrap relative group"
        onClick={() => setOpen(false)}
      >
        {item.name}
        <ChevronDown
          className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
        />
        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
      </Link>

      {open && item.children && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white border border-zinc-200 shadow-xl rounded-sm z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {item.children.map((child) => (
            <Link
              key={child.name}
              href={child.url}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-700 hover:text-primary hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile Collapsible Item ──────────────────────────────────────────────────
function MobileCollapsibleItem({ item }: { item: (typeof navConfig)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-zinc-900/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-zinc-900 text-zinc-500 hover:text-primary transition-all text-left"
      >
        {item.name}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      {open && item.children && (
        <div className="bg-zinc-950 border-t border-zinc-900/60">
          {item.children.map((child) => (
            <SheetClose key={child.name} asChild>
              <Link
                href={child.url}
                className="block pl-16 pr-12 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 hover:text-primary hover:bg-zinc-900 transition-all"
              >
                › {child.name}
              </Link>
            </SheetClose>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Header Component ────────────────────────────────────────────────────
export function SiteHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;

  return (
    <div className="w-full flex flex-col bg-white border-b border-zinc-200 sticky top-0 z-50 md:static">
      {/* Global Black Bar - Centered Elite Branding */}
      <div className="w-full bg-black text-white h-24 md:h-36 flex items-center px-4 md:px-8 relative shadow-2xl">
        <div className="absolute top-4 left-4 md:top-6 md:left-8 text-[10px] md:text-xs font-bold text-zinc-400 tracking-wider">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        
        {/* Centered Professional Masthead */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[98%] md:max-w-none px-1">
          <Link href="/" className="flex items-center justify-center gap-2 sm:gap-4 group">
            <div className="relative w-[240px] h-[80px] sm:w-[300px] sm:h-[100px] md:w-[420px] md:h-[140px] transform group-hover:scale-105 transition-transform duration-500 shrink-0">
              <Image
                src="/new_logo.png"
                alt="Manav Rachna Times Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 300px, 420px"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3 sm:gap-4 z-10">
          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer text-zinc-500 hover:text-white transition-colors" />
              </SheetTrigger>
              <SheetContent side="left" className="bg-black text-white border-none p-0 w-[85vw] max-w-[320px] shadow-2xl flex flex-col h-[100dvh]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Side Drawer Branding */}
                <div className="p-8 border-b border-zinc-900 bg-zinc-950 flex flex-col items-center gap-5 shrink-0">
                  <div className="flex items-center justify-center w-[200px] h-[80px] relative">
                    <Image
                      src="/new_logo.png"
                      alt="logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="h-0.5 w-12 bg-primary" />
                </div>

                {/* Scrollable Navigation Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-20 no-scrollbar overscroll-contain" data-lenis-prevent="true">
                  <div className="flex flex-col">
                    {navConfig.map((item) =>
                      item.children ? (
                        <MobileCollapsibleItem key={item.name} item={item} />
                      ) : (
                        <SheetClose key={item.name} asChild>
                          <Link
                            href={item.url}
                            className="px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] border-b border-zinc-900/40 hover:bg-zinc-900 text-zinc-500 hover:text-primary transition-all text-left"
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      )
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Primary Navigation Hub - HIDDEN ON PHONE, VISIBLE ON DESKTOP */}
      <nav className="hidden md:block w-full bg-white border-b border-zinc-200 py-3 px-6 overflow-visible">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-x-5 lg:gap-x-8 gap-y-1">
            {navConfig.map((item) =>
              item.children ? (
                <DropdownNavItem key={item.name} item={item} />
              ) : (
                <Link
                  key={item.name}
                  href={item.url}
                  className="text-[10px] lg:text-[11px] font-black uppercase tracking-normal text-zinc-900 hover:text-primary transition-all whitespace-nowrap relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
