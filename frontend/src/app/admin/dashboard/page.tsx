'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
    views: 0,
  })
  const [recentNews, setRecentNews] = useState<any[]>([])
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
      const totalViews = newsList.reduce((sum: number, n: any) => sum + (n.views_count || 0), 0)
      
      setStats({
        total: newsList.length,
        published: newsList.filter((n: any) => n.status === 'published').length,
        draft: newsList.filter((n: any) => n.status === 'draft').length,
        scheduled: newsList.filter((n: any) => n.status === 'scheduled').length,
        views: totalViews,
      })

      setRecentNews(
        newsList
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      )
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  if (!mounted) return null

  return (
    <div className="w-full space-y-8 pb-8">
      {/* SECTION 1: KPI METRICS - EQUAL WIDTH CARDS */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <KPICard
            label="Total Articles"
            value={stats.total}
            bgGradient="from-red-600 to-red-700"
            borderColor="border-red-500"
          />
          <KPICard
            label="Published"
            value={stats.published}
            bgGradient="from-green-600 to-green-700"
            borderColor="border-green-500"
          />
          <KPICard
            label="Drafts"
            value={stats.draft}
            bgGradient="from-yellow-600 to-yellow-700"
            borderColor="border-yellow-500"
          />
          <KPICard
            label="Scheduled"
            value={stats.scheduled}
            bgGradient="from-blue-600 to-blue-700"
            borderColor="border-blue-500"
          />
          <KPICard
            label="Total Views"
            value={stats.views.toLocaleString()}
            bgGradient="from-purple-600 to-purple-700"
            borderColor="border-purple-500"
          />
        </div>
      </div>

      {/* SECTION 2: QUICK ACTIONS */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/news"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-4 px-6 rounded-lg transition text-center"
          >
            📰 Upload News
          </a>
          <a
            href="/admin/categories"
            className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold py-4 px-6 rounded-lg transition text-center"
          >
            📁 Categories
          </a>
          <a
            href="/admin/settings"
            className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold py-4 px-6 rounded-lg transition text-center"
          >
            ⚙️ Settings
          </a>
        </div>
      </div>

      {/* SECTION 3: RECENT UPLOADS */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Recent Uploads</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {recentNews.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <p className="text-sm">No articles yet. Start by uploading your first news article.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/50">
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase text-zinc-300">Title</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase text-zinc-300">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase text-zinc-300">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase text-zinc-300">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {recentNews.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition">
                      <td className="px-6 py-4 text-sm text-white font-medium">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
                          {item.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded ${
                            item.status === 'published'
                              ? 'bg-green-900/50 text-green-300'
                              : item.status === 'draft'
                              ? 'bg-yellow-900/50 text-yellow-300'
                              : 'bg-blue-900/50 text-blue-300'
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-right px-6 py-4 text-sm text-zinc-400">
                        👁️ {item.views_count?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: CONTENT STATUS */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Content Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard
            label="Published"
            icon="✓"
            count={stats.published}
            total={stats.total}
            color="green"
            bgColor="bg-green-900/20"
            textColor="text-green-300"
          />
          <StatusCard
            label="Draft"
            icon="📋"
            count={stats.draft}
            total={stats.total}
            color="yellow"
            bgColor="bg-yellow-900/20"
            textColor="text-yellow-300"
          />
          <StatusCard
            label="Scheduled"
            icon="⏱️"
            count={stats.scheduled}
            total={stats.total}
            color="blue"
            bgColor="bg-blue-900/20"
            textColor="text-blue-300"
          />
        </div>
      </div>

      {/* SECTION 5: WORKFLOW GUIDE */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <TipCard
            step="1"
            title="Create Article"
            description="Upload your first news article with title, content, and category."
            icon="📝"
          />
          <TipCard
            step="2"
            title="Organize Categories"
            description="Set up and manage news categories for better organization."
            icon="📂"
          />
        </div>
      </div>
    </div>
  )
}

// KPI CARD COMPONENT
function KPICard({
  label,
  value,
  bgGradient,
  borderColor,
}: {
  label: string
  value: string | number
  bgGradient: string
  borderColor: string
}) {
  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} rounded-lg p-6 border-l-4 ${borderColor} flex flex-col justify-between h-full min-h-[120px]`}
    >
      <p className="text-xs font-bold uppercase text-white/70 mb-3">{label}</p>
      <p className="text-4xl font-black text-white">{value}</p>
    </div>
  )
}

// STATUS CARD COMPONENT
function StatusCard({
  label,
  icon,
  count,
  total,
  color,
  bgColor,
  textColor,
}: {
  label: string
  icon: string
  count: number
  total: number
  color: string
  bgColor: string
  textColor: string
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className={`${bgColor} border border-${color}-800 rounded-lg p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-zinc-300 mb-1">{label}</p>
          <p className={`text-3xl font-black ${textColor}`}>{count}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 bg-${color}-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className={`text-xs ${textColor} mt-2`}>{percentage}% of total</p>
    </div>
  )
}

// TIP CARD COMPONENT
function TipCard({
  step,
  title,
  description,
  icon,
}: {
  step: string
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="p-6 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 text-3xl">{icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full">
              {step}
            </span>
            <h4 className="font-bold text-white text-sm">{title}</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
