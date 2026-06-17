'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hop as Home, Compass, Video, Info } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: ROUTES.HOME, icon: Home, label: 'Home' },
    { href: ROUTES.DESTINATIONS, icon: Compass, label: 'Explore' },
    { href: ROUTES.VIDEOS, icon: Video, label: 'Video' },
    { href: ROUTES.ABOUT, icon: Info, label: 'About' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 z-40 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

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
  )
}
