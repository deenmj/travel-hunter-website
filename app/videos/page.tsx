import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { VideosList } from '@/components/pages/VideosList'

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch travel videos from Sri Lanka',
}

export default function VideosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950 pb-16 md:pb-0">
        <VideosList />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
