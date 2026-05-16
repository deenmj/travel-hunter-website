'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, FileText, Video, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { href: ROUTES.ADMIN_DESTINATIONS, icon: MapPin, label: 'Destinations' },
    { href: ROUTES.ADMIN_BLOG, icon: FileText, label: 'Blog Posts' },
    { href: ROUTES.ADMIN_VIDEOS, icon: Video, label: 'Videos' },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push(ROUTES.LOGIN)
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 dark:bg-black text-white flex-col">
      <div className="p-6 border-b border-slate-700">
        <Link href={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="font-bold">T</span>
          </div>
          <span className="font-bold text-lg">Travel Hunter</span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-10"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-red-400 hover:text-red-300 hover:bg-red-950"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
