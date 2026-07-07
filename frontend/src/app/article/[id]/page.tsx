"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Youtube, PlayCircle, Tag, User, Download } from "lucide-react";

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Proxy through Next.js
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return "https://smeh-new-desing.vercel.app";
};
const API_BASE_URL = getBaseUrl();

interface RawArticle {
  id: string;
  _id?: string;
  title?: string;
  headline?: string;
  content?: string;
  description?: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  youtube_url?: string;
  youtubeUrl?: string;
  published_at?: string;
  publishedAt?: string;
  created_at?: string;
  createdAt?: string;
  category?: any;
  author?: {
    email?: string;
  };
  thumbnail?: {
    file_path?: string;
  };
  document?: {
    file_path?: string;
    original_name?: string;
  };
}

function getYouTubeId(url: string | null | undefined) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function getImageUrl(url: string | null | undefined) {
  if (!url || url === "undefined" || url === "") return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return url;
  return `/uploads/${url}`;
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

function resolveCategoryName(cat: any) {
  if (!cat) return "General";
  if (typeof cat === "string") return cat;
  if (typeof cat === "object") return cat.name || "General";
  return "General";
}

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<RawArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/news/slug/${id}`, { cache: "no-store" })
      .then(async r => {
        if (!r.ok) {
          if (r.status === 404) {
             setArticle(null);
             return null;
          }
          throw new Error("Failed to load");
        }
        return r.json();
      })
      .then(data => {
        if (data === null) {
           setLoading(false);
           return;
        }
        const actualArticle = data.data && data.success !== undefined ? data.data : data;
        setArticle(actualArticle);
        setLoading(false);
      })
      .catch(e => {
        setError("Could not load this article.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-zinc-200 rounded-full" />
        <div className="h-3 w-40 bg-zinc-100 rounded" />
        <div className="h-2 w-24 bg-zinc-50 rounded" />
      </div>
    </div>
  );

  if (error || !article) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-zinc-500">
      <p className="text-lg font-bold">{error || "Article not found."}</p>
      <button onClick={() => router.back()} className="text-primary underline text-sm">← Go Back</button>
    </div>
  );

  const categoryName = resolveCategoryName(article.category);
  const imgSrc = getImageUrl(article.thumbnail?.file_path || article.image_url || article.image || article.imageUrl);
  const ytId = getYouTubeId(article.youtube_url || article.youtubeUrl);
  const publishedDate = formatDate(article.published_at || article.created_at);
  const authorEmail = article.author?.email || "";

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">

        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-zinc-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span className="text-zinc-200">|</span>
          <span className="text-[12px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
            <Tag className="w-3 h-3" /> {categoryName}
          </span>
        </div>

        {/* Article Header */}
        <div className="mb-8 border-b border-zinc-100 pb-8">
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6 text-zinc-950">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-zinc-400 font-bold">
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {publishedDate}
              </span>
            )}
            {authorEmail && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {authorEmail}
              </span>
            )}
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-sm">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Lead Image */}
        {imgSrc && (
          <div className="relative w-full aspect-[21/9] md:aspect-video overflow-hidden bg-zinc-50 mb-10 rounded-xl shadow-sm border border-zinc-100">
            <Image src={imgSrc} alt={article.title || article.headline || 'Untitled'} fill className="object-cover" priority unoptimized={true} />
          </div>
        )}

        {/* YouTube Embed — shown above body when video exists */}
        {ytId && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle className="w-5 h-5 text-red-600" />
              <span className="text-[13px] font-black uppercase tracking-wider text-zinc-700">Watch Video</span>
            </div>
            <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title={article.title || article.headline || 'Untitled'}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${ytId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-red-600 hover:text-red-700"
            >
              <Youtube className="w-3.5 h-3.5" /> Open on YouTube
            </a>
          </div>
        )}

        {/* Document Download */}
        {article.document && article.document.file_path && (
          <div className="mb-8 p-5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-[13px] font-black uppercase tracking-wider text-zinc-800 mb-1">Attached Document</h3>
              <p className="text-sm text-zinc-500">{article.document.original_name || 'Additional information available for download'}</p>
            </div>
            <a
              href={`/uploads/${article.document.file_path}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white text-[12px] font-black uppercase tracking-widest rounded hover:bg-red-700 transition"
            >
              <Download className="w-4 h-4" /> Download (for more info)
            </a>
          </div>
        )}

        {/* Article Body — render full HTML from rich editor */}
        {article.content && (
          <div
            className="prose prose-zinc max-w-none text-[16px] leading-loose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
            Manav Rachna Times — {categoryName}
          </span>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-primary hover:underline"
          >
            <ArrowLeft className="w-3 h-3" /> Back to {categoryName}
          </button>
        </div>

      </main>
    </div>
  );
}