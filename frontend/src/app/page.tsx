"use client";

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { PlayCircle, TrendingUp, ChevronRight, Clock, Youtube, Zap } from 'lucide-react';
import { MainSiteNewsItem, CategoryItem, listCategories, getNewsByCategory, getAllPublishedNews } from '@/lib/newsApi';

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

// Breaking News Ticker Component
function BreakingNewsTicker({ items }: { items: MainSiteNewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-zinc-950 text-white py-2 overflow-hidden relative flex items-center border-y border-zinc-800">
      <div className="flex items-center gap-2 px-4 bg-zinc-950 z-10 shrink-0 border-r border-zinc-800">
        <Zap className="w-3 h-3 text-primary fill-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Breaking News</span>
      </div>
      <div className="flex animate-marquee whitespace-nowrap gap-12 items-center flex-1">
        {items.map((item, idx) => (
          <Link key={idx} href={item.link} className="text-[11px] font-medium hover:text-primary transition-colors flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            {item.headline}
          </Link>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, idx) => (
          <Link key={`loop-${idx}`} href={item.link} className="text-[11px] font-medium hover:text-primary transition-colors flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            {item.headline}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewsCard({ item, size = 'sm' }: { item: MainSiteNewsItem; size?: 'sm' | 'md' | 'lg' }) {
  const ytId = getYouTubeId(item.youtubeUrl);
  const imgSrc = item.image && item.image !== 'undefined' && item.image !== '' ? item.image : '/placeholder.jpg';

  return (
    <div className="group flex flex-col h-full">
      <div className={`relative mb-4 bg-zinc-100 overflow-hidden shadow-sm`}>
        <Image
          src={imgSrc}
          alt={item.headline}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          onError={() => {}}
        />
        {ytId && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-600/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg">
              <PlayCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">{item.category}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-[9px] font-black uppercase text-primary tracking-[0.15em] mb-2 block">{item.category}</span>
        <Link href={item.link} className="block group/title">
          <h4 className={`font-headline leading-[1.15] tracking-tight group-hover/title:text-primary transition-colors mb-2 font-bold`}>
            {item.headline}
          </h4>
        </Link>
        {size !== 'sm' && (
          <p className="text-[13px] text-zinc-500 font-medium line-clamp-2 leading-relaxed mb-4">{item.description}</p>
        )}
        <div className="mt-auto flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just Now</span>
          {ytId && (
            <span className="flex items-center gap-1 text-red-600"><Youtube className="w-3 h-3" /> Video</span>
          )}
        </div>
      </div>
    </div>
  );
}

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
          getAllPublishedNews(20)
        ]);

        setCategories(fetchedCats);
        setAllNews(fetchedAllNews);

        const sections = await Promise.all(
          fetchedCats.slice(0, 6).map(async (cat) => {
            const news = await getNewsByCategory(cat.name, 4);
            return { name: cat.name, data: news };
          })
        );
        setCategorySections(sections.filter(s => s.data.length > 0));
      } catch (error) {
        console.error('Failed to load homepage data:', error);
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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Developing Stories...</div>
        </div>
      </div>
    );
  }

  // Guard: no news available after loading
  if (allNews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="text-5xl">📰</div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">No Stories Yet</h2>
          <p className="text-zinc-400 font-medium max-w-sm">Stories are being loaded. Please check back soon or refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2 bg-zinc-950 text-white text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Identify Featured Lead Story
  const featuredNews = allNews.filter(item => item.isFeatured);
  const leadStory = featuredNews[0] || allNews[0];
  const sideHeadlines = allNews.filter(item => item.id !== leadStory?.id).slice(0, 5);
  const secondaryFeatures = allNews.filter(item => item.id !== leadStory?.id && !sideHeadlines.some(s => s.id === item.id)).slice(0, 3);
  const tickerItems = allNews.slice(0, 8);

  return (
    <div className="flex flex-col bg-white text-zinc-950 font-sans min-h-screen">
      <BreakingNewsTicker items={tickerItems} />
      
      <main className="container mx-auto px-4 md:px-8 py-8 lg:py-12">
      
        {/* Masthead: Top Tier Editorial Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-20">
        
          {/* Main Lead Story */}
          <div className="lg:col-span-8 group">
            <div className="mb-6 flex items-baseline gap-3">
              <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">Featured</span>
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Published Today</span>
            </div>
            <Link href={leadStory?.link || `#`} className="block">
              <div className="relative aspect-video mb-8 overflow-hidden bg-zinc-100 shadow-xl">
                <Image 
                  src={leadStory?.image || '/placeholder.jpg'} 
                  alt={leadStory?.headline || `Featured Story`} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter leading-[0.95] mb-6 group-hover:text-primary transition-colors">
                {leadStory?.headline}
              </h1>
              <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-8">
                {leadStory?.description}
              </p>
            </Link>
            <div className="flex items-center gap-6 pt-6 border-t border-zinc-100">
              <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> 2 minutes read
              </span>
              {leadStory?.youtubeUrl && getYouTubeId(leadStory.youtubeUrl) && (
                <Link href={`https://www.youtube.com/watch?v=${getYouTubeId(leadStory.youtubeUrl)}`} target="_blank" className="text-[11px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
                  <Youtube className="w-4 h-4" /> Watch Special Report
                </Link>
              )}
            </div>
          </div>

          {/* Right Sidebar: Top Headlines Stack */}
          <div className="lg:col-span-4">
            <div className="border-y-4 border-zinc-950 py-4 mb-8 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-tighter">Top Headlines</h3>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-8 divide-y divide-zinc-100">
              {sideHeadlines.map((item, idx) => (
                <div key={idx} className="pt-8 first:pt-0 group/item">
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest mb-2 block">{item.category}</span>
                  <Link href={item.link}>
                    <h4 className="text-lg md:text-xl font-bold font-headline leading-tight tracking-tight group-hover/item:text-primary transition-colors mb-3">
                      {item.headline}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400">
                    <Clock className="w-3 h-3" /> 1h ago
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mid Tier: Visual Multimedia Highlight */}
        <section className="mb-20">
          <div className="bg-zinc-50 p-8 md:p-12 border border-zinc-100 rounded-sm">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black font-headline tracking-tighter mb-2 italic">Digital Gallery</h2>
                <p className="text-zinc-500 font-medium tracking-tight">Visual storytelling from the heart of the campus.</p>
              </div>
              <Link href="/gallery" className="btn bg-zinc-950 text-white px-8 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                View All Stories
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {secondaryFeatures.map((item, idx) => (
                <NewsCard key={idx} item={item} size="md" />
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Categorized Grid: The Final Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {categorySections.map((sec, i) => (
            <div key={i} className="flex flex-col">
              <div className="border-b-2 border-zinc-950 pb-2 mb-8 flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tighter">{sec.name}</h2>
                <ChevronRight className="w-4 h-4" />
              </div>
              <div className="space-y-12">
                {sec.data.map((item, idx) => (
                  <NewsCard key={idx} item={item} size={idx === 0 ? 'md' : 'sm'} />
                ))}
              </div>
              <Link href={`/${sec.name.toLowerCase().replace(/\s+/g, '-')}`} className="mt-10 pt-4 border-t border-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-all flex items-center justify-between group/more">
                More from {sec.name} <PlayCircle className="w-4 h-4 group-hover/more:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

