import { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { getSiteSettings } from '@/lib/data-fetching'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Travel Hunter',
  description: 'Get in touch with Travel Hunter. Contact us for travel inquiries, partnerships, or questions about our destinations.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <Header />
      <main className="flex flex-col bg-white dark:bg-slate-950 min-h-screen">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-20 bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                Get in <span className="text-emerald-600">Touch</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Have questions about Sri Lanka? Need travel recommendations? We&apos;re here to help!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Grid */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Phone */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Phone</h3>
                {settings.contact_phone ? (
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                  >
                    {settings.contact_phone}
                  </a>
                ) : (
                  <p className="text-slate-500">Contact number not available</p>
                )}
                <p className="text-sm text-slate-500">Available 9 AM - 6 PM daily</p>
              </div>

              {/* Email */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email</h3>
                {settings.contact_email ? (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                  >
                    {settings.contact_email}
                  </a>
                ) : (
                  <p className="text-slate-500">Email not available</p>
                )}
                <p className="text-sm text-slate-500">We&apos;ll respond within 24 hours</p>
              </div>

              {/* Address */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Address</h3>
                {settings.contact_address ? (
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {settings.contact_address}
                  </p>
                ) : (
                  <p className="text-slate-500">Address not available</p>
                )}
                <p className="text-sm text-slate-500">Based in Sri Lanka</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-16 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Send us a Message
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
