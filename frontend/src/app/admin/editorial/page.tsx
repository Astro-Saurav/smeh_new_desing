'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { cacheManager } from '@/lib/cache-manager'
import { Users, UserPlus, ShieldCheck, Trash2, Plus, Crown, Briefcase, BadgeCheck, Edit3, Mail, Phone, Globe, X, Upload, Camera } from 'lucide-react'

export type EditorialMember = {
  id: string
  name: string
  role_id: string
  image?: string | null
  tagline?: string | null
  email?: string | null
  contact?: string | null
  social_link?: string | null
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

function safeImg(url: string | null | undefined) {
  if (!url || url === 'undefined' || url === '') return '/new_logo.png'
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return url
  if (url.startsWith('uploads/')) return `/${url}`
  return `/uploads/${url}`
}

export default function EditorialBoardPage() {
  const [roles, setRoles] = useState<EditorialRole[]>([])
  const [loading, setLoading] = useState(true)
  const [roleName, setRoleName] = useState('')
  
  // Create Member Form State
  const [memberName, setMemberName] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [memberImage, setMemberImage] = useState('')
  const [memberTagline, setMemberTagline] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberContact, setMemberContact] = useState('')
  const [memberSocialLink, setMemberSocialLink] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<EditorialMember | null>(null)
  const [editName, setEditName] = useState('')
  const [editRoleId, setEditRoleId] = useState('')
  const [editImage, setEditImage] = useState('')
  const [editTagline, setEditTagline] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editContact, setEditContact] = useState('')
  const [editSocialLink, setEditSocialLink] = useState('')
  const [editUploadingImage, setEditUploadingImage] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

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
      setMessage({ type: 'error', text: 'Failed to load editorial board console.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // Image Upload Handler
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (isEdit) setEditUploadingImage(true)
    else setUploadingImage(true)

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Authentication token missing')

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Image upload failed')

      const uploadedPath = data.data?.file_path || data.data?.path_webp || data.url
      if (!uploadedPath) throw new Error('Upload path missing from server response')

      if (isEdit) {
        setEditImage(uploadedPath)
      } else {
        setMemberImage(uploadedPath)
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Image upload failed' })
    } finally {
      if (isEdit) setEditUploadingImage(false)
      else setUploadingImage(false)
    }
  }

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

      setMessage({ type: 'success', text: 'New Executive Role established successfully!' })
      setRoleName('')
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create role' })
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this editorial desk role?')) return
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

      setMessage({ type: 'success', text: 'Editorial role removed successfully!' })
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete role' })
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!memberName.trim() || !selectedRoleId) {
      setMessage({ type: 'error', text: 'Member name and role selection are required.' })
      return
    }

    if (!memberImage) {
      setMessage({ type: 'error', text: '⚠️ Mandatory: Please upload a round profile picture for the board member!' })
      return
    }

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Please login first')

      const res = await fetch('/api/v1/editorial/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: memberName.trim(),
          role_id: selectedRoleId,
          image: memberImage,
          tagline: memberTagline.trim() || null,
          email: memberEmail.trim() || null,
          contact: memberContact.trim() || null,
          social_link: memberSocialLink.trim() || null,
        })
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

      setMessage({ type: 'success', text: 'Journalist/Editor inducted into Editorial Board with profile picture!' })
      setMemberName('')
      setMemberImage('')
      setMemberTagline('')
      setMemberEmail('')
      setMemberContact('')
      setMemberSocialLink('')
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to add member' })
    }
  }

  const openEditModal = (member: EditorialMember) => {
    setEditingMember(member)
    setEditName(member.name || '')
    setEditRoleId(member.role_id || '')
    setEditImage(member.image || '')
    setEditTagline(member.tagline || '')
    setEditEmail(member.email || '')
    setEditContact(member.contact || '')
    setEditSocialLink(member.social_link || '')
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return

    if (!editImage) {
      setMessage({ type: 'error', text: '⚠️ Mandatory: Profile picture is required for all editorial board members!' })
      return
    }

    setIsUpdating(true)
    setMessage(null)

    try {
      const token = cacheManager.getAccessToken()
      if (!token) throw new Error('Please login first')

      const res = await fetch(`/api/v1/editorial/members/${editingMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName.trim(),
          role_id: editRoleId,
          image: editImage,
          tagline: editTagline.trim() || null,
          email: editEmail.trim() || null,
          contact: editContact.trim() || null,
          social_link: editSocialLink.trim() || null,
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update member')
      }

      setMessage({ type: 'success', text: 'Member profile details & picture updated successfully!' })
      setEditingMember(null)
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update member' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this board member?')) return
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

      setMessage({ type: 'success', text: 'Member removed from board.' })
      fetchRoles()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete member' })
    }
  }

  const totalMembers = roles.reduce((acc, r) => acc + (r.members?.length || 0), 0)

  return (
    <div className="space-y-8 max-w-6xl font-sans text-zinc-200 antialiased">
      
      {/* ─── NEWSROOM CONTROL CONSOLE HEADER ─── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-700/50 rounded-2xl p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                Newsroom Governance Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 drop-shadow">
              <span>Editorial Board Studio</span>
            </h1>
            <p className="text-zinc-400 text-xs max-w-xl">
              Configure editorial hierarchy, assign leadership desks, and induct journalists with mandatory round profile pictures.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center gap-3">
              <Crown className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Desks</div>
                <div className="text-base font-black text-white">{roles.length}</div>
              </div>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center gap-3">
              <Users className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Members</div>
                <div className="text-base font-black text-white">{totalMembers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md border ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
              : 'bg-red-950/60 border-red-700/60 text-red-300'
          }`}
        >
          <span>{message.type === 'success' ? '✅' : '⚠️'} {message.text}</span>
          <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* ─── ACTION MODULES (2-COLUMN FORMS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module A: Establish Editorial Desk Role */}
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/90 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_25px_rgba(0,0,0,0.4)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-400">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">Establish Executive Role</h2>
                <p className="text-[11px] text-zinc-400">Create new hierarchy rank (e.g. Student Editor-in-Chief)</p>
              </div>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Role / Desk Title *
                </label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Student Editor-in-Chief"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition transform flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>Create Editorial Role</span>
              </button>
            </form>
          </div>
        </div>

        {/* Module B: Induct Board Member with Mandatory Profile Picture */}
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800/90 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_25px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-600/40 flex items-center justify-center text-rose-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">Induct Board Member</h2>
              <p className="text-[11px] text-zinc-400">Assign student journalist with mandatory round profile picture</p>
            </div>
          </div>

          <form onSubmit={handleAddMember} className="space-y-3">
            
            {/* MANDATORY PROFILE PICTURE UPLOAD */}
            <div>
              <label className="block text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Round Profile Picture * (Mandatory)</span>
                {memberImage && <span className="text-emerald-400 text-[10px]">✓ Picture Uploaded</span>}
              </label>
              
              <div className="flex items-center gap-3">
                {/* Round Image Preview */}
                <div className="w-14 h-14 rounded-full border-2 border-red-600 overflow-hidden bg-zinc-950 flex items-center justify-center shrink-0 shadow-md">
                  {memberImage ? (
                    <img src={safeImg(memberImage)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-zinc-600" />
                  )}
                </div>

                <label className="flex-1 cursor-pointer">
                  <div className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl text-xs text-zinc-300 flex items-center justify-center gap-2 transition shadow-inner">
                    <Upload className="w-4 h-4 text-red-500" />
                    <span>{uploadingImage ? 'Uploading image...' : memberImage ? 'Change Profile Picture' : 'Upload Profile Picture'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Select Role *
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:border-red-500 focus:outline-none transition cursor-pointer"
                  required
                >
                  <option value="" className="bg-zinc-900 text-zinc-400">Select Role...</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id} className="bg-zinc-900 text-zinc-200">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Aditya Tripathi"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Tagline & Optional Fields */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Tagline / Bio (Optional)
              </label>
              <input
                type="text"
                value={memberTagline}
                onChange={(e) => setMemberTagline(e.target.value)}
                placeholder="e.g. Passionate about campus life & investigative journalism"
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="editor@mrt.edu.in"
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={memberContact}
                  onChange={(e) => setMemberContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Social Link (Optional)
                </label>
                <input
                  type="url"
                  value={memberSocialLink}
                  onChange={(e) => setMemberSocialLink(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadingImage}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition transform flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Induct Board Member</span>
            </button>
          </form>
        </div>

      </div>

      {/* ─── BOARD HIERARCHY & MEMBERS TABLE ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2 uppercase">
            <Briefcase className="w-4 h-4 text-red-500" />
            <span>Active Editorial Hierarchy & Ranks</span>
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">{roles.length} Desks active</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs animate-pulse">Loading board hierarchy...</div>
        ) : roles.length === 0 ? (
          <div className="text-center py-16 bg-zinc-950 border border-zinc-800/80 border-dashed rounded-2xl">
            <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-300 text-xs font-semibold">No Editorial Desks Established</p>
          </div>
        ) : (
          <div className="space-y-5">
            {roles.map((role) => {
              const memberCount = role.members?.length || 0

              return (
                <div
                  key={role.id}
                  className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-zinc-900/90 via-zinc-950/80 to-zinc-900/90 border-b border-zinc-800/90">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 font-bold text-xs shadow-inner">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white tracking-wide">{role.name}</h3>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {memberCount} {memberCount === 1 ? 'Inducted Member' : 'Inducted Members'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteRole(role.id)}
                      disabled={memberCount > 0}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                        memberCount > 0 
                          ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                          : 'bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/50 shadow-sm'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Desk</span>
                    </button>
                  </div>

                  {/* Members Table */}
                  {memberCount > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-300 min-w-[600px]">
                        <thead className="bg-zinc-950/60 border-b border-zinc-800/80 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                          <tr>
                            <th className="py-2.5 px-5">Round Profile Picture</th>
                            <th className="py-2.5 px-5">Member Name</th>
                            <th className="py-2.5 px-5">Contact Details</th>
                            <th className="py-2.5 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {role.members.map((member) => (
                            <tr key={member.id} className="hover:bg-zinc-800/30 transition">
                              
                              {/* Round Profile Picture */}
                              <td className="py-3 px-5">
                                <div className="w-12 h-12 rounded-full border-2 border-red-600/80 overflow-hidden bg-zinc-950 shadow-md">
                                  <img
                                    src={safeImg(member.image)}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </td>

                              <td className="py-3 px-5 font-semibold text-white">
                                <div className="text-xs font-bold text-white">{member.name}</div>
                                <div className="text-[10px] text-zinc-500 font-mono">ID: {member.id.slice(0, 8)}</div>
                              </td>

                              <td className="py-3 px-5">
                                <div className="flex flex-col gap-1 text-[11px] text-zinc-400">
                                  {member.email && (
                                    <span className="flex items-center gap-1.5 text-zinc-300">
                                      <Mail className="w-3 h-3 text-red-400 shrink-0" />
                                      <span>{member.email}</span>
                                    </span>
                                  )}
                                  {member.contact && (
                                    <span className="flex items-center gap-1.5 text-zinc-400">
                                      <Phone className="w-3 h-3 text-zinc-500 shrink-0" />
                                      <span>{member.contact}</span>
                                    </span>
                                  )}
                                  {member.social_link && (
                                    <a
                                      href={member.social_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 text-red-400 hover:text-red-300 truncate max-w-xs"
                                    >
                                      <Globe className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{member.social_link}</span>
                                    </a>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => openEditModal(member)}
                                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
                                    title="Edit Member Details"
                                  >
                                    <Edit3 className="w-3 h-3 text-amber-400" />
                                    <span>Edit</span>
                                  </button>

                                  <button 
                                    onClick={() => handleDeleteMember(member.id)}
                                    className="px-2.5 py-1 bg-zinc-900 hover:bg-red-900 hover:text-red-200 border border-zinc-800 text-zinc-400 rounded-lg text-[11px] font-medium transition flex items-center gap-1"
                                    title="Remove Member"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Revoke</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-zinc-500 text-xs">
                      No board members inducted into this desk yet.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── EDIT MEMBER MODAL DIALOG ─── */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Edit Member Profile & Picture
                </h3>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-3.5 text-xs">
              
              {/* Profile Picture in Edit Modal */}
              <div>
                <label className="block text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Round Profile Picture * (Mandatory)</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 border-red-600 overflow-hidden bg-zinc-950 flex items-center justify-center shrink-0 shadow-md">
                    {editImage ? (
                      <img src={safeImg(editImage)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>

                  <label className="flex-1 cursor-pointer">
                    <div className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl text-xs text-zinc-300 flex items-center justify-center gap-2 transition shadow-inner">
                      <Upload className="w-4 h-4 text-red-500" />
                      <span>{editUploadingImage ? 'Uploading...' : 'Change Profile Picture'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                      disabled={editUploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Member Full Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Assigned Desk / Role *
                </label>
                <select
                  value={editRoleId}
                  onChange={(e) => setEditRoleId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-500 focus:outline-none cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id} className="bg-zinc-900">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Tagline / Bio (Optional)
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  placeholder="e.g. Passionate about campus life & investigative journalism"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="editor@mrt.edu.in"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Phone / Contact (Optional)
                </label>
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Social / Profile Link (Optional)
                </label>
                <input
                  type="url"
                  value={editSocialLink}
                  onChange={(e) => setEditSocialLink(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || editUploadingImage}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
