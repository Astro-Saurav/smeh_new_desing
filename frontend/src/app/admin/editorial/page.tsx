'use client'

import { useState, useEffect } from 'react'
import { cacheManager } from '@/lib/cache-manager'

export type EditorialMember = {
  id: string
  name: string
  display_order: number
  created_at: string
}

export type EditorialRole = {
  id: string
  name: string
  description: string | null
  display_order: number
  members: EditorialMember[]
}

export default function EditorialBoardPage() {
  const [roles, setRoles] = useState<EditorialRole[]>([])
  const [loading, setLoading] = useState(true)
  const [roleName, setRoleName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const fetchRoles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/editorial')
      if (!res.ok) throw new Error('Failed to fetch editorial roles')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to load editorial board.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!roleName.trim()) return

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Please login first')

      const res = await fetch('/api/v1/editorial/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: roleName })
      })

      if (!res.ok) {
        if (res.status === 401) {
          cacheManager.clearAuthData()
          window.location.href = '/login'
          return
        }
        const data = await res.json()
        throw new Error(data.message || 'Failed to create role')
      }

      setMessage({ type: 'success', text: 'Role created successfully!' })
      setRoleName('')
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create role' })
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return
    setMessage(null)

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Please login first')

      const res = await fetch(`/api/v1/editorial/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        if (res.status === 401) {
          cacheManager.clearAuthData()
          window.location.href = '/login'
          return
        }
        const data = await res.json()
        throw new Error(data.message || 'Failed to delete role')
      }

      setMessage({ type: 'success', text: 'Role deleted successfully!' })
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete role' })
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!memberName.trim() || !selectedRoleId) return

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Please login first')

      const res = await fetch('/api/v1/editorial/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: memberName, role_id: selectedRoleId })
      })

      if (!res.ok) {
        if (res.status === 401) {
          cacheManager.clearAuthData()
          window.location.href = '/login'
          return
        }
        const data = await res.json()
        throw new Error(data.message || 'Failed to add member')
      }

      setMessage({ type: 'success', text: 'Member added successfully!' })
      setMemberName('')
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add member' })
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    setMessage(null)

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Please login first')

      const res = await fetch(`/api/v1/editorial/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        if (res.status === 401) {
          cacheManager.clearAuthData()
          window.location.href = '/login'
          return
        }
        const data = await res.json()
        throw new Error(data.message || 'Failed to delete member')
      }

      setMessage({ type: 'success', text: 'Member removed successfully!' })
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete member' })
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-white">👥 Editorial Board</h1>
        <p className="text-zinc-500 mt-2">Manage the hierarchy of editors and board members</p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-green-900/30 border border-green-700 text-green-300'
              : 'bg-red-900/30 border border-red-700 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Role */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Add Role</h2>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Role Name *</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Editor-in-Chief"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition"
            >
              Create Role
            </button>
          </form>
        </div>

        {/* Add Member */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Add Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Select Role *</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:border-red-600 focus:outline-none"
                required
              >
                <option value="">Select a role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-400 uppercase mb-2">Member Name *</label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-600 focus:border-red-600 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition"
            >
              Add Member
            </button>
          </form>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Board Hierarchy</h2>
        
        {loading ? (
          <div className="text-zinc-500 animate-pulse">Loading editorial board...</div>
        ) : roles.length === 0 ? (
          <div className="text-center py-10 border border-zinc-800 border-dashed rounded-lg">
            <p className="text-zinc-500 mb-2">No roles defined</p>
            <p className="text-zinc-600 text-sm">Start by adding the first editorial role.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                  <h4 className="text-lg font-bold text-white m-0">{role.name}</h4>
                  <button 
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={role.members && role.members.length > 0}
                    title={role.members && role.members.length > 0 ? 'Cannot delete role with active members' : 'Delete role'}
                    className={`px-3 py-1.5 text-sm font-semibold rounded transition ${
                      role.members && role.members.length > 0 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-red-900/30 hover:bg-red-900 text-red-400'
                    }`}
                  >
                    Delete Role
                  </button>
                </div>
                
                {role.members && role.members.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="py-3 px-4 text-zinc-400 font-semibold w-full">Member Name</th>
                          <th className="py-3 px-4 text-zinc-400 font-semibold whitespace-nowrap text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {role.members.map((member) => (
                          <tr key={member.id} className="hover:bg-zinc-900/30 transition">
                            <td className="py-3 px-4 text-zinc-300 font-medium">
                              {member.name}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-xs font-semibold px-2 py-1 bg-zinc-800 hover:bg-red-900 hover:text-red-300 text-zinc-400 rounded transition whitespace-nowrap"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-zinc-600 text-sm m-0">No members assigned to this role yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
