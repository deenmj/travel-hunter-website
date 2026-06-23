'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export function ContactFormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', business: '', message: '' })
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="+94 (123) 456-789"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Business/Destination
        </label>
        <input
          type="text"
          name="business"
          value={formData.business}
          onChange={handleInputChange}
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="Your business or destination name"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
          placeholder="Tell me about your partnership idea..."
        />
      </div>

      <button
        type="submit"
        className="w-full h-10 md:h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-lg rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Send className="w-4 h-4 md:w-5 md:h-5" />
        Send Message
      </button>

      {submitted && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-700 dark:text-emerald-300 text-center font-semibold">
          Thanks for reaching out! I&apos;ll get back to you soon.
        </div>
      )}
    </form>
  )
}
