'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cacheManager } from '@/lib/cache-manager'
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  data?: {
    accessToken?: string
    token?: string
    refreshToken?: string
    user?: {
      id: string
      email: string
      role: string
    }
  }
  error?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [bgImage, setBgImage] = useState('/login-bg.jpg')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data: any = {}
      try {
        data = await response.json()
      } catch (e) {
        throw new Error('Server connection error. Please try again.')
      }

      if (!response.ok) {
        setError(data.message || data.error || 'Login failed. Please check credentials.')
        setLoading(false)
        return
      }

      const token = data.data?.accessToken || data.data?.token
      if (token) {
        const cached = cacheManager.setAuthData(token)
        if (!cached) {
          setError('Failed to secure session. Please try again.')
          setLoading(false)
          return
        }
      } else {
        setError('No token received from server.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setError(null)
      setFormData({ email: '', password: '' })

      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none font-sans text-zinc-200 antialiased bg-zinc-950">

      {/* 🖼️ FULLSCREEN BACKGROUND IMAGE WITH DARK GLASS OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Login Background"
          onError={() => setBgImage('/campus_building.jpg')}
          className="w-full h-full object-cover scale-105 filter brightness-50 contrast-110 blur-[2px] transition-all duration-700"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      </div>

      {/* 💳 FLOATING GLASSMORPHIC LOGIN CARD */}
      <div className="relative w-full max-w-md z-10 my-auto">
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-7 md:p-8 shadow-2xl space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-1 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition transform">
                M
              </div>
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-red-400 transition">
                Manav Rachna Times
              </span>
            </Link>

            <div className="pt-1">
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <span>Admin Console Sign In</span>
              </h1>
              <p className="text-zinc-400 text-xs mt-1">Enter your authorization credentials to access CRM</p>
            </div>
          </div>

          {/* Alert Messages */}
          {success && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-300 text-xs font-medium text-center shadow-sm">
              ✅ Authentication successful! Opening dashboard...
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-950/60 border border-red-700/50 rounded-xl text-red-300 text-xs font-medium text-center shadow-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/70 hover:border-zinc-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/80 border border-zinc-700/70 hover:border-zinc-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Access CRM Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-zinc-500 border-t border-white/10 pt-4">
            <Link href="/" className="text-zinc-400 hover:text-white transition flex items-center justify-center gap-1">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
