'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface AdminHeaderProps {
  onMenuToggle: () => void
}

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/destinations': 'Destinations',
  '/admin/destinations/new': 'New Destination',
  '/admin/blogs': 'Blog Posts',
  '/admin/blogs/new': 'New Blog Post',
  '/admin/videos': 'Videos',
  '/admin/videos/new': 'New Video',
  '/admin/media': 'Media Library',
  '/admin/settings': 'Settings',
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) setProfile(data)
      }
    }
    fetchProfile()
  }, [])

  const getTitle = () => {
    // Exact match first
    if (pageTitles[pathname]) return pageTitles[pathname]

    // Check edit pages
    if (pathname.includes('/destinations/') && pathname.includes('/edit')) return 'Edit Destination'
    if (pathname.includes('/blogs/') && pathname.includes('/edit')) return 'Edit Blog Post'
    if (pathname.includes('/videos/') && pathname.includes('/edit')) return 'Edit Video'

    // Fallback to parent
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path)) return title
    }
    return 'Admin'
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 px-4 md:px-6 h-16 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>

        {profile && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                {profile.full_name || profile.email}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                {profile.role}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {(profile.full_name || profile.email).charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
