'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '@/lib/cache-manager'
import { useRouter, useParams } from 'next/navigation'

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    youtube_url: '',
    status: 'published',
  })
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      const catRes = await fetch('/api/v1/categories')
      const catData = await catRes.json()
      setCategories(Array.isArray(catData) ? catData : (Array.isArray(catData?.data) ? catData.data : []))

      // Fetch the specific news article directly
      const newsRes = await fetch(`/api/v1/news/${id}`)
      const newsData = await newsRes.json()
      const article = newsData?.data || null

      if (article) {
          setFormData({
            title: article.title || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            category_id: article.category?.id || article.category_id || '',
            youtube_url: article.youtube_url || '',
            status: article.status || 'published',
          })
      } else {
          setError('Article not found')
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load article data')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Document change handler if needed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required')
      }
      if (!formData.category_id) {
        throw new Error('Category is required')
      }

      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      let thumbnailMediaId = formData.thumbnail_media_id;
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', fileInput.files[0]);
        
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

      let documentMediaId = undefined; // Undefined means it won't overwrite existing if not provided
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
          categoryId: formData.category_id,
          youtubeUrl: formData.youtube_url || null,
          status: formData.status,
          ...(thumbnailMediaId !== undefined && { thumbnailMediaId }),
          ...(documentMediaId !== undefined && { documentMediaId }),
        }),
      })

      if (!response.ok) throw new Error('Failed to update news')

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        router.push('/admin/news')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update news')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">✏️ Edit News</h1>
          <p className="text-zinc-500 mt-1">Update the article details</p>
        </div>
        <button 
          onClick={() => router.push('/admin/news')}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold text-sm transition"
        >
          Back to Upload News
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        {submitted && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded mb-4 text-sm font-semibold animate-pulse">
            Article updated successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded mb-4 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Article title"
              maxLength={200}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none transition"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">{formData.title.length}/200</p>
          </div>

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
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
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

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Summary</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="Brief summary (appears in grid)"
              rows={2}
              maxLength={150}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none resize-none transition"
            />
            <p className="text-xs text-zinc-500 mt-1">{formData.excerpt.length}/150</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Full article content"
              rows={5}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none resize-none font-mono text-xs transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Image</label>
            <input
              id="thumbnail_input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-zinc-400 text-sm focus:border-red-600 focus:outline-none transition"
            />
            <p className="text-xs text-zinc-500 mt-1">Max 5MB • Recommended: 1280x720px</p>
            {preview && (
              <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded mt-2 border border-zinc-700" />
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
            <p className="text-xs text-zinc-500 mt-1">Leave empty to keep existing document. Supports PDF, Word, Excel, PowerPoint, Text, CSV.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">YouTube URL</label>
            <input
              type="url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleInputChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded text-white text-sm placeholder-zinc-600 focus:border-red-600 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold rounded text-sm transition duration-200 mt-4"
          >
            {loading ? 'Updating...' : 'Update Article'}
          </button>
        </form>
      </div>
    </div>
  )
}
