import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { ContactFormComponent } from '@/components/about/ContactForm'
import { Youtube, Instagram, Facebook, MapPin, Video, Users, Award, Mail, Phone } from 'lucide-react'
import { getAboutPageData, DEFAULT_ABOUT_DATA } from '@/lib/about-utils'

export const metadata: Metadata = {
  title: 'About - Travel Hunter',
  description: 'Meet Sri Lanka&apos;s Travel Hunter. Discover my story, passion for travel, and how we can collaborate to promote your business or destination.',
}

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop', alt: 'Travel Adventure 1' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', alt: 'Travel Adventure 2' },
  { id: 3, src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=500&fit=crop', alt: 'Travel Adventure 3' },
  { id: 4, src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop', alt: 'Travel Adventure 4' },
  { id: 5, src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=500&fit=crop', alt: 'Travel Adventure 5' },
  { id: 6, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', alt: 'Travel Adventure 6' },
]

const socialIcons = [
  {
    name: 'YouTube',
    icon: Youtube,
    color: 'hover:text-red-600 dark:hover:text-red-500',
    bgColor: 'hover:bg-red-50 dark:hover:bg-red-950/30',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'hover:text-pink-600 dark:hover:text-pink-500',
    bgColor: 'hover:bg-pink-50 dark:hover:bg-pink-950/30',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'hover:text-blue-600 dark:hover:text-blue-500',
    bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
  },
  {
    name: 'TikTok',
    icon: () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.34 0 .67.05.98.15V9.41a5.64 5.64 0 0 0-.98-.08 5.976 5.976 0 0 0-5.965 6.01A5.976 5.976 0 0 0 12.75 22a5.976 5.976 0 0 0 5.825-5.83v-6.48a7.905 7.905 0 0 0 3.965-3.99v-3.99z" />
      </svg>
    ),
    color: 'hover:text-black dark:hover:text-white',
    bgColor: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  },
]

export default async function AboutPage() {
  const aboutData = await getAboutPageData() || DEFAULT_ABOUT_DATA

  const stats = [
    { label: 'YouTube Subscribers', value: aboutData.youtube_subscribers, icon: Youtube },
    { label: 'Videos Created', value: aboutData.videos_created, icon: Video },
    { label: 'Places Explored', value: aboutData.places_explored, icon: MapPin },
    { label: 'Community Members', value: aboutData.community_members, icon: Users },
  ]

  const socialLinks = [
    { ...socialIcons[0], url: aboutData.youtube_url },
    { ...socialIcons[1], url: aboutData.instagram_url },
    { ...socialIcons[2], url: aboutData.facebook_url },
    { ...socialIcons[3], url: aboutData.tiktok_url },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        {/* ── HERO SECTION ── */}
        <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/20 pt-32 pb-16">
          <div className="absolute inset-0 opacity-40 dark:opacity-20">
            <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 dark:bg-emerald-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-200 dark:bg-teal-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-widest">
                    {aboutData.hero_tagline}
                  </p>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight">
                    {aboutData.hero_title}
                  </h1>
                  <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg">
                    {aboutData.hero_description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => {
                      const element = document.getElementById('collaborate')
                      element?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full sm:w-auto h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-full transition-colors"
                  >
                    Collaborate With Me
                  </button>
                  <button
                    onClick={() => {
                      const element = document.getElementById('contact')
                      element?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full sm:w-auto h-14 px-8 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold text-lg rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    Get In Touch
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={aboutData.hero_image_url}
                    alt="Travel Hunter"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STORY SECTION ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
                {aboutData.story_title}
              </h2>
              <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {aboutData.story_content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-80 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=600&fit=crop"
                  alt="Adventure 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="h-40 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop"
                    alt="Adventure 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-40 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop"
                    alt="Adventure 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRAVEL PHILOSOPHY SECTION ── */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-slate-900 py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
                My Travel Philosophy
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                How I explore, what I believe in, and why I love Sri Lanka
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🧭',
                  title: 'Authentic Experiences',
                  description: 'I seek genuine connections with locals, not just tourist attractions. Real travel happens beyond the guidebook.',
                },
                {
                  icon: '🌱',
                  title: 'Sustainable Tourism',
                  description: 'Supporting local businesses, respecting nature, and contributing positively to the communities I visit.',
                },
                {
                  icon: '📸',
                  title: 'Storytelling First',
                  description: 'Every moment is a story. I capture not just images, but emotions, history, and the soul of each place.',
                },
                {
                  icon: '🤝',
                  title: 'Community Building',
                  description: 'Creating a space where travelers can connect, learn, and inspire each other to explore responsibly.',
                },
                {
                  icon: '🎥',
                  title: 'Quality Content',
                  description: 'High-production videos that do justice to Sri Lanka&apos;s beauty while remaining authentic and relatable.',
                },
                {
                  icon: '💚',
                  title: 'Love For Sri Lanka',
                  description: 'This island isn&apos;t just my destination—it&apos;s my passion. Every video is made with genuine care and appreciation.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS SECTION ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Journey Stats
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Numbers that represent my passion for exploration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className="p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-3">
                    {stat.value}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── GALLERY SECTION ── */}
        <section className="bg-slate-50 dark:bg-slate-900 py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
                Travel Gallery
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                A glimpse into my adventures across Sri Lanka
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-semibold text-lg">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOCIAL SECTION ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Follow My Journey
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Join my community across all platforms
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {socialLinks.map((social, idx) => {
              const IconComponent = social.icon
              return (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 transition-all duration-300 ${social.bgColor}`}
                >
                  <IconComponent className={`w-10 h-10 text-slate-600 dark:text-slate-300 transition-colors ${social.color}`} />
                </a>
              )
            })}
          </div>
        </section>

        {/* ── COLLABORATION SECTION ── */}
        <section
          id="collaborate"
          className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-20 md:py-32 text-white"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Award className="w-4 h-4" />
              <span className="font-semibold text-sm">Partnership Opportunities</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
              Let&apos;s Create Something Amazing Together
            </h2>

            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Are you a hotel, restaurant, destination, or brand looking to reach travel enthusiasts? I&apos;m always excited about authentic partnerships that align with my values and create genuine value for my community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: 'Hotels & Resorts',
                  description: 'Feature your property to our audience of dedicated travelers',
                },
                {
                  title: 'Restaurants & Cafes',
                  description: 'Showcase your culinary experience through engaging content',
                },
                {
                  title: 'Tourism Boards',
                  description: 'Promote your destination authentically to a global audience',
                },
                {
                  title: 'Brands & Products',
                  description: 'Reach travel-conscious consumers through genuine storytelling',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="opacity-90 text-sm">{item.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const element = document.getElementById('contact')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-white text-emerald-600 hover:bg-slate-100 font-bold text-lg h-14 px-8 rounded-full transition-colors"
            >
              Discuss a Partnership
            </button>
          </div>
        </section>

        {/* ── CONTACT SECTION ── */}
        <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Have a question, partnership idea, or just want to say hi? I&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Email
                </h3>
                <a href={`mailto:${aboutData.contact_email}`} className="text-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {aboutData.contact_email}
                </a>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Phone
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">{aboutData.contact_phone}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Location
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">{aboutData.contact_address}</p>
              </div>
            </div>

            {/* Contact Form */}
            <ContactFormComponent />
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h3 className="text-3xl sm:text-4xl font-black mb-4">Subscribe & Join The Adventure</h3>
            <p className="text-lg opacity-90 mb-8">Get exclusive travel tips, behind-the-scenes content, and early access to partnerships</p>
            <a
              href={aboutData.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-slate-100 font-bold text-lg h-14 px-8 rounded-full transition-colors"
            >
              <Youtube className="w-6 h-6" />
              Subscribe on YouTube
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
