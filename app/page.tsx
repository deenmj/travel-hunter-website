import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { HeroSection } from '@/components/sections/HeroSection'
import { TopPicks } from '@/components/sections/TopPicks'
import { FeaturedDestinations } from '@/components/sections/FeaturedDestinations'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { LatestVideos } from '@/components/sections/LatestVideos'
import { CTASection } from '@/components/sections/CTASection'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col bg-white dark:bg-slate-950 pb-16 md:pb-0">
        <HeroSection />
        <TopPicks />
        <FeaturedDestinations />
        <CategoriesSection />
        <LatestVideos />
        <CTASection />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
