import { resolveVideoSource } from '@/lib/video-utils'

interface VideoEmbedProps {
  youtubeId?: string | null
  videoUrl?: string | null
  title?: string
  className?: string
}

export function VideoEmbed({ youtubeId, videoUrl, title, className = '' }: VideoEmbedProps) {
  const source = resolveVideoSource(youtubeId, videoUrl)

  if (!source) return null

  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
        {source.type === 'youtube' ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${source.youtubeId}?rel=0`}
            title={title || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video
            className="absolute top-0 left-0 w-full h-full"
            src={source.url}
            controls
            playsInline
            title={title || 'Video player'}
          />
        )}
      </div>
    </div>
  )
}
