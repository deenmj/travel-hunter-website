'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Video,
  Image as ImageIcon,
  Settings,
  LogOut,
  Compass,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants'

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { href: ROUTES.ADMIN_DESTINATIONS, icon: MapPin, label: 'Destinations' },
  { href: ROUTES.ADMIN_BLOG, icon: FileText, label: 'Blogs' },
  { href: ROUTES.ADMIN_VIDEOS, icon: Video, label: 'Videos' },
  { href: ROUTES.ADMIN_MEDIA, icon: ImageIcon, label: 'Media Library' },
  { href: ROUTES.ADMIN_SETTINGS, icon: Settings, label: 'Settings' },
]

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(ROUTES.LOGIN)
    router.refresh()
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 dark:bg-black text-white flex-col shrink-0">
        <SidebarContent
          pathname={pathname}
          isActive={isActive}
          handleSignOut={handleSignOut}
          onLinkClick={() => {}}
        />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 dark:bg-black text-white flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0 flex' : '-translate-x-full hidden'
        }`}
      >
        <div className="absolute right-3 top-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent
          pathname={pathname}
          isActive={isActive}
          handleSignOut={handleSignOut}
          onLinkClick={onClose}
        />
      </aside>
    </>
  )
}

function SidebarContent({
  isActive,
  handleSignOut,
  onLinkClick,
}: {
  pathname: string
  isActive: (href: string) => boolean
  handleSignOut: () => void
  onLinkClick: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <Link
          href={ROUTES.ADMIN_DASHBOARD}
          className="flex items-center gap-3"
          onClick={onLinkClick}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg leading-tight block">Travel Hunter</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Content
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href} onClick={onLinkClick}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-400 ml-0'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-emerald-400' : ''}`} />
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-slate-700/50 p-3">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </>
  )
}
