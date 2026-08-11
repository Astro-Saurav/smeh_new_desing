'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, ThumbsUp, Share2, Facebook, Twitter } from 'lucide-react'

interface NewsDetail {
  id: string
  title: string
  excerpt: string
  content: string
  category: { name: string; slug: string }
  author?: { email: string }
  author_name?: string
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
  youtube_url?: string
  thumbnail_media_id?: string
  title_font?: string
  excerpt_font?: string
  content_font?: string
}

export default function NewsDetailPage() {
  const params = useParams()
  const newsId = params.id as string
  const [news, setNews] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [newsId])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/v1/news/${newsId}`)
      if (!res.ok) throw new Error('News not found')
      const data = await res.json()
      setNews(data.data || data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!news) return
    setLiked(!liked)
    try {
      const token = localStorage.getItem('accessToken')
      await fetch(`/api/v1/news/${newsId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token || ''}` },
      }).catch(() => {})
    } catch (err) {
      console.error('Failed to like:', err)
    }
  }

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = news?.title || 'Check this article'
    const shareUrls: { [key: string]: string } = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    }
    if (shareUrls[platform]) window.open(shareUrls[platform], '_blank')
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const formatViews = (views: number) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + 'M'
    if (views >= 1_000) return (views / 1_000).toFixed(1) + 'K'
    return views.toString()
  }

  const extractYouTubeId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n\r\t\v\f]+)/)
    return match ? match[1] : null
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-zinc-400 text-sm font-medium">Loading article…</p>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !news) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12">
        <div className="max-w-sm mx-auto px-4 text-center">
          <p className="text-red-500 mb-4 font-medium">{error || 'Article not found'}</p>
          <Link href="/" className="text-primary hover:underline font-bold text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const youtubeId = news.youtube_url ? extractYouTubeId(news.youtube_url) : null

  return (
    <div className="min-h-screen bg-white font-body">
      {/* ── Article Header / Hero ─────────────────────────────────────────── */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <Link
              href={`/category/${news.category.slug}`}
              className="text-primary hover:underline"
            >
              {news.category.name}
            </Link>
          </div>

          {/* Headline */}
          <h1 
            className="font-heading text-3xl md:text-5xl font-black leading-[1.1] tracking-tight text-zinc-900 mb-6"
            style={{ fontFamily: news.title_font || 'inherit' }}
          >
            {news.title}
          </h1>

          {/* Excerpt / Sub-headline */}
          {news.excerpt && (
            <p 
              className="border-l-4 border-primary pl-4 italic text-base md:text-lg text-zinc-600 leading-relaxed mb-6"
              style={{ fontFamily: news.excerpt_font || 'inherit' }}
            >
              {news.excerpt}
            </p>
          )}

          {/* Byline + Dateline */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-100">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-800">
              By {news.author_name || news.author?.email?.split('@')[0].replace(/[._]/g, ' ') || 'MRT Bureau'}
            </span>
            <span className="text-zinc-300 select-none">·</span>
            <time
              dateTime={news.created_at}
              className="tabular-nums text-xs text-zinc-400 font-medium"
            >
              {formatDate(news.created_at)}
            </time>
            <span className="ml-auto flex items-center gap-1 text-zinc-400 text-xs font-medium">
              <Eye className="w-3.5 h-3.5" />
              {formatViews(news.views_count)} views
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* YouTube Embed */}
        {youtubeId && (
          <div className="aspect-video rounded-sm overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={news.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Article Body */}
        <article 
          className="font-body text-base leading-[1.9] text-zinc-800 space-y-5 whitespace-pre-wrap"
          style={{ fontFamily: news.content_font || 'inherit' }}
        >
          {news.content}
        </article>

        {/* ── Engagement Bar ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-zinc-200">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2 rounded-sm text-xs font-black uppercase tracking-wider transition-all ${
              liked
                ? 'bg-primary text-white shadow-md'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {liked ? 'Liked' : 'Like'} · {news.likes_count}
          </button>

          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[#1877F2] text-white text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <Facebook className="w-3.5 h-3.5" /> Share
          </button>

          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 px-5 py-2 rounded-sm bg-zinc-900 text-white text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <Twitter className="w-3.5 h-3.5" /> Tweet
          </button>

          <Link
            href={`/category/${news.category.slug}`}
            className="ml-auto text-xs font-black uppercase tracking-wider text-primary hover:underline"
          >
            More in {news.category.name} →
          </Link>
        </div>
      </div>
    </div>
  )
}
