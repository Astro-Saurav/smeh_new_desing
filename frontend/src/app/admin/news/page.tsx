'use client'

import { useState, useEffect, useCallback } from 'react'
import { cacheManager } from '@/lib/cache-manager'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, Trash2, Edit3, Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  excerpt?: string
  category: { id: string; name: string }
  status: string
  is_breaking?: boolean
  isBreaking?: boolean
  views_count: number
  created_at: string
}

export default function NewsManagementPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  const fetchData = useCallback(async () => {
    setLoadingNews(true)
    try {
      const res = await fetch('/api/v1/news?pageSize=100')
      const newsData = await res.json()
      const list = Array.isArray(newsData.data) ? newsData.data : []
      // Filter out Photo Gallery items (they belong exclusively to /admin/gallery)
      const filteredList = list.filter((n: any) => 
        n.category?.slug !== 'photo-gallery' && 
        n.category?.slug !== 'gallery' && 
        !n.category?.name?.toLowerCase().includes('gallery')
      )
      setNewsList(filteredList)
    } catch {
      setError('Failed to load news data')
    } finally {
      setLoadingNews(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

  const handleToggleBreaking = async (id: string, currentVal: boolean) => {
    try {
      const token = cacheManager.getAccessToken()
      if (!token) return
      const res = await fetch(`/api/v1/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isBreaking: !currentVal })
      })
      if (res.ok) {
        setNewsList(prev => prev.map(n => n.id === id ? { ...n, is_breaking: !currentVal, isBreaking: !currentVal } : n))
        setSuccessMsg(`Breaking news ${!currentVal ? 'enabled ⚡' : 'disabled'}`)
        setTimeout(() => setSuccessMsg(''), 2500)
      }
    } catch (e) {
      console.error('Failed to toggle breaking news:', e)
    }
  }

  const handleDelete = async (id: string) => {
    setShowConfirm(null)
    setDeletingId(id)
    setError('')
    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Not authenticated')
      const res = await fetch(`/api/v1/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setSuccessMsg('Article deleted successfully')
      setTimeout(() => setSuccessMsg(''), 3000)
      await fetchData()
    } catch {
      setError('Failed to delete article. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // Extract unique category names for the category filter dropdown
  const uniqueCategories = Array.from(
    new Set(newsList.map(n => n.category?.name).filter(Boolean))
  )

  // Filter & Sort Pipeline
  const processedNews = newsList
    .filter(n => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'all' || n.category?.name === selectedCategory

      const matchesStatus =
        selectedStatus === 'all' || n.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'views') return (b.views_count || 0) - (a.views_count || 0)
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title)
      if (sortBy === 'title_desc') return b.title.localeCompare(a.title)
      return 0
    })

  if (!mounted) return null

  return (
    <div className="space-y-6 font-sans text-zinc-200 antialiased">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" /> News Management
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Manage and publish news articles across categories</p>
        </div>
        <Link
          href="/admin/news/create"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs rounded-lg transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Create News
        </Link>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs font-medium">
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-lg text-red-300 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Filter, Search & Sort Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-b from-zinc-900/60 to-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 shadow-sm">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headline..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/80 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/80 transition cursor-pointer"
          >
            <option value="all" className="bg-zinc-900 text-zinc-200">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-zinc-900 text-zinc-200 py-1">
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/80 transition cursor-pointer"
          >
            <option value="all" className="bg-zinc-900 text-zinc-200">All Status</option>
            <option value="published" className="bg-zinc-900 text-zinc-200">Published</option>
            <option value="draft" className="bg-zinc-900 text-zinc-200">Draft</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/80 transition cursor-pointer"
          >
            <option value="newest" className="bg-zinc-900 text-zinc-200">Sort: Newest First</option>
            <option value="oldest" className="bg-zinc-900 text-zinc-200">Sort: Oldest First</option>
            <option value="views" className="bg-zinc-900 text-zinc-200">Sort: Most Viewed</option>
            <option value="title_asc" className="bg-zinc-900 text-zinc-200">Sort: Title (A-Z)</option>
            <option value="title_desc" className="bg-zinc-900 text-zinc-200">Sort: Title (Z-A)</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        {loadingNews ? (
          <div className="p-8 text-center text-zinc-500 text-xs">Loading articles...</div>
        ) : processedNews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs font-medium">No news articles found</p>
            <p className="text-zinc-600 text-[11px]">Try adjusting your search filter or category selection</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300 min-w-[700px]">
              <thead className="bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Article Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Breaking Ticker</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {processedNews.map((item) => {
                  const isBreaking = !!(item.is_breaking || item.isBreaking)

                  return (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-zinc-800 border border-zinc-700/60 text-zinc-300 rounded text-[10px] font-mono">
                          {item.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === 'published'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleBreaking(item.id, isBreaking)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border transition cursor-pointer shadow-xs ${
                            isBreaking
                              ? 'bg-red-950/80 text-red-400 border-red-800/80 hover:bg-red-900/90 ring-1 ring-red-800/50'
                              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                          }`}
                          title="Click to toggle breaking news ticker on main site"
                        >
                          <span>{isBreaking ? '⚡ Breaking' : 'Off'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{item.views_count || 0}</td>
                      <td className="py-3 px-4 text-zinc-400 text-[11px]">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    <td className="py-3 px-4 text-right">
                      {showConfirm === item.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[10px] text-red-400 font-medium">Confirm?</span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px]"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/news/edit/${item.id}`)}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
                            title="Edit Article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setShowConfirm(item.id)}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 transition"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
