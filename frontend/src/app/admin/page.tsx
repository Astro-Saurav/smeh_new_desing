'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/v1/news')
      const data = await res.json()
      const newsList = Array.isArray(data.data) ? data.data : []
      setStats({
        total: newsList.length,
        published: newsList.filter((n: any) => n.status === 'published').length,
        draft: newsList.filter((n: any) => n.status === 'draft').length,
      })
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  if (!mounted) return <div className="animate-pulse" />

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-950 border border-blue-700/50 rounded-lg p-6">
          <p className="text-blue-400 text-sm font-bold uppercase mb-2">Total Articles</p>
          <p className="text-4xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-green-950 border border-green-700/50 rounded-lg p-6">
          <p className="text-green-400 text-sm font-bold uppercase mb-2">Published</p>
          <p className="text-4xl font-black text-white">{stats.published}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-950 border border-yellow-700/50 rounded-lg p-6">
          <p className="text-yellow-400 text-sm font-bold uppercase mb-2">Drafts</p>
          <p className="text-4xl font-black text-white">{stats.draft}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/admin/news"
          className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg p-6 text-white font-bold transition group cursor-pointer"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition">📰</div>
          <h3 className="text-xl font-black">Upload News</h3>
          <p className="text-sm text-red-100 mt-2">Create and manage articles</p>
        </a>



        <a
          href="/admin/settings"
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg p-6 text-white font-bold transition group cursor-pointer"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition">⚙️</div>
          <h3 className="text-xl font-black">Settings</h3>
          <p className="text-sm text-blue-100 mt-2">Password & site settings</p>
        </a>
      </div>

      {/* Info Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">📖 Quick Guide</h2>
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            <span className="font-bold">📰 Upload News:</span> Create new articles and assign them to categories
          </p>

          <p>
            <span className="font-bold">⚙️ Settings:</span> Change your password and configure site settings
          </p>
        </div>
      </div>
    </div>
  )
}
