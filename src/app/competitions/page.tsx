"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Share2, TrendingUp, Calendar, Users, Trophy, ChevronRight } from "lucide-react";
import { format } from 'date-fns';

export default function CompetitionsPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const competitionNews = await getNewsByCategory("Competitions", 10);
      setStories(competitionNews);
      setLoading(false);
    };
    fetchCompetitions();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading competitions...</div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center">No competitions available yet.</div>;

  const mainComp = stories[0] || { image: "/placeholder.jpg", headline: "No competition", description: "" };
  const listComps = stories.slice(1, 5);
  const trendingStoriesList = stories.slice(0, 5);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            competitions & <span className="text-primary italic">opportunities</span>
          </h1>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Main Competition Focus - Column 1 & 2 (Lg) */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <div className="group block mb-10">
              <div className="relative aspect-video mb-6 overflow-hidden bg-zinc-100 border border-zinc-200">
                <Image 
                  src={`https://picsum.photos/seed/comp-main/800/600`} 
                  alt="comp" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-all duration-1000" 
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  Featured
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none group-hover:text-primary transition-colors mb-6 uppercase">
                {mainComp.name}
              </h2>
              <div className="flex flex-wrap gap-6 mb-8 text-[11px] font-black uppercase text-zinc-500">
                 <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 border border-zinc-100"><Calendar className="w-3.5 h-3.5 text-primary" /> {format(new Date(mainComp.deadline), 'MMM d, yyyy')}</div>
                 <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 border border-zinc-100"><Users className="w-3.5 h-3.5" /> {mainComp.eligibility}</div>
              </div>
              <p className="text-zinc-600 text-lg leading-relaxed mb-8">Organized by <span className="font-bold text-zinc-950 underline decoration-primary decoration-2">{mainComp.organizer}</span>. A premier opportunity for students to showcase their expertise and compete at a national level.</p>
              <Link href={mainComp.link} target="_blank" className="inline-flex items-center gap-3 bg-zinc-950 text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-primary transition-all">
                 Apply Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-10 border-t border-zinc-100">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Open Calls</h3>
               <div className="grid md:grid-cols-2 gap-6">
                {listComps.map((comp, i) => (
                  <Link key={i} href={comp.link} target="_blank" className="block group bg-zinc-50 p-6 border border-zinc-100 hover:border-primary transition-all">
                     <h4 className="text-sm font-bold group-hover:text-primary transition-colors mb-2 line-clamp-2">{comp.name}</h4>
                     <span className="text-[9px] font-black uppercase text-zinc-400">Deadline: {format(new Date(comp.deadline), 'MMM d')}</span>
                  </Link>
                ))}
               </div>
            </div>
          </div>

          {/* Quick List - Middle Column */}
          <div className="lg:col-span-3 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Incentives</h3>
            <div className="space-y-8">
               {[
                 { title: "Cash Prizes", desc: "Up to ₹50,000 for winners" },
                 { title: "Internships", desc: "Placements with MRT Network" },
                 { title: "Mentorship", desc: "Industry expert guidance" },
               ].map((item, i) => (
                 <div key={i} className="group">
                    <Trophy className="w-5 h-5 text-primary mb-2" />
                    <h4 className="text-md font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                 </div>
               ))}
            </div>

            <div className="mt-12 pt-12 border-t border-zinc-100">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Archived</h4>
               <div className="space-y-4">
                  {competitionsData.slice(5, 8).map((comp, i) => (
                    <div key={i} className="text-zinc-400 group cursor-not-allowed">
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-zinc-500 transition-colors line-clamp-2">{comp.name}</h5>
                       <span className="text-[9px] font-black uppercase mt-1 block tracking-widest">Closed</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar - Related News */}
          <div className="lg:col-span-3">
             <div className="bg-zinc-950 text-white p-6 mb-10 border-l-4 border-primary shadow-2xl">
                <h4 className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4 italic">Winner Spotlight</h4>
                <p className="text-[12px] text-zinc-400 leading-relaxed italic mb-4">"Winning the Tech-Fest changed my perspective on team collaboration and industry standards."</p>
                <span className="text-[9px] font-black uppercase text-white tracking-widest">- Aryan Sharma, 2024 Winner</span>
             </div>

             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Trending Success
             </h4>
             <div className="space-y-6">
                {trendingStoriesList.map((story, i) => (
                  <Link key={i} href="#" className="flex gap-4 group">
                    <div className="relative w-16 h-16 shrink-0 bg-zinc-100">
                       <Image src={story.image} alt="sq" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div>
                       <h5 className="text-[12px] font-bold leading-tight group-hover:text-primary line-clamp-2">{story.headline}</h5>
                       <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1 block">Success Story</span>
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
