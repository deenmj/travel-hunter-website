import Link from 'next/link'
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { ROUTES, SITE_NAME } from '@/lib/constants'
import { getSiteSettings } from '@/lib/data-fetching'

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const settings = await getSiteSettings()

  return (
    <footer className="bg-slate-900 dark:bg-black text-white pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {/* Brand - Hidden on mobile, shown on sm: */}
          <div className="hidden sm:block space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-base">{SITE_NAME}</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Discover the hidden gems of Sri Lanka and experience authentic travel moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Explore</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
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
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Contact</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {settings.contact_phone && (
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors truncate">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors truncate">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm leading-tight line-clamp-2">{settings.contact_address}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {settings.tiktok_url && (
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
