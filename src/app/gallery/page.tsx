"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Camera, Maximize2, Hash, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GalleryPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const galleryNews = await getNewsByCategory("Gallery", 20);
      setStories(galleryNews);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading gallery...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No gallery items available yet.</div>;

  const campusImages = stories.slice(0, 4);
  const eventImages = stories.slice(4, 8); 
  const workImages = stories.slice(8, 12);
  const gridStories = stories.slice(0, 6);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Visual Header */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-12 md:py-20 mb-12">
        <div className="container mx-auto px-4 md:px-8">
           <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Visual Journal</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
             Digital <span className="text-primary">Gallery</span>
           </h1>
           <p className="text-zinc-500 text-lg md:text-xl font-medium mt-6 max-w-2xl leading-relaxed">
             High-fidelity visual archives documenting our journey. A specialized collection across institutional life, major events, and innovative student work.
           </p>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Visual Content with Sections */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="campus" className="w-full">
              <div className="flex items-center justify-between border-b border-zinc-100 mb-10 overflow-x-auto no-scrollbar">
                <TabsList className="bg-transparent h-auto p-0 gap-8 md:gap-12 flex-nowrap">
                   {[
                     { id: "campus", label: "Campus Life" },
                     { id: "events", label: "Events" },
                     { id: "work", label: "Student Work" }
                   ].map((tab) => (
                     <TabsTrigger 
                       key={tab.id} 
                       value={tab.id} 
                       className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 data-[state=active]:text-zinc-950 transition-all whitespace-nowrap"
                     >
                       {tab.label}
                     </TabsTrigger>
                   ))}
                </TabsList>
              </div>

              {[
                { id: "campus", data: campusImages },
                { id: "events", data: eventImages },
                { id: "work", data: workImages }
              ].map((section) => (
                <TabsContent key={section.id} value={section.id} className="mt-0 focus-visible:outline-none">
                  <div className="columns-1 md:columns-2 gap-8 space-y-8">
                    {section.data.map((item, i) => (
                      <div key={i} className="group relative break-inside-avoid">
                        <div className="relative overflow-hidden bg-zinc-100 border border-zinc-100 shadow-sm">
                           <img src={item.image} alt="g" className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000 grayscale hover:grayscale-0" />
                           <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white p-4 rounded-full transform scale-50 group-hover:scale-100 transition-all duration-500">
                                 <Maximize2 className="w-6 h-6 text-zinc-950" />
                              </div>
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent">
                              <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                 <Camera className="w-3 h-3 text-primary" /> {section.id === "campus" ? "Shot on Campus" : section.id === "events" ? "Event Coverage" : "Project Showcase"}
                              </p>
                              <h4 className="text-white text-xs font-bold leading-tight line-clamp-1">{item.headline}</h4>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-950 border-b-2 border-zinc-950 pb-2 mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Visual Trending
              </h3>
              <div className="space-y-10">
                {gridStories.map((item, i) => (
                  <Link key={i} href="#" className="block group">
                    <div className="flex gap-6">
                       <span className="text-5xl font-black text-zinc-100 group-hover:text-primary transition-colors shrink-0 tabular-nums">0{i+1}</span>
                       <div className="space-y-2">
                          <h4 className="text-sm font-bold leading-snug group-hover:text-primary group-hover:underline underline-offset-4 decoration-zinc-200 transition-all">{item.headline}</h4>
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600">{item.category}</span>
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sticky top-24 bg-zinc-950 text-white p-10 border-l-4 border-primary shadow-2xl">
               <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-6">Archive Access</h4>
               <h3 className="text-2xl font-black tracking-tighter leading-tight mb-8 italic">Contribute to the Visual Legacy</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-10 font-medium pb-8 border-b border-zinc-900">Are you a student photographer? Submit your work to be featured in the official school archives.</p>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                     <ImageIcon className="w-4 h-4 text-primary" /> 1,200+ Photos
                  </div>
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                     <Hash className="w-4 h-4 text-primary" /> Visual Metadata
                  </div>
               </div>
               <button className="w-full bg-primary text-white font-black uppercase text-[11px] tracking-widest py-4 mt-12 hover:bg-white hover:text-zinc-950 transition-all shadow-xl">Submit Your Work</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
