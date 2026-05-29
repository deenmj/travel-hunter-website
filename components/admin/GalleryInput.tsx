'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
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

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <p className="text-xs text-slate-400 -mt-1">
        Add extra photos for the gallery section on the destination page (upload or URL).
      </p>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Gallery Photo
        </button>
      )}
    </div>
  )
}
