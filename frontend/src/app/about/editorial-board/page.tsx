import type { Metadata } from 'next'
import Link from 'next/link'
import { getEditorialRoles } from '@/lib/editorialApi'
import { Mail, Phone, ExternalLink, ShieldCheck, UserCheck, UserPlus, Users, Camera } from 'lucide-react'

function safeImg(url: string | null | undefined) {
  if (!url || url === 'undefined' || url === '') return null
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return url
  if (url.startsWith('uploads/')) return `/${url}`
  return `/uploads/${url}`
}

export const metadata: Metadata = {
  title: 'Editorial Board — Manav Rachna Times',
  description:
    'Meet the student editorial team behind Manav Rachna Times — the journalists, editors, photographers and multimedia producers from SMeH.',
}

export const dynamic = 'force-dynamic'

export default async function EditorialBoardPage() {
  const roles = await getEditorialRoles();

  return (
    <div className="min-h-screen bg-zinc-50/60 font-sans text-zinc-900 antialiased pb-24">
      
      {/* ── Hero Banner ── */}
      <div className="bg-zinc-950 text-white relative overflow-hidden shadow-2xl border-b border-zinc-800">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700" />
        
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 max-w-6xl relative z-10">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
            <span>›</span>
            <span className="text-zinc-400">Editorial Board</span>
          </nav>
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-950/80 border border-red-800/60 rounded-full text-[10px] font-mono text-red-400 uppercase tracking-widest shadow-sm">
              <Users className="w-3.5 h-3.5 text-red-500" />
              <span>SMeH Editorial Board & Press Corps</span>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Our Editorial Team
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Meet the student journalists, section editors, photojournalists, and media creators who lead the newsroom of Manav Rachna Times.
            </p>
          </div>
        </div>
      </div>

      {/* ── Unified Team Showcase Grid ── */}
      <div className="container mx-auto px-4 md:px-8 py-14 md:py-20 max-w-6xl">
        {roles.length === 0 ? (
          <div className="text-center py-16 bg-white border border-zinc-200/80 rounded-3xl shadow-sm">
            <p className="text-zinc-500 text-sm font-medium">The editorial board is currently being updated. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role) => {
              const members = role.members || [];
              const activeMember = members.find(
                (m) => m.name && m.name !== '—' && !m.name.toLowerCase().includes('to be announced')
              );

              const roleTitle = role.name;

              if (!activeMember) {
                // Open / Unassigned Position Card
                return (
                  <div
                    key={role.id}
                    className="bg-white border-2 border-dashed border-zinc-200 rounded-3xl p-8 flex flex-col justify-between min-h-[320px] shadow-sm hover:border-zinc-300 transition select-none"
                  >
                    <div className="space-y-5">
                      <span className="inline-block text-[11px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 border border-zinc-200 px-3.5 py-1.5 rounded-full">
                        {roleTitle}
                      </span>

                      {/* Empty Round Avatar */}
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center text-zinc-300 mx-auto">
                        <Camera className="w-8 h-8" />
                      </div>

                      <div className="space-y-1 text-center">
                        <h3 className="text-lg font-bold text-zinc-400 italic">To be announced</h3>
                        <p className="text-xs text-zinc-400">Position pending induction</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-400">
                      <UserPlus className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Role Open</span>
                    </div>
                  </div>
                );
              }

              // Avatar Initials fallback if image fails
              const initials = activeMember.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              const memberImgSrc = safeImg(activeMember.image);

              return (
                <div
                  key={role.id}
                  className="bg-white border border-zinc-200/90 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-red-600 transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group select-none"
                >
                  {/* Subtle Red Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-5">
                    {/* Position / Role Title Badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-block text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-200/80 px-3.5 py-1 rounded-full select-none">
                        {roleTitle}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 select-none">
                        <UserCheck className="w-3 h-3" /> Active
                      </span>
                    </div>

                    {/* Prominent Enlarged Round Profile Picture */}
                    <div className="flex flex-col items-center text-center space-y-3 pt-2">
                      <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-3xl group-hover:scale-105 transition-transform duration-300 ring-4 ring-red-600/20 select-none">
                        {memberImgSrc ? (
                          <img
                            src={memberImgSrc}
                            alt={activeMember.name}
                            className="w-full h-full object-cover rounded-full pointer-events-none select-none"
                            draggable={false}
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-zinc-900 group-hover:text-red-600 transition-colors leading-tight tracking-tight">
                          {activeMember.name}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
                          {activeMember.tagline || 'SMeH Student Journalist & Editor'}
                        </p>
                      </div>
                    </div>

                    {/* Contact & Social Information */}
                    {(activeMember.email || activeMember.contact || activeMember.social_link) && (
                      <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                        {activeMember.email && (
                          <a
                            href={`mailto:${activeMember.email}`}
                            className="flex items-center justify-center gap-2 text-zinc-600 hover:text-red-600 transition-colors truncate font-medium"
                            title={activeMember.email}
                          >
                            <Mail className="w-4 h-4 text-red-600 shrink-0" />
                            <span className="truncate">{activeMember.email}</span>
                          </a>
                        )}

                        {activeMember.contact && (
                          <div className="flex items-center justify-center gap-2 text-zinc-500 font-medium">
                            <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                            <span>{activeMember.contact}</span>
                          </div>
                        )}

                        {activeMember.social_link && (
                          <a
                            href={activeMember.social_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors truncate pt-1"
                          >
                            <ExternalLink className="w-4 h-4 text-red-600 shrink-0" />
                            <span className="truncate">View Public Profile →</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-500 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Verified Credentials
                    </span>
                    <span>SMeH Press</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Return Link */}
        <div className="mt-16 pt-8 border-t border-zinc-200 flex items-center justify-between">
          <Link
            href="/about"
            className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors"
          >
            ← Return to About Us
          </Link>
          <span className="text-xs font-mono text-zinc-400">Manav Rachna Times Press Bureau</span>
        </div>
      </div>
    </div>
  )
}
