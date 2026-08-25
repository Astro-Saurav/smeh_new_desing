'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { cacheManager } from '@/lib/cache-manager'
import { Image as ImageIcon, ArrowLeft, Plus, Edit3, ChevronDown } from 'lucide-react'

export default function EditGalleryAlbumPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [galleryCategoryId, setGalleryCategoryId] = useState<string>('')

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'published',
    thumbnail_media_id: undefined as string | undefined,
    authorName: '',
  })

  const [albumImages, setAlbumImages] = useState<{ file?: File; preview: string; mediaId?: string }[]>([])

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      const catRes = await fetch('/api/v1/categories')
      const catData = await catRes.json()
      const list = Array.isArray(catData) ? catData : (Array.isArray(catData?.data) ? catData.data : [])
      const galCat = list.find((c: any) => c.slug === 'photo-gallery' || c.slug === 'gallery' || c.name?.toLowerCase().includes('gallery'))
      if (galCat) {
        setGalleryCategoryId(galCat.id)
      }

      const token = localStorage.getItem('token') || ''
      const newsRes = await fetch(`/api/v1/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const newsData = await newsRes.json()
      const article = newsData?.data || null

      if (article) {
        setFormData({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          status: article.status || 'published',
          thumbnail_media_id: article.thumbnail_media_id || undefined,
          authorName: article.author_name || '',
        })

        if (Array.isArray(article.images) && article.images.length > 0) {
          const existingImages = article.images.map((imgItem: any) => {
            const path = imgItem.media?.file_path || ''
            const url = path.startsWith('http') || path.startsWith('/') ? path : `/uploads/${path}`
            return {
              mediaId: imgItem.media?.id || imgItem.media_id,
              preview: url
            }
          })
          setAlbumImages(existingImages)
        }
      } else {
        setError('Gallery album not found')
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load gallery album')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAlbumFilesAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setAlbumImages((prev) => [...prev, ...newItems])
    e.target.value = ''
  }

  const removeAlbumImage = (index: number) => {
    setAlbumImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.title.trim()) throw new Error('Album Title is required')

      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      let thumbnailMediaId = formData.thumbnail_media_id
      const coverInput = document.getElementById('cover_input') as HTMLInputElement
      if (coverInput && coverInput.files && coverInput.files[0]) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', coverInput.files[0])
        const uploadRes = await fetch(`/api/v1/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          if (uploadData.data?.id) {
            thumbnailMediaId = uploadData.data.id
          }
        }
      }

      const imagesMediaIds: string[] = []
      if (albumImages.length > 0) {
        for (const item of albumImages) {
          if (item.mediaId) {
            imagesMediaIds.push(item.mediaId)
          } else if (item.file) {
            const formDataUpload = new FormData()
            formDataUpload.append('file', item.file)
            const uploadRes = await fetch(`/api/v1/upload`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formDataUpload,
            })
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              if (uploadData.data?.id) {
                imagesMediaIds.push(uploadData.data.id)
              }
            }
          }
        }
      }

      const response = await fetch(`/api/v1/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          status: formData.status,
          ...(thumbnailMediaId !== undefined && { thumbnailMediaId }),
          imagesMediaIds,
          authorName: formData.authorName || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update gallery album')

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        router.push('/admin/gallery')
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update album')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans antialiased text-zinc-200 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-red-500" /> Edit Gallery Album
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Manage photo entries and album metadata</p>
        </div>
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-lg transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-800/80 rounded-xl p-6 shadow-sm">
        {submitted && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs font-medium mb-5">
            ✅ Album updated successfully!
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-lg text-red-300 text-xs font-medium mb-5">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Album Title */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Album Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Album title"
              className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/80 transition"
              required
            />
          </div>

          {/* Status & Credit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Publish Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full appearance-none pl-3.5 pr-9 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/80 transition cursor-pointer"
                >
                  <option value="published" className="bg-zinc-900 text-zinc-200 py-1">Published</option>
                  <option value="draft" className="bg-zinc-900 text-zinc-200 py-1">Draft</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Photographer / Credit</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="Source or photographer credit"
                className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500/80 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Description</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Album summary description"
              rows={2}
              className="w-full px-3.5 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-red-500/80 transition resize-none"
            />
          </div>

          {/* Cover Thumbnail */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Cover Thumbnail</label>
            <input
              id="cover_input"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 text-xs focus:outline-none focus:border-red-500/80 transition cursor-pointer"
            />
            {preview && (
              <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2 border border-zinc-800" />
            )}
          </div>

          {/* Album Photos Manager */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-medium text-white flex items-center gap-2">
                  <span>🖼️ Album Photos</span> <span className="text-zinc-500 font-mono text-[11px]">({albumImages.length} photos)</span>
                </h3>
              </div>
              <label className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs rounded-lg cursor-pointer transition flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAlbumFilesAdd}
                  className="hidden"
                />
              </label>
            </div>

            {albumImages.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-2">
                {albumImages.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img src={img.preview} alt={`Album photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAlbumImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600/90 hover:bg-red-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow"
                      title="Remove Photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-800 rounded-lg p-6 text-center text-zinc-500 text-xs">
                No photos in this album. Click <strong className="text-zinc-300">+ Add Photos</strong> to select images.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition shadow-sm"
          >
            {loading ? 'Updating Album...' : 'Save Gallery Album Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
