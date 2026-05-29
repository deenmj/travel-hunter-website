import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export default function DestinationNotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-4 pb-16 md:pb-0">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Destination Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            This place may have been moved or removed. Browse our curated destinations instead.
          </p>
          <Link href={ROUTES.DESTINATIONS}>
            <Button className="rounded-full px-8">Browse Destinations</Button>
          </Link>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
