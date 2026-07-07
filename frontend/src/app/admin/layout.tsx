'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cacheManager } from '@/lib/cache-manager'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
    // Check authentication using secure cache manager
    if (!cacheManager.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    // Clear all secure cache
    cacheManager.clearAuthData()
    window.location.href = '/login'
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return <div />

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* SIDEBAR - ABSOLUTE ON MOBILE, RELATIVE ON DESKTOP */}
      <aside
        data-lenis-prevent="true"
        className={`
          absolute z-50 h-full md:relative flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 overflow-y-auto overscroll-contain
          ${sidebarOpen 
            ? 'translate-x-0 w-64' 
            : '-translate-x-full w-64 md:translate-x-0 md:w-20'}
        `}
      >
        {/* Logo Section - FIXED HEIGHT */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-800 gap-3">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              📰
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-black text-sm truncate">MRT</h2>
              <p className="text-zinc-500 text-xs truncate">Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zinc-400 hover:text-white transition ml-auto flex-shrink-0"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Navigation Menu - FLEX-1 SCROLLABLE */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <NavItem
            href="/admin"
            icon="📊"
            label="Dashboard"
            open={sidebarOpen}
          />
          <NavItem
            href="/admin/news"
            icon="📰"
            label="Upload News"
            open={sidebarOpen}
          />
          <NavItem
            href="/admin/settings"
            icon="⚙️"
            label="Settings"
            open={sidebarOpen}
          />
        </nav>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Footer Menu - COMPACT */}
        <div className="px-2 py-2 space-y-1 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1.5 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white transition text-xs"
            title="Back to site"
          >
            <span className="text-sm flex-shrink-0">🏠</span>
            {sidebarOpen && <span className="font-medium truncate">Home</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-red-400 hover:bg-red-900/20 hover:text-red-300 transition text-xs"
            title="Logout"
          >
            <span className="text-sm flex-shrink-0">🚪</span>
            {sidebarOpen && <span className="font-medium truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT - FLEX-1, NO MARGIN (SIDEBAR HANDLES LAYOUT) */}
      <div className="flex-1 flex flex-col bg-zinc-950 min-w-0">
        {/* TOP BAR - FIXED HEIGHT */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 md:px-6 justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-white font-black text-xl">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-semibold">Admin</p>
              <p className="text-zinc-500 text-xs">admin@mrt.local</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT AREA - FLEX-1 SCROLLABLE WITH CONSISTENT PADDING */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950 overscroll-contain">
          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: string
  label: string
  open: boolean
}

function NavItem({ href, icon, label, open }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition group"
      title={label}
    >
      <span className="text-lg group-hover:scale-110 transition flex-shrink-0">{icon}</span>
      {open && <span className="font-semibold text-sm truncate">{label}</span>}
    </Link>
  )
}
