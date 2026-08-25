'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MainSiteNewsItem } from '@/lib/newsApi'
import { ChevronLeft, ChevronRight, Camera, Sparkles, Layers, ArrowRight, Search, X } from 'lucide-react'

function safeImg(url: string | null | undefined) {
  if (!url || url === 'undefined' || url === '') return '/placeholder-news.jpg'
  if (url.startsWith('http') || url.startsWith('/')) return url
  return `/uploads/${url}`
}

export function GalleryGrid({ items }: { items: MainSiteNewsItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPaused, setIsPaused] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)
  const collectionRef = useRef<HTMLDivElement>(null)
  const scrollStep = useRef<number>(0)
  const isScrolling = useRef<boolean>(false)

  // Strictly top 5 featured albums for carousel
  const featuredOnly = items.filter((item) => item.isFeatured)
  const featuredItems = (featuredOnly.length > 0 ? featuredOnly : items).slice(0, 5)
  const totalFeatured = featuredItems.length

  // Filter all items based on search query
  const filteredAlbums = items.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.headline.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    )
  })

  // Auto-play 3D carousel (3 seconds)
  useEffect(() => {
    if (totalFeatured <= 1 || isPaused) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % totalFeatured)
    }, 3000)
    return () => clearInterval(timer)
  }, [totalFeatured, isPaused])

  // 2-Step Smooth Scroll Snap Interaction:
  // Step 1: 1st scroll down snaps carousel to full-screen focus.
  // Step 2: Next scroll down snaps to Photo Albums Collection.
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return
      const scrollY = window.scrollY

      // 1st scroll down: Snap carousel into full screen focus
      if (scrollY > 30 && scrollY < 250 && scrollStep.current === 0) {
        scrollStep.current = 1
        isScrolling.current = true
        carouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => { isScrolling.current = false }, 600)
      } 
      // 2nd scroll down: Snap straight to Photo Albums Collection
      else if (scrollY > 280 && scrollStep.current === 1) {
        scrollStep.current = 2
        isScrolling.current = true
        collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setTimeout(() => { isScrolling.current = false }, 600)
      } 
      // Reset step if scrolled back to absolute top
      else if (scrollY < 15) {
        scrollStep.current = 0
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const nextSlide = () => setActiveIdx((prev) => (prev + 1) % totalFeatured)
  const prevSlide = () => setActiveIdx((prev) => (prev - 1 + totalFeatured) % totalFeatured)

  if (!items || items.length === 0) {
    return (
      <div className="py-24 text-center text-zinc-400 font-sans">
        <Camera className="w-12 h-12 mx-auto mb-3 text-zinc-300 stroke-[1.5]" />
        <p className="text-lg font-bold text-zinc-700 uppercase tracking-wide">No Photo Albums Available</p>
        <p className="text-xs text-zinc-500 mt-1">Check back soon for new event coverage & campus photos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 font-sans text-zinc-900 pb-16">
      
      {/* ─── SECTION 1: FULL-WIDTH 3D PARALLAX FEATURED CAROUSEL ─── */}
      {totalFeatured > 0 && (
        <div id="carousel-hero" ref={carouselRef} className="space-y-3 pt-1 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 px-4 sm:px-6 md:px-10 lg:px-14">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-zinc-900">
                Featured Photo Collections
              </h2>
            </div>
            <div className="text-xs font-mono font-bold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
              <span className="text-red-600">{activeIdx + 1}</span> / {totalFeatured}
            </div>
          </div>

          {/* Full-Width 3D Carousel Stage */}
          <div
            className="relative w-full min-h-[70vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden py-8 px-6 sm:px-12 md:px-16 bg-gradient-to-b from-zinc-950/5 via-zinc-900/10 to-transparent border border-zinc-200/90 rounded-3xl shadow-md"
            style={{ perspective: '1200px' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 3D Track */}
            <div className="relative w-full max-w-7xl h-[60vh] md:h-[68vh] flex items-center justify-center">
              {featuredItems.map((item, idx) => {
                let offset = idx - activeIdx
                if (offset > totalFeatured / 2) offset -= totalFeatured
                if (offset < -totalFeatured / 2) offset += totalFeatured

                const isActive = offset === 0
                const isAbsOne = Math.abs(offset) === 1

                const rotateY = offset * -28
                const translateZ = isActive ? 0 : -160 * Math.abs(offset)
                const translateX = offset * 290
                const scale = isActive ? 1 : Math.max(0.72, 1 - Math.abs(offset) * 0.14)
                const opacity = isActive ? 1 : isAbsOne ? 0.75 : 0.2
                const zIndex = 100 - Math.abs(offset) * 10

                const photoCount =
                  typeof item.imageCount === 'number' && item.imageCount > 0
                    ? item.imageCount
                    : Array.isArray(item.images) && item.images.length > 0
                    ? item.images.length
                    : (item.image && item.image !== '/new_logo.png' && item.image !== '/placeholder-news.jpg' ? 1 : 0)

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      transition: 'all 700ms cubic-bezier(0.2, 0.7, 0, 1)'
                    }}
                    className={`absolute w-[90%] sm:w-[82%] md:w-[76%] h-full rounded-2xl md:rounded-3xl overflow-hidden border bg-zinc-950 cursor-pointer ${
                      isActive
                        ? 'border-red-600 ring-4 ring-red-600/70 shadow-[0_25px_60px_rgba(220,38,38,0.25)]'
                        : 'border-zinc-300 shadow-xl pointer-events-auto hover:opacity-90'
                    }`}
                  >
                    {/* Slide Background Image */}
                    <img
                      src={safeImg(item.image)}
                      alt={item.headline}
                      onError={(e) => {
                        if (!e.currentTarget.src.includes('/placeholder-news.jpg')) {
                          e.currentTarget.srcset = '';
                          e.currentTarget.src = '/placeholder-news.jpg';
                        }
                      }}
                      className="w-full h-full object-cover transform scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Photo Count Badge (Top Right) */}
                    <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                      <Camera className="w-3.5 h-3.5 text-red-400" />
                      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                    </div>

                    {/* Minimal Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white space-y-2">
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight drop-shadow line-clamp-2">
                        {item.headline}
                      </h2>

                      {isActive && (
                        <div className="pt-1">
                          <Link
                            href={item.link}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
                          >
                            <span>Explore Album</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Navigation Arrows with Generous Side Padding */}
            {totalFeatured > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-4 sm:left-8 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-red-600 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl z-50 cursor-pointer"
                  title="Previous Album"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-red-600 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl z-50 cursor-pointer"
                  title="Next Album"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Bottom Dots Navigation */}
            {totalFeatured > 1 && (
              <div className="absolute bottom-1 flex items-center gap-2 z-50">
                {featuredItems.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIdx === idx ? 'w-8 bg-red-600' : 'w-2.5 bg-zinc-400 hover:bg-zinc-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SECTION 2: SEARCH BAR & BENTO GRID COLLECTION (AUTOSCROLL TARGET) ─── */}
      <div ref={collectionRef} className="space-y-6 pt-6 border-t-4 border-zinc-900 scroll-mt-6">
        
        {/* Gallery Title & Interactive Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 uppercase flex items-center gap-2">
              <Layers className="w-7 h-7 text-red-600" />
              <span>Photo Albums Collection</span>
            </h2>
            <p className="text-zinc-500 text-xs mt-1">Explore moments, events and campus photo archives</p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search photo albums..."
                className="w-full pl-10 pr-9 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white border border-zinc-300 focus:border-red-600 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-700 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                Found {filteredAlbums.length} {filteredAlbums.length === 1 ? 'album' : 'albums'}
              </p>
            )}
          </div>
        </div>

        {/* ─── BENTO GRID ALBUMS LAYOUT ─── */}
        {filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[320px]">
            {filteredAlbums.map((item, index) => {
              const i = index % 6
              let spanClass = 'col-span-1 row-span-1'
              if (i === 0) spanClass = 'sm:col-span-2 sm:row-span-2'
              else if (i === 3) spanClass = 'sm:col-span-2 sm:row-span-1'

              const photoCount =
                typeof item.imageCount === 'number' && item.imageCount > 0
                  ? item.imageCount
                  : Array.isArray(item.images) && item.images.length > 0
                  ? item.images.length
                  : (item.image && item.image !== '/new_logo.png' && item.image !== '/placeholder-news.jpg' ? 1 : 0)

              return (
                <div
                  key={item.id}
                  className={`${spanClass} group relative flex flex-col bg-zinc-950 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1`}
                >
                  <Link href={item.link} className="block relative w-full h-full">
                    {/* Cover Photo */}
                    <img
                      src={safeImg(item.image)}
                      alt={item.headline}
                      onError={(e) => {
                        if (!e.currentTarget.src.includes('/placeholder-news.jpg')) {
                          e.currentTarget.srcset = '';
                          e.currentTarget.src = '/placeholder-news.jpg';
                        }
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                    {/* Photo Count Badge */}
                    <div className="absolute top-3.5 right-3.5 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                      <span>📷</span>
                      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                    </div>

                    {/* Category Pill */}
                    <div className="absolute top-3.5 left-3.5 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow">
                      Album
                    </div>

                    {/* Album Title & Footer Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1.5">
                      <h3 className="font-extrabold text-base sm:text-lg md:text-xl leading-snug drop-shadow-md group-hover:text-red-300 transition-colors line-clamp-2">
                        {item.headline}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-zinc-300 pt-1 border-t border-white/20">
                        <span className="font-semibold text-zinc-300">Manav Rachna Times</span>
                        <span className="font-bold text-red-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          View Album →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-500 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl">
            <p className="text-sm font-bold text-zinc-700">No photo albums match &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-semibold text-red-600 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
