import type { Destination } from '@/lib/types'
import { extractYouTubeId } from '@/lib/video-utils'

export function getGalleryImages(destination: Destination): string[] {
  const images: string[] = []

  if (destination.featured_image) images.push(destination.featured_image)
  destination.images?.forEach((img) => {
    if (img && !images.includes(img)) images.push(img)
  })

  const ytId =
    (destination.video_id && extractYouTubeId(destination.video_id)) ||
    (destination.video_url && extractYouTubeId(destination.video_url))
  if (ytId) {
    const thumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    if (!images.includes(thumb)) images.push(thumb)
  }

  return images
}

export function getBudgetLabel(category: Destination['category']): string {
  switch (category) {
    case 'eat':
      return 'Moderate'
    case 'stay':
      return 'Premium'
    default:
      return 'Budget Friendly'
  }
}

export function getRating(slug: string): number {
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return Math.round((4.5 + (hash % 5) * 0.1) * 10) / 10
}

export function getHowToReach(destination: Destination): string {
  const place = destination.location || 'the area'
  return `Reach ${place} by train, bus, or private hire from Colombo or Kandy. Local tuk-tuks and ride apps are widely available for the last mile.`
}

export function getEntryFees(category: Destination['category']): string {
  switch (category) {
    case 'eat':
      return 'Varies by venue — street food from LKR 200, restaurants LKR 1,500+'
    case 'stay':
      return 'Room rates vary by season — book ahead during peak months'
    default:
      return 'Entry fees vary — many sites LKR 500–3,000 for foreign visitors'
  }
}

export function hasVideo(destination: Destination): boolean {
  return Boolean(
    destination.video_id ||
      (destination.video_url && destination.video_url.length > 0),
  )
}

export function getDestinationHref(destination: { slug?: string | null; id: string }): string {
  return `/destinations/${destination.slug?.trim() || destination.id}`
}
