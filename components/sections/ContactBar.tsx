import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { getSiteSettings } from '@/lib/data-fetching'

export async function ContactBar() {
  const settings = await getSiteSettings()

  // If there's no contact info or social links, don't show the bar
  const hasContactInfo = !!(settings.contact_phone || settings.contact_email || settings.contact_address)
  const hasSocials = !!(settings.facebook_url || settings.instagram_url || settings.youtube_url || settings.twitter_url)

  if (!hasContactInfo && !hasSocials) {
    return null
  }

  return (
    <div className="w-full bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-1.5">
          {settings.contact_phone && (
            <a
              href={`tel:${settings.contact_phone}`}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.contact_phone}</span>
            </a>
          )}
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.contact_email}</span>
            </a>
          )}
          {settings.contact_address && (
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.contact_address}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {hasSocials && (
          <div className="flex items-center gap-4 border-t border-slate-800 sm:border-t-0 pt-1.5 sm:pt-0">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {settings.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            )}
            {settings.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
