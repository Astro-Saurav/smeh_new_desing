'use client'

import { useEffect, useState } from 'react'
import { getNewsByCategory } from '@/lib/newsApi'
import type { MainSiteNewsItem } from '@/lib/newsApi'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CategoryPage() {
  const params = useParams()
  const slug = (params.slug as string) || ''

  const categoryMap: { [key: string]: string } = {
    'campus-buzz': 'Campus Buzz',
    'beyond-campus': 'Beyond Campus',
    'social-buzz': 'Social Buzz',
    'mr-tv': 'Manav Rachna TV',
    'podcast': 'Podcast',
    'blog': 'Blog',
    'achievements': 'Achievements',
    'announcement': 'Announcement',
    'gallery': 'Gallery',
  }

  const categoryName = categoryMap[slug] || 'Category'

  const [stories, setStories] = useState<MainSiteNewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getNewsByCategory(categoryName, 20)
        setStories(data)
      } catch (error) {
        console.error('Failed to load news', error)
      } finally {
        setLoading(false)
      }
    }

    if (categoryName !== 'Category') {
      fetchNews()
    }
  }, [categoryName])

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-sans">
        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="text-center text-zinc-500">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="border-b-4 border-zinc-900 mb-8 pb-4 flex items-center justify-between">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{categoryName}</h1>
          <Link href="/" className="text-red-500 font-bold text-sm hover:text-red-600">
            ← Back
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.length === 0 ? (
            <p className="text-zinc-500 col-span-full">No articles in this category yet.</p>
          ) : (
            stories.map((story, i) => (
              <Link key={i} href={story.link} className="group">
                <div className="relative aspect-video mb-3 overflow-hidden bg-zinc-100">
                  <Image
                    src={story.image}
                    alt={story.headline}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="bg-white p-3 border border-zinc-200 group-hover:border-red-500 transition">
                  <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">{categoryName}</span>
                  <h4 className="text-sm font-bold group-hover:text-red-500 transition-colors leading-tight mt-2 line-clamp-2">
                    {story.headline}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2">{story.description}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
