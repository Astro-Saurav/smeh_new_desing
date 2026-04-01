"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Play, Tv, Wifi } from "lucide-react";

export default function MRTVPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVNews = async () => {
      const tvNews = await getNewsByCategory("Manav Rachna TV", 10);
      setStories(tvNews);
      setLoading(false);
    };
    fetchTVNews();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading news...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No news available yet.</div>;

  const mainStory = stories[0] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const sideStory1 = stories[1] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const listStories = stories.slice(2, 6);
  const trendingStoriesList = stories.slice(0, 5);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Manav Rachna <span className="text-primary italic">TV</span>
          </h1>
          <div className="flex items-center gap-4 mb-2">
             <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary animate-pulse"><Wifi className="w-3 h-3" /> Live Channel</span>
             <span className="h-4 w-px bg-zinc-200" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Channel 04</span>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Broadcast - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <div className="group block relative cursor-pointer mb-6">
              <div className="relative aspect-video mb-4 overflow-hidden bg-zinc-950">
                <Image 
                  src={mainStory.image} 
                  alt="m" 
                  fill 
                  className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                      <Play className="w-8 h-8 fill-white ml-1" />
                   </div>
                </div>
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  Featured
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-4">
                {mainStory.headline}
              </h2>
              <p className="text-zinc-600 line-clamp-3 mb-6 text-lg">{mainStory.description}</p>
              <div className="flex gap-6 mt-4 pt-4 border-t border-zinc-100">
                {studentProjects.slice(6, 9).map((news, i) => (
                  <Link key={i} href="#" className="block group flex-1">
                    <h4 className="text-[13px] font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {news.headline}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Features - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Coming Up Next</h3>
            <Link href="#" className="group block mb-8">
              <div className="relative aspect-video mb-3 overflow-hidden">
                <Image src={sideStory1.image} alt="side" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">
                {sideStory1.headline}
              </h4>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 block">10:30 AM • Entertainment</span>
            </Link>

            <div className="space-y-6 pt-6 border-t border-zinc-100">
               {listStories.slice(0, 3).map((story, i) => (
                 <Link key={i} href="#" className="flex gap-4 group">
                    <div className="relative w-16 h-16 shrink-0 bg-zinc-100">
                       <Image src={story.image} alt="s" fill className="object-cover" />
                    </div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black uppercase text-zinc-400 mt-1 block tracking-tighter">On Demand</span>
                    </div>
                 </Link>
               ))}
            </div>
          </div>

          {/* Sidebar - Schedule & Trending */}
          <div className="lg:col-span-3">
             <div className="bg-zinc-950 text-white p-6 border-l-4 border-primary mb-10">
                <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-6 flex items-center gap-2">
                   <Tv className="w-3.5 h-3.5" /> Programming
                </h4>
                <div className="space-y-4">
                  {[
                    { time: "09:00", show: "Morning Buzz" },
                    { time: "12:30", show: "Tech Insider" },
                    { time: "18:00", show: "Global Wrap" },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-zinc-900 pb-3 last:border-0">
                       <span className="text-[11px] font-black italic">{s.show}</span>
                       <span className="text-[10px] font-medium text-zinc-500">{s.time}</span>
                    </div>
                  ))}
                </div>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Most Watched
             </h4>
             <div className="space-y-6">
                {trendingStoriesList.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-4 group">
                    <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">1.2M Views</span>
                    </div>
                  </Link>
                ))}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
