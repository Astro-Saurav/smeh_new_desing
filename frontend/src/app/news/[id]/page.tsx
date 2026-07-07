'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface NewsDetail {
  id: string
  title: string
  excerpt: string
  content: string
  category: { name: string; slug: string }
  author: { email: string }
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
  youtube_url?: string
  thumbnail_media_id?: string
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

      if (!res.ok) {
        throw new Error('News not found')
      }

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
      }).catch(() => {}) // Ignore errors for demo
    } catch (err) {
      console.error('Failed to like:', err)
    }
  }

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = news?.title || 'Check this article'

    const shareUrls: { [key: string]: string } = {
      facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-red-400 mb-4">{error || 'Article not found'}</p>
          <Link href="/" className="text-orange-500 hover:text-orange-400 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
    return views.toString()
  }

  const extractYouTubeId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\&\n\r\t\v\f]+)/)
    return match ? match[1] : null
  }

  const youtubeId = news.youtube_url ? extractYouTubeId(news.youtube_url) : null

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="text-orange-500 hover:text-orange-400 mb-4 inline-block font-semibold">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">{news.title}</h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-slate-400">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {news.category.name}
            </span>
            <span>{formatDate(news.created_at)}</span>
            <span>By {news.author.email}</span>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="w-full h-96 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-6xl opacity-30">📰</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* YouTube Video */}
        {youtubeId && (
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={news.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}

        {/* Excerpt */}
        {news.excerpt && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <p className="text-lg text-white leading-relaxed">{news.excerpt}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="text-white leading-relaxed space-y-4 whitespace-pre-wrap text-base">
          {news.content}
        </div>

        {/* Engagement */}
        <div className="flex gap-4 pt-6 border-t border-slate-700 flex-wrap">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
              liked
                ? 'bg-orange-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>👍</span> Like ({news.likes_count})
          </button>
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-700 text-slate-300 rounded-lg font-semibold">
            <span>👁️</span> {formatViews(news.views_count)} views
          </div>
        </div>

        {/* Share */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Share this article</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleShare('facebook')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              📘 Facebook
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition font-semibold"
            >
              𝕏 Twitter
            </button>
            <button
              onClick={() => handleShare('pinterest')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              📌 Pinterest
            </button>
          </div>
        </div>

        {/* Related Articles Link */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
          <Link
            href={`/category/${news.category.slug}`}
            className="text-orange-500 hover:text-orange-400 font-semibold"
          >
            → More articles in {news.category.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
