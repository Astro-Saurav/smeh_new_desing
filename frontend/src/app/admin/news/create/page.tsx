'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cacheManager } from '@/lib/cache-manager'
import { FileText, ArrowLeft, Maximize2, Minimize2, ChevronDown, Upload, Image as ImageIcon, Sparkles, Send, Paperclip, Video } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug?: string
}

const FONTS = ['Inter', 'Playfair Display', 'Merriweather', 'Lato', 'Source Serif 4']

export default function CreateNewsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
    titleFont: 'Inter',
    excerptFont: 'Inter',
    contentFont: 'Inter',
    authorName: '',
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
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
      
      const filtered = list.filter((cat: Category) => 
        cat.slug !== 'photo-gallery' && 
        cat.slug !== 'gallery' && 
        !cat.name?.toLowerCase().includes('gallery')
      )
      
      setCategories(filtered)
      if (filtered.length > 0) {
        setFormData(prev => ({ ...prev, category_id: prev.category_id || filtered[0].id }))
      }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.title.trim()) throw new Error('Article Headline Title is required')
      if (!formData.category_id) throw new Error('Please select a news category')

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
        isBreaking: formData.is_breaking,
        thumbnailMediaId,
        documentMediaId,
        titleFont: formData.titleFont,
        excerptFont: formData.excerptFont,
        contentFont: formData.contentFont,
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
        throw new Error(errorData.message || 'Failed to publish news article')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/news')
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) return null

  return (
    <div className="space-y-6 font-sans antialiased text-zinc-200 pb-16">
      
      {/* Editorial Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
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
              <span>Editorial Publishing Studio</span>
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">Compose, format, and publish news stories</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-lg transition"
          >
            Discard
          </Link>
          <button
            type="button"
            onClick={(e) => {
              const form = document.getElementById('article-form') as HTMLFormElement
              if (form) form.requestSubmit()
            }}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition shadow-md flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/50 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2">
          ✅ Article published successfully! Redirecting to news management...
        </div>
      )}

      {/* 2-COLUMN EDITORIAL STUDIO LAYOUT */}
      <form id="article-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── LEFT COLUMN: MAIN EDITORIAL CONTENT (8 COLS) ─── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Article Container */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
            
            {/* Prominent Headline Input */}
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
                placeholder="Write a concise overview summary for the news feed card..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/80 resize-none transition leading-relaxed"
              />
            </div>

            {/* Rich Content Area with Expansion Control */}
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
                placeholder="Write or paste full article body story here (supports Markdown / HTML)..."
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

            {/* Category Dropdown (Excludes Gallery) */}
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
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Breaking News Toggle */}
            <div className="p-3 bg-zinc-950/90 border border-zinc-800 rounded-xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>Mark as Breaking News</span>
                </div>
                <div className="text-[10px] text-zinc-400">Display story on top Breaking News Bar</div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_breaking: !prev.is_breaking }))}
                className={`w-10 h-5 rounded-full transition-colors relative shadow-inner p-0.5 cursor-pointer ${
                  formData.is_breaking ? 'bg-red-600' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                    formData.is_breaking ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Author Credit */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">Author Credit (Optional)</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="E.g., Student Reporter"
                maxLength={100}
                className="w-full px-3.5 py-2 bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/80 transition"
              />
            </div>
          </div>

          {/* Featured Cover Image Upload Dropzone */}
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
            {preview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 mt-2">
                <img src={preview} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500">Recommended 16:9 ratio image saved to `/uploads/news/`</p>
            )}
          </div>

          {/* Attachments & Embeds */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800/80 pb-2">
              Media Attachments
            </h3>

            {/* Document */}
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

            {/* Video Link */}
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

          {/* Typography Fonts Card */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Font Styling
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Headline Font</label>
                <div className="relative">
                  <select
                    name="titleFont"
                    value={formData.titleFont}
                    onChange={handleInputChange}
                    className="w-full appearance-none pl-3 pr-8 py-1.5 bg-zinc-950/90 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none cursor-pointer"
                  >
                    {FONTS.map(f => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
                  </select>
                  <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">Content Font</label>
                <div className="relative">
                  <select
                    name="contentFont"
                    value={formData.contentFont}
                    onChange={handleInputChange}
                    className="w-full appearance-none pl-3 pr-8 py-1.5 bg-zinc-950/90 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none cursor-pointer"
                  >
                    {FONTS.map(f => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
                  </select>
                  <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
