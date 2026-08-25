'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { cacheManager } from '@/lib/cache-manager'
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings as SettingsIcon,
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Plus,
  ShieldCheck,
  GraduationCap
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
    if (!cacheManager.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    cacheManager.clearAuthData()
    window.location.href = '/login'
  }

  if (!mounted) return <div className="bg-zinc-950 min-h-screen" />

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-200 font-sans overflow-hidden antialiased select-none">
      
      {/* ─── SKEUOMORPHIC OFFICIAL UNIVERSITY SIDEBAR ─── */}
      <aside
        data-lenis-prevent="true"
        className={`
          absolute z-50 h-full md:relative flex-shrink-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border-r border-zinc-800/90 shadow-[5px_0_25px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen 
            ? 'translate-x-0 w-64' 
            : '-translate-x-full w-64 md:translate-x-0 md:w-20'}
        `}
      >
        {/* Top Official Crimson Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 shadow-[0_0_10px_#dc2626]" />

        {/* Official University Press Crest Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-800/80 bg-zinc-950/80 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 border border-red-400/40 flex items-center justify-center text-white font-black text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_10px_rgba(0,0,0,0.5)] shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-black text-xs tracking-wider uppercase truncate">Manav Rachna Times</h2>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-red-500 inline" /> Official SMeH Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)] hover:bg-zinc-800 transition ml-auto flex-shrink-0 cursor-pointer"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Professional Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <NavItem
            href="/admin/dashboard"
            icon={<LayoutDashboard className="w-4.5 h-4.5" />}
            label="Dashboard"
            active={pathname === '/admin/dashboard' || pathname === '/admin'}
            open={sidebarOpen}
          />
          <NavItem
            href="/admin/news"
            icon={<FileText className="w-4.5 h-4.5" />}
            label="News & Press Releases"
            active={pathname.startsWith('/admin/news')}
            open={sidebarOpen}
          />
          <NavItem
            href="/admin/gallery"
            icon={<ImageIcon className="w-4.5 h-4.5" />}
            label="Photo Gallery"
            active={pathname.startsWith('/admin/gallery')}
            open={sidebarOpen}
          />
          <NavItem
            href="/admin/editorial"
            icon={<Users className="w-4.5 h-4.5" />}
            label="Editorial Board"
            active={pathname.startsWith('/admin/editorial')}
            open={sidebarOpen}
          />
          <NavItem
            href="/admin/settings"
            icon={<SettingsIcon className="w-4.5 h-4.5" />}
            label="Portal Settings"
            active={pathname.startsWith('/admin/settings')}
            open={sidebarOpen}
          />
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4)] transition text-xs font-bold"
            title="View Main Website"
          >
            <ExternalLink className="w-4 h-4 text-red-500" />
            {sidebarOpen && <span>View Main Website</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 border border-red-800/50 shadow-[0_4px_0_0_#7f1d1d] hover:shadow-[0_2px_0_0_#7f1d1d] hover:translate-y-0.5 transition-all text-xs font-bold cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Log Out Portal</span>}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        
        {/* Official Top Header */}
        <header className="h-20 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center px-6 sm:px-8 justify-between flex-shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-zinc-400 hover:text-white p-2 bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-white font-black text-xs sm:text-sm tracking-wide uppercase">
                School of Media Studies & Humanities (SMeH) Press Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/news/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-[0_4px_0_0_#991b1b,0_6px_15px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Article</span>
            </Link>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  open: boolean
}

function NavItem({ href, icon, label, active, open }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 font-bold text-xs relative
        ${active 
          ? 'bg-gradient-to-r from-zinc-900 to-zinc-950 text-white border border-red-600/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.6)] translate-x-1' 
          : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white border border-transparent'}
      `}
      title={label}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r bg-red-600 shadow-[0_0_8px_#dc2626]" />
      )}
      <span className={active ? 'text-red-500' : 'text-zinc-400'}>
        {icon}
      </span>
      {open && <span className="truncate tracking-wide">{label}</span>}
    </Link>
  )
}
