'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: { name: string; slug: string }
  views_count: number
  created_at: string
  thumbnail_media_id?: string
}

function NewsSkeleton() {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-slate-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-slate-700 rounded w-20"></div>
          <div className="h-3 bg-slate-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

interface NewsGridProps {
  categorySlug?: string
}

export default function NewsGrid({ categorySlug }: NewsGridProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [categorySlug])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = '/api/v1/news'
      if (categorySlug) {
        url += `?category=${categorySlug}`
      }

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`Failed to fetch news: ${res.status}`)
      }

      const data = await res.json()
      let newsList = Array.isArray(data.data) ? data.data : []

      // Filter published news only
      newsList = newsList.filter((n: any) => n.status === 'published')

      // Sort by newest first
      newsList.sort((a: NewsItem, b: NewsItem) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setNews(newsList)
    } catch (err) {
      console.error('News fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
    return views.toString()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
          {error}
          <button
            onClick={fetchNews}
            className="ml-4 px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(12)].map((_, i) => (
              <NewsSkeleton key={i} />
            ))}
          </>
        ) : news.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400">No articles found in this category</p>
          </div>
        ) : (
          news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-orange-500/20 transition hover:-translate-y-1 cursor-pointer group h-full flex flex-col">
                {/* Thumbnail */}
                <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden flex-shrink-0">
                  {item.thumbnail_media_id ? (
                    <img
                      src={`/placeholder-thumb.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform bg-slate-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                      📰
                    </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {item.category.name.slice(0, 12)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-white line-clamp-2 group-hover:text-orange-400 transition flex-1">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-400 line-clamp-2">{item.excerpt || 'No description'}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
                    <span>👁️ {formatViews(item.views_count)}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
