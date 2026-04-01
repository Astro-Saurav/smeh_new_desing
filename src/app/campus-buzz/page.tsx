"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Clock, Globe } from "lucide-react";

export default function CampusBuzzPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getNewsByCategory("Campus Buzz", 10);
        setStories(data);
      } catch (error) {
        console.error("Failed to load Campus Buzz news", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
    const refreshTimer = setInterval(fetchNews, 10000);

    return () => clearInterval(refreshTimer);
  }, []);

  const mainStory = stories[0] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const listStories = stories.slice(2, 6);
  const trendingStoriesList = stories.slice(4, 9);

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-sans">
        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="border-b-4 border-zinc-900 mb-8 pb-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Campus <span className="text-primary italic">Buzz</span>
            </h1>
          </div>
          <p className="text-center text-zinc-500">Loading news...</p>
        </main>
      </div>
    );
  }

  if (!mainStory) {
    return (
      <div className="bg-white min-h-screen font-sans">
        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="border-b-4 border-zinc-900 mb-8 pb-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Campus <span className="text-primary italic">Buzz</span>
            </h1>
          </div>
          <p className="text-center text-zinc-500">No news available yet.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Campus <span className="text-primary italic">Buzz</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Feed - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-8 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <Link href="#" className="group block mb-6">
              <div className="relative aspect-[16/10] mb-4 overflow-hidden">
                <Image 
                  src={mainStory.image} 
                  alt={mainStory.headline} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  Lead Story
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-4">
                {mainStory.headline}
              </h2>
              <p className="text-zinc-600 line-clamp-3 mb-6 text-xl">{mainStory.description}</p>
              
              <div className="flex items-center gap-6 text-[10px] font-black uppercase text-zinc-400">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Just now</span>
                <span className="flex items-center gap-1.5 hover:text-primary cursor-pointer"><MessageSquare className="w-3.5 h-3.5" /> Comments</span>
              </div>
            </Link>

            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
               {listStories.slice(0, 2).map((story, i) => (
                 <Link key={i} href="#" className="block group">
                    <div className="relative aspect-video mb-3 overflow-hidden">
                       <Image src={story.image} alt="sub" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">{story.headline}</h4>
                 </Link>
               ))}
            </div>
          </div>

          {/* Sidebar - Trending Column */}
          <div className="lg:col-span-4">
             <div className="bg-zinc-950 text-white p-6 mb-10 border-l-4 border-primary shadow-2xl">
                <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4">Bulletin Board</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-6 italic">"The ultimate student resource for daily campus life and academic news."</p>
                <div className="h-px bg-zinc-800 w-full mb-6" />
                <button className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white hover:text-zinc-950 transition-all">Submit Story</button>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Global Buzz
             </h4>
             <div className="space-y-6">
                {trendingStoriesList.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-4 group">
                    <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">Trending</span>
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
