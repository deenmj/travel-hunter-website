'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Featured Image' }: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>(value && !value.includes('/storage/v1/object/public/media/') ? 'url' : 'upload')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        if (uploadError.message.toLowerCase().includes('bucket not found')) {
          throw new Error(
            'Storage bucket "media" is missing. Run supabase-storage-setup.sql in your Supabase SQL Editor, then try again.',
          )
        }
        throw new Error(uploadError.message)
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(data.path)

      onChange(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
  }

  const handleClear = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove Image
          </button>
        )}
      </div>

      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="bg-white hover:bg-slate-100 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          {/* Tabs */}
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
              <Upload className="w-3.5 h-3.5" /> Upload File
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
              <LinkIcon className="w-3.5 h-3.5" /> Image URL
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {activeTab === 'upload' ? (
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  uploading
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Uploading image...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Click to upload
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      PNG, JPG, GIF or WEBP (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={value}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Paste a direct link to any web image.
                </p>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 font-medium mt-2">
                ⚠️ {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
