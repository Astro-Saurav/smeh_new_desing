"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Globe, MapPin, ExternalLink } from "lucide-react";

export default function BeyondCampusPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeyondNews = async () => {
      const beyondNews = await getNewsByCategory("Beyond Campus", 10);
      setStories(beyondNews);
      setLoading(false);
    };
    fetchBeyondNews();
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
            Beyond <span className="text-primary italic">Campus</span>
          </h1>
        </div>

        {/* Hero Grid - 3 Columns (Lg) / 1 Column (Md) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Feature - 2/3 Width roughly */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <Link href="#" className="group block mb-6">
              <div className="relative aspect-[16/10] mb-4 overflow-hidden">
                <Image 
                  src={mainStory.image} 
                  alt="m" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
                <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Live Updates
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors">
                {mainStory.headline}
              </h2>
            </Link>
            
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              {studentProjects.slice(5, 8).map((news, i) => (
                <Link key={i} href="#" className="block group border-b border-zinc-50 pb-4 last:border-0">
                  <h3 className="text-lg font-bold group-hover:text-primary group-hover:underline transition-all">
                    {news.headline}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Secondary Features - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <Link href="#" className="group block mb-6">
              <div className="relative aspect-video mb-4 overflow-hidden">
                <Image 
                  src={sideStory1.image} 
                  alt="s" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-xl md:text-2xl font-black leading-tight group-hover:text-primary transition-colors mb-2">
                {sideStory1.headline}
              </h3>
              <p className="text-sm text-zinc-500 line-clamp-3">
                {sideStory1.description}
              </p>
            </Link>

            <div className="space-y-6 pt-6 border-t border-zinc-100">
               {listStories.slice(0, 2).map((story, i) => (
                 <Link key={i} href="#" className="block group">
                   <h4 className="text-base font-bold group-hover:text-primary transition-colors">
                     {story.headline}
                   </h4>
                   <span className="text-[10px] font-black uppercase text-zinc-400 mt-1 block tracking-widest">30 Mins ago</span>
                 </Link>
               ))}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Ad Space Mockup */}
            <div className="bg-zinc-50 border border-zinc-100 p-6 flex flex-col justify-between aspect-square">
               <div>
                 <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-4 block text-right">Advertisement</span>
                 <h4 className="text-xl font-black tracking-tighter text-zinc-800 mb-2">Elevate Your Career with Industry Insights</h4>
                 <p className="text-xs text-zinc-500">Join our next webinar featuring global leaders in tech and media.</p>
               </div>
               <button className="w-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest py-3 hover:bg-primary transition-colors">Learn More</button>
            </div>

            {/* Thumbnail Feed */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Trending Now
              </h4>
               {trendingStoriesList.map((story, i) => (
                 <Link key={i} href="#" className="flex gap-4 group">
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                       <Image src={story.image} alt="sq" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter mt-1">{story.category}</span>
                    </div>
                 </Link>
               ))}
            </div>
          </div>

        </div>

        {/* Global Partnership Section */}
        <div className="bg-zinc-950 text-white p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-primary relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
           <div className="relative z-10 max-w-2xl">
              <span className="text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-4 block italic">Global Network</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">Mapping the Future Beyond Institutional Boundaries</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">Join a network of over 500+ global partners and industry leaders shaping the next decade of innovation.</p>
           </div>
           <Link href="/contact" className="relative z-10 bg-primary text-white px-10 py-5 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-zinc-950 transition-all shrink-0 flex items-center gap-2">
             Partner With Us <ExternalLink className="w-4 h-4" />
           </Link>
        </div>

      </main>
    </div>
  );
}
