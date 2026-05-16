import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { BlogList } from '@/components/pages/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read travel stories and tips from our community',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950 pb-16 md:pb-0">
        <BlogList />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
