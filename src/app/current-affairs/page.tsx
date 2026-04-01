"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Newspaper, Clock, BookOpen } from "lucide-react";

export default function CurrentAffairsPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAffairs = async () => {
      const affairsNews = await getNewsByCategory("Current Affairs", 10);
      setStories(affairsNews);
      setLoading(false);
    };
    fetchCurrentAffairs();
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
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Current <span className="text-primary italic">Affairs</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Analysis - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <Link href="#" className="group block mb-6">
              <div className="relative aspect-[16/10] mb-6 overflow-hidden border border-zinc-100 shadow-sm">
                <Image 
                  src={mainStory.image} 
                  alt="m" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                  priority
                />
                <div className="absolute top-4 left-4 bg-zinc-950 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <Newspaper className="w-3.5 h-3.5 text-primary" /> Analysis
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-6 uppercase italic">
                {mainStory.headline}
              </h2>
              <p className="text-zinc-600 line-clamp-3 mb-8 text-xl leading-relaxed">{mainStory.description}</p>
              
              <div className="flex items-center gap-6 text-[10px] font-black uppercase text-zinc-400">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 6 Min Read</span>
                <span className="h-4 w-px bg-zinc-100" />
                <span className="flex items-center gap-2">Policy Review 2024</span>
              </div>
            </Link>

            <div className="space-y-6 pt-10 border-t border-zinc-100">
              {studentProjects.slice(5, 8).map((news, i) => (
                <div key={i} className="flex gap-6 group cursor-pointer pb-6 border-b border-zinc-50 last:border-0">
                   <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</div>
                   <div>
                      <h4 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight mb-2 underline decoration-zinc-100">
                        {news.headline}
                      </h4>
                      <p className="text-zinc-500 text-sm line-clamp-2">{news.description}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Briefs - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Regional Impact</h3>
            <Link href="#" className="group block mb-10">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                <Image src={sideStory1.image} alt="side" fill className="object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-4 left-4">
                   <span className="bg-primary text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest">In-Depth</span>
                </div>
              </div>
              <h4 className="text-lg font-black leading-tight group-hover:text-primary transition-colors uppercase italic">
                {sideStory1.headline}
              </h4>
            </Link>

            <div className="space-y-6 pt-6 border-t border-zinc-100">
               {listStories.slice(0, 3).map((story, i) => (
                 <Link key={i} href="#" className="block group">
                    <span className="text-[9px] font-black uppercase text-primary tracking-widest block mb-1">Weekly Update</span>
                    <h5 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{story.headline}</h5>
                 </Link>
               ))}
            </div>
          </div>

          {/* Sidebar - Trending Column */}
          <div className="lg:col-span-3">
             <div className="bg-zinc-50 border border-zinc-200 p-6 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <BookOpen className="w-3.5 h-3.5 text-primary" /> Daily Dispatch
                </h4>
                <div className="space-y-5 relative z-10">
                  <p className="text-[12px] text-zinc-600 font-medium leading-relaxed italic">"Analyzing the intersections of global policy and local campus shifts."</p>
                  <div className="h-px bg-zinc-200 w-full" />
                  <button className="w-full bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest py-3 hover:bg-primary transition-all">Download PDF Brief</button>
                </div>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-zinc-400">
                <TrendingUp className="w-4 h-4" /> Global Trending
             </h4>
             <div className="space-y-6">
                {trendingStoriesList.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-4 group">
                    <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">Policy Analysis</span>
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
