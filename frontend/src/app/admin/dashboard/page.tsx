'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  CheckCircle2, 
  Edit3, 
  Image as ImageIcon, 
  Eye,
  ArrowUpRight,
  Plus,
  GraduationCap
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
    views: 0,
    galleryCount: 0
  })
  const [recentNews, setRecentNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/news?pageSize=100')
      const data = await res.json()
      const newsList = Array.isArray(data.data) ? data.data : []
      const totalViews = newsList.reduce((sum: number, n: any) => sum + (n.views_count || 0), 0)
      
      setStats({
        total: newsList.length,
        published: newsList.filter((n: any) => n.status === 'published').length,
        draft: newsList.filter((n: any) => n.status === 'draft').length,
        scheduled: newsList.filter((n: any) => n.status === 'scheduled').length,
        views: totalViews,
        galleryCount: newsList.filter((n: any) => n.category?.slug === 'photo-gallery' || n.category?.slug === 'gallery').length
      })

      setRecentNews(
        newsList
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      )
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-sans antialiased text-zinc-200 select-none pb-20">
      
      {/* ─── OFFICIAL UNIVERSITY HERO BANNER ─── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-700/60 rounded-2xl p-5 sm:p-8 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 shadow-[0_0_10px_#dc2626]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 inline" /> SMeH Official Media Bureau
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              Manav Rachna Times Press Portal
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Overview of published news, draft press releases, photo gallery collections, and reader analytics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Link
              href="/admin/news/create"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-[0_4px_0_0_#991b1b,0_6px_15px_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Article</span>
            </Link>
            <Link
              href="/admin/gallery/create"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl border border-zinc-800 shadow-sm transition cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-red-500" />
              <span>Create Photo Album</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── SUMMARY STATS METERS ─── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-400">
            Publication Summary & Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <KPICard
            label="Total Articles"
            value={loading ? "..." : stats.total}
            icon={<FileText className="w-4 h-4 text-red-500" />}
          />
          <KPICard
            label="Published Live"
            value={loading ? "..." : stats.published}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          />
          <KPICard
            label="Drafts in Review"
            value={loading ? "..." : stats.draft}
            icon={<Edit3 className="w-4 h-4 text-amber-400" />}
          />
          <KPICard
            label="Photo Albums"
            value={loading ? "..." : stats.galleryCount}
            icon={<ImageIcon className="w-4 h-4 text-rose-400" />}
          />
          <KPICard
            label="Reader Views"
            value={loading ? "..." : stats.views.toLocaleString()}
            icon={<Eye className="w-4 h-4 text-cyan-400" />}
            className="col-span-2 sm:col-span-1"
          />
        </div>
      </div>

      {/* ─── RECENT ARTICLES TABLE & MOBILE CARDS ─── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h2 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-400">
            Recent Press Releases & News
          </h2>
          <Link
            href="/admin/news"
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition"
          >
            <span>View All</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-md">
          {loading ? (
            <div className="p-8 sm:p-12 text-center text-zinc-500 text-xs animate-pulse">
              Loading recent articles...
            </div>
          ) : recentNews.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-zinc-500 text-xs">
              No articles published yet. Click "Publish New Article" to create your first story!
            </div>
          ) : (
            <div>
              {/* ─── MOBILE CARD VIEW (< 768px) ─── */}
              <div className="md:hidden divide-y divide-zinc-800/80">
                {recentNews.map((item) => (
                  <div key={item.id} className="p-4 space-y-2.5 hover:bg-zinc-800/30 transition">
                    <h3 className="font-bold text-white text-xs sm:text-sm leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700/60 text-zinc-300 rounded font-mono text-[10px]">
                          {item.category?.name || 'General'}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            item.status === 'published'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <span className="text-zinc-400 font-mono font-bold text-[10px]">
                        👁 {item.views_count?.toLocaleString() || 0} views
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── DESKTOP TABLE VIEW (>= 768px) ─── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/90 bg-zinc-950/80 text-zinc-400 font-extrabold text-[10px] uppercase tracking-wider">
                      <th className="px-5 py-3.5">Article Title</th>
                      <th className="px-5 py-3.5">Category Desk</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {recentNews.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                        <td className="px-5 py-4 font-bold text-white max-w-sm truncate">
                          {item.title}
                        </td>
                        <td className="px-5 py-4 text-zinc-400 font-medium">
                          {item.category?.name || 'General'}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              item.status === 'published'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-zinc-300">
                          {item.views_count?.toLocaleString() || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

function KPICard({ label, value, icon, className = "" }: { label: string; value: string | number; icon: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_6px_16px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">{label}</span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-950 border border-zinc-800 shadow-inner flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow">{value}</div>
    </div>
  )
}
