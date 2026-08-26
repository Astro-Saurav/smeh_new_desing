"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

export function SiteFooter() {
  const pathname = usePathname();
  
  const [socials, setSocials] = useState<{
    instagramUrl?: string;
    xUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
  }>({});

  const getApiBase = () => {
    if (typeof window !== 'undefined') return '/api/v1'
    if (process.env.INTERNAL_API_URL) return `${process.env.INTERNAL_API_URL}/api/v1`
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
    return 'http://127.0.0.1:8081/api/v1'
  }

  const checkSocials = () => {
    // 1. Try local storage first
    try {
      const saved = localStorage.getItem("mrt_newsroom_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSocials({
          instagramUrl: parsed.instagramUrl || "",
          xUrl: parsed.xUrl || "",
          linkedinUrl: parsed.linkedinUrl || "",
          youtubeUrl: parsed.youtubeUrl || "",
        });
      }
    } catch (e) {
      console.error("Failed to load footer socials from localStorage:", e);
    }

    // 2. Fetch official public settings from PostgreSQL DB API
    const apiBase = getApiBase();
    fetch(`${apiBase}/settings`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const dbData = resData.data;
          setSocials({
            instagramUrl: dbData.instagramUrl || "",
            xUrl: dbData.xUrl || "",
            linkedinUrl: dbData.linkedinUrl || "",
            youtubeUrl: dbData.youtubeUrl || "",
          });
        }
      })
      .catch(err => console.error("Failed to fetch footer settings from DB API:", err));
  };

  useEffect(() => {
    checkSocials();
    const handleSettingsChange = () => checkSocials();
    window.addEventListener("mrt_settings_changed", handleSettingsChange);
    window.addEventListener("storage", handleSettingsChange);

    return () => {
      window.removeEventListener("mrt_settings_changed", handleSettingsChange);
      window.removeEventListener("storage", handleSettingsChange);
    };
  }, []);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  // Active Social Media List - Render ONLY if URL exists!
  const activeSocialItems = [
    {
      id: "instagram",
      name: "Instagram",
      url: socials.instagramUrl,
      icon: Instagram,
      color: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-pink-500/50"
    },
    {
      id: "x",
      name: "X (Twitter)",
      url: socials.xUrl,
      icon: Twitter,
      color: "hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      url: socials.linkedinUrl,
      icon: Linkedin,
      color: "hover:bg-blue-600 hover:text-white hover:border-blue-500"
    },
    {
      id: "youtube",
      name: "YouTube",
      url: socials.youtubeUrl,
      icon: Youtube,
      color: "hover:bg-red-600 hover:text-white hover:border-red-500"
    }
  ].filter(item => item.url && item.url.trim().length > 0);

  const sections = [
    {
      title: "News",
      links: [
        { name: "Campus Buzz", href: "/category/campus-buzz" },
        { name: "Beyond Campus", href: "/category/beyond-campus" },
        { name: "Social Buzz", href: "/category/social-buzz" },
        { name: "Current Affairs", href: "/category/current-affairs" },
        { name: "Entertainment & Lifestyle", href: "/category/entertainment-lifestyle" },
        { name: "Sports", href: "/category/sports" },
        { name: "Student Voices", href: "/category/students-voices" },
      ]
    },
    {
      title: "Multimedia",
      links: [
        { name: "MR TV", href: "/category/mr-tv" },
        { name: "MR Podcast", href: "/category/mr-podcast" },
        { name: "Photo Gallery", href: "/category/photo-gallery" },
      ]
    },
    {
      title: "About",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Editorial Board", href: "/about/editorial-board" },
        { name: "Announcements", href: "/category/announcement" },
        { name: "Contact", href: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 font-sans mt-20 relative overflow-hidden select-none">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-800"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section & Conditional Social Icons */}
          <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-12">
            <Link href="/" className="inline-block group max-w-full">
              <div className="relative w-48 h-16 xs:w-56 xs:h-20 sm:w-72 sm:h-24 md:w-80 md:h-28 lg:w-96 lg:h-32 max-w-full group-hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/new_logo.png"
                  alt="Manav Rachna Times Logo"
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 480px) 224px, (max-width: 768px) 288px, 384px"
                  priority
                  unoptimized
                />
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-zinc-400 font-medium max-w-md">
              The authoritative voice of Manav Rachna's media platform. Delivering comprehensive coverage of campus news, global affairs, and student life.
            </p>

            {/* Render Social Media Icons ONLY if URLs are configured in CRM Settings! */}
            {activeSocialItems.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Connect With Us
                </div>
                <div className="flex items-center gap-3">
                  {activeSocialItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center transition-all duration-300 shadow-md transform hover:-translate-y-1 ${item.color}`}
                        title={item.name}
                      >
                        <IconComp className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-white text-[11px] font-black uppercase tracking-[0.15em]">
                  {section.title}
                </h3>
                <ul className="space-y-3.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-[13px] font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-900/50 flex justify-center items-center">
          <p className="text-zinc-600 text-xs font-medium">
            &copy; {new Date().getFullYear()} Manav Rachna Times. All rights reserved.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-zinc-900/50">
          <p className="text-[11px] text-zinc-600 leading-relaxed text-center max-w-3xl mx-auto">
            <span className="font-black uppercase tracking-wider text-zinc-500">Disclaimer: </span>
            The content for this website is managed and produced by the students of School of Media
            Studies and Humanities (SMeH). If you come across any mistake on the site, please send
            an e-mail to{' '}
            <a href="mailto:editor@mriu.edu.in" className="text-primary hover:underline">
              editor@mriu.edu.in
            </a>
            . The Editors will ensure that the error is rectified.
          </p>
        </div>

        {/* Developer Credits - Highlighted */}
        <div className="mt-6 pt-6 border-t border-zinc-900/50 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/80 px-6 py-3 rounded-full border border-zinc-800 shadow-xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
              Architected By
            </span>
            <div className="flex items-center gap-2 text-xs font-black tracking-wider">
              <Link href="https://www.linkedin.com/in/saurav-kumar-astro/" target="_blank" className="text-white hover:text-red-500 transition-colors">
                SAURAV KUMAR
              </Link> 
              <span className="text-red-600">&amp;</span> 
              <Link href="https://www.linkedin.com/in/aditya766/" target="_blank" className="text-white hover:text-red-500 transition-colors">
                ADITYA TRIPATHI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
