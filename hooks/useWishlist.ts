'use client'

import { useState, useEffect, useCallback } from 'react'
import type { WishlistItem } from '@/lib/types'

const WISHLIST_KEY = 'travel-hunter-wishlist'

function getStoredWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setItems(getStoredWishlist())
    setLoaded(true)
  }, [])

  const addItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) return prev
      const next = [...prev, { ...item, addedAt: new Date().toISOString() }]
      setStoredWishlist(next)
      return next
    })
  }, [])

  const removeItem = useCallback((id: string, type: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => !(i.id === id && i.type === type))
      setStoredWishlist(next)
      return next
    })
  }, [])

  const toggleItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type)
      const next = exists
        ? prev.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...prev, { ...item, addedAt: new Date().toISOString() }]
      setStoredWishlist(next)
      return next
    })
  }, [])

  const isInWishlist = useCallback(
    (id: string, type: string) => items.some((i) => i.id === id && i.type === type),
    [items],
  )

  return { items, loaded, addItem, removeItem, toggleItem, isInWishlist }
}
