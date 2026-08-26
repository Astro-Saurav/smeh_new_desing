'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { cacheManager } from '@/lib/cache-manager'
import { FileText, ArrowLeft, Maximize2, Minimize2, ChevronDown, Upload, Image as ImageIcon, Sparkles, Save, Paperclip, Video } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug?: string
}

const FONTS = ['Inter', 'Playfair Display', 'Merriweather', 'Lato', 'Source Serif 4']

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [isContentExpanded, setIsContentExpanded] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    youtube_url: '',
    status: 'published',
    is_breaking: false,
    thumbnail_media_id: undefined as string | undefined,
    titleFont: 'Inter',
    excerptFont: 'Inter',
    contentFont: 'Inter',
    authorName: '',
  })

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [id])

  async function fetchData() {
    try {
      const catRes = await fetch('/api/v1/categories')
      const catData = await catRes.json()
      const list = Array.isArray(catData) ? catData : (Array.isArray(catData?.data) ? catData.data : [])
      
      const filtered = list.filter((cat: Category) => 
        cat.slug !== 'photo-gallery' && 
        cat.slug !== 'gallery' && 
        !cat.name?.toLowerCase().includes('gallery')
      )

      setCategories(filtered)

      const token = localStorage.getItem('token') || ''
      const newsRes = await fetch(`/api/v1/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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
            is_breaking: !!(article.is_breaking || article.isBreaking),
            thumbnail_media_id: article.thumbnail_media_id || undefined,
            titleFont: article.title_font || 'Inter',
            excerptFont: article.excerpt_font || 'Inter',
            contentFont: article.content_font || 'Inter',
            authorName: article.author_name || '',
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
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.title.trim()) throw new Error('Article Headline Title is required')
      if (!formData.category_id) throw new Error('Please select a news category')

      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      let thumbnailMediaId = formData.thumbnail_media_id
      const thumbnailInput = document.getElementById('thumbnail_input') as HTMLInputElement
      if (thumbnailInput && thumbnailInput.files && thumbnailInput.files[0]) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', thumbnailInput.files[0])

        const uploadRes = await fetch(`/api/v1/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        })
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}))
          throw new Error(`Image upload failed: ${errData.message || uploadRes.statusText}`)
        }
        const uploadData = await uploadRes.json()
        if (uploadData.data && uploadData.data.id) {
          thumbnailMediaId = uploadData.data.id
        }
      }

      let documentMediaId = undefined
      const documentInput = document.getElementById('document_input') as HTMLInputElement
      if (documentInput && documentInput.files && documentInput.files[0]) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', documentInput.files[0])

        const uploadRes = await fetch(`/api/v1/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        })
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}))
          throw new Error(`Document upload failed: ${errData.message || uploadRes.statusText}`)
        }
        const uploadData = await uploadRes.json()
        if (uploadData.data && uploadData.data.id) {
          documentMediaId = uploadData.data.id
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
          isBreaking: formData.is_breaking,
          ...(thumbnailMediaId !== undefined && { thumbnailMediaId }),
          ...(documentMediaId !== undefined && { documentMediaId }),
          titleFont: formData.titleFont,
          excerptFont: formData.excerptFont,
          contentFont: formData.contentFont,
          authorName: formData.authorName || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update article')

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        router.push('/admin/news')
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6 font-sans antialiased text-zinc-200 pb-16">
      
      {/* Editorial Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="p-2 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
            title="Back to news"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Edit Article Studio</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">Update headline, story body, and media attachments</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/admin/news"
            className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-lg transition"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => {
              const form = document.getElementById('edit-article-form') as HTMLFormElement
              if (form) form.requestSubmit()
            }}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
          ✅ Article updated successfully! Redirecting...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/50 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* 2-COLUMN EDITORIAL STUDIO LAYOUT */}
      <form id="edit-article-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── LEFT COLUMN: MAIN EDITORIAL CONTENT (8 COLS) ─── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Article Container */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
            
            {/* Headline Title */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Headline Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Type article headline title..."
                className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-white text-base md:text-lg font-bold placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition"
                required
              />
            </div>

            {/* Subtitle / Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Subtitle / Summary Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Write a concise overview summary..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/80 resize-none transition leading-relaxed"
              />
            </div>

            {/* Rich Content Area */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Full Article Content
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">({formData.content.length} chars)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContentExpanded(!isContentExpanded)}
                  className="text-[11px] text-zinc-300 hover:text-white flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1 rounded-md transition border border-zinc-700/60 cursor-pointer"
                >
                  {isContentExpanded ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Standard View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Expand Workspace</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Full article body story..."
                style={{ height: isContentExpanded ? '600px' : '380px' }}
                className="w-full px-4 py-3.5 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs md:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition-all duration-300 font-mono leading-relaxed resize-y"
              />
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: PUBLISHING & MEDIA PANEL (4 COLS) ─── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publishing Controls Card */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">
              Publishing Options
            </h3>

            {/* Category Dropdown */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">Category *</label>
              <div className="relative">
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/80 transition cursor-pointer"
                  required
                >
                  <option value="" className="bg-zinc-900 text-zinc-500">Select news category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-zinc-900 text-zinc-200 py-1">{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">Publish Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500/80 transition cursor-pointer"
                >
                  <option value="published" className="bg-zinc-900 text-zinc-200 py-1">Published (Live)</option>
                  <option value="draft" className="bg-zinc-900 text-zinc-200 py-1">Draft</option>
                </select>
              </div>
            </div>

            {/* Breaking News Toggle */}
            <div className="pt-2 border-t border-zinc-800/60">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
                    ⚡ Breaking News
                  </label>
                  <p className="text-[10px] text-zinc-500">Show on main website ticker</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_breaking: !prev.is_breaking }))}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.is_breaking ? 'bg-red-600' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      formData.is_breaking ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Author Credit */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">Author Credit (Optional)</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="Author name"
                maxLength={100}
                className="w-full px-3.5 py-2 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition"
              />
            </div>
          </div>

          {/* Cover Image Upload Dropzone */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-red-400" />
              <span>Cover Image</span>
            </h3>

            <input
              id="thumbnail_input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 text-xs focus:outline-none focus:border-red-500/80 transition cursor-pointer"
            />
            {preview && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 mt-2">
                <img src={preview} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Attachments & Embeds */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">
              Media Attachments
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 flex items-center gap-1">
                <Paperclip className="w-3 h-3 text-zinc-400" /> Document (PDF / Office)
              </label>
              <input
                id="document_input"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                className="w-full px-3 py-2 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 text-xs focus:outline-none focus:border-red-500/80 transition cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 flex items-center gap-1">
                <Video className="w-3 h-3 text-zinc-400" /> YouTube Embed Link
              </label>
              <input
                type="url"
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition"
              />
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
