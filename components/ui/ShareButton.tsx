'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareButtonProps {
  url: string
  title: string
  className?: string
}

export function ShareButton({ url, title, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link', err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-semibold hidden sm:inline">Share</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100 dark:border-slate-800 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <DropdownMenuItem 
          onClick={() => window.open(shareLinks.whatsapp, '_blank')}
          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-200"
        >
          <MessageCircle className="w-5 h-5 text-green-500" />
          <span className="font-medium">WhatsApp</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => window.open(shareLinks.facebook, '_blank')}
          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-200"
        >
          <Facebook className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Facebook</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950/30 text-slate-700 dark:text-slate-200"
        >
          <Twitter className="w-5 h-5 text-sky-500" />
          <span className="font-medium">Twitter</span>
        </DropdownMenuItem>

        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

        <DropdownMenuItem 
          onClick={handleCopy}
          className="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          <LinkIcon className="w-5 h-5 text-slate-500" />
          <span className="font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
