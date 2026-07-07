import Image from 'next/image'
import Link from 'next/link'
import { getAllPublishedNews, getNewsByCategory } from '@/lib/newsApi'
import { DynamicCategoryGrid } from '@/components/DynamicCategoryGrid'

export const revalidate = 60 // Enable ISR (cache regenerates every 60 seconds)

export default async function HomePage() {
  // Fetch hero stories and category feeds in parallel for maximum performance
  const [
    heroStories,
    campusBuzz,
    beyondCampus,
    socialBuzz,
    podcast,
    mrTv,
    gallery,
    blog,
    announcement,
    achievements
  ] = await Promise.all([
    getAllPublishedNews(8),
    getNewsByCategory('Campus Buzz', 10),
    getNewsByCategory('Beyond Campus', 8),
    getNewsByCategory('Social Buzz', 10),
    getNewsByCategory('Podcast', 8),
    getNewsByCategory('Manav Rachna TV', 6),
    getNewsByCategory('Gallery', 8),
    getNewsByCategory('Blog', 8),
    getNewsByCategory('Announcement', 8),
    getNewsByCategory('Achievements', 6),
  ])

  const mainStory = heroStories[0]
  const trendingStories = heroStories.slice(1, 6)

  // Map the fetched data to our statically defined automatic grid structure
  const automaticGrids = [
    {
      id: 'campus-buzz',
      category: 'Campus Buzz',
      categorySlug: 'campus-buzz',
      title: 'Campus Buzz',
      layout: 'FEATURED' as const,
      featuredLimit: 1,
      articleLimit: 10,
      showViewAll: true,
      hasMore: campusBuzz.length >= 10,
      articleCount: campusBuzz.length,
      articles: campusBuzz.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'beyond-campus',
      category: 'Beyond Campus',
      categorySlug: 'beyond-campus',
      title: 'Beyond Campus',
      layout: 'MAGAZINE' as const,
      featuredLimit: 1,
      articleLimit: 8,
      showViewAll: true,
      hasMore: beyondCampus.length >= 8,
      articleCount: beyondCampus.length,
      articles: beyondCampus.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'social-buzz',
      category: 'Social Buzz',
      categorySlug: 'social-buzz',
      title: 'Social Buzz',
      layout: 'STANDARD' as const,
      featuredLimit: 0,
      articleLimit: 10,
      showViewAll: true,
      hasMore: socialBuzz.length >= 10,
      articleCount: socialBuzz.length,
      articles: socialBuzz.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'podcast',
      category: 'Podcast',
      categorySlug: 'podcast',
      title: 'Podcast',
      layout: 'FEATURED' as const,
      featuredLimit: 1,
      articleLimit: 8,
      showViewAll: true,
      hasMore: podcast.length >= 8,
      articleCount: podcast.length,
      articles: podcast.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'mr-tv',
      category: 'Manav Rachna TV',
      categorySlug: 'mr-tv',
      title: 'Manav Rachna TV',
      layout: 'VIDEO' as const,
      featuredLimit: 1,
      articleLimit: 6,
      showViewAll: true,
      hasMore: mrTv.length >= 6,
      articleCount: mrTv.length,
      articles: mrTv.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'gallery',
      category: 'Gallery',
      categorySlug: 'gallery',
      title: 'Gallery',
      layout: 'STANDARD' as const,
      featuredLimit: 0,
      articleLimit: 8,
      showViewAll: true,
      hasMore: gallery.length >= 8,
      articleCount: gallery.length,
      articles: gallery.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'blog',
      category: 'Blog',
      categorySlug: 'blog',
      title: 'Blog',
      layout: 'MAGAZINE' as const,
      featuredLimit: 1,
      articleLimit: 8,
      showViewAll: true,
      hasMore: blog.length >= 8,
      articleCount: blog.length,
      articles: blog.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'announcement',
      category: 'Announcement',
      categorySlug: 'announcement',
      title: 'Announcement',
      layout: 'FEATURED' as const,
      featuredLimit: 1,
      articleLimit: 8,
      showViewAll: true,
      hasMore: announcement.length >= 8,
      articleCount: announcement.length,
      articles: announcement.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'achievements',
      category: 'Achievements',
      categorySlug: 'achievements',
      title: 'Achievements',
      layout: 'STANDARD' as const,
      featuredLimit: 0,
      articleLimit: 6,
      showViewAll: true,
      hasMore: achievements.length >= 6,
      articleCount: achievements.length,
      articles: achievements.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    }
  ]

  // Filter out any grids that have 0 articles so the page doesn't look empty
  const activeGrids = automaticGrids.filter(grid => grid.articles.length > 0)

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* ── Hero Section (Latest News) ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* Main Story */}
          <div className="lg:col-span-8 border-r-0 lg:border-r border-zinc-100 lg:pr-8">
            {mainStory ? (
              <Link href={mainStory.link || '#'} className="group block min-w-0">
                <div className="relative aspect-[21/9] mb-6 overflow-hidden bg-zinc-50 rounded-xl shadow-sm border border-zinc-100">
                  <Image
                    src={mainStory.image}
                    alt={mainStory.headline}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-red-600 px-3 py-1 text-[10px] rounded-md font-bold uppercase tracking-widest shadow-sm">
                    Latest
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-zinc-900 group-hover:text-red-600 transition-colors mb-4">
                  {mainStory.headline}
                </h2>
                <p className="text-zinc-500 line-clamp-3 mb-6 text-lg leading-relaxed">
                  {mainStory.description}
                </p>
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase text-red-600 tracking-widest">
                  <span>{mainStory.category}</span>
                </div>
              </Link>
            ) : (
              <p className="text-zinc-400 text-center py-20">No articles published yet.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">


            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-[0.2em] mb-8">Trending</h4>
            <div className="space-y-6">
              {trendingStories.map((story, i) => (
                <Link key={story.id} href={story.link || '#'} className="flex gap-4 group items-start min-w-0">
                  <div className="text-3xl font-black text-zinc-200 group-hover:text-red-600 transition-colors shrink-0 tabular-nums">
                    0{i + 1}
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1 block">
                      {story.category}
                    </span>
                    <h5 className="text-[15px] font-bold leading-snug text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {story.headline}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Automatic Pre-defined Category Grids ────────────────────────── */}
        {activeGrids.length > 0 ? (
          activeGrids.map((grid) => (
            <DynamicCategoryGrid key={grid.id} grid={grid} />
          ))
        ) : (
          <div className="border-t border-zinc-200 pt-12 mt-12">
            <p className="text-zinc-400 text-sm text-center py-8">
              Welcome to the Manav Rachna Times. More content coming soon!
            </p>
          </div>
        )}

      </main>
    </div>
  )
}
