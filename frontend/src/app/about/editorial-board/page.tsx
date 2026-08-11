import type { Metadata } from 'next'
import Link from 'next/link'
import { getEditorialRoles } from '@/lib/editorialApi'

export const metadata: Metadata = {
  title: 'Editorial Board — Manav Rachna Times',
  description:
    'Meet the student editorial team behind Manav Rachna Times — the journalists, editors, photographers and multimedia producers from SMeH.',
}

export default async function EditorialBoardPage() {
  const roles = await getEditorialRoles();

  return (
    <div className="min-h-screen bg-white font-body">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-800" />
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 max-w-5xl">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">About</Link>
            <span>›</span>
            <span className="text-zinc-400">Editorial Board</span>
          </nav>
          <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tight text-white leading-tight mb-4">
            Editorial Board
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
            Meet the dedicated student journalists and media creators who power Manav Rachna Times.
          </p>
        </div>
      </div>

      {/* ── Role Cards Grid ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-5xl">
        {roles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500">The editorial board is currently being updated. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((group) => (
              <div
                key={group.id}
                className="border border-zinc-200 rounded-sm p-6 hover:border-primary hover:shadow-md transition-all group"
              >
                {/* Role title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-0.5 h-6 bg-primary rounded-full shrink-0" />
                  <h2 className="font-heading text-base font-black uppercase tracking-wide text-zinc-900 group-hover:text-primary transition-colors">
                    {group.name}
                  </h2>
                </div>

                {/* Description */}
                {group.description && (
                  <p className="text-[12px] text-zinc-400 mb-4 leading-relaxed pl-3.5">
                    {group.description}
                  </p>
                )}

                {/* Member names */}
                {group.members && group.members.length > 0 ? (
                  <ul className="space-y-2 pl-3.5 mt-2">
                    {group.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center gap-2 text-sm font-bold text-zinc-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {member.name === '—' ? (
                          <span className="text-zinc-300 italic font-normal text-xs">
                            To be announced
                          </span>
                        ) : (
                          member.name
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-300 italic font-normal text-xs pl-3.5 mt-2">
                    To be announced
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-zinc-200">
          <Link
            href="/about"
            className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors"
          >
            ← Back to About Us
          </Link>
        </div>
      </div>
    </div>
  )
}
