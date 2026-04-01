"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Heart, Instagram, Twitter } from "lucide-react";

export default function SocialBuzzPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialNews = async () => {
      const socialNews = await getNewsByCategory("Social Buzz", 15);
      setStories(socialNews);
      setLoading(false);
    };
    fetchSocialNews();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading news...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No news available yet.</div>;

  const mainStory = stories[0] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const listStories = stories.slice(1, 3);
  const trendingStoriesList = stories.slice(3, 8);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Social <span className="text-primary italic">Buzz</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Social Feature - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <Link href="#" className="group block mb-6">
              <div className="relative aspect-square mb-4 overflow-hidden bg-zinc-100">
                <Image 
                  src={mainStory.image} 
                  alt="m" 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  priority
                />
                <div className="absolute top-4 left-4 bg-zinc-950 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Instagram className="w-3 h-3 text-primary" /> Viral
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-6 h-6 rounded-full bg-zinc-200 border border-zinc-300" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">@manav_rachna_times</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-4">
                {mainStory.headline}
              </h2>
              <p className="text-zinc-600 line-clamp-3 mb-6">{mainStory.description}</p>
              <div className="flex gap-6 text-[11px] font-black uppercase text-zinc-400">
                 <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-primary" /> 2.4k</span>
                 <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> 156</span>
              </div>
            </Link>

            <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-zinc-100">
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

          {/* Feed Column - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Twitter className="w-4 h-4 text-primary" /> Live Feed
            </h3>
            <div className="space-y-8">
               {studentProjects.slice(8, 12).map((tweet, i) => (
                 <div key={i} className="group border-b border-zinc-100 pb-6 last:border-0 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-5 h-5 rounded-full bg-zinc-100" />
                       <span className="text-[9px] font-black uppercase text-zinc-400">MRT_Insider</span>
                    </div>
                    <p className="text-[13px] text-zinc-800 leading-snug group-hover:text-primary transition-colors">
                      {tweet.headline}... #ManavRachna #CampusLife #MRT
                    </p>
                    <span className="text-[9px] font-medium text-zinc-400 mt-2 block">2h ago</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar - Trending */}
          <div className="lg:col-span-3">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Trending Tags
             </h4>
             <div className="flex flex-wrap gap-2 mb-10">
                {["#SMEHBuzz", "#GlobalImpact", "#TechFest2026", "#LifeAtMR", "#MRTExclusive", "#ViralCampus"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 text-[9px] font-black uppercase text-zinc-600 hover:bg-primary hover:text-white transition-all cursor-pointer">
                    {tag}
                  </span>
                ))}
             </div>

             <div className="space-y-6">
                {trendingStoriesList.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-4 group">
                    <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary transition-colors">{story.headline}</h5>
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
