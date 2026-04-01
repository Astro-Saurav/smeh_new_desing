"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const navLinks = [
    { name: "Campus Buzz", url: "/campus-buzz" },
    { name: "Beyond Campus", url: "/beyond-campus" },
    { name: "Social Buzz", url: "/social-buzz" },
    { name: "Manav Rachna TV", url: "/mr-tv" },
    { name: "Podcast", url: "/podcast" },
    { name: "Blog", url: "/blog" },
    { name: "Achievements", url: "/achievements" },
    { name: "Announcement", url: "/announcement" },
    { name: "Gallery", url: "/gallery" },
    { name: "Contact", url: "/contact" },
  ];

  if (!mounted) return <div className="h-20 bg-white" />;

  return (
    <div className="w-full flex flex-col bg-white border-b border-zinc-200">
      {/* Global Black Bar - Centered Elite Branding */}
      <div className="w-full bg-black text-white h-16 md:h-24 flex items-center px-4 md:px-8 relative shadow-2xl">
        {/* Centered Professional Masthead */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[98%] md:max-w-none px-1">
          <Link href="/" className="flex items-center justify-center gap-2 sm:gap-4 group">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 p-1 bg-white rounded-sm shadow-xl transform group-hover:scale-105 transition-transform duration-500 shrink-0">
              <Image 
                src="/logo.png" 
                alt="Manav Rachna Times Logo" 
                fill 
                className="object-contain" 
                sizes="(max-width: 768px) 40px, 64px" 
                priority
              />
            </div>
            {/* Bold, Larger Full Name for Mobile Header */}
            <div className="flex items-baseline gap-1 md:gap-3 whitespace-nowrap">
               <span className="font-sans font-black text-[22px] sm:text-[28px] md:text-2xl lg:text-3xl text-white tracking-tight">
                 Manav Rachna
               </span>
               <span className="font-sans font-black text-[22px] sm:text-[28px] md:text-2xl lg:text-4xl text-primary tracking-tighter">
                 Times
               </span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1" />

        <div className="flex items-center gap-3 sm:gap-6 z-10">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer text-zinc-500 hover:text-white transition-colors" />
              </SheetTrigger>
              <SheetContent side="left" className="bg-black text-white border-none p-0 w-85 shadow-2xl flex flex-col h-[100dvh]">
                {/* Accessibility: Title for Screen Readers */}
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                
                {/* Side Drawer Branding: Centered & Slightly Smaller Logo */}
                <div className="p-10 border-b border-zinc-900 bg-zinc-950 flex flex-col items-center gap-5 shrink-0">
                   <div className="flex items-center justify-center">
                        <Image 
                          src="/logo.png" 
                          alt="logo" 
                          width={80} 
                          height={80} 
                          className="object-contain bg-white rounded-sm p-1.5 shadow-xl" 
                        />
                   </div>
                   <div className="h-0.5 w-12 bg-primary" />
                </div>

                {/* Scrollable Navigation Area (Hidden Scrollbar) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-20 no-scrollbar">
                    <div className="flex flex-col">
                      {navLinks.map(link => (
                        <SheetClose key={link.name} asChild>
                          <Link href={link.url} className="px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] border-b border-zinc-900/40 hover:bg-zinc-900 text-zinc-500 hover:text-primary transition-all text-left">
                            {link.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Primary Navigation Hub - HIDDEN ON PHONE, VISIBLE ON DESKTOP */}
      <nav className="hidden md:block w-full bg-white border-b border-zinc-200 py-3 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-nowrap items-center justify-center gap-x-6 lg:gap-x-10">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.url} 
                className="text-[10px] lg:text-[11px] font-black uppercase tracking-normal text-zinc-900 hover:text-primary transition-all whitespace-nowrap relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
