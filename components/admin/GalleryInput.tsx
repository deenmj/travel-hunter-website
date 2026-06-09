'use client'

import { useState } from 'react'
import { X, Plus, ChevronUp, ChevronDown, GripVertical, Image as ImageIcon } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

interface GalleryInputProps {
  value: string[]
  onChange: (images: string[]) => void
  label?: string
}

export default function GalleryInput({
  value,
  onChange,
  label = 'Gallery Images',
}: GalleryInputProps) {
  const [adding, setAdding] = useState(false)
  const [pendingUrl, setPendingUrl] = useState('')

  const addImage = (url: string) => {
    const trimmed = url.trim()
    if (!trimmed || value.includes(trimmed)) return
    onChange([...value, trimmed])
    setPendingUrl('')
    setAdding(false)
  }

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...value]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return
    ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        {value.length > 0 && (
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {value.length} photo{value.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 -mt-1">
        Add extra photos for the gallery section. Drag to reorder.
      </p>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />

              {/* Image number badge */}
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </div>

              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {/* Move up */}
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, 'up')}
                    className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow transition-colors"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}

                {/* Move down */}
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, 'down')}
                    className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow transition-colors"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center shadow transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="space-y-2">
          <ImageUpload
            value={pendingUrl}
            onChange={(url) => {
              if (url) addImage(url)
            }}
            label="Add Gallery Photo"
          />
          <button
            type="button"
            onClick={() => {
              setAdding(false)
              setPendingUrl('')
            }}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Gallery Photo
        </button>
      )}
    </div>
  )
}
