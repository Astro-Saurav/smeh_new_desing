"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Award, Star, Trophy } from "lucide-react";

export default function AchievementsPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const achievementNews = await getNewsByCategory("Achievements", 15);
      setStories(achievementNews);
      setLoading(false);
    };
    fetchAchievements();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading news...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No news available yet.</div>;

  const mainStory = stories[0] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const sideStory1 = stories[1] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const listStories = stories.slice(2, 5);
  const trendingStoriesList = stories.slice(5, 10);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Accolades & <span className="text-primary italic">Achievements</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Success Story - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <Link href="#" className="group block mb-6">
              <div className="relative aspect-[4/3] mb-4 overflow-hidden border border-zinc-100">
                <Image 
                  src={mainStory.image} 
                  alt="m" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                  priority
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Award className="w-4 h-4" /> Top Honor
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-4 uppercase italic">
                {mainStory.headline}
              </h2>
              <p className="text-zinc-600 line-clamp-3 mb-6 text-xl leading-relaxed">{mainStory.description}</p>
              
              <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-zinc-100">
                {stories.slice(11, 14).map((news, i) => (
                  <div key={i} className="flex gap-4 group">
                     <Trophy className="w-5 h-5 text-zinc-300 group-hover:text-primary shrink-0" />
                     <h4 className="text-md font-bold group-hover:text-primary transition-colors leading-tight">{news.headline}</h4>
                  </div>
                ))}
              </div>
            </Link>
          </div>

          {/* Highlights - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Student Spotlights</h3>
            <Link href="#" className="group block mb-10">
              <div className="relative aspect-[3/4] mb-3 overflow-hidden">
                <Image src={sideStory1.image} alt="side" fill className="object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-4 left-4">
                   <span className="bg-white/90 backdrop-blur-md px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-950">Visionary of the Year</span>
                </div>
              </div>
              <h4 className="text-lg font-black leading-tight group-hover:text-primary transition-colors uppercase">
                {sideStory1.headline}
              </h4>
            </Link>

            <div className="space-y-6 pt-6 border-t border-zinc-100">
               {listStories.slice(0, 2).map((story, i) => (
                 <Link key={i} href="#" className="block group">
                    <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em] mb-1 block">National Award</span>
                    <h5 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{story.headline}</h5>
                 </Link>
               ))}
            </div>
          </div>

          {/* Sidebar - Wall of Honor */}
          <div className="lg:col-span-3">
             <div className="bg-zinc-50 border border-zinc-200 p-6 mb-10">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Star className="w-3.5 h-3.5 text-primary" /> Hall of Fame
                </h4>
                <div className="space-y-5">
                  {[
                    "Global Media Award 2024",
                    "UNESCO Peace Prize Nomination",
                    "National Journalism Merit",
                    "Times of India CSR Award"
                  ].map((award, i) => (
                    <div key={i} className="border-b border-zinc-200 pb-3 last:border-0 last:pb-0">
                       <p className="text-[11px] font-black uppercase tracking-tight text-zinc-800 leading-tight">{award}</p>
                       <span className="text-[9px] font-medium text-zinc-400 mt-1 block">Category: Excellence</span>
                    </div>
                  ))}
                </div>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-zinc-400">
                <TrendingUp className="w-4 h-4" /> Global Citations
             </h4>
             <div className="space-y-6">
                {trendingStoriesList.slice(0, 4).map((story, i) => (
                  <Link key={i} href="#" className="block group border-l-2 border-zinc-100 hover:border-primary pl-4 transition-all">
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary transition-colors">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mt-1 block">Journalism Today</span>
                  </Link>
                ))}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
