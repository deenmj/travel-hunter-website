'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Link as LinkIcon, X, Film, Loader2, Sparkles } from 'lucide-react'
import { extractYouTubeId, isDirectVideoUrl } from '@/lib/video-utils'

export interface VideoInputValue {
  youtubeId: string
  videoUrl: string
}

interface VideoInputProps {
  value: VideoInputValue
  onChange: (value: VideoInputValue) => void
  label?: string
  required?: boolean
  /** Called when YouTube metadata is auto-fetched */
  onYoutubeMeta?: (meta: { title?: string; thumbnail?: string }) => void
}

export default function VideoInput({
  value,
  onChange,
  label = 'Video',
  required = false,
  onYoutubeMeta,
}: VideoInputProps) {
  const hasValue = Boolean(value.youtubeId || value.videoUrl)
  const isUploaded = value.videoUrl.includes('/storage/v1/object/public/media/')
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>(hasValue && !isUploaded && value.youtubeId ? 'url' : 'upload')
  const [uploading, setUploading] = useState(false)
  const [fetchingMeta, setFetchingMeta] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleClear = () => {
    onChange({ youtubeId: '', videoUrl: '' })
    setUrlInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const fetchYoutubeMeta = async (ytId: string) => {
    if (!onYoutubeMeta) return
    setFetchingMeta(true)
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
      const data = await response.json()
      if (data?.title) {
        onYoutubeMeta({
          title: data.title,
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
        })
      }
    } catch {
      onYoutubeMeta?.({ thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` })
    } finally {
      setFetchingMeta(false)
    }
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 100 * 1024 * 1024) {
      setError('Video file must be less than 100MB')
      return
    }
    if (!file.type.startsWith('video/')) {
      setError('Only video files are allowed (MP4, WebM, MOV)')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `videos/${fileName}`

      const { data, error: uploadError } = await supabase.storage.from('media').upload(filePath, file)
      if (uploadError) throw new Error(uploadError.message)

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(data.path)

      onChange({ youtubeId: '', videoUrl: publicUrl })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload video'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = async (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setError(null)
    const ytId = extractYouTubeId(trimmed)

    if (ytId) {
      onChange({ youtubeId: ytId, videoUrl: '' })
      await fetchYoutubeMeta(ytId)
    } else if (isDirectVideoUrl(trimmed)) {
      onChange({ youtubeId: '', videoUrl: trimmed })
    } else {
      setError('Enter a valid YouTube link/ID or direct video URL (https://...)')
    }
  }

  const previewSource = value.youtubeId
    ? { type: 'youtube' as const, id: value.youtubeId }
    : value.videoUrl
      ? { type: 'direct' as const, url: value.videoUrl }
      : null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove Video
          </button>
        )}
      </div>

      {previewSource ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 group">
          <div className="aspect-video">
            {previewSource.type === 'youtube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${previewSource.id}`}
                className="w-full h-full"
                allowFullScreen
                title="Video preview"
              />
            ) : (
              <video src={previewSource.url} controls className="w-full h-full object-contain" />
            )}
          </div>
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="bg-white hover:bg-slate-100 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              Change Video
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'upload'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload Video
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2.5 text-xs font-medium border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'url'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Video URL
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'upload' ? (
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  uploading
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/*"
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uploading video...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-1">
                      <Film className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Click to upload video</p>
                    <p className="text-xs text-slate-400">MP4, WebM or MOV (Max 100MB)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="YouTube link/ID or direct video URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleUrlSubmit(urlInput)
                      }
                    }}
                    onBlur={() => urlInput && handleUrlSubmit(urlInput)}
                    className="w-full h-11 px-3 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {fetchingMeta ? (
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Paste a YouTube link (auto-fetches title & thumbnail) or a direct MP4/WebM URL.
                </p>
              </div>
            )}

            {error && <p className="text-xs text-red-500 font-medium mt-2">⚠️ {error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
