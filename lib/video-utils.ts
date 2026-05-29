/** Extract YouTube video ID from URL or raw ID string */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (match) return match[1]

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  return null
}

/** True when value is a hosted/uploaded video URL (not YouTube) */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false
  if (extractYouTubeId(url)) return false
  return /^https?:\/\//.test(url)
}

/** Resolve playable source from youtube_id and/or video_url fields */
export function resolveVideoSource(youtubeId?: string | null, videoUrl?: string | null) {
  if (videoUrl && isDirectVideoUrl(videoUrl)) {
    return { type: 'direct' as const, url: videoUrl }
  }
  const id = youtubeId ? extractYouTubeId(youtubeId) ?? (videoUrl ? extractYouTubeId(videoUrl) : null) : null
  if (id) return { type: 'youtube' as const, youtubeId: id }
  if (videoUrl) {
    const fromUrl = extractYouTubeId(videoUrl)
    if (fromUrl) return { type: 'youtube' as const, youtubeId: fromUrl }
    if (isDirectVideoUrl(videoUrl)) return { type: 'direct' as const, url: videoUrl }
  }
  return null
}

/** Best thumbnail for destination cards: featured image, then YouTube thumbnail */
export function getDestinationThumbnail(destination: {
  featured_image?: string | null
  video_id?: string | null
  video_url?: string | null
}): string | null {
  if (destination.featured_image) return destination.featured_image

  const ytId =
    (destination.video_id && extractYouTubeId(destination.video_id)) ||
    (destination.video_url && extractYouTubeId(destination.video_url))

  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`

  return null
}
