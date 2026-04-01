"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Bell, Pin, Calendar, ArrowRight, Info } from "lucide-react";

export default function AnnouncementPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcementNews = await getNewsByCategory("Announcement", 15);
      setStories(announcementNews);
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading news...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No news available yet.</div>;

  const mainNotice = stories[0] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const sideNotice1 = stories[1] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const listNotices = stories.slice(2, 6);
  const trendingNoticesList = stories.slice(6, 11);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Official <span className="text-primary italic">Announcements</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Priority Notice - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <div className="bg-zinc-950 text-white p-8 md:p-12 mb-8 relative border-l-8 border-primary group">
              <div className="absolute top-8 right-8 text-primary animate-pulse">
                <Pin className="w-6 h-6" />
              </div>
              <span className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-4 block">High Priority</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.1] group-hover:text-primary transition-colors">
                {mainNotice.headline}
              </h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                {mainNotice.description}
              </p>
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-900">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <Calendar className="w-4 h-4" /> Posted 12h ago
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {listNotices.map((notice, i) => (
                <Link key={i} href="#" className="flex gap-6 group border-b border-zinc-100 pb-6 last:border-0 cursor-pointer">
                   <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors tabular-nums">0{i+1}</div>
                   <div>
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight mb-2 italic">
                        {notice.headline}
                      </h4>
                      <p className="text-zinc-500 text-sm line-clamp-2">{notice.description}</p>
                   </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Bulletin - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> Key Briefs
            </h3>
            <div className="space-y-10">
               <div className="group cursor-pointer">
                 <div className="relative aspect-video mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <Image src={sideNotice1.image} alt="notice" fill className="object-cover" />
                 </div>
                 <h4 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">
                   {sideNotice1.headline}
                 </h4>
               </div>

               <div className="space-y-6 pt-6 border-t border-zinc-100">
                  {studentProjects.slice(12, 15).map((n, i) => (
                    <div key={i} className="group">
                       <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Administrative</span>
                       <h5 className="text-[13px] font-bold group-hover:text-primary leading-snug">{n.headline}</h5>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar - Timeline */}
          <div className="lg:col-span-3">
             <div className="bg-zinc-50 border border-zinc-200 p-6 mb-10">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Bell className="w-3.5 h-3.5 text-primary" /> Deadline Watch
                </h4>
                <div className="space-y-5">
                  {[
                    { label: "Exam Form", date: "MAR 22" },
                    { label: "Studio Booking", date: "MAR 25" },
                    { label: "Scholarship", date: "APR 01" },
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-zinc-200 pb-3 last:border-0 last:pb-0">
                       <span className="text-[11px] font-black uppercase text-zinc-800">{d.label}</span>
                       <span className="text-[10px] font-bold text-primary font-mono bg-white px-2 py-0.5">{d.date}</span>
                    </div>
                  ))}
                </div>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Archived Notices
             </h4>
             <div className="space-y-6">
                {trendingNoticesList.map((n, i) => (
                  <Link key={i} href="#" className="block group border-l-2 border-zinc-100 hover:border-primary pl-4 transition-all">
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{n.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-300 uppercase mt-1 block tracking-tighter">FEB 2026 Archive</span>
                  </Link>
                ))}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
