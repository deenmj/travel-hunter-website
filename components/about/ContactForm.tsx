'use client'

import { useRef, useState } from 'react'
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { submitContactMessage } from '@/lib/contact-actions'

export function ContactFormComponent() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, setIsPending] = useState(false)
  const [state, setState] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setState(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await submitContactMessage(null, formData)
    
    setState(result as any)
    setIsPending(false)

    if (result.success) {
      formRef.current?.reset()
      // Clear success message after 5 seconds
      setTimeout(() => {
        setState(null)
      }, 5000)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="John Doe"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="john@example.com"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="+94 (123) 456-789"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Business/Destination
        </label>
        <input
          type="text"
          name="business"
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors"
          placeholder="Your business or destination name"
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none"
          placeholder="Tell me about your partnership idea..."
          disabled={isPending}
        />
      </div>

      {state?.error && (
        <div className="p-3 md:p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm md:text-base flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 md:p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-700 dark:text-emerald-300 text-sm md:text-base font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-10 md:h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold text-sm md:text-lg rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
