"use client";

import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import type { MainSiteNewsItem } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { Clock, Youtube, PlayCircle } from "lucide-react";

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function safeImg(url) {
  return url && url !== "undefined" && url !== "" ? url : "/placeholder.jpg";
}
function YTButton({ url }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <a href={"https://www.youtube.com/watch?v=" + id} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[11px] font-black text-red-600 hover:text-red-700 transition-colors">
      <Youtube className="w-3.5 h-3.5" /> Watch Video
    </a>
  );
}

export default function Page() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getNewsByCategory("Manav Rachna TV", 20).then(data => { setStories(data); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse flex flex-col items-center gap-3"><div className="w-12 h-12 bg-zinc-200 rounded-full" /><div className="h-3 w-28 bg-zinc-100 rounded" /></div></div>;
  if (!stories.length) return <div className="min-h-screen flex items-center justify-center text-zinc-400"><p>No news published in this section yet.</p></div>;

  const lead = stories[0];
  const sub = stories.slice(1, 5);
  const trending = stories.slice(5, 12);
  const ytId = getYouTubeId(lead.youtubeUrl);

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="border-b-4 border-zinc-900 mb-10 pb-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Manav Rachna <span className="text-primary italic">TV</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 lg:border-r border-zinc-100 lg:pr-10">
            <Link href={lead.link} className="group block">
              <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 mb-5">
                <Image src={safeImg(lead.image)} alt={lead.headline} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" priority />
                {ytId && <div className="absolute inset-0 flex items-center justify-center"><div className="bg-red-600/90 rounded-full p-4"><PlayCircle className="w-9 h-9 text-white" /></div></div>}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{lead.category}</span>
              <h2 className="text-2xl md:text-4xl font-black leading-tight group-hover:text-primary transition-colors mb-4">{lead.headline}</h2>
              <p className="text-zinc-600 text-[15px] leading-relaxed line-clamp-3 mb-5">{lead.description}</p>
            </Link>
            <div className="flex items-center gap-5 pb-8 border-b border-zinc-100 mb-8">
              <YTButton url={lead.youtubeUrl} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sub.map((story, i) => {
                const sYt = getYouTubeId(story.youtubeUrl);
                return (
                  <div key={i} className="group">
                    <Link href={story.link}>
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 mb-3">
                        <Image src={safeImg(story.image)} alt={story.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        {sYt && <div className="absolute bottom-2 left-2"><span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 flex items-center gap-1"><PlayCircle className="w-2.5 h-2.5" /> Video</span></div>}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-primary mb-1 block">{story.category}</span>
                      <h4 className="text-[14px] font-black leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">{story.headline}</h4>
                      <p className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed">{story.description}</p>
                    </Link>
                    {sYt && <div className="mt-2"><YTButton url={story.youtubeUrl} /></div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b-2 border-zinc-900 pb-3 mb-6">More in Manav Rachna TV</h3>
            <div className="flex flex-col gap-5">
              {trending.map((story, i) => {
                const tYt = getYouTubeId(story.youtubeUrl);
                return (
                  <div key={i} className="group flex gap-4 border-b border-zinc-100 pb-5 last:border-0">
                    <span className="text-3xl font-black text-zinc-100 group-hover:text-primary shrink-0 leading-none tabular-nums mt-1">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <Link href={story.link}>
                        <h5 className="text-[13px] font-black leading-snug group-hover:text-primary transition-colors mb-1 line-clamp-2">{story.headline}</h5>
                      </Link>
                      <p className="text-[11px] text-zinc-500 line-clamp-1 mb-1.5">{story.description}</p>
                      {tYt && <YTButton url={story.youtubeUrl} />}
                    </div>
                    <Link href={story.link} className="shrink-0 hidden sm:block">
                      <div className="relative w-20 h-14 overflow-hidden bg-zinc-100">
                        <Image src={safeImg(story.image)} alt={story.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}