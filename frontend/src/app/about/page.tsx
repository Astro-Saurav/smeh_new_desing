import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — Manav Rachna Times',
  description:
    'Manav Rachna Times is an initiative of the students of the School of Media Studies and Humanities (SMeH) at Manav Rachna International Institute of Research and Studies.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-body">
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="bg-zinc-950 text-white relative overflow-hidden">
        {/* Red accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-800" />
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
            Manav Rachna Times
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
            About Us
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
            A student-run media platform at the School of Media Studies and Humanities,
            Manav Rachna International Institute of Research and Studies.
          </p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-4xl">
        <div className="space-y-8 text-zinc-700 leading-[1.85]">
          <div>
            <h2 className="font-heading text-2xl font-black text-zinc-900 mb-4">About Manav Rachna Times</h2>
            <p className="mb-4">
              Manav Rachna Times (MRT) is an initiative of the students of the School of Media Studies and Humanities (SMeH) at Manav Rachna International Institute of Research and Studies (MRIIRS). It serves as a platform for students to hone their journalistic skills and to bring the latest news and updates from campus and beyond to their peers.
            </p>
            <p>
              The publication covers a wide range of topics including campus news, current affairs, entertainment, sports, and student voices. It provides an opportunity for students to develop their writing, editing, photography, and multimedia skills in a real-world setting.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-black text-zinc-900 mb-4">About SMeH</h2>
            <p className="mb-4">
              The School of Media Studies and Humanities (SMeH) is one of the top media schools in Delhi NCR. It offers undergraduate and postgraduate programs in Journalism &amp; Mass Communication and English, preparing students for careers in media, communication, and the humanities.
            </p>
            <p>
              SMeH is known for its industry-integrated curriculum, experienced faculty, and state-of-the-art facilities. The school has produced numerous alumni who have gone on to have successful careers in print, digital, broadcast media, public relations, corporate communications, and academia.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-black text-zinc-900 mb-4">Department of Journalism &amp; Mass Communication</h2>
            <p className="mb-4">
              Established in 2009, the Department of Journalism &amp; Mass Communication at MRIIRS has been at the forefront of media education in Delhi NCR. The department offers a Bachelor of Arts (Hons.) in Journalism &amp; Mass Communication.
            </p>
            <p>
              The program is designed to equip students with the theoretical knowledge and practical skills needed to thrive in today's fast-evolving media landscape. Students get hands-on experience through internships, workshops, field visits, and projects like Manav Rachna Times.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-black text-zinc-900 mb-4">Department of English</h2>
            <p className="mb-4">
              Established in 2013, the Department of English at MRIIRS offers a Bachelor of Arts (Hons.) in English. The program focuses on developing critical thinking, analytical writing, and communication skills.
            </p>
            <p>
              The department fosters a rich literary culture through seminars, literary festivals, and publications. Students are encouraged to explore diverse literary traditions and to engage with contemporary issues through the lens of language and literature.
            </p>
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────────── */}
        <div className="mt-20 pt-12 border-t border-zinc-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-black text-zinc-900 mb-1">
              Meet the team behind Manav Rachna Times
            </h3>
            <p className="text-zinc-500 text-sm">Our editorial board of dedicated student journalists.</p>
          </div>
          <Link
            href="/about/editorial-board"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors rounded-sm shrink-0"
          >
            Editorial Board →
          </Link>
        </div>
      </div>
    </div>
  )
}
