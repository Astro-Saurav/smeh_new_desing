'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cacheManager } from '@/lib/cache-manager'
import { Image as ImageIcon, ArrowLeft, Trash2, Plus, Sparkles, ChevronDown } from 'lucide-react'

export default function CreateGalleryAlbumPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [galleryCategoryId, setGalleryCategoryId] = useState<string>('')

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'published',
    authorName: '',
  })

  const [albumImages, setAlbumImages] = useState<{ file?: File; preview: string }[]>([])

  useEffect(() => {
    fetchGalleryCategory()
  }, [])

  const fetchGalleryCategory = async () => {
    try {
      const res = await fetch('/api/v1/categories')
      const data = await res.json()
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
      let galCat = list.find((c: any) => c.slug === 'photo-gallery' || c.slug === 'gallery' || c.name?.toLowerCase().includes('gallery'))
      if (galCat?.id) {
        setGalleryCategoryId(galCat.id)
      }
    } catch (err) {
      console.error('Failed to fetch category:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.title.trim()) throw new Error('Album Title is required')
      if (!galleryCategoryId) throw new Error('Photo Gallery category not found')

      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      let thumbnailMediaId = null
      const thumbnailInput = document.getElementById('cover_input') as HTMLInputElement
      if (thumbnailInput && thumbnailInput.files && thumbnailInput.files[0]) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', thumbnailInput.files[0])

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
        } else {
          const errData = await uploadRes.json().catch(() => ({}))
          throw new Error(errData.message || `Cover image upload failed (${uploadRes.status})`)
        }
      }

      const imagesMediaIds: string[] = []
      if (albumImages.length > 0) {
        for (const item of albumImages) {
          if (item.file) {
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
            } else {
              const errData = await uploadRes.json().catch(() => ({}))
              throw new Error(errData.message || `Album photo upload failed (${uploadRes.status})`)
            }
          }
        }
      }

      if (!thumbnailMediaId && imagesMediaIds.length > 0) {
        thumbnailMediaId = imagesMediaIds[0]
      }

      const submitData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        categoryId: galleryCategoryId,
        status: formData.status,
        thumbnailMediaId,
        ...(imagesMediaIds.length > 0 && { imagesMediaIds }),
        authorName: formData.authorName || null,
      }

      const res = await fetch('/api/v1/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create gallery album')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/gallery')
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans antialiased text-zinc-200 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-500" /> Create Gallery Album
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">Publish a new photo album collection</p>
        </div>
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-lg transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-lg text-red-300 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs font-medium">
          ✅ Gallery album created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-800/80 rounded-xl p-6 shadow-sm space-y-5">
        
        {/* Album Title */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Album Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter album title"
            className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition"
            required
          />
        </div>

        {/* Status & Credit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Publish Status
            </label>
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
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Photographer / Credit (Optional)
            </label>
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
              placeholder="Photographer or source credit"
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Album Summary (Optional)
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            placeholder="Brief overview of photos in this album"
            rows={2}
            className="w-full px-3.5 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition resize-none"
          />
        </div>

        {/* Album Cover Thumbnail */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Cover Thumbnail (Optional)
          </label>
          <input
            id="cover_input"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 text-xs focus:outline-none focus:border-red-500/80 transition cursor-pointer"
          />
          {preview && (
            <img src={preview} alt="Cover Preview" className="w-full h-32 object-cover rounded-lg mt-2 border border-zinc-800" />
          )}
        </div>

        {/* Multi-Photo Uploader */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium text-white flex items-center gap-2">
                <span>🖼️ Album Photos</span> <span className="text-zinc-500 font-mono text-[11px]">({albumImages.length} selected)</span>
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
            <div className="border border-dashed border-zinc-800 rounded-lg p-6 text-center text-zinc-500 text-xs font-normal">
              No photos added. Click <strong className="text-zinc-300">+ Add Photos</strong> to select image files.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition shadow-sm"
          >
            {loading ? 'Publishing...' : 'Publish Gallery Album'}
          </button>
        </div>
      </form>
    </div>
  )
}
