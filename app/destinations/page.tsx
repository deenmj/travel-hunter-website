import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { DestinationsList } from '@/components/pages/DestinationsList'

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Explore all our curated destinations in Sri Lanka',
}

export default function DestinationsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950 pb-16 md:pb-0">
        <DestinationsList />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
