'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { href: ROUTES.HOME, label: 'Home' },
    { href: ROUTES.DESTINATIONS, label: 'Destinations' },
    { href: ROUTES.VIDEOS, label: 'Videos' },
    { href: ROUTES.BLOG, label: 'Blog' },
    { href: ROUTES.ABOUT, label: 'About' },
    { href: ROUTES.CONTACT, label: 'Contact' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline text-gray-900 dark:text-white">
            Travel Hunter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive(link.href) ? 'default' : 'ghost'}
                className="h-10 px-4"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Search className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Link href={ROUTES.LOGIN} className="hidden sm:inline">
            <Button variant="outline" className="h-10 px-4">
              Sign In
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  isActive(link.href)
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full h-12 mt-4 bg-emerald-600 hover:bg-emerald-700">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
