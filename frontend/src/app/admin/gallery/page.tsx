'use client'

import { useState, useEffect, useCallback } from 'react'
import { cacheManager } from '@/lib/cache-manager'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Image as ImageIcon, Plus, Trash2, Edit3, Layers } from 'lucide-react'

interface GalleryAlbumItem {
  id: string
  title: string
  excerpt?: string
  status: string
  created_at: string
  thumbnail?: {
    file_path?: string
  }
  images?: Array<any>
}

export default function GalleryManagementPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [albums, setAlbums] = useState<GalleryAlbumItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/news?category=photo-gallery&pageSize=100')
      const data = await res.json()
      setAlbums(Array.isArray(data.data) ? data.data : [])
    } catch {
      setError('Failed to load gallery albums')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

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
      setSuccessMsg('Gallery album deleted successfully')
      setTimeout(() => setSuccessMsg(''), 3000)
      await fetchData()
    } catch {
      setError('Failed to delete album. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const getImgUrl = (path?: string) => {
    if (!path) return '/placeholder-news.jpg'
    if (path.startsWith('http') || path.startsWith('/')) return path
    return `/uploads/${path}`
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 font-sans text-zinc-200 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-500" /> Photo Gallery Albums
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Manage photo collections and multi-image uploads</p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs rounded-lg transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Create Album
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

      {/* Gallery Cards Grid */}
      <div>
        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            Loading photo gallery albums...
          </div>
        ) : albums.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No gallery albums created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map((album) => {
              const photoCount = album.images && album.images.length > 0 ? album.images.length : 1
              const coverUrl = getImgUrl(album.thumbnail?.file_path)

              return (
                <div
                  key={album.id}
                  className={`group bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm hover:border-zinc-700/80 transition-all flex flex-col justify-between ${
                    deletingId === album.id ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                    <img
                      src={coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-news.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-2.5 right-2.5 bg-zinc-900/90 text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded border border-zinc-700/60 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-red-400" />
                      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                    </div>

                    <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded border border-emerald-800/40">
                      {album.status}
                    </div>
                  </div>

                  {/* Album Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-medium text-xs md:text-sm line-clamp-2 leading-snug">
                        {album.title}
                      </h3>
                      {album.excerpt && (
                        <p className="text-zinc-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">{album.excerpt}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>{new Date(album.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => router.push(`/admin/gallery/edit/${album.id}`)}
                          className="px-2.5 py-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium rounded transition text-[11px] flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => setShowConfirm(album.id)}
                          className="px-2.5 py-1 bg-zinc-800/80 hover:bg-red-950/50 hover:text-red-400 text-zinc-300 font-medium rounded transition text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-white font-semibold text-sm mb-1.5">Delete Album?</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-5">
              Are you sure you want to delete this album?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDelete(showConfirm)}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-lg transition"
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
