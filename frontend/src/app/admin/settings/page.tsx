'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '@/lib/cache-manager'
import { 
  KeyRound, 
  Globe, 
  Sliders, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck, 
  Radio,
  Share2,
  Instagram,
  Linkedin,
  Youtube,
  Twitter
} from 'lucide-react'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 1. Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  // 2. Website Info State
  const [siteName, setSiteName] = useState('Manav Rachna Times')
  const [siteTagline, setSiteTagline] = useState('The Official Voice of School of Media Studies & Humanities (SMeH)')
  const [contactEmail, setContactEmail] = useState('editor@manavrachnatimes.com')
  const [enableBreakingTicker, setEnableBreakingTicker] = useState(true)

  // 3. Social Media Links State
  const [instagramUrl, setInstagramUrl] = useState('')
  const [xUrl, setXUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  // 4. Website Preferences State
  const [defaultPublishState, setDefaultPublishState] = useState<'published' | 'draft'>('published')
  const [pageSize, setPageSize] = useState('20')
  const [allowDownloads, setAllowDownloads] = useState(true)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('mrt_newsroom_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.siteName) setSiteName(parsed.siteName)
        if (parsed.siteTagline) setSiteTagline(parsed.siteTagline)
        if (parsed.contactEmail) setContactEmail(parsed.contactEmail)
        if (typeof parsed.enableBreakingTicker === 'boolean') setEnableBreakingTicker(parsed.enableBreakingTicker)
        if (parsed.instagramUrl !== undefined) setInstagramUrl(parsed.instagramUrl)
        if (parsed.xUrl !== undefined) setXUrl(parsed.xUrl)
        if (parsed.linkedinUrl !== undefined) setLinkedinUrl(parsed.linkedinUrl)
        if (parsed.youtubeUrl !== undefined) setYoutubeUrl(parsed.youtubeUrl)
        if (parsed.defaultPublishState) setDefaultPublishState(parsed.defaultPublishState)
        if (parsed.pageSize) setPageSize(parsed.pageSize)
        if (typeof parsed.allowDownloads === 'boolean') setAllowDownloads(parsed.allowDownloads)
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }, [])

  const toggleTicker = (newVal: boolean) => {
    setEnableBreakingTicker(newVal)
    try {
      const saved = localStorage.getItem('mrt_newsroom_settings')
      const parsed = saved ? JSON.parse(saved) : {}
      parsed.enableBreakingTicker = newVal
      localStorage.setItem('mrt_newsroom_settings', JSON.stringify(parsed))
      window.dispatchEvent(new Event('mrt_settings_changed'))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const settings = {
        siteName,
        siteTagline,
        contactEmail,
        enableBreakingTicker,
        instagramUrl,
        xUrl,
        linkedinUrl,
        youtubeUrl,
        defaultPublishState,
        pageSize,
        allowDownloads
      }
      localStorage.setItem('mrt_newsroom_settings', JSON.stringify(settings))
      window.dispatchEvent(new Event('mrt_settings_changed'))
      setMessage({ type: 'success', text: 'Website information, social links, and preferences saved successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings.' })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }

    try {
      setLoading(true)
      const token = cacheManager.getAccessToken()
      if (!token) {
        setMessage({ type: 'error', text: 'Please log in first.' })
        return
      }

      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!res.ok) throw new Error('Password change failed. Please check your current password.')

      setMessage({ type: 'success', text: 'Your password has been changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password.' })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 max-w-4xl font-sans text-zinc-200 antialiased pb-20 select-none">
      
      {/* ─── HEADER BANNER ─── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-700/60 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 shadow-[0_0_10px_#dc2626]" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-red-500">
              Admin Controls
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings & Account
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Manage your admin password, website information, official social media links, and general preferences.
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md border ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
              : 'bg-red-950/80 border-red-700/80 text-red-300'
          }`}
        >
          <span>{message.type === 'success' ? '✅' : '⚠️'} {message.text}</span>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* ─── SECTION 1: CHANGE PASSWORD ─── */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 border border-red-500/40 flex items-center justify-center text-white shadow-md">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">Change Password</h2>
            <p className="text-xs text-zinc-400">Update your admin login password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-[0_4px_0_0_#991b1b,0_6px_15px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save New Password'}</span>
          </button>
        </form>
      </div>

      {/* ─── SECTION 2: WEBSITE INFORMATION & PREFERENCES ─── */}
      <form onSubmit={handleSaveInfo} className="space-y-8">
        
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/90 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 border border-red-500/40 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">Website Information</h2>
              <p className="text-xs text-zinc-400">Website title, tagline motto, and contact email</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Website Name *
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white focus:border-red-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white focus:border-red-500 focus:outline-none transition"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Website Tagline / Subtitle *
              </label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white focus:border-red-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Breaking News Ticker Toggle */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Show Breaking News Running Headlines Bar</span>
              </div>
              <div className="text-[11px] text-zinc-400">Display live continuous scrolling news headlines at top of website</div>
            </div>
            <button
              type="button"
              onClick={() => toggleTicker(!enableBreakingTicker)}
              className={`w-12 h-6 rounded-full transition-colors relative shadow-inner p-0.5 cursor-pointer ${
                enableBreakingTicker ? 'bg-red-600' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  enableBreakingTicker ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ─── SECTION 3: OFFICIAL SOCIAL MEDIA LINKS ─── */}
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 border border-red-500/40 flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">Official Social Media Links</h2>
              <p className="text-xs text-zinc-400">Add URLs to display social icons in the website footer. Leave blank to hide an icon.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>Instagram URL</span>
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-700 focus:border-red-500 focus:outline-none transition"
              />
            </div>

            {/* X / Twitter */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-400" />
                <span>X (Twitter) URL</span>
              </label>
              <input
                type="url"
                value={xUrl}
                onChange={(e) => setXUrl(e.target.value)}
                placeholder="https://x.com/yourhandle"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-700 focus:border-red-500 focus:outline-none transition"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-500" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/school/yourhandle"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-700 focus:border-red-500 focus:outline-none transition"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube URL</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] rounded-xl text-xs text-white placeholder-zinc-700 focus:border-red-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: PUBLISHING PREFERENCES ─── */}
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/80">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 border border-red-500/40 flex items-center justify-center text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">Publishing Preferences</h2>
              <p className="text-xs text-zinc-400">Default article options and photo gallery download settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Default Article Status
              </label>
              <select
                value={defaultPublishState}
                onChange={(e) => setDefaultPublishState(e.target.value as 'published' | 'draft')}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none transition cursor-pointer"
              >
                <option value="published">Publish Immediately Live</option>
                <option value="draft">Save as Draft (Review First)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Articles Per Page
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none transition cursor-pointer"
              >
                <option value="10">10 Articles</option>
                <option value="20">20 Articles (Recommended)</option>
                <option value="30">30 Articles</option>
                <option value="50">50 Articles</option>
              </select>
            </div>
          </div>

          {/* Photo Download Toggle */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold text-white">Allow Public Photo Downloads</div>
              <div className="text-[11px] text-zinc-400">Let visitors download photos from the photo gallery</div>
            </div>
            <button
              type="button"
              onClick={() => setAllowDownloads(!allowDownloads)}
              className={`w-12 h-6 rounded-full transition-colors relative shadow-inner p-0.5 cursor-pointer ${
                allowDownloads ? 'bg-red-600' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  allowDownloads ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-[0_4px_0_0_#991b1b,0_6px_15px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Website Info, Socials & Preferences</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  )
}
