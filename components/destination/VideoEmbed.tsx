interface VideoEmbedProps {
  youtubeId: string
  title?: string
  className?: string
}

export function VideoEmbed({ youtubeId, title, className = '' }: VideoEmbedProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}
