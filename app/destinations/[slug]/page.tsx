import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { DestinationDetail } from '@/components/destination/DestinationDetail'
import { fetchDestinationBySlug, fetchRelatedDestinations } from '@/lib/destinations-server'
import { SITE_NAME } from '@/lib/constants'
import { getDestinationThumbnail } from '@/lib/video-utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const destination = await fetchDestinationBySlug(slug)

  if (!destination) {
    return { title: 'Destination Not Found' }
  }

  const image = getDestinationThumbnail(destination)

  return {
    title: `${destination.name} | ${SITE_NAME}`,
    description: destination.description.slice(0, 160),
    openGraph: {
      title: destination.name,
      description: destination.description.slice(0, 160),
      ...(image && { images: [{ url: image }] }),
    },
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const destination = await fetchDestinationBySlug(slug)

  if (!destination) {
    notFound()
  }

  const related = await fetchRelatedDestinations(destination.category, destination.id, 3)

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">
        <DestinationDetail destination={destination} related={related} />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
