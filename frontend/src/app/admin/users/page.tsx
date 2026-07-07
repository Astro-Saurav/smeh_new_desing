'use client'

import { useState, useEffect } from 'react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const res = await fetch('/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUsers(Array.isArray(data.data) ? data.data : [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Users</h2>
          <p className="text-slate-400 mt-1">Manage system users and permissions</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          ➕ Add User
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="border-b border-slate-700 text-slate-400 text-sm">
                <tr>
                  <th className="pb-3 px-4">Email</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-white">{user.email}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                        {user.role?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Active</span>
                    </td>
                    <td className="py-3 px-4 text-sm space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Disable</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
