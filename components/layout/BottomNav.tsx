'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Video, Newspaper, Info } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: ROUTES.HOME, icon: Home, label: 'Home' },
    { href: ROUTES.DESTINATIONS, icon: MapPin, label: 'Places' },
    { href: ROUTES.VIDEOS, icon: Video, label: 'Videos' },
    { href: ROUTES.BLOG, icon: Newspaper, label: 'Blog' },
    { href: ROUTES.ABOUT, icon: Info, label: 'About' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full h-16 transition-colors ${
                active
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
