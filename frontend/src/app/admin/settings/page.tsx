'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '@/lib/cache-manager'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      setLoading(true)
      const token = cacheManager.getAccessToken()
      if (!token) {
        setMessage({ type: 'error', text: 'Please login first' })
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

      if (!res.ok) throw new Error('Failed to change password')

      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">⚙️ Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your admin account and site settings</p>
      </div>

      {/* Change Password */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          🔐 Change Password
        </h2>

        {message && (
          <div
            className={`px-4 py-3 rounded mb-6 text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-green-900/30 border border-green-700 text-green-300'
                : 'bg-red-900/30 border border-red-700 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Current Password *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              autoComplete="new-password"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-bold rounded transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>



      {/* Danger Zone */}
      <div className="bg-red-950/30 border border-red-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
          ⚠️ Danger Zone
        </h2>

        <p className="text-red-300 text-sm mb-4">These actions cannot be undone.</p>

        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-300 font-bold rounded transition text-sm">
            Clear Cache
          </button>
          <button className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-300 font-bold rounded transition text-sm">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}
