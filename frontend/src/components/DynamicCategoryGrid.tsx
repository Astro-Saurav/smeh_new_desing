'use client'

import Image from 'next/image'
import Link from 'next/link'
import { routes } from '@/lib/routes'

// ─── Types ────────────────────────────────────────────────────────
export interface HomepageArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  thumbnail: string | null
  published_at: string | null
  youtube_url: string | null
  category: {
    id: string
    name: string
    slug: string
  }
}

export interface HomepageGrid {
  id: string
  category: string
  categorySlug: string
  layout: 'FEATURED' | 'MAGAZINE' | 'STANDARD' | 'VIDEO'
  title: string
  articleLimit: number
  featuredLimit: number
  showViewAll: boolean
  articleCount: number
  hasMore: boolean
  articles: HomepageArticle[]
}

// ─── Layout Templates ─────────────────────────────────────────────
// Defines the slot pattern for each layout type.
// featured_limit articles always start as "featured" slots regardless of this pattern.
// After the pattern is exhausted, remaining articles flow as uniform "small" cards.
const GRID_LAYOUTS = {
  FEATURED: {
    columns: 12,
    pattern: ['featured', 'small', 'small', 'small', 'small', 'medium', 'medium', 'medium']
  },
  MAGAZINE: {
    columns: 12,
    pattern: ['featured', 'medium', 'medium', 'small', 'small', 'small', 'small']
  },
  STANDARD: {
    columns: 12,
    pattern: ['medium', 'medium', 'medium', 'small', 'small', 'small', 'small', 'small', 'small']
  },
  VIDEO: {
    columns: 12,
    pattern: ['featured', 'medium', 'medium', 'small', 'small', 'small', 'small']
  }
} as const

// ─── Skeleton Loader ──────────────────────────────────────────────
function ArticleSkeleton({ size }: { size: 'featured' | 'medium' | 'small' }) {
  const heightClass = size === 'featured' ? 'h-[340px]' : size === 'medium' ? 'h-52' : 'h-36'
  return (
    <div className={`animate-pulse bg-zinc-100 ${heightClass} w-full`} />
  )
}

// ─── Article Card Variants ─────────────────────────────────────────
const PLACEHOLDER_IMAGE = '/logo.png'

function getImageSrc(thumbnail: string | null): string {
  if (!thumbnail) return PLACEHOLDER_IMAGE
  if (thumbnail.startsWith('http')) return thumbnail
  if (thumbnail.startsWith('/')) return thumbnail
  return `/uploads/${thumbnail}`
}

function FeaturedCard({ article }: { article: HomepageArticle }) {
  return (
    <Link href={routes.article(article.slug)} className="group flex flex-col h-full min-w-0">
      <div className="relative aspect-video overflow-hidden bg-zinc-50 rounded-xl shadow-sm border border-zinc-100 mb-4">
        <Image
          src={getImageSrc(article.thumbnail)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          unoptimized={true}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-red-600 px-2.5 py-1 text-[10px] rounded-md font-bold uppercase tracking-widest shadow-sm">
          {article.category.name}
        </div>
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-zinc-500 text-sm mt-2 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      )}
    </Link>
  )
}

