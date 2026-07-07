'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cacheManager } from '@/lib/cache-manager'
import { Eye, EyeOff } from 'lucide-react'

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

      const data: LoginResponse = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Store ONLY the access token using secure cache manager
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

      // Clear form data after successful login
      setFormData({ email: '', password: '' })

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="text-3xl font-black text-white">
              MANAV RACHNA <span className="text-orange-500">TIMES</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-slate-400">Sign in to your account to continue</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-xl p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-300 text-sm">
              Login successful! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-slate-400">
              Back to{' '}
              <Link href="/" className="text-orange-500 hover:text-orange-400 font-medium">
                home page
              </Link>
            </p>
          </div>
        </div>

        {/* Support Message */}
        <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-300 text-xs text-center">
          <p>If you need login assistance, please contact the administrator.</p>
        </div>
      </div>
    </div>
  )
}
