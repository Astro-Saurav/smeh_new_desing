'use client'

import { useState, useEffect, useCallback } from 'react'
import { cacheManager } from '@/lib/cache-manager'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
}

interface NewsItem {
  id: string
  title: string
  excerpt?: string
  category: { id: string; name: string }
  status: string
  views_count: number
  created_at: string
}

export default function NewsManagementPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoadingNews(true)
    try {
      const [newsRes, catRes] = await Promise.all([
        fetch('/api/v1/news?pageSize=50'),
        fetch('/api/v1/categories'),
      ])
      const newsData = await newsRes.json()
      const catData = await catRes.json()
      setNewsList(Array.isArray(newsData.data) ? newsData.data : [])
      setCategories(
        Array.isArray(catData) ? catData : Array.isArray(catData?.data) ? catData.data : []
      )
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

  const handleEdit = (id: string) => {
    router.push(`/admin/news/edit/${id}`)
  }

  const confirmDelete = (id: string) => {
    setShowConfirm(id)
  }

  const cancelDelete = () => {
    setShowConfirm(null)
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

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'bg-green-900/60 text-green-300 border border-green-700',
      draft: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
      scheduled: 'bg-blue-900/60 text-blue-300 border border-blue-700',
    }
    return styles[status] ?? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">📰 News Management</h1>
          <p className="text-zinc-500 mt-1">Create and manage news articles</p>
        </div>
        <button
          onClick={() => router.push('/admin/news/create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-lg text-sm transition shadow-lg shadow-red-900/30"
        >
          <span className="text-base">+</span> Create News
        </button>
      </div>

      {/* Toast Messages */}
      {successMsg && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm font-semibold">
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Articles', value: newsList.length, color: 'text-red-400' },
          { label: 'Published', value: newsList.filter((n) => n.status === 'published').length, color: 'text-green-400' },
          { label: 'Drafts', value: newsList.filter((n) => n.status === 'draft').length, color: 'text-yellow-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* News Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-zinc-800/50 border-b border-zinc-800">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Title</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Actions</span>
        </div>

        {/* Table Body */}
        {loadingNews ? (
          <div className="py-16 text-center">
            <div className="inline-block w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-zinc-500 text-sm">Loading articles...</p>
          </div>
        ) : newsList.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-zinc-400 text-lg font-semibold">No articles found</p>
            <p className="text-zinc-600 text-sm mt-1">Click "Create News" to publish your first article</p>
            <button
              onClick={() => router.push('/admin/news/create')}
              className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition"
            >
              + Create News
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {newsList.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-zinc-800/40 transition ${
                  deletingId === item.id ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                {/* Title */}
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate" title={item.title}>
                    {item.title}
                  </p>
                  {item.excerpt && (
                    <p className="text-zinc-500 text-xs mt-0.5 truncate">{item.excerpt}</p>
                  )}
                </div>

                {/* Category */}
                <span className="text-zinc-400 text-sm truncate">{item.category?.name ?? '—'}</span>

                {/* Status */}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${statusBadge(item.status)}`}>
                  {item.status}
                </span>

                {/* Date */}
                <span className="text-zinc-500 text-xs">
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item.id)}
                    className="px-3 py-1.5 bg-blue-900/50 hover:bg-blue-700 text-blue-300 hover:text-white text-xs font-bold rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="px-3 py-1.5 bg-red-900/40 hover:bg-red-700 text-red-400 hover:text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {deletingId === item.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-white font-black text-lg mb-2">🗑️ Delete Article?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              This will permanently delete the article and all its associated images. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(showConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-sm rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
