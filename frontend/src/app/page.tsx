"use client";

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { PlayCircle, TrendingUp, ChevronRight, Clock, Youtube } from 'lucide-react';
import { MainSiteNewsItem, CategoryItem, listCategories, getNewsByCategory, getAllPublishedNews } from '@/lib/newsApi';

// Extracts YouTube video ID from any YouTube URL format
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

// Reusable news card with proper image rendering + conditional YouTube button
function NewsCard({ item, size = 'sm' }: { item: MainSiteNewsItem; size?: 'sm' | 'md' | 'lg' }) {
  const ytId = getYouTubeId(item.youtubeUrl);
  const imgSrc = item.image && item.image !== 'undefined' && item.image !== '' ? item.image : '/placeholder.jpg';

  return (
    <div className="group flex flex-col">
      <div className={`relative ${size === 'lg' ? 'aspect-video' : 'aspect-[4/3]'} mb-3 bg-zinc-100 overflow-hidden`}>
        <Image
          src={imgSrc}
          alt={item.headline}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => {}}
        />
        {ytId && (
          <div className="absolute inset-0 flex items-end justify-start p-3">
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-1 flex items-center gap-1 uppercase tracking-wider">
              <PlayCircle className="w-3 h-3" /> Video
            </span>
          </div>
        )}
      </div>
      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-1 block">{item.category}</span>
      <Link href={item.link} className="block">
        <h4 className={`font-black leading-tight group-hover:text-primary transition-colors mb-2 ${size === 'lg' ? 'text-[17px]' : 'text-[14px]'}`}>
          {item.headline}
        </h4>
      </Link>
      {size !== 'sm' && (
        <p className="text-[12px] text-zinc-500 font-medium line-clamp-2 leading-relaxed mb-3">{item.description}</p>
      )}
      {ytId && (
        <a
          href={`https://www.youtube.com/watch?v=${ytId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-black text-red-600 hover:text-red-700 transition-colors mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Youtube className="w-3.5 h-3.5" /> Watch Video
        </a>
      )}
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [allNews, setAllNews] = useState<MainSiteNewsItem[]>([]);
  const [latestBuzzNews, setLatestBuzzNews] = useState<MainSiteNewsItem[]>([]);
  const [tvNews, setTvNews] = useState<MainSiteNewsItem[]>([]);
  const [categorySections, setCategorySections] = useState<{name: string, data: MainSiteNewsItem[]}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedCats, fetchedAllNews, fetchedLatest, fetchedTv] = await Promise.all([
          listCategories(),
          getAllPublishedNews(10),
          getNewsByCategory("Latest Buzz", 4),
          getNewsByCategory("Manav Rachna TV", 2)
        ]);

        setCategories(fetchedCats);
        setAllNews(fetchedAllNews);
        setLatestBuzzNews(fetchedLatest);
        setTvNews(fetchedTv);

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
    youtubeUrl: "",
    link: "#"
  };

  const sideNews = latestBuzzNews.length > 0 ? latestBuzzNews : allNews.slice(1, 5);
  const multimediaNews = tvNews.length > 0 ? tvNews : allNews.slice(5, 7);
  const mainYtId = getYouTubeId(mainArticle.youtubeUrl);
  const mainImgSrc = mainArticle.image && mainArticle.image !== 'undefined' ? mainArticle.image : '/placeholder.jpg';

  return (
    <div className="flex flex-col bg-white text-zinc-950 font-body min-h-screen">
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10">
        
        {/* Main News Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-zinc-200 mb-16">
          
          {/* Left Column: Latest Buzz */}
          <div className="lg:col-span-3 lg:border-r border-zinc-200 pr-0 lg:pr-6 pb-10 border-b lg:border-b-0 mb-10 lg:mb-0">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary w-fit pb-1 mb-6">Latest Buzz</h3>
            <div className="flex flex-col divide-y divide-zinc-100">
              {sideNews.map((item, idx) => {
                const ytId = getYouTubeId(item.youtubeUrl);
                return (
                  <div key={idx} className="group py-5 first:pt-0">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider mb-2 block">{item.category}</span>
                    <Link href={item.link}>
                      <h4 className="text-[15px] font-black leading-snug group-hover:text-primary transition-colors mb-2">
                        {item.headline}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 mt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2h ago</span>
                      {ytId && (
                        <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 font-black" onClick={e => e.stopPropagation()}>
                          <PlayCircle className="w-3 h-3" /> Watch
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Column: The Lead Story */}
          <div className="lg:col-span-6 px-0 lg:px-8 pb-10 lg:border-r border-zinc-200 border-b lg:border-b-0 mb-10 lg:mb-0">
            <div className="mb-0 text-center">
              <span className="inline-flex items-center gap-2 bg-primary text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                Live Updates
              </span>
              <Link href={mainArticle.link} className="group block">
                <h1 className="text-3xl md:text-5xl lg:text-[2.75rem] font-black font-headline tracking-tight leading-[1.05] mb-8 text-zinc-950 group-hover:text-zinc-800 transition-colors">
                  {mainArticle.headline}
                </h1>
              </Link>
            </div>

            <Link href={mainArticle.link} className="group block">
              <div className="relative w-full aspect-video bg-zinc-100 overflow-hidden mb-8">
                <Image src={mainImgSrc} alt={mainArticle.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="max-w-xl mx-auto">
                <p className="text-[17px] font-medium leading-relaxed text-zinc-600 mb-6 pb-6 border-b border-zinc-100">
                  {mainArticle.description}
                </p>
              </div>
            </Link>
            {/* YouTube button for lead story */}
            {mainYtId && (
              <div className="max-w-xl mx-auto">
                <a
                  href={`https://www.youtube.com/watch?v=${mainYtId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-[12px] uppercase tracking-widest px-5 py-2.5 transition-colors"
                >
                  <Youtube className="w-4 h-4" /> Watch Full Video
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Multimedia */}
          <div className="lg:col-span-3 pl-0 lg:pl-6 pb-10">
            <div className="bg-zinc-50 border border-zinc-100 p-5 mb-8">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-950">Multimedia</h3>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-6">
                {multimediaNews.map((video, idx) => {
                  const ytId = getYouTubeId(video.youtubeUrl);
                  const src = video.image && video.image !== 'undefined' ? video.image : '/placeholder.jpg';
                  return (
                    <div key={idx} className="group">
                      <div className="relative aspect-video mb-3 overflow-hidden">
                        <Image src={src} alt={video.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                          <PlayCircle className="w-8 h-8 opacity-80" />
                        </div>
                      </div>
                      <h4 className="text-[13px] font-black leading-tight group-hover:text-primary transition-colors mb-2">{video.headline}</h4>
                      {ytId && (
                        <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-black text-red-600 hover:text-red-700 transition-colors">
                          <Youtube className="w-3 h-3" /> Watch Video
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Sectional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
          {categorySections.map((sec, i) => (
            <div key={i} className="flex flex-col">
              <h2 className="text-lg font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className="w-2 h-6 bg-zinc-950" />
                {sec.name}
              </h2>
              <div className="space-y-8">
                {sec.data.map((item, idx) => (
                  <NewsCard key={idx} item={item} size="md" />
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