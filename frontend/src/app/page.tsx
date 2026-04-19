"use client";

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { 
  PlayCircle, 
  TrendingUp, 
  ChevronRight,
  Clock,
  MessageCircle
} from 'lucide-react';
import { 
  MainSiteNewsItem, 
  CategoryItem, 
  listCategories, 
  getNewsByCategory, 
  getAllPublishedNews 
} from '@/lib/newsApi';

export default function Home() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [allNews, setAllNews] = useState<MainSiteNewsItem[]>([]);
  const [categorySections, setCategorySections] = useState<{name: string, data: MainSiteNewsItem[]}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedCats, fetchedAllNews] = await Promise.all([
          listCategories(),
          getAllPublishedNews(10)
        ]);

        setCategories(fetchedCats);
        setAllNews(fetchedAllNews);

        // For each category, get its news to build the sections
        const sections = await Promise.all(
          fetchedCats.slice(0, 9).map(async (cat) => {
            const news = await getNewsByCategory(cat.name, 3);
            return { name: cat.name, data: news };
          })
        );
        
        setCategorySections(sections.filter(s => s.data.length > 0));
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-200 rounded-full mb-4" />
          <div className="h-4 w-32 bg-zinc-100 rounded" />
        </div>
      </div>
    );
  }

  const mainArticle = allNews[0] || {
    id: "default",
    headline: "Welcome to Manav Rachna Time",
    description: "Start adding news in your admin panel to see them here live.",
    image: "https://picsum.photos/seed/default/1200/800",
    category: "General",
    link: "#"
  };

  const sideNews = allNews.slice(1, 5);
  const multimediaNews = allNews.slice(5, 7);

  return (
    <div className="flex flex-col bg-white text-zinc-950 font-body min-h-screen">
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        
        {/* Main News Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-zinc-200 mb-16">
          
          {/* Left Column: Latest Buzz */}
          <div className="lg:col-span-3 lg:border-r border-zinc-200 pr-0 lg:pr-6 pb-10 border-b lg:border-b-0 mb-10 lg:mb-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary w-fit pb-1 mb-6">Latest Buzz</h3>
            <div className="flex flex-col divide-y divide-zinc-100">
              {sideNews.map((item, idx) => (
                <Link key={idx} href={item.link} className="group py-5 block first:pt-0">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2 block">{item.category}</span>
                  <h4 className="text-[15px] font-black leading-snug group-hover:text-primary transition-colors mb-3">
                    {item.headline}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h ago</span>
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
                <Image 
                  src={mainArticle.image} 
                  alt="lead" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="max-w-xl mx-auto">
                <p className="text-[17px] font-medium leading-relaxed text-zinc-600 mb-8 pb-8 border-b border-zinc-100">
                  {mainArticle.description}
                </p>
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
                {multimediaNews.map((video, idx) => (
                  <Link key={idx} href={video.link} className="group block">
                    <div className="relative aspect-video mb-3 overflow-hidden">
                      <Image 
                        src={video.image} 
                        alt="video" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                        <PlayCircle className="w-8 h-8 opacity-80" />
                      </div>
                    </div>
                    <h4 className="text-[13px] font-black leading-tight group-hover:text-primary transition-colors">{video.headline}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Sectional Grid (No Code Required) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
          {categorySections.map((sec, i) => (
            <div key={i} className="flex flex-col">
              <h2 className="text-lg font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className="w-2 h-6 bg-zinc-950" />
                {sec.name}
              </h2>
              <div className="space-y-8">
                {sec.data.map((item, idx) => (
                   <Link key={idx} href={item.link} className="group block">
                      <div className="relative aspect-video mb-4 bg-zinc-100 overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt="news" 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <h4 className="font-black text-[15px] leading-tight group-hover:text-primary transition-colors mb-2">
                        {item.headline}
                      </h4>
                      <p className="text-[12px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                        {item.description}
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
