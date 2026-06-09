'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import type { WishlistItem } from '@/lib/types'

interface WishlistButtonProps {
  item: Omit<WishlistItem, 'addedAt'>
  className?: string
  size?: 'sm' | 'md'
}

export function WishlistButton({ item, className = '', size = 'md' }: WishlistButtonProps) {
  const { toggleItem, isInWishlist, loaded } = useWishlist()
  const active = loaded && isInWishlist(item.id, item.type)

  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(item)
      }}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all duration-300 ${
        active
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-500 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 shadow-md'
      } ${className}`}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <Heart className={`${iconSize} ${active ? 'fill-current' : ''} transition-all`} />
    </button>
  )
}
