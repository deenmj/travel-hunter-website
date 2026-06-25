'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { optimizeImage, formatBytes } from '@/lib/image-utils'

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'optimizing' | 'uploading' | 'error' | 'done'
  error?: string
  originalSize?: number
  newSize?: number
  skipped?: boolean
}

export default function MultiImageUpload({ value = [], onChange, label = 'Gallery Images' }: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (validFiles.length === 0) return

    const newUploads = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      progress: 0,
      status: 'optimizing' as const
    }))

    setUploadingFiles(prev => [...prev, ...newUploads])

    for (const upload of newUploads) {
      try {
        // 1. Optimize
        const { file: optimizedFile, originalSize, newSize, skipped } = await optimizeImage(upload.file)
        
        setUploadingFiles(prev => prev.map(f => 
          f.id === upload.id ? { ...f, status: 'uploading', originalSize, newSize, skipped } : f
        ))

        // 2. Upload to Supabase Storage
        const fileExt = optimizedFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { data, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, optimizedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)

        // 3. Update main state
        onChange([...value, publicUrl])
        
        // Mark as done briefly before removing from uploading list
        setUploadingFiles(prev => prev.map(f => 
          f.id === upload.id ? { ...f, status: 'done', progress: 100 } : f
        ))

        // Remove from uploading list after a short delay
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== upload.id))
        }, 3000)

      } catch (err: any) {
        setUploadingFiles(prev => prev.map(f => 
          f.id === upload.id ? { ...f, status: 'error', error: err.message || 'Upload failed' } : f
        ))
      }
    }
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
    // Reset input so the same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...value]
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return
    
    ;[newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-xs text-slate-500 font-medium">
          {value.length} image{value.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid of existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </div>

              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i > 0 && (
                  <button type="button" onClick={() => moveImage(i, 'left')} className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow transition-all hover:scale-105">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                
                <button type="button" onClick={() => removeImage(i)} className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center shadow transition-all hover:scale-105">
                  <X className="w-4 h-4" />
                </button>
                
                {i < value.length - 1 && (
                  <button type="button" onClick={() => moveImage(i, 'right')} className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow transition-all hover:scale-105">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Currently uploading files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(file => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                {file.status === 'done' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : file.status === 'error' ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {file.status === 'optimizing' && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Optimizing...</span>}
                  {file.status === 'uploading' && <span className="text-xs text-blue-600 font-medium flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</span>}
                  {file.status === 'done' && <span className="text-xs text-emerald-600 font-medium">Complete</span>}
                  {file.status === 'error' && <span className="text-xs text-red-500 font-medium">{file.error}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 scale-[1.02]'
            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            Select multiple images. They will be automatically optimized and converted to WebP (Max 3MB final size).
          </p>
        </div>
      </div>
    </div>
  )
}
