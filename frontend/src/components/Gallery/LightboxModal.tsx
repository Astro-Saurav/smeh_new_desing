'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause,
  Share2,
  Check,
  Layers,
  Sparkles
} from 'lucide-react'

export interface LightboxImage {
  src: string
  title?: string
  originalName?: string
}

interface LightboxModalProps {
  images: LightboxImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export function LightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}: LightboxModalProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const currentImg = images[currentIndex]

  // Reset zoom & rotation when changing photos
  useEffect(() => {
    setZoom(1)
    setRotation(0)
  }, [currentIndex])

  const handlePrev = useCallback(() => {
    if (images.length === 0) return
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const handleNext = useCallback(() => {
    if (images.length === 0) return
    onNavigate((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onNavigate])

  // Slideshow timer
  useEffect(() => {
    if (!isOpen || !isPlaying || images.length <= 1) return
    const timer = setInterval(() => {
      handleNext()
    }, 3500)
    return () => clearInterval(timer)
  }, [isOpen, isPlaying, images.length, handleNext])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(prev => !prev)
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleBrowserFullscreen()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, handlePrev, handleNext])

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5))
  const handleResetTransform = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentImg) return

    setIsDownloading(true)
    try {
      const response = await fetch(currentImg.src)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      const filename = currentImg.originalName || `photo-${currentIndex + 1}.jpg`
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(currentImg.src, '_blank')
    } finally {
      setTimeout(() => setIsDownloading(false), 1000)
    }
  }

  if (!isOpen || !currentImg) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-fadeIn font-sans text-zinc-100 overflow-hidden"
      onClick={onClose}
    >
      {/* ─── TOP CONTROL BAR ─── */}
      <div
        className="relative z-30 w-full px-4 md:px-8 py-3 flex items-center justify-between bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent border-b border-zinc-800/40"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Counter & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/90 border border-zinc-700/60 rounded-full text-xs font-mono text-zinc-300 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-red-500" />
            <span>
              <strong className="text-white">{currentIndex + 1}</strong> / {images.length}
            </span>
          </div>

          {currentImg.title && (
            <span className="hidden sm:inline-block text-xs font-medium text-zinc-400 max-w-xs md:max-w-md truncate">
              {currentImg.title}
            </span>
          )}
        </div>

        {/* Center/Right: Sleek Tool Buttons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Slideshow Auto Play/Pause */}
          {images.length > 1 && (
            <button
              onClick={() => setIsPlaying(prev => !prev)}
              className={`p-2 rounded-lg transition-all flex items-center gap-1 text-xs font-medium ${
                isPlaying
                  ? 'bg-red-600/90 text-white ring-2 ring-red-500/50'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
              title={isPlaying ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-zinc-300" />}
              <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Slideshow'}</span>
            </button>
          )}

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 border border-zinc-800 rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 border border-zinc-800 rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Reset Zoom/Rotate (only if transformed) */}
          {(zoom !== 1 || rotation !== 0) && (
            <button
              onClick={handleResetTransform}
              className="px-2 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 text-[10px] font-mono rounded-lg transition"
              title="Reset View"
            >
              Reset
            </button>
          )}

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          {/* Copy Share Link */}
          <button
            onClick={handleShare}
            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition relative"
            title="Share Album"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Modern Icon Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 bg-zinc-900/90 hover:bg-red-600/90 text-zinc-200 hover:text-white border border-zinc-800 hover:border-red-500/50 rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Download Full Quality Image"
          >
            <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-red-400' : ''}`} />
            <span className="hidden sm:inline text-xs font-semibold">Download</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleBrowserFullscreen}
            className="p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition"
            title="Toggle Native Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition shadow-md ml-1"
            title="Close Lightbox (Esc)"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* ─── MAIN STAGE: IMAGE DISPLAY & NAV ARROWS ─── */}
      <div className="relative flex-1 flex items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-12 my-auto overflow-hidden">
        {/* Nav Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-2 md:left-6 z-30 p-3.5 rounded-full bg-zinc-900/80 hover:bg-red-600 text-white border border-zinc-800 hover:border-red-500 shadow-2xl backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 group"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Display Image with Dynamic Zoom & Rotation */}
        <div
          className="relative max-h-full max-w-full flex items-center justify-center transition-transform duration-300 ease-out"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={currentImg.src}
            alt={currentImg.title || `Photo ${currentIndex + 1}`}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxHeight: showThumbnails ? '68vh' : '82vh',
              maxWidth: '88vw'
            }}
            className="object-contain rounded-xl shadow-2xl transition-all duration-300 ease-out cursor-grab active:cursor-grabbing border border-zinc-800/50"
          />
        </div>

        {/* Nav Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-2 md:right-6 z-30 p-3.5 rounded-full bg-zinc-900/80 hover:bg-red-600 text-white border border-zinc-800 hover:border-red-500 shadow-2xl backdrop-blur-md transition-all duration-200 transform hover:scale-110 active:scale-95 group"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* ─── BOTTOM CAPTION & FILMSTRIP THUMBNAILS ─── */}
      <div
        className="relative z-30 w-full bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pt-3 pb-4 px-4 border-t border-zinc-800/40 space-y-3"
        onClick={e => e.stopPropagation()}
      >
        {/* Caption */}
        {currentImg.title && (
          <div className="text-center">
            <span className="text-xs md:text-sm font-medium text-zinc-300 bg-zinc-900/80 border border-zinc-800/80 px-4 py-1.5 rounded-full shadow inline-block">
              {currentImg.title}
            </span>
          </div>
        )}

        {/* Filmstrip Carousel of Album Photos */}
        {images.length > 1 && showThumbnails && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-4 max-w-4xl mx-auto no-scrollbar">
            {images.map((img, idx) => {
              const isSelected = idx === currentIndex
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(idx)}
                  className={`relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-red-500 ring-2 ring-red-500/50 scale-105 opacity-100 shadow-lg'
                      : 'border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600'
                  }`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-red-600/20 border border-red-400 rounded-lg pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Copied Toast */}
      {copied && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> Link Copied to Clipboard!
        </div>
      )}
    </div>
  )
}
