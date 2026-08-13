import Link from 'next/link'
import { SafeImage } from '@/components/SafeImage'
import { getAllPublishedNews, getNewsByCategory } from '@/lib/newsApi'
import { DynamicCategoryGrid } from '@/components/DynamicCategoryGrid'

export const revalidate = 0 // Disable cache to always show latest news

export default async function HomePage() {
  // Fetch hero stories and category feeds in parallel for maximum performance
  const [
    heroStories,
    campusBuzz,
    beyondCampus,
    currentAffairs,
    entertainmentLifestyle,
    sports,
    socialBuzz,
    podcast,
    mrTv,
    gallery,
    announcement,
    achievements,
    studentsVoices
  ] = await Promise.all([
    getAllPublishedNews(8),
    getNewsByCategory('Campus Buzz', 10),
    getNewsByCategory('Beyond Campus', 8),
    getNewsByCategory('Current Affairs', 6),
    getNewsByCategory('Entertainment & Lifestyle Feature', 6),
    getNewsByCategory('Sports', 6),
    getNewsByCategory('Social Buzz', 10),
    getNewsByCategory('MR Podcast', 8),
    getNewsByCategory('MR TV', 6),
    getNewsByCategory('Photo Gallery', 8),
    getNewsByCategory('Announcement', 8),
    getNewsByCategory('Achievements', 6),
    getNewsByCategory('Students Voices', 4)
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
        author: a.author,
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
        author: a.author,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'current-affairs',
      category: 'Current Affairs',
      categorySlug: 'current-affairs',
      title: 'Current Affairs',
      layout: 'STANDARD' as const,
      featuredLimit: 0,
      articleLimit: 6,
      showViewAll: true,
      hasMore: currentAffairs.length >= 6,
      articleCount: currentAffairs.length,
      articles: currentAffairs.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        author: a.author,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'entertainment-lifestyle',
      category: 'Entertainment & Lifestyle',
      categorySlug: 'entertainment-lifestyle',
      title: 'Entertainment & Lifestyle',
      layout: 'STANDARD' as const,
      featuredLimit: 0,
      articleLimit: 6,
      showViewAll: true,
      hasMore: entertainmentLifestyle.length >= 6,
      articleCount: entertainmentLifestyle.length,
      articles: entertainmentLifestyle.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        author: a.author,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'sports',
      category: 'Sports',
      categorySlug: 'sports',
      title: 'Sports',
      layout: 'STANDARD' as const,
      featuredLimit: 0,
      articleLimit: 6,
      showViewAll: true,
      hasMore: sports.length >= 6,
      articleCount: sports.length,
      articles: sports.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        author: a.author,
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
        author: a.author,
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
        author: a.author,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'mr-tv',
      category: 'MR-TV',
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
        author: a.author,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'gallery',
      category: 'Gallery',
      categorySlug: 'gallery',
      title: 'Gallery',
      layout: 'BENTO' as const,
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
        author: a.author,
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
        author: a.author,
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
        author: a.author,
        category: { id: a.category, name: a.category, slug: a.category.toLowerCase().replace(/\s+/g, '-') }
      }))
    },
    {
      id: 'students-voices',
      category: 'Students Voices',
      categorySlug: 'students-voices',
      title: 'Students Voices',
      layout: 'GRID_2X2' as const,
      featuredLimit: 0,
      articleLimit: 4,
      showViewAll: true,
      hasMore: studentsVoices.length >= 4,
      articleCount: studentsVoices.length,
      articles: studentsVoices.map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.headline,
        excerpt: a.description,
        thumbnail: a.image,
        published_at: null,
        youtube_url: a.youtubeUrl,
        author: a.author,
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

          {/* Main Story – 8 columns, text overlaid on image */}
          <div className="lg:col-span-8">
            {mainStory ? (
              <Link href={mainStory.link || '#'} className="group block relative overflow-hidden rounded-xl shadow-md aspect-[16/9] bg-zinc-900">
                <SafeImage
                  src={mainStory.image}
                  alt={mainStory.headline}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                  priority
                  unoptimized={true}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-[10px] rounded-sm font-bold uppercase tracking-widest shadow">
                  {mainStory.category}
                </div>
                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-white group-hover:text-red-300 transition-colors mb-3 drop-shadow-lg">
                    {mainStory.headline}
                  </h2>
                  <p className="text-zinc-300 line-clamp-2 text-sm leading-relaxed drop-shadow">
                    {mainStory.description}
                  </p>
                </div>
              </Link>
            ) : (
              <p className="text-zinc-400 text-center py-20">No articles published yet.</p>
            )}
          </div>

          {/* Sidebar – 4 columns, 3 stacked thumbnail cards */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-[0.2em]">Trending</h4>
            {trendingStories.slice(0, 3).map((story, i) => (
              <Link key={story.id} href={story.link || '#'} className="flex gap-3 group items-start min-w-0 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                {/* Thumbnail */}
                <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <SafeImage
                    src={story.image || '/new_logo.png'}
                    alt={story.headline}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1 block">
                    {story.category}
                  </span>
                  <h5 className="text-[13px] font-bold leading-snug text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-3">
                    {story.headline}
                  </h5>
                </div>
              </Link>
            ))}
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
