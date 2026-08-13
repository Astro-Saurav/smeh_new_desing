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
  author?: string
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
  layout: 'FEATURED' | 'MAGAZINE' | 'STANDARD' | 'VIDEO' | 'GRID_2X2' | 'BENTO'
  title: string
  articleLimit: number
  featuredLimit: number
  showViewAll: boolean
  articleCount: number
  hasMore: boolean
  articles: HomepageArticle[]
}

// ─── Skeleton Loader ──────────────────────────────────────────────
function ArticleSkeleton({ size }: { size: 'featured' | 'medium' | 'small' }) {
  const heightClass = size === 'featured' ? 'h-[340px]' : size === 'medium' ? 'h-52' : 'h-36'
  return (
    <div className={`animate-pulse bg-zinc-100 ${heightClass} w-full`} />
  )
}

// ─── Shared image helper ───────────────────────────────────────────
const PLACEHOLDER_IMAGE = '/new_logo.png'

function getImageSrc(thumbnail: string | null): string {
  if (!thumbnail) return PLACEHOLDER_IMAGE
  if (thumbnail.startsWith('http')) return thumbnail
  if (thumbnail.startsWith('/')) return thumbnail
  return `/uploads/${thumbnail}`
}

// ─── Card Variants ─────────────────────────────────────────────────

/**
 * HeroOverlayCard – full width, image fills card, text overlaid at bottom.
 * Used in the 8-column slot of the FEATURED layout.
 */
function HeroOverlayCard({ article }: { article: HomepageArticle }) {
  return (
    <Link
      href={routes.article(article.slug)}
      className="group relative block w-full overflow-hidden rounded-xl shadow-md aspect-[16/9] bg-zinc-900"
    >
      <Image
        src={getImageSrc(article.thumbnail)}
        alt={article.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
        loading="lazy"
        unoptimized={true}
        onError={(e) => { if (!e.currentTarget.src.includes(PLACEHOLDER_IMAGE)) { e.currentTarget.srcset = ''; e.currentTarget.src = PLACEHOLDER_IMAGE; } }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      {/* Category badge */}
      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-[10px] rounded-sm font-bold uppercase tracking-widest shadow">
        {article.category.name}
      </div>
      {/* Text at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight text-white group-hover:text-red-300 transition-colors mb-2 drop-shadow-lg">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed drop-shadow">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

/**
 * SidebarCard – image left (fixed size), text right.
 * Used in the 4-column sidebar slot of the FEATURED layout (3 stacked cards).
 */
function SidebarCard({ article }: { article: HomepageArticle }) {
  return (
    <Link
      href={routes.article(article.slug)}
      className="group flex gap-3 items-start min-w-0 border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={getImageSrc(article.thumbnail)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          unoptimized={true}
          onError={(e) => { if (!e.currentTarget.src.includes(PLACEHOLDER_IMAGE)) { e.currentTarget.srcset = ''; e.currentTarget.src = PLACEHOLDER_IMAGE; } }}
        />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1 block">
          {article.category.name}
        </span>
        <h4 className="text-[13px] font-bold leading-snug text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-3">
          {article.title}
        </h4>
      </div>
    </Link>
  )
}

/**
 * StoryCard – image on top, text below.
 * Used in 3-column (4-across) rows: STANDARD, VIDEO, bottom row of FEATURED, GRID_2X2.
 */
function StoryCard({ article }: { article: HomepageArticle }) {
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
          onError={(e) => { if (!e.currentTarget.src.includes(PLACEHOLDER_IMAGE)) { e.currentTarget.srcset = ''; e.currentTarget.src = PLACEHOLDER_IMAGE; } }}
        />
      </div>
      <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider mb-1 block">
        {article.category.name}
      </span>
      <h4 className="text-[14px] font-bold text-zinc-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-3">
        {article.title}
      </h4>
    </Link>
  )
}

/**
 * MediumCard – image left, text right (used in MAGAZINE layout).
 */
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
          onError={(e) => { if (!e.currentTarget.src.includes(PLACEHOLDER_IMAGE)) { e.currentTarget.srcset = ''; e.currentTarget.src = PLACEHOLDER_IMAGE; } }}
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

/**
 * FeaturedCard – alias used in MAGAZINE center column.
 * Large image with text below.
 */
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
          onError={(e) => { if (!e.currentTarget.src.includes(PLACEHOLDER_IMAGE)) { e.currentTarget.srcset = ''; e.currentTarget.src = PLACEHOLDER_IMAGE; } }}
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

  const articles = grid.articles

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

      {/* ─── FEATURED Layout: 8/4 hero row + 4-across bottom row ─── */}
      {grid.layout === 'FEATURED' && (
        <div className="flex flex-col gap-6">
          {/* Top row: hero (8 cols) + 3 sidebar cards (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {articles[0] && <HeroOverlayCard article={articles[0]} />}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4">
              {articles.slice(1, 4).map(article => (
                <SidebarCard key={article.id} article={article} />
              ))}
            </div>
          </div>
          {/* Bottom row: 4-across (3 cols each = 12 total) */}
          {articles.length > 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-zinc-100">
              {articles.slice(4, 8).map(article => (
                <StoryCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── MAGAZINE Layout: 3 medium | 6 featured | 3 medium ─── */}
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

      {/* ─── STANDARD / VIDEO Layout: 4-across (3 cols each) ─── */}
      {(grid.layout === 'STANDARD' || grid.layout === 'VIDEO') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 8).map((article) => (
            <StoryCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* ─── GRID_2X2 Layout: 2 columns, 2 rows ─── */}
      {grid.layout === 'GRID_2X2' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((article) => (
            <StoryCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* ─── BENTO Layout (Photo Gallery) – DO NOT MODIFY ─── */}
      {grid.layout === 'BENTO' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[250px] grid-flow-row-dense">
          {articles.map((article, index) => {
            const i = index % 8;
            let spanClass = "col-span-1 row-span-1";
            switch (i) {
              case 0: spanClass = "col-span-2 row-span-2"; break;
              case 1: spanClass = "col-span-1 row-span-1"; break;
              case 2: spanClass = "col-span-1 row-span-1"; break;
              case 3: spanClass = "col-span-2 row-span-1 md:col-span-2 md:row-span-1"; break;
              case 4: spanClass = "col-span-1 row-span-2 md:col-span-1 md:row-span-2"; break;
              case 5: spanClass = "col-span-1 row-span-1"; break;
              case 6: spanClass = "col-span-2 row-span-2"; break;
              case 7: spanClass = "col-span-1 row-span-1"; break;
            }

            return (
              <Link
                key={article.id}
                href={routes.article(article.slug)}
                className={`${spanClass} group relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all`}
              >
                <Image
                  src={getImageSrc(article.thumbnail)}
                  alt={article.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  unoptimized={true}
                  onError={(e) => { if (!e.currentTarget.src.includes(PLACEHOLDER_IMAGE)) { e.currentTarget.srcset = ''; e.currentTarget.src = PLACEHOLDER_IMAGE; } }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1 block text-red-400 drop-shadow-md">
                      {article.category.name}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-3 drop-shadow-md group-hover:text-red-400 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

    </section>
  )
}
