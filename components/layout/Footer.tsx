import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { ROUTES, SITE_NAME } from '@/lib/constants'
import { getSiteSettings } from '@/lib/data-fetching'

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const settings = await getSiteSettings()

  return (
    <footer className="bg-slate-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="font-bold text-lg">{SITE_NAME}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover the hidden gems of Sri Lanka and experience authentic travel moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href={ROUTES.DESTINATIONS} className="hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href={ROUTES.VIDEOS} className="hover:text-white transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BLOG} className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={ROUTES.ABOUT} className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CONTACT} className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {settings.contact_phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors break-all">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{settings.contact_address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Newsletter</h3>
            <p className="text-gray-400 text-sm">Subscribe for travel tips and destination updates.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-slate-800 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-10"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-sm font-medium transition-colors h-10"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            )}
            {settings.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
