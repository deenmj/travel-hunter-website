import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { BlogDetail } from '@/components/pages/BlogDetail'
import { getBlogPostBySlug, getLatestBlogPosts } from '@/lib/data-fetching'
import { SITE_NAME } from '@/lib/constants'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return { title: 'Blog Post Not Found' }
  }

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      ...(post.featured_image && { images: [{ url: post.featured_image }] }),
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const related = await getLatestBlogPosts(3)

  return (
    <>
      <Header />
      <main className="min-h-screen pb-16 md:pb-0 bg-white dark:bg-slate-950">
        <BlogDetail post={post} related={related} />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
