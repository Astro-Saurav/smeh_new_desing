"use client";


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
        { name: "Students Voices", href: "/category/students-voices" },
      ]
    },
    {
      title: "Multimedia",
      links: [
        { name: "MR TV", href: "/category/mr-tv" },
        { name: "MR Podcast", href: "/category/podcast" },
        { name: "Photo Gallery", href: "/category/gallery" },
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
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 font-sans mt-20 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-800"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-6 pr-0 lg:pr-12">
            <Link href="/" className="inline-block group">
              <div className="relative w-64 h-24 lg:w-72 lg:h-28 group-hover:opacity-80 transition-opacity duration-300">
                <Image src="/new_logo.png" alt="logo" fill className="object-contain object-left" sizes="(max-width: 1024px) 256px, 288px" />
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-zinc-400 font-medium max-w-md">
              The authoritative voice of Manav Rachna's media platform. Delivering comprehensive coverage of campus news, global affairs, and student life.
            </p>
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
