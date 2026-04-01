"use client";

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { 
  studentProjects, 
  documentaryAndShortFilms 
} from '@/lib/data';
import { 
  PlayCircle, 
  TrendingUp, 
  ChevronRight,
  Clock,
  MessageCircle,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const mainArticle = studentProjects[0];
  const worldNews = studentProjects.slice(1, 4);
  const opinionNews = studentProjects.slice(4, 7);

  return (
    <div className="flex flex-col bg-white text-zinc-950 font-body min-h-screen">
      
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        
        {/* Main News Hub - CNN Style High-Intensity Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-zinc-200 mb-16">
          
          {/* Left Column: Quick Scan Headlines */}
          <div className="lg:col-span-3 lg:border-r border-zinc-200 pr-0 lg:pr-6 pb-10 border-b lg:border-b-0 mb-10 lg:mb-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary w-fit pb-1 mb-6">Latest Buzz</h3>
            <div className="flex flex-col divide-y divide-zinc-100">
              {studentProjects.slice(2, 6).map((item, idx) => (
                <Link key={idx} href={item.link} className="group py-5 block first:pt-0">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2 block">{item.category}</span>
                  <h4 className="text-[15px] font-black leading-snug group-hover:text-primary transition-colors mb-3">
                    {item.headline}
                  </h4>
                  {idx === 1 && (
                     <div className="relative aspect-video mb-3">
                       <Image 
                         src={item.image} 
                         alt="side-news" 
                         fill 
                         sizes="(max-width: 768px) 100vw, 25vw"
                         className="object-cover" 
                       />
                     </div>
                  )}
                  <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h ago</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 12</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Center Column: The Lead Story */}
          <div className="lg:col-span-6 px-0 lg:px-8 pb-10 lg:border-r border-zinc-200 border-b lg:border-b-0 mb-10 lg:mb-0">
            <Link href={mainArticle.link} className="group block">
              <div className="mb-0 text-center">
                <span className="inline-flex items-center gap-2 bg-primary text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  Live Updates
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-[2.75rem] font-black font-headline tracking-tight leading-[1.05] mb-8 text-zinc-950 group-hover:text-zinc-800 transition-colors">
                  {mainArticle.headline}
                </h1>
              </div>

              <div className="relative w-full aspect-video bg-zinc-100 overflow-hidden mb-8">
                <iframe
                  src="https://www.youtube.com/embed/CV08TgRVNT8?autoplay=1&mute=1&loop=1&playlist=CV08TgRVNT8&controls=0&modestbranding=1&rel=0&disablekb=1"
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  allow="autoplay; encrypted-media"
                />
              </div>

              <div className="max-w-xl mx-auto">
                <p className="text-[17px] font-medium leading-relaxed text-zinc-600 mb-8 pb-8 border-b border-zinc-100">
                  {mainArticle.description}
                </p>
                <div className="space-y-4">
                  {studentProjects.slice(1, 3).map((sub, i) => (
                    <div key={i} className="flex gap-4 group/sub hover:text-primary cursor-pointer transition-colors">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-sm font-black leading-snug">{sub.headline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: Featured & Multimedia */}
          <div className="lg:col-span-3 pl-0 lg:pl-6 pb-10">
            <div className="bg-zinc-50 border border-zinc-100 p-5 mb-8">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-950">Multimedia</h3>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-6">
                {documentaryAndShortFilms.slice(0, 2).map((video, idx) => (
                  <Link key={idx} href="/explore/audio-visual" className="group block">
                    <div className="relative aspect-video mb-3 overflow-hidden">
                      <Image 
                        src={video.thumbnailUrl} 
                        alt="video" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-all text-white">
                        <PlayCircle className="w-8 h-8 opacity-80" />
                      </div>
                    </div>
                    <h4 className="text-[13px] font-black leading-tight group-hover:text-primary transition-colors">{video.title}</h4>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Analysis</h3>
              {opinionNews.slice(0, 2).map((item, idx) => (
                <Link key={idx} href={item.link} className="group block">
                   <h4 className="text-sm font-black leading-snug group-hover:text-primary transition-colors underline decoration-zinc-100 underline-offset-4 decoration-2">
                     {item.headline}
                   </h4>
                   <span className="text-[10px] font-bold text-zinc-400 mt-2 block uppercase tracking-wider">By Editorial Team</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sectional Grid: Modern Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
          {[
            { name: "Manav Rachna TV", data: documentaryAndShortFilms.slice(2, 5), type: 'video' },
            { name: "Campus Buzz", data: studentProjects.slice(3, 6), type: 'article' },
            { name: "Social Buzz", data: studentProjects.slice(0, 3), type: 'article' }
          ].map((sec, i) => (
            <div key={i} className="flex flex-col">
              <h2 className="text-lg font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className="w-2 h-6 bg-zinc-950" />
                {sec.name}
              </h2>
              <div className="space-y-8">
                {sec.data.map((item: any, idx) => (
                   <Link key={idx} href="#" className="group block">
                      <div className="relative aspect-video mb-4 bg-zinc-100 overflow-hidden">
                        <Image 
                          src={item.image || item.thumbnailUrl} 
                          alt="news" 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {sec.type === 'video' && <PlayCircle className="absolute inset-0 m-auto w-10 h-10 text-white/90" />}
                      </div>
                      <h4 className="font-black text-[15px] leading-tight group-hover:text-primary transition-colors mb-2">
                        {item.headline || item.title}
                      </h4>
                      <p className="text-[12px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                        {item.description || "In-depth coverage and reporting from the Manav Rachna campus and beyond."}
                      </p>
                   </Link>
                ))}
              </div>
              <Link href="#" className="mt-8 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all flex items-center gap-1 group/more">
                See all {sec.name} <ChevronRight className="w-3 h-3 group-hover/more:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
