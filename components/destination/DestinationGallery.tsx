'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface DestinationGalleryProps {
  images: string[]
  name: string
}

export function DestinationGallery({ images, name }: DestinationGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-3 gap-3">
        {images.slice(0, 6).map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className={`group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'
            }`}
          >
            <img
              src={src}
              alt={`${name} photo ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </button>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {images.map((src, i) => (
              <CarouselItem key={src + i} className="pl-3 basis-[85%] sm:basis-[70%]">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden block"
                >
                  <img
                    src={src}
                    alt={`${name} photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 border-0 bg-white/90 shadow-md" />
          <CarouselNext className="right-2 border-0 bg-white/90 shadow-md" />
        </Carousel>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
            }}
            className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`${name} photo ${lightboxIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((lightboxIndex + 1) % images.length)
            }}
            className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="absolute bottom-6 text-white/70 text-sm">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
