'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Sun, Moon, Heart } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { SearchModal } from '@/components/ui/SearchModal'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { href: ROUTES.HOME, label: 'Home' },
    { href: ROUTES.DESTINATIONS, label: 'Destinations' },
    { href: ROUTES.VIDEOS, label: 'Videos' },
    { href: ROUTES.BLOG, label: 'Blog' },
    { href: ROUTES.ABOUT, label: 'About' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl sm:text-2xl">T</span>
            </div>
            <span className="font-black text-lg sm:text-xl hidden sm:inline tracking-tight text-slate-900 dark:text-white">
              Travel<span className="text-emerald-600 dark:text-emerald-500">Hunter</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-1.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 mx-auto">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  className={`h-9 px-5 rounded-full text-sm font-semibold transition-all ${
                    isActive(link.href) 
                      ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
            {/* Search trigger */}
            <Button 
              variant="outline" 
              className="hidden lg:flex h-10 w-64 justify-between items-center px-4 rounded-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              onClick={() => setSearchOpen(true)}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="font-normal text-sm">Search...</span>
              </div>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                ⌘K
              </kbd>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-10 w-10 rounded-full"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Link href={ROUTES.WISHLIST}>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-500 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-slate-500"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-full text-slate-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 absolute w-full left-0 shadow-xl pb-6 rounded-b-3xl">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 rounded-xl font-semibold transition-all ${
                    isActive(link.href)
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