function MediumCard({ article }: { article: HomepageArticle }) {
  return (
    <Link href={routes.article(article.slug)} className="group flex gap-4 items-start min-w-0">
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-zinc-50 rounded-lg shadow-sm border border-zinc-100">
        <Image
          src={getImageSrc(article.thumbnail)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          unoptimized={true}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
        />
      </div>
      <div className="flex-1 min-w-0 py-1">
        <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider block mb-1">
          {article.category.name}
        </span>
        <h4 className="text-[15px] font-bold text-zinc-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
          {article.title}
        </h4>
      </div>
    </Link>
  )
}

function SmallCard({ article }: { article: HomepageArticle }) {
  return (
    <Link href={routes.article(article.slug)} className="group flex flex-col h-full min-w-0">
      <div className="relative aspect-video overflow-hidden bg-zinc-50 rounded-lg shadow-sm border border-zinc-100 mb-3">
        <Image
          src={getImageSrc(article.thumbnail)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          unoptimized={true}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
        />
      </div>
      <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">
        {article.category.name}
      </span>
      <h4 className="text-[15px] font-bold text-zinc-900 group-hover:text-red-600 transition-colors leading-snug mt-1.5 line-clamp-2">
        {article.title}
      </h4>
    </Link>
  )
}

// ─── Slot resolver ────────────────────────────────────────────────
function getSlotType(
  index: number,
  featuredLimit: number,
  pattern: readonly string[]
): 'featured' | 'medium' | 'small' {
  // First N articles are always "featured"
  if (index < featuredLimit) return 'featured'

  // Map remaining articles against the layout pattern (after featured slots)
  const patternIndex = index - featuredLimit
  if (patternIndex < pattern.length) {
    const slot = pattern[patternIndex]
    return (slot === 'featured' || slot === 'medium' || slot === 'small') ? slot : 'small'
  }

  // Pattern exhausted → uniform small cards via CSS auto-placement
  return 'small'
}

// ─── Grid CSS class resolver ──────────────────────────────────────
function getSlotClasses(slot: 'featured' | 'medium' | 'small'): string {
  switch (slot) {
    case 'featured':
      return 'col-span-12 md:col-span-8'
    case 'medium':
      return 'col-span-12 md:col-span-4'
    case 'small':
      return 'col-span-12 sm:col-span-6 md:col-span-4'
  }
}

// ─── Main DynamicCategoryGrid Component ───────────────────────────
interface DynamicCategoryGridProps {
  grid: HomepageGrid
  loading?: boolean
}

export function DynamicCategoryGrid({ grid, loading = false }: DynamicCategoryGridProps) {
  if (loading) {
    return (
      <section className="border-t border-zinc-200 pt-10 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-zinc-100 animate-pulse" />
          <div className="h-4 w-16 bg-zinc-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ArticleSkeleton key={i} size="small" />
          ))}
        </div>
      </section>
    )
  }

  if (!grid.articles || grid.articles.length === 0) return null

  // Helper to safely get articles
  const articles = grid.articles;

  return (
    <section className="border-t border-zinc-200 pt-10 mt-10 mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-3">
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900">
          {grid.title}
        </h3>
        {grid.showViewAll && grid.hasMore && (
          <Link
            href={routes.category(grid.categorySlug)}
            className="text-[11px] font-bold uppercase tracking-widest text-red-600 hover:text-zinc-900 transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      {/* ─── Robust Layouts ────────────────────────────── */}
      
      {grid.layout === 'FEATURED' && (
        <div className="flex flex-col gap-6">
          {/* Top row: 1 massive featured, 2 small stacked on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {articles[0] && <FeaturedCard article={articles[0]} />}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              {articles[1] && <SmallCard article={articles[1]} />}
              {articles[2] && <SmallCard article={articles[2]} />}
            </div>
          </div>
          {/* Bottom row: up to 4 small cards */}
          {articles.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-zinc-100">
              {articles.slice(3, 7).map(article => (
                <SmallCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}

      {grid.layout === 'MAGAZINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: List */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {articles.slice(1, 4).map(article => (
              <MediumCard key={article.id} article={article} />
            ))}
          </div>
          {/* Center Column: Featured */}
          <div className="lg:col-span-6">
            {articles[0] && <FeaturedCard article={articles[0]} />}
          </div>
          {/* Right Column: List */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {articles.slice(4, 7).map(article => (
              <MediumCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {(grid.layout === 'STANDARD' || grid.layout === 'VIDEO') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 8).map((article) => (
            <SmallCard key={article.id} article={article} />
          ))}
        </div>
      )}

    </section>
  )
}
