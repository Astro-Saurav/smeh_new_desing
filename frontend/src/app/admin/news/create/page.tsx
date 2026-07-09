'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cacheManager } from '@/lib/cache-manager'

interface Category {
  id: string
  name: string
}

export default function CreateNewsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    youtube_url: '',
    status: 'draft',
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    fetchCategories()
  }, [isClient])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []))
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Document change handler if needed for state, currently handled via DOM in submit
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.title.trim()) throw new Error('Title is required')
      if (!formData.category_id) throw new Error('Category is required')

      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      let thumbnailMediaId = null;
      const thumbnailInput = document.getElementById('thumbnail_input') as HTMLInputElement;
      if (thumbnailInput && thumbnailInput.files && thumbnailInput.files[0]) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', thumbnailInput.files[0]);
        
        const uploadRes = await fetch(`/api/v1/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(`Image upload failed: ${errData.message || uploadRes.statusText}`);
        }
        const uploadData = await uploadRes.json();
        if (uploadData.data && uploadData.data.id) {
          thumbnailMediaId = uploadData.data.id;
        }
      }

      let documentMediaId = null;
      const documentInput = document.getElementById('document_input') as HTMLInputElement;
      if (documentInput && documentInput.files && documentInput.files[0]) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', documentInput.files[0]);
        
        const uploadRes = await fetch(`/api/v1/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(`Document upload failed: ${errData.message || uploadRes.statusText}`);
        }
        const uploadData = await uploadRes.json();
        if (uploadData.data && uploadData.data.id) {
          documentMediaId = uploadData.data.id;
        }
      }

      const submitData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        categoryId: formData.category_id,
        youtubeUrl: formData.youtube_url || null,
        status: formData.status,
        thumbnailMediaId,
        documentMediaId,
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
        throw new Error(errorData.message || 'Failed to create news')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/news')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white">✨ Create Article</h1>
            <p className="text-zinc-500 mt-1">Add a new news article to the website</p>
          </div>
          <Link href="/admin/news" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm rounded-lg transition">
            ← Back
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 font-semibold">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-6 font-semibold">
            ✅ Article created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Article title"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none transition"
              required
            />
          </div>

          {/* Category & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Category *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm focus:border-red-600 focus:outline-none transition"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm focus:border-red-600 focus:outline-none transition"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Summary (Optional)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief summary (appears in news grid)"
              rows={2}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none resize-none transition"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Content (Optional)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Full article content"
              rows={10}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none resize-none font-mono transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Thumbnail Image</label>
            <input
              id="thumbnail_input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-zinc-400 text-sm focus:border-red-600 focus:outline-none transition"
            />
            <p className="text-xs text-zinc-500 mt-1">Recommended: 1280×720px • Saved to /uploads/news/</p>
            {preview && (
              <img src={preview} alt="Preview" className="w-full h-28 object-cover rounded mt-3 border border-zinc-700" />
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Attached Document (Optional)</label>
            <input
              id="document_input"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              onChange={handleDocumentChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-zinc-400 text-sm focus:border-red-600 focus:outline-none transition"
            />
            <p className="text-xs text-zinc-500 mt-1">Supports PDF, Word, Excel, PowerPoint, Text, CSV.</p>
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">YouTube URL (Optional)</label>
            <input
              type="url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleInputChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg transition"
            >
              {loading ? 'Creating...' : '✨ Publish Article'}
            </button>
            <Link
              href="/admin/news"
              className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-sm rounded-lg transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
    </div>
  )
}
