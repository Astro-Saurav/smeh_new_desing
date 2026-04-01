"use client";

import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  const sections = [
    {
      title: "News Sections",
      links: [
        { name: "Campus Buzz", href: "/campus-buzz" },
        { name: "Beyond Campus", href: "/beyond-campus" },
        { name: "Social Buzz", href: "/social-buzz" },
        { name: "Manav Rachna TV", href: "/mr-tv" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Podcasts", href: "/podcast" },
        { name: "Digital Archive", href: "/gallery" },
        { name: "Announcements", href: "/announcement" },
        { name: "Contact Desk", href: "/contact" },
      ]
    }
  ];

  return (
    <footer className="bg-black text-zinc-400 py-20 border-t-[8px] border-primary font-sans">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="col-span-2 space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative w-12 h-12 bg-white rounded-sm p-1">
                 <Image src="/logo.png" alt="logo" fill className="object-contain" sizes="48px" />
              </div>
              <span className="font-sans font-black text-2xl lg:text-3xl tracking-tight text-white">
                MANAV RACHNA <span className="text-primary">TIMES</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              The authoritative voice of Manav Rachna's School of Media and Humanities. Documenting excellence, innovation, and campus life since inception.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-primary transition-all transform hover:scale-110"><Twitter className="w-6 h-6" /></Link>
              <Link href="#" className="hover:text-primary transition-all transform hover:scale-110"><Facebook className="w-6 h-6" /></Link>
              <Link href="#" className="hover:text-primary transition-all transform hover:scale-110"><Instagram className="w-6 h-6" /></Link>
              <Link href="#" className="hover:text-primary transition-all transform hover:scale-110"><Youtube className="w-6 h-6" /></Link>
            </div>
          </div>
          
          {sections.map((section) => (
            <div key={section.title} className="space-y-8">
              <h3 className="text-white text-[11px] font-black uppercase tracking-[0.2em] border-b border-zinc-800 pb-3">
                {section.title}
              </h3>
              <ul className="space-y-5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs font-bold hover:text-white transition-colors tracking-wide">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            <Link href="#" className="hover:text-zinc-400">Terms of Service</Link>
            <Link href="#" className="hover:text-zinc-400">Privacy Policy</Link>
            </div>
                    <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right mt-6 md:mt-0">
            <p className="tracking-[0.4em] uppercase text-zinc-500">© 2026 Manav Rachna Times Network</p>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 tracking-[0.2em] text-[9px] uppercase text-zinc-500">
               <span className="font-bold">Architected By</span>
               <Link href="https://www.linkedin.com/in/saurav-kumar-astro/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors font-black bg-zinc-900/80 px-2.5 py-1.5 border border-zinc-800 hover:border-primary shadow-sm flex items-center gap-1">
                 Saurav Kumar <span className="text-primary tracking-widest">[SCA]</span>
               </Link>
               <span className="text-zinc-700 font-black px-1">&</span>
               <Link href="https://www.linkedin.com/in/aditya766/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors font-black bg-zinc-900/80 px-2.5 py-1.5 border border-zinc-800 hover:border-primary shadow-sm flex items-center gap-1">
                 Aditya Tripathi <span className="text-primary tracking-widest">[SET]</span>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}







