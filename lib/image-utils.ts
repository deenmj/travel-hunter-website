/**
 * Client-side image optimization utility
 * Converts images to WebP and scales them down if they exceed a target file size or max dimensions.
 */

interface OptimizeOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  initialQuality?: number
}

/**
 * Optimizes a given image File.
 * - Resizes if dimensions exceed maxWidthOrHeight
 * - Converts to WebP format
 * - Iteratively reduces quality until it fits under maxSizeMB
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<{ file: File; originalSize: number; newSize: number; skipped: boolean }> {
  // Default target: max 2.5MB, max 2560px (4K-ish)
  const {
    maxSizeMB = 2.5,
    maxWidthOrHeight = 2560,
    initialQuality = 0.85,
  } = options

  const targetBytes = maxSizeMB * 1024 * 1024;

  // Smart Optimization: If the file is already small enough, skip compression
  // to preserve original quality and format.
  if (file.size <= targetBytes) {
    return {
      file,
      originalSize: file.size,
      newSize: file.size,
      skipped: true
    }
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width)
            width = maxWidthOrHeight
          } else {
            width = Math.round((width * maxWidthOrHeight) / height)
            height = maxWidthOrHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height)

        let currentQuality = initialQuality
        
        // Helper to convert canvas to file and check size
        const attemptCompression = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob failed'))
                return
              }

              // If size is good, or quality is already very low, accept it
              if (blob.size <= targetBytes || quality <= 0.3) {
                const optimizedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, "") + '.webp',
                  {
                    type: 'image/webp',
                    lastModified: Date.now(),
                  }
                )
                resolve({
                  file: optimizedFile,
                  originalSize: file.size,
                  newSize: blob.size,
                  skipped: false
                })
              } else {
                // Drop quality and try again
                attemptCompression(quality - 0.15)
              }
            },
            'image/webp',
            quality
          )
        }

        attemptCompression(currentQuality)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Format bytes into human readable string
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
