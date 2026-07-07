"use client";

import { Facebook, Instagram, Twitter, Youtube, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  const sections = [
    {
      title: "News",
      links: [
        { name: "Campus Buzz", href: "/category/campus-buzz" },
        { name: "Beyond Campus", href: "/category/beyond-campus" },
        { name: "Social Buzz", href: "/category/social-buzz" },
        { name: "Current Affairs", href: "/category/current-affairs" },
      ]
    },
    {
      title: "Multimedia",
      links: [
        { name: "Manav Rachna TV", href: "/category/mr-tv" },
        { name: "Podcasts", href: "/category/podcast" },
        { name: "Digital Archive", href: "/category/gallery" },
      ]
    },
    {
      title: "About",
      links: [
        { name: "Announcements", href: "/category/announcement" },
        { name: "Contact Desk", href: "/contact" },
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 font-sans mt-20 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-800"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 space-y-8 pr-0 lg:pr-12">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-white rounded-lg p-1 shadow-lg group-hover:shadow-red-500/20 transition-all duration-300">
                  <Image src="/logo.png" alt="logo" fill className="object-contain" sizes="40px" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-black text-xl tracking-tight text-white leading-none">
                    MANAV RACHNA
                  </span>
                  <span className="text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                    Times
                  </span>
                </div>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-zinc-400 font-medium">
              The authoritative voice of Manav Rachna's media platform. Delivering comprehensive coverage of campus news, global affairs, and student life.
            </p>

            <div className="pt-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" /> Subscribe to Newsletter
              </h4>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-md px-4 py-2.5 w-full focus:outline-none focus:border-red-500 transition-colors placeholder:text-zinc-600"
                />
                <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-md transition-colors flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
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
        <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-zinc-600 text-xs font-medium">
              &copy; {new Date().getFullYear()} Manav Rachna Times. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="#" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
              <Facebook className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
              <Instagram className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
              <Youtube className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Developer Credits - Highlighted */}
        <div className="mt-8 pt-8 border-t border-zinc-900/50 flex justify-center">
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
