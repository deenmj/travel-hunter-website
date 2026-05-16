import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Travel Hunter and our mission to share Sri Lanka',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950 pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Travel Hunter</h1>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Travel Hunter is a community-driven platform dedicated to sharing the hidden gems and authentic experiences of Sri Lanka. We believe that the best travel memories come from discovering places recommended by locals and fellow travelers who truly know the island.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We aim to inspire and guide travelers to explore the diverse destinations, exquisite cuisine, and warm hospitality that Sri Lanka has to offer. Through curated content, authentic stories, and visual documentation, we help you discover experiences that go beyond the typical tourist path.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Destination Guides:</strong> Carefully curated information about places to visit, eat, and stay</li>
              <li><strong>Video Content:</strong> Authentic travel footage and experiences from across the island</li>
              <li><strong>Travel Blog:</strong> Stories, tips, and insights from travel enthusiasts</li>
              <li><strong>Local Expertise:</strong> Recommendations from people who know Sri Lanka intimately</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Join Our Community</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Whether you&apos;re planning your first trip to Sri Lanka or returning to explore something new, Travel Hunter is your companion in discovering the island&apos;s treasures. Join our growing community of travelers and content creators today!
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
