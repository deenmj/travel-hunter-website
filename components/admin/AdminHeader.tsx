'use client'

import { useEffect, useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUserProfile } from '@/lib/auth'
import type { Profile } from '@/lib/types'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'

export function AdminHeader() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push(ROUTES.LOGIN)
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {!loading && profile && (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.full_name || profile.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{profile.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
              {profile.full_name?.charAt(0) || profile.email.charAt(0)}
            </div>
          </div>
        )}

        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
