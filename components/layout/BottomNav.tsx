'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Video, Search, Heart } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useState } from 'react'
import { SearchModal } from '@/components/ui/SearchModal'

export function BottomNav() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  const navItems = [
    { href: ROUTES.HOME, icon: Home, label: 'Home' },
    { href: ROUTES.DESTINATIONS, icon: Compass, label: 'Explore' },
    { href: '#search', icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    { href: ROUTES.WISHLIST, icon: Heart, label: 'Saved' },
    { href: ROUTES.VIDEOS, icon: Video, label: 'Videos' },
  ]

  const isActive = (href: string) => {
    if (href === '#search') return searchOpen
    return pathname === href
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 z-40 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            if (item.action) {
              return (
                <button
                  key={item.href}
                  onClick={item.action}
                  className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                    active
                      ? 'text-emerald-600 dark:text-emerald-400 transform -translate-y-1'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${active ? 'stroke-[2.5px]' : ''}`} />
                  <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-emerald-500" />
                  )}
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                  active
                    ? 'text-emerald-600 dark:text-emerald-400 transform -translate-y-1'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${active ? 'stroke-[2.5px]' : ''}`} />
                <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {active && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
