"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Mic, Play, Headphones, Clock, Radio } from "lucide-react";

export default function PodcastPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcastNews = async () => {
      const podcastNews = await getNewsByCategory("Podcast", 15);
      setStories(podcastNews);
      setLoading(false);
    };
    fetchPodcastNews();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading news...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No news available yet.</div>;

  const mainStory = stories[0] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const sideStory1 = stories[1] || { image: "/placeholder.jpg", headline: "No article", description: "" };
  const listStories = stories.slice(2, 6);
  const trendingStoriesList = stories.slice(6, 11);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Audio <span className="text-primary italic">Originals</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Podcast Feature - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <div className="group block relative cursor-pointer mb-8">
              <div className="relative aspect-video mb-6 overflow-hidden bg-zinc-950 shadow-2xl">
                <Image 
                  src={mainStory.image} 
                  alt="m" 
                  fill 
                  className="object-cover opacity-70 group-hover:opacity-100 transition-all duration-1000" 
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-3xl transform group-hover:scale-110 transition-all duration-500">
                      <Play className="w-10 h-10 fill-white ml-1" />
                   </div>
                </div>
                <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <Mic className="w-4 h-4" /> New Release
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                 <span className="flex items-center gap-1.5 text-primary">Hosted by Sarah Khan</span>
                 <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                 <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4" /> 4.2k Listens</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-6 uppercase italic">
                {mainStory.headline}
              </h2>
              <p className="text-zinc-600 text-lg leading-relaxed mb-8">{mainStory.description}</p>
            </div>

            <div className="pt-10 border-t border-zinc-100">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Recent Episodes</h3>
               <div className="space-y-6">
                {listStories.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-6 group cursor-pointer pb-6 border-b border-zinc-50 last:border-0">
                     <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-zinc-100">
                        <Image src={story.image} alt="sq" fill className="object-cover group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[9px] font-black uppercase text-primary tracking-widest leading-none">{story.category}</span>
                           <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> 28m</span>
                        </div>
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight mb-2 underline decoration-zinc-100">
                          {story.headline}
                        </h4>
                     </div>
                  </Link>
                ))}
               </div>
            </div>
          </div>

          {/* Featured Show - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Series Spotlight</h3>
            <Link href="#" className="group block mb-10">
              <div className="relative aspect-square mb-4 overflow-hidden shadow-xl border border-zinc-100">
                <Image src={sideStory1.image} alt="side" fill className="object-cover group-hover:scale-110 transition-all duration-700" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-950 shadow-sm">
                  Top Rated Show
                </div>
              </div>
              <h4 className="text-lg font-black leading-tight group-hover:text-primary transition-colors uppercase italic underline decoration-zinc-100">
                {sideStory1.headline}
              </h4>
              <p className="text-zinc-500 text-xs mt-3 leading-relaxed line-clamp-3">{sideStory1.description}</p>
            </Link>

            <div className="space-y-6 pt-6 border-t border-zinc-100">
               {studentProjects.slice(8, 11).map((story, i) => (
                 <Link key={i} href="#" className="block group">
                    <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-1 flex items-center gap-1.5"><Radio className="w-3 h-3" /> Audio Clip</span>
                    <h5 className="text-[13px] font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{story.headline}</h5>
                 </Link>
               ))}
            </div>
          </div>

          {/* Sidebar - Trending/Support */}
          <div className="lg:col-span-3">
             <div className="bg-zinc-950 text-white p-8 mb-10 relative overflow-hidden border-l-4 border-primary shadow-2xl">
                <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-6">Listen Everywhere</h4>
                <div className="grid grid-cols-2 gap-3 mb-8">
                   {["Spotify", "Apple", "Google", "Amazon"].map(p => (
                     <div key={p} className="bg-zinc-900 px-3 py-2 border border-zinc-800 text-center text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all cursor-pointer">
                        {p}
                     </div>
                   ))}
                </div>
                <button className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 hover:bg-white hover:text-zinc-950 transition-all">Go to Network</button>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 text-zinc-400">
                <TrendingUp className="w-4 h-4" /> Global Frequency
             </h4>
             <div className="space-y-6">
                {trendingStoriesList.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-4 group">
                    <div className="text-2xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">Trending Episode</span>
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
