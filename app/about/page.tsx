import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { ContactFormComponent } from '@/components/about/ContactForm'
import { Youtube, Instagram, Facebook, MapPin, Video, Users, Award, Mail, Phone, ChevronDown } from 'lucide-react'
import { getAboutPageData, getSiteSettingsServer, DEFAULT_ABOUT_DATA } from '@/lib/about-utils'
import { getDestinations } from '@/lib/data-fetching'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export const metadata: Metadata = {
  title: 'About - Travel Hunter',
  description: "Meet Sri Lanka's Travel Hunter. Discover my story, passion for travel, and how we can collaborate to promote your business or destination.",
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.34 0 .67.05.98.15V9.41a5.64 5.64 0 0 0-.98-.08 5.976 5.976 0 0 0-5.965 6.01A5.976 5.976 0 0 0 12.75 22a5.976 5.976 0 0 0 5.825-5.83v-6.48a7.905 7.905 0 0 0 3.965-3.99v-3.99z" />
  </svg>
)

export default async function AboutPage() {
  const [rawAboutData, siteSettings, destinations] = await Promise.all([
    getAboutPageData(),
    getSiteSettingsServer(),
    getDestinations(),
  ])

  const aboutData = {
    ...DEFAULT_ABOUT_DATA,
    ...(rawAboutData ?? {}),
  }

  const contactEmail = aboutData.contact_email || siteSettings.contact_email
  const contactPhone = aboutData.contact_phone || siteSettings.contact_phone
  const contactAddress = aboutData.contact_address || siteSettings.contact_address

  const stats = [
    { label: 'YouTube Subscribers', value: aboutData.youtube_subscribers || '250K+', icon: Youtube },
    { label: 'Videos Created', value: aboutData.videos_created || '500+', icon: Video },
    { label: 'Places Explored', value: aboutData.places_explored || '150+', icon: MapPin },
    { label: 'Community Members', value: aboutData.community_members || '500K+', icon: Users },
  ]

  const socialLinks = [
    {
      name: 'YouTube',
      followers: '250K+ Subscribers',
      icon: Youtube,
      url: siteSettings.youtube_url,
      color: 'text-slate-600 group-hover:text-red-600 dark:text-slate-300 dark:group-hover:text-red-500',
      bgColor: 'group-hover:bg-red-50 dark:group-hover:bg-red-950/30',
      borderColor: 'group-hover:border-red-200 dark:group-hover:border-red-900',
    },
    {
      name: 'Instagram',
      followers: '150K+ Followers',
      icon: Instagram,
      url: siteSettings.instagram_url,
      color: 'text-slate-600 group-hover:text-pink-600 dark:text-slate-300 dark:group-hover:text-pink-500',
      bgColor: 'group-hover:bg-pink-50 dark:group-hover:bg-pink-950/30',
      borderColor: 'group-hover:border-pink-200 dark:group-hover:border-pink-900',
    },
    {
      name: 'Facebook',
      followers: '100K+ Followers',
      icon: Facebook,
      url: siteSettings.facebook_url,
      color: 'text-slate-600 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-500',
      bgColor: 'group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30',
      borderColor: 'group-hover:border-blue-200 dark:group-hover:border-blue-900',
    },
    {
      name: 'TikTok',
      followers: '300K+ Followers',
      icon: TikTokIcon,
      url: siteSettings.tiktok_url,
      color: 'text-slate-600 group-hover:text-black dark:text-slate-300 dark:group-hover:text-white',
      bgColor: 'group-hover:bg-gray-100 dark:group-hover:bg-gray-800',
      borderColor: 'group-hover:border-gray-300 dark:group-hover:border-gray-700',
    },
  ].filter((s) => s.url)

  // Use destination featured images for the gallery
  const galleryImages = destinations
    .filter(d => d.featured_image)
    .slice(0, 8)
    .map((d, index) => ({
      id: d.id || index,
      src: d.featured_image,
      alt: d.name,
    }))
  
  // Fallback if less than 3 images
  if (galleryImages.length < 3) {
    galleryImages.push(
      { id: 'fb1', src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop', alt: 'Travel Adventure 1' },
      { id: 'fb2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', alt: 'Travel Adventure 2' },
      { id: 'fb3', src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=500&fit=crop', alt: 'Travel Adventure 3' }
    )
  }

  const storyParagraphs = (aboutData.story_content || '')
    .split('\n\n')
    .filter(Boolean)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        {/* ── HERO SECTION ── */}
        <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/20 pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 dark:bg-emerald-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-200 dark:bg-teal-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
              {/* Hero Content */}
              <div className="md:col-span-6 lg:col-span-7 space-y-6 md:space-y-8 order-2 md:order-1">
                <div className="space-y-3 md:space-y-4">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest">
                    {aboutData.hero_tagline}
                  </p>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1]">
                    {aboutData.hero_title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg">
                    {aboutData.hero_description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                  <a
                    href="#collaborate"
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-lg rounded-full transition-colors flex items-center justify-center text-center shadow-md"
                  >
                    Collaborate With Me
                  </a>
                  <a
                    href="#contact"
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold text-sm md:text-lg rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-center text-center shadow-sm"
                  >
                    Get In Touch
                  </a>
                </div>
              </div>

              {/* Hero Image */}
              <div className="md:col-span-6 lg:col-span-5 relative order-1 md:order-2">
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
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
          
          {/* Scroll Cue */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pb-4 md:pb-0 pointer-events-none">
            <div className="animate-bounce p-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <ChevronDown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </section>

        {/* ── STATS SECTION ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-6 md:p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl md:rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-center mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-2 md:mb-3">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-semibold">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── STORY SECTION ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="text-left">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 md:mb-12">
              {aboutData.story_title}
            </h2>
            <div className="space-y-6 md:space-y-8 text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mx-auto">
              {storyParagraphs.length > 0
                ? storyParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                : <p>{aboutData.story_content}</p>
              }
            </div>
          </div>
        </section>

        {/* ── TRAVEL PHILOSOPHY SECTION ── */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-slate-900 py-16 md:py-24 border-y border-emerald-100 dark:border-emerald-900/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6">
                My Travel Philosophy
              </h2>
              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                How I explore, what I believe in, and why I love Sri Lanka
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: '🧭', title: 'Authentic Experiences', description: 'I seek genuine connections with locals, not just tourist attractions. Real travel happens beyond the guidebook.' },
                { icon: '🌱', title: 'Sustainable Tourism', description: 'Supporting local businesses, respecting nature, and contributing positively to the communities I visit.' },
                { icon: '📸', title: 'Storytelling First', description: 'Every moment is a story. I capture not just images, but emotions, history, and the soul of each place.' },
                { icon: '🤝', title: 'Community Building', description: 'Creating a space where travelers can connect, learn, and inspire each other to explore responsibly.' },
                { icon: '🎥', title: 'Quality Content', description: "High-production videos that do justice to Sri Lanka's beauty while remaining authentic and relatable." },
                { icon: '💚', title: 'Love For Sri Lanka', description: "This island isn't just my destination—it's my passion. Every video is made with genuine care and appreciation." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 md:p-8 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 flex flex-col"
                >
                  <div className="text-3xl md:text-4xl mb-4 md:mb-5 bg-slate-50 dark:bg-slate-800 w-16 h-16 flex items-center justify-center rounded-2xl">{item.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY SECTION ── */}
        <section className="bg-slate-50 dark:bg-slate-900 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6">
                Travel Gallery
              </h2>
              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400">
                A glimpse into my adventures across Sri Lanka
              </p>
            </div>

            <div className="px-6 md:px-12 relative">
              <Carousel opts={{ align: 'start', loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {galleryImages.map((image) => (
                    <CarouselItem key={image.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div className="group relative h-72 md:h-80 rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <p className="text-white font-bold text-lg leading-tight">{image.alt}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 md:-left-12 bg-white dark:bg-slate-800" />
                <CarouselNext className="hidden sm:flex -right-4 md:-right-12 bg-white dark:bg-slate-800" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* ── SOCIAL SECTION ── */}
        {socialLinks.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6">
                Follow My Journey
              </h2>
              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400">
                Join our community across platforms
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {socialLinks.map((social, idx) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-6 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.borderColor} ${social.bgColor}`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <IconComponent className={`w-12 h-12 mb-4 transition-colors ${social.color}`} />
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{social.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{social.followers}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* ── COLLABORATION SECTION ── */}
        <section
          id="collaborate"
          className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-800 py-16 md:py-24 text-white"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full mb-6 md:mb-8 border border-white/30 shadow-sm">
              <Award className="w-4 h-4" />
              <span className="font-bold text-sm tracking-wide">PARTNERSHIP OPPORTUNITIES</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Let&apos;s Create Something Amazing Together
            </h2>

            <p className="text-base md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Are you a hotel, restaurant, destination, or brand looking to reach travel enthusiasts? I&apos;m always excited about authentic partnerships that align with my values and create genuine value for my community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left">
              {[
                { title: 'Hotels & Resorts', description: 'Feature your property to our audience of dedicated travelers seeking their next stay.' },
                { title: 'Restaurants & Cafes', description: 'Showcase your culinary experience through engaging, mouth-watering content.' },
                { title: 'Tourism Boards', description: 'Promote your destination authentically to a global audience of adventure seekers.' },
                { title: 'Brands & Products', description: 'Reach travel-conscious consumers through genuine product integration and storytelling.' },
              ].map((item, idx) => (
                <div key={idx} className="p-6 md:p-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl hover:bg-white/15 transition-colors">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2">{item.title}</h3>
                  <p className="opacity-90 text-sm md:text-base leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-black text-sm md:text-lg h-14 px-8 rounded-full transition-colors inline-flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 duration-200"
            >
              Discuss a Partnership
            </a>
          </div>
        </section>

        {/* ── CONTACT SECTION ── */}
        <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6">
              Get In Touch
            </h2>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400">
              Have a question, partnership idea, or just want to say hi?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Contact Info */}
            <div className="space-y-6 md:space-y-10 order-2 md:order-1">
              <div>
                <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 md:mb-6">
                  Contact Information
                </h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-8 md:mb-10 leading-relaxed">
                  Fill out the form to send a direct message, or reach out via email or phone. I usually respond within 24-48 hours.
                </p>
              </div>

              <div className="space-y-6 md:space-y-8">
                {contactEmail && (
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mt-1">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Email</h4>
                      <a href={`mailto:${contactEmail}`} className="text-base md:text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors break-all">
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {contactPhone && (
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mt-1">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</h4>
                      <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white break-all">{contactPhone}</p>
                    </div>
                  </div>
                )}

                {contactAddress && (
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mt-1">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Location</h4>
                      <p className="text-base md:text-lg font-bold text-slate-900 dark:text-white break-words pr-4">{contactAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="order-1 md:order-2 bg-slate-50 dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800">
              <ContactFormComponent />
            </div>
          </div>
        </section>

        {/* ── YOUTUBE CTA SECTION ── */}
        {siteSettings.youtube_url && (
          <section className="bg-slate-900 dark:bg-black py-16 md:py-24 border-t border-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg shadow-red-600/30">
                <Youtube className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-4 md:mb-6">Subscribe & Join The Adventure</h3>
              <p className="text-base md:text-xl text-slate-400 mb-8 md:mb-10 max-w-2xl mx-auto">
                Get exclusive travel tips, behind-the-scenes content, and watch the highest quality Sri Lanka travel videos.
              </p>
              <a
                href={siteSettings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm md:text-lg h-12 md:h-14 px-8 md:px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
              >
                <Youtube className="w-5 h-5 md:w-6 md:h-6" />
                Subscribe on YouTube
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
