'use client'

import { useEffect, useCallback } from 'react'

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
  const currentImg = images[currentIndex]

  const handlePrev = useCallback(() => {
    if (images.length === 0) return
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const handleNext = useCallback(() => {
    if (images.length === 0) return
    onNavigate((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onNavigate])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, handlePrev, handleNext])

  if (!isOpen || !currentImg) return null

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
    } catch (err) {
      console.error('Failed to download image:', err)
      // Fallback direct open/download link
      window.open(currentImg.src, '_blank')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn"
      onClick={onClose}
    >
      {/* ─── Top Control Bar ─── */}
      <div className="flex items-center justify-between z-10 w-full max-w-7xl mx-auto py-2 px-4" onClick={e => e.stopPropagation()}>
        {/* Counter */}
        <div className="text-zinc-300 font-mono text-xs md:text-sm bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full shadow">
          📷 <span className="font-bold text-white">{currentIndex + 1}</span> / {images.length}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold rounded-lg shadow transition active:scale-95"
            title="Download full resolution photo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition shadow text-lg font-bold"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ─── Main Image Viewer with Navigation ─── */}
      <div className="relative flex-1 flex items-center justify-center my-4 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 md:left-6 z-20 w-11 h-11 md:w-14 md:h-14 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition shadow-lg backdrop-blur-sm border border-white/10 group"
            title="Previous (Left Arrow)"
          >
            <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Display Image */}
        <div className="relative max-h-full max-w-full flex items-center justify-center p-2" onClick={e => e.stopPropagation()}>
          <img
            src={currentImg.src}
            alt={currentImg.title || `Photo ${currentIndex + 1}`}
            className="max-h-[78vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 md:right-6 z-20 w-11 h-11 md:w-14 md:h-14 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition shadow-lg backdrop-blur-sm border border-white/10 group"
            title="Next (Right Arrow)"
          >
            <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* ─── Bottom Caption Overlay ─── */}
      {currentImg.title && (
        <div className="text-center text-zinc-300 text-xs md:text-sm max-w-3xl mx-auto py-2 px-4 bg-zinc-900/60 rounded-lg backdrop-blur-sm" onClick={e => e.stopPropagation()}>
          {currentImg.title}
        </div>
      )}
    </div>
  )
}
