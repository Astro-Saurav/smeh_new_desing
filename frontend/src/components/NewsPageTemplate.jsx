// SHARED: creates a clean news section page (Times of India style)
// Usage: wrap in a page component, pass categoryName, pageTitle, pageSubtitle

"use client";
import { useEffect, useState } from "react";
import { getNewsByCategory } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, Youtube, PlayCircle } from "lucide-react";

function getYouTubeId(url) {
  if (!url) return null;
  const m = (url || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Big card for the lead story
function LeadCard({ story }) {
  const ytId = getYouTubeId(story.youtubeUrl);
  const img = story.image && story.image !== "undefined" ? story.image : "/placeholder.jpg";
  return (
    <div className="group">
      <Link href={story.link}>
        <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 mb-4">
          <Image src={img} alt={story.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
          {ytId && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600/90 rounded-full p-3">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{story.category}</span>
        <h2 className="text-2xl md:text-3xl font-black leading-tight group-hover:text-primary transition-colors mb-3">
          {story.headline}
        </h2>
        <p className="text-zinc-600 text-[15px] leading-relaxed line-clamp-3 mb-4">{story.description}</p>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-[11px] text-zinc-400 font-bold flex items-center gap-1">
          <Clock className="w-3 h-3" /> {timeAgo(story.publishedAt)}
        </span>
        {ytId && (
          <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-black text-red-600 hover:text-red-700">
            <Youtube className="w-3.5 h-3.5" /> Watch Video
          </a>
        )}
      </div>
    </div>
  );
}

// Medium card for sub-stories
function MedCard({ story }) {
  const ytId = getYouTubeId(story.youtubeUrl);
  const img = story.image && story.image !== "undefined" ? story.image : "/placeholder.jpg";
  return (
    <div className="group flex gap-4 border-b border-zinc-100 pb-5 last:border-0 last:pb-0">
      <Link href={story.link} className="block shrink-0">
        <div className="relative w-24 h-20 overflow-hidden bg-zinc-100">
          <Image src={img} alt={story.headline} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      </Link>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[9px] font-black uppercase tracking-wider text-primary mb-1">{story.category}</span>
        <Link href={story.link}>
          <h4 className="text-[13px] font-black leading-snug group-hover:text-primary transition-colors mb-1.5 line-clamp-2">{story.headline}</h4>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {timeAgo(story.publishedAt)}</span>
          {ytId && (
            <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-black text-red-600 flex items-center gap-1">
              <Youtube className="w-3 h-3" /> Watch
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Small list card for sidebar trending
function SmallCard({ story, rank }) {
  const img = story.image && story.image !== "undefined" ? story.image : "/placeholder.jpg";
  return (
    <Link href={story.link} className="group flex gap-3 border-b border-zinc-100 pb-4 last:border-0">
      <span className="text-2xl font-black text-zinc-100 group-hover:text-primary shrink-0 leading-none mt-1">
        {String(rank).padStart(2, "0")}
      </span>
      <div>
        <h5 className="text-[12px] font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">{story.headline}</h5>
        <span className="text-[10px] text-zinc-400 mt-1 block"><Clock className="w-2.5 h-2.5 inline mr-1" />{timeAgo(story.publishedAt)}</span>
      </div>
    </Link>
  );
}
